import { useEffect, useState } from "react";
import { useScrollReveal } from "../components/scroll-reveal";
import { ExternalLink, Wifi } from "lucide-react";
import { supabase } from "../../lib/supabase";

type StreamConfig = {
  youtube_url: string;
  facebook_url: string;
  zoom_meeting_url: string;
  zoom_meeting_id: string;
  zoom_passcode: string;
}

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
    <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
  </svg>
);
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);
const ZoomIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
    <path d="M24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12zM9.57 8.323H6.35A1.35 1.35 0 005 9.673v4.386c0 .994.806 1.8 1.8 1.8H12.6c.248 0 .45-.202.45-.45V11.02a1.35 1.35 0 00-1.35-1.35H9.57V8.323zm4.73 1.847l2.684-1.918a.45.45 0 01.716.363v6.77a.45.45 0 01-.716.363l-2.684-1.918V10.17z"/>
  </svg>
);

export function Livestream() {
  useScrollReveal();
  const [streamConfig, setStreamConfig] = useState<StreamConfig>({
    youtube_url: "#",
    facebook_url: "#",
    zoom_meeting_url: "#",
    zoom_meeting_id: "xxx xxx xxxx",
    zoom_passcode: "xxxxxx"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Live Stream — St. Francis Cheptarit";
    loadStreamConfig();
  }, []);

  async function loadStreamConfig() {
    try {
      const { data, error } = await supabase
        .from("livestream_config")
        .select("youtube_url, facebook_url, zoom_meeting_url, zoom_meeting_id, zoom_passcode")
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading stream config:', error);
      }

      if (data) {
        setStreamConfig({
          youtube_url: data.youtube_url || "#",
          facebook_url: data.facebook_url || "#",
          zoom_meeting_url: data.zoom_meeting_url || "#",
          zoom_meeting_id: data.zoom_meeting_id || "xxx xxx xxxx",
          zoom_passcode: data.zoom_passcode || "xxxxxx"
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#f8efe2" }}>
        <div className="text-center">
          <Wifi className="h-12 w-12 mx-auto mb-4 text-green-700 animate-pulse" />
          <p className="text-green-700">Loading livestream information...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section
        className="relative py-24 px-4 text-white overflow-hidden parallax-section"
        style={{ backgroundImage: "url('/images/church.jpg')", minHeight: "420px" }}
      >
        <div className="absolute inset-0 hero-overlay" />
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <img src="/images/logo_stamp.jpeg" alt="" className="w-72 h-72 object-contain" />
        </div>
        <div className="relative z-10 container mx-auto max-w-4xl text-center">
          <div className="reveal flex justify-center mb-5">
            <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-emerald-300 bg-emerald-600/15">
              <Wifi className="h-10 w-10 text-emerald-200" />
              <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-emerald-400 live-dot border-2 border-white"></span>
            </div>
          </div>
          <h1 className="reveal text-4xl md:text-5xl font-bold mb-4" data-delay="0.1s">Live Stream</h1>
          <div className="w-20 h-1 mx-auto rounded mb-4" style={{ background: "linear-gradient(90deg, #8d5439, #6e3c28)" }}></div>
          <p className="reveal text-green-100 text-lg max-w-xl mx-auto" data-delay="0.2s">
            Join our Masses and parish events online. Watch on your preferred platform.
          </p>
        </div>
      </section>

      <section className="py-16 px-4" style={{ background: "#f8efe2" }}>
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 reveal">
            <p className="text-green-700 font-semibold text-sm uppercase tracking-wider mb-2">Watch Us Online</p>
            <h2 className="text-3xl font-bold mb-3" style={{ color: "#6e3c28" }}>Choose Your Platform</h2>
            <div className="section-divider"></div>
            <p className="text-gray-500 mt-4 text-sm">Click the button for the platform you prefer. Links will be active during live services.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="reveal touch-card rounded-2xl overflow-hidden shadow-lg border border-green-100" data-delay="0.05s">
              <div className="p-8 text-white text-center" style={{ background: "linear-gradient(135deg, #8d5439, #bf875f)" }}>
                <div className="flex justify-center mb-3"><YoutubeIcon /></div>
                <h3 className="font-bold text-xl">YouTube</h3>
                <p className="text-emerald-100 text-sm mt-1">Live & Recorded</p>
              </div>
              <div className="p-5 bg-white">
                <p className="text-gray-600 text-sm text-center mb-4">Watch our live Masses and access all recorded services on our YouTube channel.</p>
                <a href={streamConfig.youtube_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full text-white font-bold py-3 rounded-xl transition-all btn-ripple shadow-md"
                  style={{ background: "linear-gradient(135deg, #8d5439, #bf875f)" }}>
                  <YoutubeIcon />
                  <span>Watch on YouTube</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
                <p className="text-xs text-center text-gray-400 mt-2">URL to be updated by admin</p>
              </div>
            </div>

            <div className="reveal touch-card rounded-2xl overflow-hidden shadow-lg border border-green-100" data-delay="0.15s">
              <div className="p-8 text-white text-center" style={{ background: "linear-gradient(135deg, #1877f2, #0d5ec4)" }}>
                <div className="flex justify-center mb-3"><FacebookIcon /></div>
                <h3 className="font-bold text-xl">Facebook</h3>
                <p className="text-blue-100 text-sm mt-1">Facebook Live</p>
              </div>
              <div className="p-5 bg-white">
                <p className="text-gray-600 text-sm text-center mb-4">Join us on Facebook Live for Sunday Masses and special parish celebrations and events.</p>
                <a href={streamConfig.facebook_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full text-white font-bold py-3 rounded-xl transition-all btn-ripple shadow-md"
                  style={{ background: "linear-gradient(135deg, #1877f2, #0d5ec4)" }}>
                  <FacebookIcon />
                  <span>Watch on Facebook</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
                <p className="text-xs text-center text-gray-400 mt-2">URL to be updated by admin</p>
              </div>
            </div>

            <div className="reveal touch-card rounded-2xl overflow-hidden shadow-lg border border-green-100" data-delay="0.25s">
              <div className="p-8 text-white text-center" style={{ background: "linear-gradient(135deg, #2d8cff, #0e72eb)" }}>
                <div className="flex justify-center mb-3"><ZoomIcon /></div>
                <h3 className="font-bold text-xl">Zoom</h3>
                <p className="text-blue-100 text-sm mt-1">Interactive Sessions</p>
              </div>
              <div className="p-5 bg-white">
                <p className="text-gray-600 text-sm text-center mb-4">Join interactive parish meetings, catechism sessions, and prayer gatherings via Zoom.</p>
                <div className="bg-blue-50 rounded-xl p-3 mb-3 border border-blue-100">
                  <p className="text-xs text-blue-700 font-semibold">Meeting ID: <span className="font-bold">{streamConfig.zoom_meeting_id}</span></p>
                  <p className="text-xs text-blue-700 font-semibold">Passcode: <span className="font-bold">{streamConfig.zoom_passcode}</span></p>
                </div>
                <a href={streamConfig.zoom_meeting_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full text-white font-bold py-3 rounded-xl transition-all btn-ripple shadow-md"
                  style={{ background: "linear-gradient(135deg, #2d8cff, #0e72eb)" }}>
                  <ZoomIcon />
                  <span>Join on Zoom</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
                <p className="text-xs text-center text-gray-400 mt-2">URL to be updated by admin</p>
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
              <div key={i} className="reveal glass-white rounded-xl p-4 flex items-start gap-4 touch-card" data-delay={`${i * 0.1}s`}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xs" style={{ background: "#8d5439" }}>
                  <Wifi className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-green-900 text-sm">{item.event}</p>
                  <p className="text-green-700 text-xs">{item.day} &bull; {item.time}</p>
                  <p className="text-gray-500 text-xs mt-0.5">Platform: {item.platform}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto max-w-3xl text-center reveal">
          <h2 className="text-2xl font-bold mb-3" style={{ color: "#6e3c28" }}>Stay Connected Online</h2>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            Can't make it to Mass in person? Join us online. Follow us on our social media platforms to receive notifications before every live stream.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { href: streamConfig.youtube_url, label: "Subscribe on YouTube", bg: "#8d5439", Icon: YoutubeIcon },
              { href: streamConfig.facebook_url, label: "Follow on Facebook", bg: "#1877f2", Icon: FacebookIcon },
            ].map(({ href, label, bg, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-full transition-all btn-ripple shadow-md touch-card"
                style={{ background: bg }}>
                <Icon /> {label}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
