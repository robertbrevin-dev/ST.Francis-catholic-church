import { supabase } from "./supabase"

/** Must match a public bucket in Supabase Storage (see supabase/announcements_poster.sql). */
export const ANNOUNCEMENT_POSTERS_BUCKET = "announcement-posters"

export type AnnouncementRow = {
  id: string
  title: string
  content: string
  display_date: string
  category: string
  color: string
  pinned: boolean
  is_active: boolean
  created_at: string
  expires_at: string
  poster_url: string | null
  author_id?: string | null
}

const UPLOAD_TIMEOUT_MS = 45_000
const POSTER_MAX_DIMENSION = 1400
const POSTER_JPEG_QUALITY = 0.82

export async function compressPosterForUpload(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || typeof document === "undefined") return file

  const blob = await new Promise<Blob | null>((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const nw = img.naturalWidth
      const nh = img.naturalHeight
      if (!nw || !nh) {
        resolve(null)
        return
      }
      const scale = Math.min(1, POSTER_MAX_DIMENSION / Math.max(nw, nh))
      const w = Math.round(nw * scale)
      const h = Math.round(nh * scale)
      const canvas = document.createElement("canvas")
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        resolve(null)
        return
      }
      ctx.drawImage(img, 0, 0, w, h)
      canvas.toBlob((b) => resolve(b), "image/jpeg", POSTER_JPEG_QUALITY)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(null)
    }
    img.src = url
  })

  if (!blob || blob.size >= file.size * 0.95) return file
  return new File([blob], "poster.jpg", { type: "image/jpeg" })
}

function rejectAfter(ms: number, message: string): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), ms)
  })
}

/** End of local calendar day in UTC-ish ISO for expiry filtering. */
export function endOfDayIsoFromDateInput(dateStr: string): string {
  const d = new Date(`${dateStr}T23:59:59`)
  if (Number.isNaN(d.getTime())) return defaultExpiresAtISO()
  return d.toISOString()
}

/** Default: 30 days from now (when admin does not pick a date). */
export function defaultExpiresAtISO(): string {
  const d = new Date()
  d.setDate(d.getDate() + 30)
  d.setHours(23, 59, 59, 999)
  return d.toISOString()
}

export function defaultExpiryDateInput(): string {
  const d = new Date()
  d.setDate(d.getDate() + 30)
  return d.toISOString().slice(0, 10)
}

function randomUploadId() {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID()
  } catch {
    /* noop */
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 14)}`
}

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120)
}

/**
 * Published = active, not past expiry. Ordered: pinned first, then newest.
 */
export async function fetchPublishedAnnouncements(limit?: number) {
  let q = supabase
    .from("announcements")
    .select("*")
    .eq("is_active", true)
    .gt("expires_at", new Date().toISOString())
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false })

  if (limit != null && limit > 0) q = q.limit(limit)

  const { data, error } = await q
  return { data: (data ?? null) as AnnouncementRow[] | null, error }
}

export async function uploadAnnouncementPoster(file: File): Promise<{ publicUrl: string }> {
  const safeTail = sanitizeFileName(file.name || "poster.jpg")
  const filePath = `${randomUploadId()}-${safeTail}`
  const contentType = file.type && file.type.startsWith("image/") ? file.type : "image/jpeg"

  const rawSession = localStorage.getItem("stfrancis-admin-auth")
  const jwt = rawSession ? (() => { try { return JSON.parse(rawSession)?.access_token } catch { return null } })() : null
  if (!jwt) throw new Error("No session token — sign out and sign back in.")

  const supaUrl = (import.meta.env.VITE_SUPABASE_URL as string).replace(/\/$/, "")
  const supaKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 15000)
  let resp: Response
  try {
    resp = await fetch(`${supaUrl}/storage/v1/object/${ANNOUNCEMENT_POSTERS_BUCKET}/${filePath}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${jwt}`,
        "apikey": supaKey,
        "Content-Type": contentType,
        "Cache-Control": "3600",
        "x-upsert": "false",
      },
      body: file,
      signal: ctrl.signal,
    })
  } finally {
    clearTimeout(timer)
  }

  if (!resp.ok) {
    const errText = await resp.text().catch(() => resp.statusText)
    throw new Error(`Poster upload failed (${resp.status}): ${errText}`)
  }

  const publicUrl = `${supaUrl}/storage/v1/object/public/${ANNOUNCEMENT_POSTERS_BUCKET}/${filePath}`
  return { publicUrl }
}

export async function uploadPosterAndLinkToAnnouncement(announcementId: string, file: File): Promise<void> {
  const toSend = await compressPosterForUpload(file)
  const { publicUrl } = await uploadAnnouncementPoster(toSend)

  const rawSession = localStorage.getItem("stfrancis-admin-auth")
  const jwt = rawSession ? (() => { try { return JSON.parse(rawSession)?.access_token } catch { return null } })() : null
  if (!jwt) throw new Error("No session token for poster link update.")

  const supaUrl = (import.meta.env.VITE_SUPABASE_URL as string).replace(/\/$/, "")
  const supaKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

  const resp = await fetch(`${supaUrl}/rest/v1/announcements?id=eq.${announcementId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "apikey": supaKey,
      "Authorization": `Bearer ${jwt}`,
      "Prefer": "return=minimal",
    },
    body: JSON.stringify({ poster_url: publicUrl }),
  })
  if (!resp.ok) {
    void removeAnnouncementPosterFromStorage(publicUrl)
    throw new Error(`Failed to link poster (${resp.status})`)
  }
}

/** Storage object path for removal (everything after the bucket name in the public URL). */
export function posterStoragePathFromPublicUrl(posterUrl: string): string | null {
  const marker = `/object/public/${ANNOUNCEMENT_POSTERS_BUCKET}/`
  const i = posterUrl.indexOf(marker)
  if (i === -1) return null
  return decodeURIComponent(posterUrl.slice(i + marker.length))
}

export async function removeAnnouncementPosterFromStorage(posterUrl: string | null | undefined) {
  if (!posterUrl) return
  const path = posterStoragePathFromPublicUrl(posterUrl)
  if (!path) return
  await supabase.storage.from(ANNOUNCEMENT_POSTERS_BUCKET).remove([path])
}
