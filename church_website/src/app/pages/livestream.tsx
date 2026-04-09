import { useEffect, useState, type ReactNode } from "react"
import { useScrollReveal } from "../components/scroll-reveal"
import { ParishPageHero } from "../components/parish-page-hero"
import { ExternalLink, Wifi, Play } from "lucide-react"
import { supabase } from "../../lib/supabase"
import { getFacebookEmbedSrc, getYouTubeEmbedSrc, isConfiguredStreamUrl, normalizeExternalUrl } from "../../lib/livestreamEmbed"

type StreamConfig = {
  youtube_url: string
  youtube_title?: string
  youtube_description?: string
  youtube_poster_url?: string
  facebook_url: string
  facebook_title?: string
  facebook_description?: string
  facebook_poster_url?: string
  zoom_meeting_url: string
  zoom_meeting_id: string
  zoom_passcode: string
  zoom_title?: string
  zoom_description?: string
  zoom_poster_url?: string
}

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
    <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
  </svg>
)
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)
const ZoomIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
    <path d="M24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12zM9.57 8.323H6.35A1.35 1.35 0 005 9.673v4.386c0 .994.806 1.8 1.8 1.8H12.6c.248 0 .45-.202.45-.45V11.02a1.35 1.35 0 00-1.35-1.35H9.57V8.323zm4.73 1.847l2.684-1.918a.45.45 0 01.716.363v6.77a.45.45 0 01-.716.363l-2.684-1.918V10.17z" />
  </svg>
)

function ClickableStreamPreview({
  href,
  embedSrc,
  openLabel,
  fallback,
  posterUrl,
}: {
  href: string
  embedSrc: string | null
  openLabel: string
  fallback: ReactNode
  posterUrl?: string
}) {
  const [showPlayer, setShowPlayer] = useState(false)
  const ok = isConfiguredStreamUrl(href)

  if (!ok) {
    return (
      <div className="parish-glass-card aspect-video flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#c9a88a]/50 px-4 text-center text-sm text-gray-600">
        <span>Stream link not set yet.</span>
        <span className="text-xs text-gray-400">Check back after the next announcement.</span>
      </div>
    )
  }

  return (
    <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-zinc-900 shadow-inner ring-1 ring-black/10">
      {showPlayer && embedSrc ? (
        <iframe
          src={`${embedSrc}?autoplay=1`}
          title="Stream preview"
          className="absolute inset-0 h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <>
          {posterUrl ? (
            <img 
              src={posterUrl} 
              alt="Stream poster" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 transition-opacity hover:opacity-80" 
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center p-6 text-white opacity-40">
              {fallback}
            </div>
          )}
          
          <div className="absolute inset-0 flex items-center justify-center z-20">
            {embedSrc ? (
              <button
                onClick={() => setShowPlayer(true)}
                className="group flex flex-col items-center gap-3 transition-transform hover:scale-105 active:scale-95"
                aria-label="Load preview"
              >
                <div className="bg-white/20 backdrop-blur-md rounded-full p-4 border border-white/30 shadow-xl group-hover:bg-white/30 transition-colors">
                  <div className="bg-white text-black rounded-full p-3 shadow-inner">
                    <Play className="h-6 w-6 fill-current ml-1" />
                  </div>
                </div>
                <span className="text-white text-xs font-bold uppercase tracking-widest drop-shadow-md">
                  Click to Preview
                </span>
              </button>
            ) : (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-3 transition-transform hover:scale-105"
              >
                <div className="bg-white/20 backdrop-blur-md rounded-full p-4 border border-white/30 shadow-xl">
                  <ExternalLink className="h-8 w-8 text-white" />
                </div>
                <span className="text-white text-xs font-bold uppercase tracking-widest drop-shadow-md">
                  Visit External Site
                </span>
              </a>
            )}
          </div>
        </>
      )}

      {!showPlayer && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-0 left-0 right-0 z-30 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent pb-3 pt-12 px-3 text-center"
          aria-label={openLabel}
        >
          <span className="text-white text-[10px] font-bold drop-shadow-md flex items-center justify-center gap-1 opacity-70">
            {openLabel}
            <ExternalLink className="h-3 w-3" />
          </span>
        </a>
      )}
    </div>
  )
}

function displayOrDash(value: string) {
  const t = (value ?? "").trim()
  if (!t || t === "#") return "—"
  return t
}

export function Livestream() {
  useScrollReveal()
  const [streamConfig, setStreamConfig] = useState<StreamConfig>({
    youtube_url: "",
    facebook_url: "",
    zoom_meeting_url: "",
    zoom_meeting_id: "",
    zoom_passcode: "",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = "Live Stream — St. Francis Cheptarit"
    void loadStreamConfig()
  }, [])

  async function loadStreamConfig() {
    try {
      const { data, error } = await supabase
        .from("livestream_config")
        .select("*")
        .eq("id", "main")
        .maybeSingle()

      if (error) {
        console.error("Error loading stream config:", error.message || error)
      }

      if (data) {
        setStreamConfig({
          youtube_url: normalizeExternalUrl((data.youtube_url ?? "").trim()),
          youtube_title: (data.youtube_title ?? "").trim(),
          youtube_description: (data.youtube_description ?? "").trim(),
          youtube_poster_url: normalizeExternalUrl((data.youtube_poster_url ?? "").trim()),
          facebook_url: normalizeExternalUrl((data.facebook_url ?? "").trim()),
          facebook_title: (data.facebook_title ?? "").trim(),
          facebook_description: (data.facebook_description ?? "").trim(),
          facebook_poster_url: normalizeExternalUrl((data.facebook_poster_url ?? "").trim()),
          zoom_meeting_url: normalizeExternalUrl((data.zoom_meeting_url ?? "").trim()),
          zoom_meeting_id: (data.zoom_meeting_id ?? "").trim(),
          zoom_passcode: (data.zoom_passcode ?? "").trim(),
          zoom_title: (data.zoom_title ?? "").trim(),
          zoom_description: (data.zoom_description ?? "").trim(),
          zoom_poster_url: normalizeExternalUrl((data.zoom_poster_url ?? "").trim()),
        })
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const ytEmbed = getYouTubeEmbedSrc(streamConfig.youtube_url)
  const fbEmbed = getFacebookEmbedSrc(streamConfig.facebook_url)

  const footerLinks = [
    isConfiguredStreamUrl(streamConfig.youtube_url)
      ? { href: streamConfig.youtube_url, label: "Subscribe on YouTube", bg: "#8d5439", Icon: YoutubeIcon }
      : null,
    isConfiguredStreamUrl(streamConfig.facebook_url)
      ? { href: streamConfig.facebook_url, label: "Follow on Facebook", bg: "#1877f2", Icon: FacebookIcon }
      : null,
  ].filter(Boolean) as Array<{ href: string; label: string; bg: string; Icon: typeof YoutubeIcon }>

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#f8efe2" }}>
        <div className="text-center">
          <Wifi className="h-12 w-12 mx-auto mb-4 text-green-700 animate-pulse" />
          <p className="text-green-700">Loading livestream information...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <ParishPageHero
        imageUrl="/images/livestream-hero-background.png"
        eyebrow="Online"
        title="Live Stream"
        icon={
          <span className="relative inline-flex">
            <Wifi className="text-white drop-shadow-sm" aria-hidden />
            <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-white" aria-hidden />
          </span>
        }
        tagline="Join our Masses and parish events online. Watch on your preferred platform."
      >
        <p className="text-center font-serif text-lg leading-relaxed text-[#3a1f13] [text-shadow:0_1px_2px_rgba(255,255,255,0.35)] md:text-xl">
          When a stream link is set by the parish, previews below let you open YouTube, Facebook, or Zoom in a new tab for full playback.
        </p>
      </ParishPageHero>

      <section className="parish-page-content-bg page-background-section py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 reveal">
            <p className="text-green-700 font-semibold text-sm uppercase tracking-wider mb-2">Watch Us Online</p>
            <h2 className="text-3xl font-bold mb-3" style={{ color: "#6e3c28" }}>
              Choose Your Platform
            </h2>
            <div className="section-divider"></div>
            <p className="text-gray-500 mt-4 text-sm max-w-xl mx-auto">
              Preview loads below when a link is set. Tap the preview (or the button) to open the full stream on YouTube, Facebook, or Zoom in a new tab.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="reveal touch-card rounded-2xl overflow-hidden shadow-lg border border-green-100" data-delay="0.05s">
              <div className="p-8 text-white text-center" style={{ background: "linear-gradient(135deg, #8d5439, #bf875f)" }}>
                <div className="flex justify-center mb-3">
                  <YoutubeIcon />
                </div>
                <h3 className="font-bold text-xl">{streamConfig.youtube_title || "YouTube"}</h3>
                <p className="text-emerald-100 text-sm mt-1">Live & Recorded</p>
              </div>
              <div className="space-y-4 p-5 parish-glass-card">
                <ClickableStreamPreview
                  href={streamConfig.youtube_url}
                  embedSrc={ytEmbed}
                  posterUrl={streamConfig.youtube_poster_url}
                  openLabel="Open on YouTube"
                  fallback={
                    <div
                      className="flex flex-col items-center justify-center gap-2 text-center h-full w-full px-4"
                      style={{ background: "linear-gradient(135deg, #5c3825, #8d5439)" }}
                    >
                      <YoutubeIcon />
                      <p className="text-sm font-medium">Open in YouTube to watch the stream or channel.</p>
                    </div>
                  }
                />
                <div className="space-y-3">
                  <p className="text-gray-600 text-sm text-center leading-relaxed">
                    {streamConfig.youtube_description || "Watch our live Masses and recorded services on YouTube."}
                  </p>
                  
                  {isConfiguredStreamUrl(streamConfig.youtube_url) && (
                    <div className="bg-orange-50/50 rounded-lg p-2 border border-orange-100/50">
                      <p className="text-[10px] text-orange-800/70 font-medium uppercase tracking-wider mb-1 text-center">Stream URL</p>
                      <p className="text-[11px] text-orange-900/80 font-mono break-all text-center px-2">
                        {streamConfig.youtube_url}
                      </p>
                    </div>
                  )}
                </div>
                
                {isConfiguredStreamUrl(streamConfig.youtube_url) && (
                  <a
                    href={streamConfig.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full text-white font-bold py-3 rounded-xl transition-all btn-ripple shadow-md"
                    style={{ background: "linear-gradient(135deg, #8d5439, #bf875f)" }}
                  >
                    <YoutubeIcon />
                    <span>Watch on YouTube</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>

            <div className="reveal touch-card rounded-2xl overflow-hidden shadow-lg border border-green-100" data-delay="0.15s">
              <div className="p-8 text-white text-center" style={{ background: "linear-gradient(135deg, #1877f2, #0d5ec4)" }}>
                <div className="flex justify-center mb-3">
                  <FacebookIcon />
                </div>
                <h3 className="font-bold text-xl">{streamConfig.facebook_title || "Facebook"}</h3>
                <p className="text-blue-100 text-sm mt-1">Facebook Live</p>
              </div>
              <div className="space-y-4 p-5 parish-glass-card">
                <ClickableStreamPreview
                  href={streamConfig.facebook_url}
                  embedSrc={fbEmbed}
                  posterUrl={streamConfig.facebook_poster_url}
                  openLabel="Open on Facebook"
                  fallback={
                    <div className="text-center space-y-2 flex flex-col items-center justify-center h-full" style={{ background: "linear-gradient(135deg, #0d5ec4, #1877f2)" }}>
                      <FacebookIcon />
                      <p className="text-sm font-medium px-4">Open Facebook to watch the live stream</p>
                    </div>
                  }
                />
                <div className="space-y-3">
                  <p className="text-gray-600 text-sm text-center leading-relaxed">
                    {streamConfig.facebook_description || "Join us on Facebook Live for Sunday Masses and parish celebrations."}
                  </p>
                  
                  {isConfiguredStreamUrl(streamConfig.facebook_url) && (
                    <div className="bg-blue-50/50 rounded-lg p-2 border border-blue-100/50">
                      <p className="text-[10px] text-blue-800/70 font-medium uppercase tracking-wider mb-1 text-center">Stream URL</p>
                      <p className="text-[11px] text-blue-900/80 font-mono break-all text-center px-2">
                        {streamConfig.facebook_url}
                      </p>
                    </div>
                  )}
                </div>
                
                {isConfiguredStreamUrl(streamConfig.facebook_url) && (
                  <a
                    href={streamConfig.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full text-white font-bold py-3 rounded-xl transition-all btn-ripple shadow-md"
                    style={{ background: "linear-gradient(135deg, #1877f2, #0d5ec4)" }}
                  >
                    <FacebookIcon />
                    <span>Watch on Facebook</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>

            <div className="reveal touch-card rounded-2xl overflow-hidden shadow-lg border border-green-100" data-delay="0.25s">
              <div className="p-8 text-white text-center" style={{ background: "linear-gradient(135deg, #2d8cff, #0e72eb)" }}>
                <div className="flex justify-center mb-3">
                  <ZoomIcon />
                </div>
                <h3 className="font-bold text-xl">{streamConfig.zoom_title || "Zoom"}</h3>
                <p className="text-blue-100 text-sm mt-1">Interactive Sessions</p>
              </div>
              <div className="space-y-4 p-5 parish-glass-card">
                <ClickableStreamPreview
                  href={streamConfig.zoom_meeting_url}
                  embedSrc={null}
                  posterUrl={streamConfig.zoom_poster_url}
                  openLabel="Join Zoom meeting"
                  fallback={
                    <div className="flex flex-col items-center justify-center gap-2 text-center h-full w-full" style={{ background: "linear-gradient(135deg, #0e72eb, #2d8cff)" }}>
                      <ZoomIcon />
                      <p className="text-sm font-medium px-4">Tap below to launch Zoom</p>
                    </div>
                  }
                />
                <div className="space-y-3">
                  <p className="text-gray-600 text-sm text-center leading-relaxed">
                    {streamConfig.zoom_description || "Join meetings, catechism, and prayer gatherings on Zoom."}
                  </p>
                  
                  {isConfiguredStreamUrl(streamConfig.zoom_meeting_url) && (
                    <div className="bg-blue-50/50 rounded-lg p-2 border border-blue-100/50">
                      <p className="text-[10px] text-blue-800/70 font-medium uppercase tracking-wider mb-1 text-center">Meeting URL</p>
                      <p className="text-[11px] text-blue-900/80 font-mono break-all text-center px-2">
                        {streamConfig.zoom_meeting_url}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                  <p className="text-xs text-blue-700 font-semibold">
                    Meeting ID: <span className="font-bold">{displayOrDash(streamConfig.zoom_meeting_id)}</span>
                  </p>
                  <p className="text-xs text-blue-700 font-semibold">
                    Passcode: <span className="font-bold">{displayOrDash(streamConfig.zoom_passcode)}</span>
                  </p>
                </div>
                {isConfiguredStreamUrl(streamConfig.zoom_meeting_url) && (
                  <a
                    href={streamConfig.zoom_meeting_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full text-white font-bold py-3 rounded-xl transition-all btn-ripple shadow-md"
                    style={{ background: "linear-gradient(135deg, #2d8cff, #0e72eb)" }}
                  >
                    <ZoomIcon />
                    <span>Join on Zoom</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-16 px-4 parallax-section relative"
        style={{ backgroundImage: "url('/images/saint_francis.png')", minHeight: "320px" }}
      >
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(124,45,18,0.92), rgba(124,45,18,0.85))" }} />
        <div className="relative z-10 container mx-auto max-w-4xl">
          <div className="text-center mb-10 reveal">
            <h2 className="text-2xl font-bold text-white mb-3">Live Stream Schedule</h2>
            <div className="w-16 h-1 mx-auto rounded" style={{ background: "linear-gradient(90deg, #bf875f, #f97316)" }}></div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { day: "Sunday", time: "7:00 AM", event: "Early Morning Mass", platform: "YouTube & Facebook" },
              { day: "Sunday", time: "9:00 AM", event: "Main Sunday Mass", platform: "YouTube & Facebook" },
              { day: "Wednesday", time: "6:00 PM", event: "Bible Study", platform: "Zoom" },
              { day: "Special Events", time: "As Announced", event: "Parish Celebrations", platform: "All Platforms" },
            ].map((item, i) => (
              <div key={i} className="reveal parish-glass-card flex items-start gap-4 rounded-xl p-4 touch-card" data-delay={`${i * 0.1}s`}>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xs"
                  style={{ background: "#8d5439" }}
                >
                  <Wifi className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-green-900 text-sm">{item.event}</p>
                  <p className="text-green-700 text-xs">
                    {item.day} &bull; {item.time}
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5">Platform: {item.platform}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="parish-page-content-bg page-background-section py-12 px-4">
        <div className="container mx-auto max-w-3xl text-center reveal">
          <h2 className="text-2xl font-bold mb-3" style={{ color: "#6e3c28" }}>
            Stay Connected Online
          </h2>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            Can&apos;t make it to Mass in person? Join us online. Follow us on our social media platforms to receive notifications before every live stream.
          </p>
          {footerLinks.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-3">
              {footerLinks.map(({ href, label, bg, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-full transition-all btn-ripple shadow-md touch-card"
                  style={{ background: bg }}
                >
                  <Icon /> {label}
                </a>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Social links will appear here once the parish adds them in admin.</p>
          )}
        </div>
      </section>
    </div>
  )
}
