export function isConfiguredStreamUrl(url: string | null | undefined): boolean {
  const u = (url ?? "").trim().replace(/^`|`$/g, "").trim()
  if (!u || u === "#") return false
  try {
    const parsed = new URL(u.startsWith("http://") || u.startsWith("https://") ? u : `https://${u}`)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return false
  }
}

export function normalizeExternalUrl(url: string | null | undefined): string {
  const u = (url ?? "").trim().replace(/^`|`$/g, "").trim()
  if (!u || u === "#") return ""
  if (u.startsWith("http://") || u.startsWith("https://")) return u
  return `https://${u}`
}

export function getYouTubeVideoId(url: string): string | null {
  const raw = url.trim().replace(/^`|`$/g, "").trim()
  if (!raw) return null
  try {
    const u = new URL(raw.startsWith("http://") || raw.startsWith("https://") ? raw : `https://${raw}`)
    const host = u.hostname.replace(/^www\./, "")
    if (host === "youtu.be") {
      const id = u.pathname.split("/").filter(Boolean)[0]
      return id && isLikelyYoutubeId(id) ? id : null
    }
    if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
      if (u.pathname === "/watch" || u.pathname.startsWith("/watch")) {
        const v = u.searchParams.get("v")
        return v && isLikelyYoutubeId(v) ? v : null
      }
      const parts = u.pathname.split("/").filter(Boolean)
      const embedIdx = parts.indexOf("embed")
      if (embedIdx >= 0 && parts[embedIdx + 1]) return isLikelyYoutubeId(parts[embedIdx + 1]) ? parts[embedIdx + 1] : null
      const liveIdx = parts.indexOf("live")
      if (liveIdx >= 0 && parts[liveIdx + 1]) return isLikelyYoutubeId(parts[liveIdx + 1]) ? parts[liveIdx + 1] : null
      const shortsIdx = parts.indexOf("shorts")
      if (shortsIdx >= 0 && parts[shortsIdx + 1]) return isLikelyYoutubeId(parts[shortsIdx + 1]) ? parts[shortsIdx + 1] : null
    }
  } catch {
  }
  return null
}

function isLikelyYoutubeId(id: string): boolean {
  return /^[\w-]{11}$/.test(id)
}

export function getYouTubeEmbedSrc(url: string): string | null {
  const id = getYouTubeVideoId(url)
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
}

export function getFacebookEmbedSrc(url: string): string | null {
  if (!isConfiguredStreamUrl(url)) return null
  const normalized = normalizeExternalUrl(url)
  if (!normalized.includes("facebook.com") && !normalized.includes("fb.watch")) return null
  return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(normalized)}&show_text=false&width=560`
}
