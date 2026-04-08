import { useEffect, useMemo, useRef, useState } from "react"
import { AboutGalleryImage } from "../../components/AboutGalleryImage"
import { isSupabaseConfigured, supabase } from "../../../lib/supabase"
import { useAdmin } from "../../../lib/auth"
import { ABOUT_STORY_MAX_PHOTOS as MAX_PHOTOS } from "../../../lib/aboutGalleryLimits"

type AboutPhoto = {
  id: string
  story_id: string
  photo_url: string
  photo_path: string
  sort_order: number
}

type AboutStory = {
  id: string
  title: string
  occasion_type: string
  event_date: string | null
  location: string
  people_present: string
  description: string
  impact: string
  photo_url: string
  photo_path: string
  display_order: number
  is_featured: boolean
  is_active: boolean
  created_at: string
  about_story_photos?: AboutPhoto[]
}

const OCCASION_TYPES = ["Donation", "Community Outreach", "Youth Event", "Choir", "Construction", "Visitors", "Celebration", "Other"]
const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024

function formatEventDate(value: string | null) {
  if (!value) return "Date not provided"
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 50)
}

function sortStoryPhotosNewestFirst(photos: AboutPhoto[] | undefined) {
  if (!photos?.length) return []
  return [...photos].sort((a, b) => b.sort_order - a.sort_order)
}

function randomUploadId() {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID()
  } catch {}
  return `${Date.now()}-${Math.random().toString(36).slice(2, 14)}`
}

function formatSaveError(error: unknown): string {
  if (error instanceof Error) {
    if (error.name === "AbortError") {
      return "Saving timed out (network or upload too slow). Try smaller images or check your connection."
    }
    const m = error.message.toLowerCase()
    if (m.includes("abort") || m.includes("timed out")) {
      return "Request timed out or was cancelled. Try again with smaller photos or a stronger connection."
    }
    return error.message
  }
  if (typeof error === "object" && error !== null) {
    const o = error as { message?: unknown; details?: unknown; hint?: unknown; error?: unknown }
    const parts: string[] = []
    if (typeof o.message === "string" && o.message) parts.push(o.message)
    if (typeof o.details === "string" && o.details) parts.push(o.details)
    if (typeof o.hint === "string" && o.hint) parts.push(o.hint)
    if (typeof o.error === "string" && o.error) parts.push(o.error)
    if (parts.length) return parts.join(" — ")
  }
  return "Something went wrong while saving."
}

function rejectAfter(ms: number, message: string): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), ms)
  })
}

export function AdminAboutStories() {
  const { profile, session } = useAdmin()
  const saveBusyRef = useRef(false)
  const [stories, setStories] = useState<AboutStory[]>([])
  const [loading, setLoading] = useState(true)
  const [listError, setListError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ text: "", ok: true })
  const [editing, setEditing] = useState<AboutStory | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [localPreviewUrls, setLocalPreviewUrls] = useState<string[]>([])
  const [fileInputKey, setFileInputKey] = useState(0)
  const [form, setForm] = useState({
    title: "",
    occasion_type: "Donation",
    event_date: "",
    location: "",
    people_present: "",
    description: "",
    impact: "",
    display_order: 0,
    is_featured: false,
    photo_url: "",
    photo_path: "",
  })

  useEffect(() => {
    if (!isSupabaseConfigured) {
      notify("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env and restart the dev server.", false)
      setLoading(false)
      return
    }

    let cancelled = false

    void (async () => {
      await Promise.race([
        supabase.auth.getSession(),
        new Promise<void>((resolve) => {
          setTimeout(resolve, 2500)
        }),
      ])
      if (cancelled) return
      await loadStories()
    })()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (cancelled) return
      if (event === "SIGNED_OUT") {
        setStories([])
        return
      }
      if (event === "INITIAL_SESSION" || event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        void loadStories({ silent: true })
      }
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (selectedFiles.length === 0) {
      setLocalPreviewUrls([])
      return
    }
    const nextPreviewUrls = selectedFiles.map((file) => URL.createObjectURL(file))
    setLocalPreviewUrls(nextPreviewUrls)
    return () => nextPreviewUrls.forEach((url) => URL.revokeObjectURL(url))
  }, [selectedFiles])

  const LIST_FETCH_MS = 45_000

  async function loadStories(options?: { silent?: boolean }) {
    const silent = options?.silent === true
    if (!silent) {
      setLoading(true)
      setListError(null)
    }
    try {
      const storiesQuery = supabase.from("about_stories").select("*").order("created_at", { ascending: false })

      const { data: rows, error: storiesError } = await Promise.race([
        storiesQuery,
        rejectAfter(LIST_FETCH_MS, "Loading stories timed out. Check your connection."),
      ])

      if (storiesError) {
        if (!silent) {
          setListError(storiesError.message)
          notify(storiesError.message, false)
          setStories([])
        }
        return
      }

      const list = (rows ?? []) as AboutStory[]
      const ids = list.map((r) => r.id)
      let photos: AboutPhoto[] = []

      if (ids.length > 0) {
        const photosQuery = supabase.from("about_story_photos").select("*").in("story_id", ids).order("sort_order", { ascending: true })
        const { data: photoRows, error: photosError } = await Promise.race([
          photosQuery,
          rejectAfter(LIST_FETCH_MS, "Loading photos timed out. Check your connection."),
        ])
        if (!photosError && photoRows) {
          photos = photoRows as AboutPhoto[]
        }
      }

      const byStory = new Map<string, AboutPhoto[]>()
      for (const p of photos) {
        const arr = byStory.get(p.story_id) ?? []
        arr.push(p)
        byStory.set(p.story_id, arr)
      }

      const merged: AboutStory[] = list.map((row) => ({
        ...row,
        about_story_photos: byStory.get(row.id) ?? [],
      }))

      setStories(merged)
      if (!silent) setListError(null)

      if (import.meta.env.DEV && !silent) {
        console.info(`[Admin About] Loaded ${merged.length} story row(s) from about_stories (photos merged client-side).`)
      }
    } catch (e) {
      const msg =
        e instanceof DOMException && e.name === "AbortError"
          ? "Request timed out. Check your network or try again."
          : e instanceof Error
            ? e.message
            : "Could not load stories."
      if (!silent) {
        setListError(msg)
        notify(msg, false)
        setStories([])
      }
    } finally {
      setLoading(false)
    }
  }

  function notify(text: string, ok = true) {
    setMessage({ text, ok })
    window.setTimeout(() => setMessage({ text: "", ok: true }), 4000)
  }

  function resetForm() {
    setForm({
      title: "",
      occasion_type: "Donation",
      event_date: "",
      location: "",
      people_present: "",
      description: "",
      impact: "",
      display_order: 0,
      is_featured: false,
      photo_url: "",
      photo_path: "",
    })
    setSelectedFiles([])
    setFileInputKey((k) => k + 1)
  }

  function startEdit(story: AboutStory) {
    setEditing(story)
    setSelectedFiles([])
    setFileInputKey((k) => k + 1)
    setForm({
      title: story.title,
      occasion_type: story.occasion_type,
      event_date: story.event_date ?? "",
      location: story.location ?? "",
      people_present: story.people_present ?? "",
      description: story.description ?? "",
      impact: story.impact ?? "",
      display_order: story.display_order ?? 0,
      is_featured: story.is_featured,
      photo_url: story.photo_url,
      photo_path: story.photo_path,
    })
  }

  const UPLOAD_ONE_MS = 75_000

  async function uploadPhoto(file: File, title: string) {
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg"
    const safeTitle = slugify(title) || "about-story"
    const filePath = `${new Date().getFullYear()}/${randomUploadId()}-${safeTitle}.${extension}`

    const { error: uploadError } = await Promise.race([
      supabase.storage.from("about-gallery").upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || undefined,
      }),
      rejectAfter(
        UPLOAD_ONE_MS,
        "One photo took too long to upload. Use smaller files (under 8MB each), check your connection, or try one photo at a time.",
      ),
    ])

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from("about-gallery").getPublicUrl(filePath)
    return { photo_url: data.publicUrl, photo_path: filePath }
  }

  async function uploadPhotos(files: File[], title: string) {
    const out: Array<{ photo_url: string; photo_path: string }> = []
    for (const file of files) {
      out.push(await uploadPhoto(file, title))
    }
    return out
  }

  async function removeStoredPhotos(photoPaths: string[]) {
    const paths = photoPaths.filter(Boolean)
    if (paths.length === 0) return
    try {
      await Promise.race([
        supabase.storage.from("about-gallery").remove(paths),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Storage remove timed out")), 25_000),
        ),
      ])
    } catch {}
  }

  const SAVE_OVERALL_MS = 165_000

  async function saveStory() {
    if (saveBusyRef.current) return

    if (!form.title.trim() || !form.description.trim()) {
      notify("Please add a title and story description.", false)
      return
    }

    const existingPhotos = editing?.about_story_photos ?? []
    if (selectedFiles.length === 0 && existingPhotos.length === 0 && !form.photo_url) {
      notify(`Please choose between 1 and ${MAX_PHOTOS} photos to upload.`, false)
      return
    }

    if (selectedFiles.length > MAX_PHOTOS) {
      notify(`Please upload a maximum of ${MAX_PHOTOS} photos.`, false)
      return
    }

    if (selectedFiles.some((file) => file.size > MAX_FILE_SIZE_BYTES)) {
      notify("One or more selected photos are too large. Please keep each image below 8MB.", false)
      return
    }

    saveBusyRef.current = true
    setSaving(true)

    let uploadedPhotos: Array<{ photo_url: string; photo_path: string }> = []

    try {
      await Promise.race([
        (async () => {
      let activeSession = session
      if (!activeSession) {
        const { data } = await Promise.race([
          supabase.auth.getSession(),
          rejectAfter(15_000, "Could not verify your session in time. Refresh the page or sign in again."),
        ])
        activeSession = data.session
      }
      if (!activeSession) {
        throw new Error("Your session expired. Sign out and sign in again, then try saving.")
      }

      const sortedExisting = [...(editing?.about_story_photos ?? [])].sort((a, b) => a.sort_order - b.sort_order)

      if (selectedFiles.length > 0) {
        if (editing) {
          const slotsLeft = MAX_PHOTOS - sortedExisting.length
          if (slotsLeft <= 0) {
            throw new Error(
              `This story already has ${MAX_PHOTOS} photos (the maximum). Use “Add about story” for a new event so older occasions stay on the site with their own photos.`,
            )
          }
          const filesToUpload = selectedFiles.slice(0, slotsLeft)
          uploadedPhotos = await uploadPhotos(filesToUpload, form.title)
          if (filesToUpload.length < selectedFiles.length) {
            notify(
              `Only ${filesToUpload.length} new photo(s) were added (max ${MAX_PHOTOS} per story). Add another story for the rest.`,
              false,
            )
          }
        } else {
          uploadedPhotos = await uploadPhotos(selectedFiles, form.title)
        }
      }

      const primaryPhoto = sortedExisting.length > 0 ? sortedExisting[0] : uploadedPhotos[0] ?? null

      const payload = {
        title: form.title.trim(),
        occasion_type: form.occasion_type,
        event_date: form.event_date || null,
        location: form.location.trim(),
        people_present: form.people_present.trim(),
        description: form.description.trim(),
        impact: form.impact.trim(),
        display_order: Number(form.display_order) || 0,
        is_featured: form.is_featured,
        photo_url: primaryPhoto?.photo_url ?? form.photo_url,
        photo_path: primaryPhoto?.photo_path ?? form.photo_path,
      }

      if (editing) {
        const updatePayload = {
          ...payload,
          updated_at: new Date().toISOString(),
          ...(profile?.id ? { updated_by: profile.id } : {}),
        }
        const { data: updatedRows, error } = await supabase.from("about_stories").update(updatePayload).eq("id", editing.id).select("id")

        if (error) throw error
        if (!updatedRows?.length) {
          throw new Error("Could not update this story. Check that you are signed in as an admin.")
        }

        if (selectedFiles.length > 0) {
          const maxSort = sortedExisting.reduce((m, p) => Math.max(m, p.sort_order), 0)
          const photoRows = uploadedPhotos.map((photo, index) => ({
            story_id: editing.id,
            photo_url: photo.photo_url,
            photo_path: photo.photo_path,
            sort_order: maxSort + index + 1,
          }))

          if (photoRows.length > 0) {
            const { error: photoInsertError } = await supabase.from("about_story_photos").insert(photoRows)
            if (photoInsertError) throw photoInsertError
          }
        }

        const { data: refreshed, error: refetchError } = await supabase
          .from("about_stories")
          .select("*, about_story_photos(*)")
          .eq("id", editing.id)
          .single()

        if (refetchError) throw refetchError
        if (refreshed) {
          setStories((prev) => prev.map((s) => (s.id === editing.id ? (refreshed as AboutStory) : s)))
        }

        notify("About story updated. Existing photos for this story were kept; new ones were added.")
      } else {
        const insertRow = {
          ...payload,
          is_active: true,
          ...(profile?.id ? { created_by: profile.id, updated_by: profile.id } : {}),
          updated_at: new Date().toISOString(),
        }

        const { data: newRow, error } = await supabase.from("about_stories").insert(insertRow).select("*").single()

        if (error) throw error

        const photoRows = uploadedPhotos.slice(0, MAX_PHOTOS).map((photo, index) => ({
          story_id: newRow.id,
          photo_url: photo.photo_url,
          photo_path: photo.photo_path,
          sort_order: index + 1,
        }))

        let insertedPhotos: AboutPhoto[] = []
        if (photoRows.length > 0) {
          const { data: inserted, error: photoInsertError } = await supabase.from("about_story_photos").insert(photoRows).select("*")
          if (photoInsertError) {
            await supabase.from("about_stories").delete().eq("id", newRow.id)
            throw photoInsertError
          }
          insertedPhotos = (inserted ?? []) as AboutPhoto[]
        }

        setStories((prev) => [{ ...(newRow as AboutStory), about_story_photos: insertedPhotos }, ...prev])
        notify("About story added.")
      }

      setEditing(null)
      resetForm()
        })(),
        new Promise<never>((_, reject) =>
          setTimeout(
            () =>
              reject(
                new Error(
                  "Save timed out. Check your internet, VPN, firewall, and that your Supabase project is not paused.",
                ),
              ),
            SAVE_OVERALL_MS,
          ),
        ),
      ])
    } catch (error) {
      void removeStoredPhotos(uploadedPhotos.map((photo) => photo.photo_path).filter(Boolean))
      notify(formatSaveError(error), false)
    } finally {
      setSaving(false)
      saveBusyRef.current = false
    }

    void loadStories({ silent: true })
  }

  async function toggleStory(story: AboutStory) {
    const { error } = await supabase
      .from("about_stories")
      .update({
        is_active: !story.is_active,
        updated_at: new Date().toISOString(),
        ...(profile?.id ? { updated_by: profile.id } : {}),
      })
      .eq("id", story.id)

    if (error) {
      notify(error.message, false)
      return
    }

    notify(story.is_active ? "Story hidden from the About page." : "Story is now visible on the About page.")
    await loadStories()
  }

  async function deleteStory(story: AboutStory) {
    if (
      !window.confirm(
        `Delete story "${story.title}"?\n\nThis removes it from the website and deletes its photos from storage. This cannot be undone.`,
      )
    )
      return

    const { error } = await supabase.from("about_stories").delete().eq("id", story.id)

    if (error) {
      notify(error.message, false)
      return
    }

    const photoPaths = (story.about_story_photos ?? []).map((photo) => photo.photo_path).filter(Boolean)
    if (photoPaths.length > 0) await removeStoredPhotos(photoPaths)
    else if (story.photo_path) await removeStoredPhotos([story.photo_path])

    if (editing?.id === story.id) {
      setEditing(null)
      resetForm()
    }

    notify("Story deleted.")
    await loadStories()
  }

  const existingPreviewUrls = useMemo(
    () => sortStoryPhotosNewestFirst(editing?.about_story_photos).map((photo) => photo.photo_url).filter(Boolean),
    [editing],
  )
  const previewUrls = localPreviewUrls.length > 0 ? localPreviewUrls : existingPreviewUrls.length > 0 ? existingPreviewUrls : form.photo_url ? [form.photo_url] : []
  const inp: React.CSSProperties = {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #e0d0c0",
    fontSize: "13px",
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
    background: "#fff",
    color: "#3a1f13",
  }

  return (
    <div className="admin-page-wrap admin-page-wrap--wide">
      <div style={{ background: "#fff", borderRadius: "14px", border: "0.5px solid #e0d0c0", padding: "24px", marginBottom: "24px" }}>
        <p style={{ fontSize: "13px", fontWeight: 600, color: "#3a1f13", margin: "0 0 16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: "4px", height: "16px", background: "#8d5439", borderRadius: "2px", display: "inline-block" }} />
          {editing ? "Edit about story" : "Add about story"}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
          <input style={inp} placeholder="Occasion title" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} />
          <select style={inp} value={form.occasion_type} onChange={(e) => setForm((prev) => ({ ...prev, occasion_type: e.target.value }))}>
            {OCCASION_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <input style={inp} type="date" value={form.event_date} onChange={(e) => setForm((prev) => ({ ...prev, event_date: e.target.value }))} />
          <input style={inp} placeholder="Location" value={form.location} onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))} />
          <input style={inp} placeholder="People present" value={form.people_present} onChange={(e) => setForm((prev) => ({ ...prev, people_present: e.target.value }))} />
          <input
            style={inp}
            type="number"
            placeholder="Display order"
            value={form.display_order}
            onChange={(e) => setForm((prev) => ({ ...prev, display_order: Number(e.target.value) }))}
          />
        </div>
        <textarea
          style={{ ...inp, height: "90px", resize: "vertical", marginBottom: "12px" }}
          placeholder="Describe what happened, why it mattered, and the story behind the photo"
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
        />
        <textarea
          style={{ ...inp, height: "80px", resize: "vertical", marginBottom: "12px" }}
          placeholder="Impact or outcome"
          value={form.impact}
          onChange={(e) => setForm((prev) => ({ ...prev, impact: e.target.value }))}
        />
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: "16px", alignItems: "start", marginBottom: "14px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#7c4c2e", marginBottom: "6px" }}>Upload up to {MAX_PHOTOS} photos</label>
            <input
              key={fileInputKey}
              style={{ ...inp, padding: "8px 10px" }}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setSelectedFiles(Array.from(e.target.files ?? []).slice(0, MAX_PHOTOS))}
            />
            <p style={{ margin: "8px 0 0", fontSize: "11px", color: "#9e8070" }}>
              <strong>New event?</strong> Use this form as “Add about story” so each occasion stays on the site with its own photos and text.{" "}
              <strong>Editing?</strong> New files are <em>added</em> to that story’s gallery (up to {MAX_PHOTOS} total); older photos are not removed.
            </p>
            <p style={{ margin: "6px 0 0", fontSize: "11px", color: "#9e8070" }}>
              On the public About page, newest stories appear first; within a story, newer photos show first in the gallery.
            </p>
            {selectedFiles.length > 0 && (
              <p style={{ margin: "8px 0 0", fontSize: "12px", color: "#2e7d32" }}>
                Selected: {selectedFiles.length} photo{selectedFiles.length === 1 ? "" : "s"}
              </p>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#3a1f13", cursor: "pointer" }}>
              <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm((prev) => ({ ...prev, is_featured: e.target.checked }))} />
              Feature on top
            </label>
            <div style={{ background: "#f7f2ee", borderRadius: "12px", border: "1px solid #eadfd6", overflow: "hidden", minHeight: "180px", padding: "8px" }}>
              {previewUrls.length > 0 ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: "8px",
                    maxHeight: "min(55vh, 420px)",
                    overflowY: "auto",
                  }}
                >
                  {previewUrls.slice(0, MAX_PHOTOS).map((previewUrl, index) => (
                    <img
                      key={`${previewUrl}-${index}`}
                      src={previewUrl}
                      alt={`${form.title || "About story preview"} ${index + 1}`}
                      style={{ width: "100%", height: "85px", objectFit: "cover", borderRadius: "8px" }}
                    />
                  ))}
                </div>
              ) : (
                <div style={{ minHeight: "164px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "12px", color: "#9e8070", padding: "16px", textAlign: "center" }}>Photo previews appear here</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
          <div style={{ fontSize: "12px", color: "#9e8070" }}>
            Suggested details: occasion, date, people present, location, story, and impact.
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            {editing && (
              <button
                onClick={() => {
                  setEditing(null)
                  resetForm()
                }}
                style={{ padding: "9px 18px", background: "#f0e8e0", color: "#7c4c2e", border: "none", borderRadius: "8px", fontSize: "13px", cursor: "pointer" }}
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={() => void saveStory()}
              disabled={saving || !form.title.trim() || !form.description.trim() || (selectedFiles.length === 0 && previewUrls.length === 0)}
              style={{ padding: "10px 28px", background: saving ? "#a47b65" : "#8d5439", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
            >
              {saving ? "Saving..." : editing ? "Update story" : "Add story"}
            </button>
          </div>
        </div>
        {message.text && (
          <div style={{ marginTop: "14px", padding: "10px 14px", borderRadius: "8px", background: message.ok ? "#eaf7ee" : "#fce4e4", fontSize: "13px", color: message.ok ? "#2e7d32" : "#a32d2d" }}>
            {message.text}
          </div>
        )}

        <div
          style={{
            marginTop: "28px",
            paddingTop: "22px",
            borderTop: "1px solid #eadfd6",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "10px", marginBottom: "4px" }}>
            <p style={{ fontSize: "12px", fontWeight: 700, color: "#3a1f13", margin: 0, letterSpacing: "0.02em" }}>
              Uploaded stories (history)
            </p>
            <button
              type="button"
              onClick={() => void loadStories()}
              disabled={loading}
              style={{
                fontSize: "11px",
                fontWeight: 600,
                padding: "6px 12px",
                borderRadius: "8px",
                border: "1px solid #d9c1b5",
                background: loading ? "#f0e8e0" : "#fff",
                color: "#7c4c2e",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              Refresh list
            </button>
          </div>
          <p style={{ fontSize: "11px", color: "#9e8070", margin: "0 0 16px", lineHeight: 1.45 }}>
            Newest at the top. Use <strong>Update story</strong> to change text or add photos; use <strong>Delete story</strong> to remove it from the website permanently (including storage photos).
          </p>

          {loading && stories.length === 0 ? (
            <p style={{ color: "#9e8070", fontSize: "13px", margin: 0 }}>Loading your stories…</p>
          ) : stories.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "28px 16px",
                color: "#9e8070",
                background: "#fbf9f7",
                borderRadius: "12px",
                border: listError ? "1px solid #f5c0c0" : "1px dashed #e0d0c0",
                fontSize: "13px",
              }}
            >
              {listError ? (
                <>
                  <p style={{ color: "#a32d2d", margin: "0 0 12px", fontWeight: 600 }}>Could not load stories</p>
                  <p style={{ margin: "0 0 14px", lineHeight: 1.5 }}>{listError}</p>
                  <button
                    type="button"
                    onClick={() => void loadStories()}
                    style={{
                      padding: "8px 18px",
                      borderRadius: "8px",
                      border: "1px solid #8d5439",
                      background: "#8d5439",
                      color: "#fff",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontSize: "13px",
                    }}
                  >
                    Try again
                  </button>
                </>
              ) : (
                <>
                  <p style={{ margin: "0 0 10px", fontWeight: 600, color: "#5c4a3d" }}>No stories in this list yet</p>
                  <p style={{ margin: "0 0 14px", lineHeight: 1.55 }}>
                    If you already added one, the app is not receiving any rows from Supabase (usually project mismatch, RLS, or a hidden story).
                  </p>
                  <ul
                    style={{
                      textAlign: "left",
                      margin: "0 0 14px",
                      paddingLeft: "20px",
                      fontSize: "12px",
                      lineHeight: 1.6,
                      color: "#7a6a5c",
                    }}
                  >
                    <li>
                      In <strong>Supabase → Table Editor → about_stories</strong>, confirm your row exists and note <code style={{ fontSize: "11px" }}>is_active</code>. The public site only loads active stories; admins should still see inactive ones if your user is in <code style={{ fontSize: "11px" }}>admin_profiles</code>.
                    </li>
                    <li>
                      <strong>Same project as this site:</strong> <code style={{ fontSize: "11px" }}>church_website/.env</code> must use the same <code style={{ fontSize: "11px" }}>VITE_SUPABASE_URL</code> where the story was saved. Restart <code style={{ fontSize: "11px" }}>npm run dev</code> after editing <code style={{ fontSize: "11px" }}>.env</code>.
                    </li>
                    <li>
                      <strong>Your login:</strong>{" "}
                      {session?.user?.email ? (
                        <>
                          signed in as <strong>{session.user.email}</strong>. Your Auth user id must match <code style={{ fontSize: "11px" }}>admin_profiles.auth_user_id</code> for full admin RLS (run seed SQL from <code style={{ fontSize: "11px" }}>database/RESET_AND_RECREATE_SCHEMA.sql</code> if needed).
                        </>
                      ) : (
                        <>You do not appear signed in — open the admin login page and sign in, then refresh.</>
                      )}
                    </li>
                    <li>
                      DevTools → <strong>Console</strong> should log <code style={{ fontSize: "11px" }}>[Admin About] Loaded N story row(s)</code> after a successful fetch.
                    </li>
                  </ul>
                  <p style={{ margin: 0, fontSize: "12px", color: "#b0a090" }}>
                    New story? Use the form above and click <strong>Add story</strong>, then <strong>Refresh list</strong>.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {stories.map((story) => {
                const cover = sortStoryPhotosNewestFirst(story.about_story_photos)[0]
                const isEditingRow = editing?.id === story.id
                return (
                  <div
                    key={story.id}
                    style={{
                      background: isEditingRow ? "#fffdf8" : "#fbf9f7",
                      borderRadius: "14px",
                      border: isEditingRow ? "1.5px solid #c4a574" : "1px solid #e8ddd4",
                      padding: "14px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                      opacity: story.is_active ? 1 : 0.72,
                    }}
                  >
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", alignItems: "flex-start" }}>
                      <div
                        style={{
                          borderRadius: "12px",
                          overflow: "hidden",
                          width: "140px",
                          minWidth: "120px",
                          flexShrink: 0,
                          height: "100px",
                          background: "#f0e8e0",
                        }}
                      >
                        <AboutGalleryImage
                          photoPath={cover?.photo_path}
                          photoUrlFallback={cover?.photo_url ?? story.photo_url}
                          alt={story.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <div style={{ flex: "1 1 180px", minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "6px" }}>
                          <span style={{ fontSize: "14px", fontWeight: 600, color: "#3a1f13" }}>{story.title}</span>
                          <span style={{ fontSize: "10px", background: "#f4e4d8", color: "#8d5439", padding: "2px 8px", borderRadius: "999px" }}>{story.occasion_type}</span>
                          {story.is_featured && (
                            <span style={{ fontSize: "10px", background: "#fff3cd", color: "#8a6a0a", padding: "2px 8px", borderRadius: "999px" }}>Featured</span>
                          )}
                          {!story.is_active && (
                            <span style={{ fontSize: "10px", background: "#f0e8e0", color: "#9e8070", padding: "2px 8px", borderRadius: "999px" }}>Hidden from About</span>
                          )}
                        </div>
                        <p style={{ fontSize: "12px", color: "#9e8070", margin: "0 0 6px" }}>
                          {formatEventDate(story.event_date)}
                          {story.location ? ` • ${story.location}` : ""}
                        </p>
                        {story.people_present && (
                          <p style={{ fontSize: "12px", color: "#6e3c28", margin: "0 0 6px" }}>
                            Present: {story.people_present}
                          </p>
                        )}
                        <p style={{ fontSize: "12px", color: "#6e3c28", margin: 0, lineHeight: 1.5 }}>
                          {story.description.slice(0, 160)}
                          {story.description.length > 160 ? "…" : ""}
                        </p>
                        <p style={{ fontSize: "11px", color: "#9e8070", margin: "8px 0 0" }}>
                          Photos: {story.about_story_photos?.length ?? (story.photo_url ? 1 : 0)} / {MAX_PHOTOS}
                        </p>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        paddingTop: "4px",
                        borderTop: "1px solid #eadfd6",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => startEdit(story)}
                        style={{
                          fontSize: "12px",
                          padding: "8px 14px",
                          borderRadius: "8px",
                          border: "1px solid #c4a080",
                          background: "#8d5439",
                          color: "#fff",
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        Update story
                      </button>
                      <button
                        type="button"
                        onClick={() => void toggleStory(story)}
                        style={{
                          fontSize: "12px",
                          padding: "8px 14px",
                          borderRadius: "8px",
                          border: "1px solid #b5d4f4",
                          background: "#fff",
                          cursor: "pointer",
                          color: "#1565c0",
                          fontWeight: 600,
                        }}
                      >
                        {story.is_active ? "Hide on About page" : "Show on About page"}
                      </button>
                      <button
                        type="button"
                        onClick={() => void deleteStory(story)}
                        style={{
                          fontSize: "12px",
                          padding: "8px 14px",
                          borderRadius: "8px",
                          border: "1px solid #e8a0a0",
                          background: "#fff5f5",
                          cursor: "pointer",
                          color: "#a32d2d",
                          fontWeight: 600,
                        }}
                      >
                        Delete story
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
