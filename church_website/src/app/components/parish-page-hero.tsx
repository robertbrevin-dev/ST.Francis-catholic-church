import type { ReactNode } from "react"

export function resolvePublicAssetUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path
  const base = import.meta.env.BASE_URL ?? "/"
  const clean = path.startsWith("/") ? path.slice(1) : path
  return `${base}${clean}`.replace(/\/{2,}/g, "/")
}

const HERO_OVERLAY =
  "linear-gradient(145deg, rgba(26,14,9,0.72) 0%, rgba(58,31,19,0.7) 45%, rgba(33,54,40,0.62) 100%)"

export type ParishPageHeroProps = {
  imageUrl: string
  eyebrow?: string
  title: string
  icon: ReactNode
  tagline: string
  children: ReactNode
}

export function ParishPageHero({
  imageUrl,
  eyebrow = "St. Francis Cheptarit",
  title,
  icon,
  tagline,
  children,
}: ParishPageHeroProps) {
  const src = resolvePublicAssetUrl(imageUrl)
  return (
    <section className="relative overflow-hidden bg-[#261610] px-4 py-20 text-white sm:py-28">
      <img
        src={src}
        alt=""
        width={1920}
        height={1080}
        decoding="async"
        fetchPriority="high"
        className="pointer-events-none absolute inset-0 z-0 h-full min-h-[min(52vh,620px)] w-full object-cover object-center"
        aria-hidden
      />
      <div className="absolute inset-0 z-[1]" style={{ background: HERO_OVERLAY }} aria-hidden />
      <div
        className="pointer-events-none absolute -inset-40 z-[1] opacity-[0.2] blur-3xl"
        style={{ background: "radial-gradient(ellipse at 30% 20%, #f59e0b 0%, transparent 55%)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 top-1/2 z-[1] h-72 w-72 -translate-y-1/2 rounded-full opacity-[0.12] blur-3xl sm:h-96 sm:w-96"
        style={{ background: "radial-gradient(circle, #4ade80 0%, transparent 70%)" }}
        aria-hidden
      />
      <div className="relative z-10 container mx-auto max-w-4xl">
        <div className="text-center">
          <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-lg backdrop-blur-sm sm:h-[4.5rem] sm:w-[4.5rem]">
            <span className="flex items-center justify-center text-amber-100 [&_svg]:h-9 [&_svg]:w-9 sm:[&_svg]:h-10 sm:[&_svg]:w-10">
              {icon}
            </span>
          </div>
          <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-amber-100/90 sm:text-xs">{eyebrow}</p>
          <h1 className="mb-5 font-serif text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl md:leading-tight">
            {title}
          </h1>
          <div className="mx-auto mb-6 h-1 w-24 rounded-full bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400/90" />
          <p className="mx-auto mb-10 max-w-2xl text-sm leading-relaxed text-green-100/95 sm:mb-12 sm:text-lg">{tagline}</p>
        </div>
        <div className="mx-auto max-w-4xl">
          <div
            className="rounded-2xl border border-white/40 px-5 py-7 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-md sm:rounded-[1.35rem] md:px-8 md:py-9"
            style={{ background: "rgba(253, 250, 246, 0.45)" }}
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}
