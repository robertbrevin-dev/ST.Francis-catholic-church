import { supabase } from "./supabase"

export const ABOUT_GALLERY_BUCKET = "about-gallery"

export function normalizeStoragePath(p: string | null | undefined): string {
  if (!p) return ""
  return p.replace(/\\/g, "/").replace(/^\/+/, "").trim()
}

export function extractStoragePathFromPublicUrl(url: string): string | null {
  try {
    const u = new URL(url.trim())
    const marker = `/object/public/${ABOUT_GALLERY_BUCKET}/`
    const idx = u.pathname.indexOf(marker)
    if (idx === -1) return null
    return decodeURIComponent(u.pathname.slice(idx + marker.length))
  } catch {
    return null
  }
}

export function resolveAboutGallerySources(
  photoPath: string | null | undefined,
  photoUrlFallback: string | null | undefined,
): { displaySrc: string | null; signingPath: string } {
  const rawPath = (photoPath ?? "").trim()
  const rawFb = (photoUrlFallback ?? "").trim()

  if (rawPath.startsWith("http://") || rawPath.startsWith("https://")) {
    const extracted = extractStoragePathFromPublicUrl(rawPath)
    return { displaySrc: rawPath, signingPath: extracted ?? "" }
  }

  const normalized = normalizeStoragePath(rawPath)
  if (normalized) {
    const { data } = supabase.storage.from(ABOUT_GALLERY_BUCKET).getPublicUrl(normalized)
    return { displaySrc: data.publicUrl || null, signingPath: normalized }
  }

  if (rawFb.startsWith("http://") || rawFb.startsWith("https://")) {
    const extracted = extractStoragePathFromPublicUrl(rawFb)
    return { displaySrc: rawFb, signingPath: extracted ?? "" }
  }

  return { displaySrc: null, signingPath: "" }
}

export function aboutGalleryImageSrc(photoPath?: string | null, photoUrlFallback?: string | null): string {
  const { displaySrc } = resolveAboutGallerySources(photoPath, photoUrlFallback)
  return displaySrc ?? ""
}
