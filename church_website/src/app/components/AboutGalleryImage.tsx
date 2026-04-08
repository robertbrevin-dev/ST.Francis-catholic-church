import { useEffect, useRef, useState, type CSSProperties } from "react"
import { supabase } from "../../lib/supabase"
import { ABOUT_GALLERY_BUCKET, resolveAboutGallerySources } from "../../lib/aboutGallery"

type Props = {
  photoPath?: string | null
  photoUrlFallback?: string | null
  alt: string
  className?: string
  style?: CSSProperties
  loading?: "lazy" | "eager"
}

export function AboutGalleryImage({ photoPath, photoUrlFallback, alt, className, style, loading = "lazy" }: Props) {
  const fallbackTrim = (photoUrlFallback ?? "").trim()
  const { displaySrc: initialSrc, signingPath } = resolveAboutGallerySources(photoPath, photoUrlFallback)
  const [src, setSrc] = useState<string | null>(() => initialSrc)
  const errorStep = useRef(0)

  useEffect(() => {
    errorStep.current = 0
    const { displaySrc } = resolveAboutGallerySources(photoPath, photoUrlFallback)
    setSrc(displaySrc)
  }, [photoPath, photoUrlFallback])

  if (!src) {
    return (
      <div
        className={className}
        style={{ background: "linear-gradient(135deg, #f8efe2, #ecd5c5)", minHeight: "8rem", ...style }}
        aria-hidden
      />
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      decoding="async"
      onError={() => {
        if (errorStep.current === 0 && signingPath) {
          errorStep.current = 1
          void supabase.storage
            .from(ABOUT_GALLERY_BUCKET)
            .createSignedUrl(signingPath, 3600)
            .then(({ data, error }) => {
              if (!error && data?.signedUrl) setSrc(data.signedUrl)
            })
          return
        }
        if (errorStep.current <= 1 && fallbackTrim.startsWith("http") && src !== fallbackTrim) {
          errorStep.current = 2
          setSrc(fallbackTrim)
        }
      }}
    />
  )
}
