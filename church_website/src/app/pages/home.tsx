import { useState, useEffect } from "react";
import '../styles/home.css';
import { Link } from "react-router";
import { Calendar, Clock, Phone, ArrowRight, Bell, ChevronRight, ChevronLeft, Smartphone, MapPin, Heart, Users, BookOpen } from "lucide-react";
import { useScrollReveal, ScrollReveal, StaggerContainer, StaggerItem } from "../components/scroll-reveal";
import { CHURCH_PHONE, PARISH_TEL_HREF, WHATSAPP_NUMBER } from "../../lib/parishContact";
import { KSUC_GATE_FRAMING_POSITION, KSUC_GATE_IMAGE_URL } from "../../lib/ksucGateImage";
import { fetchPublishedAnnouncements, type AnnouncementRow } from "../../lib/announcements";
import { isSupabaseConfigured } from "../../lib/supabase";
import { fetchUsccbDailyReading, type DailyReadingDisplay } from "../../lib/usccbDailyReading";

const LIVE_ANNOUNCEMENTS = [
  "Welcome to St. Francis Cheptarit Catholic Parish — Mosoriot, Nandi County",
  "Sunday Masses: 7:00 AM & 9:00 AM every week",
  "Confessions: Every Saturday 4:00 PM – 5:30 PM",
  "Bible Study: Wednesdays 6:00 PM at the Parish Hall",
  "Sadaka via M-PESA: Paybill 247247, Account 341370",
];

const UPCOMING_EVENTS = [
  { title: "Sunday Mass", date: "Every Sunday", time: "7:00 AM & 9:00 AM" },
  { title: "Confession", date: "Every Saturday", time: "4:00 PM – 5:30 PM" },
  { title: "Bible Study", date: "Every Wednesday", time: "6:00 PM" },
  { title: "Youth Meeting", date: "To be announced", time: "As scheduled" },
];

const MINISTRIES_PREVIEW = [
  { name: "Catholic Men Association", description: "Faith, brotherhood, service and leadership for men of the parish" },
  { name: "Catholic Women Association", description: "Women united in faith, prayer, service and community support" },
  { name: "Youth Ministry", description: "Young people growing in faith, fellowship and Catholic identity" },
  { name: "PMC", description: "Parish Missionary Council — spreading faith in the community" },
  { name: "Choir Ministry", description: "Lifting voices in praise and worship at all parish Masses" },
  { name: "CSA", description: "Catholic Students Association — including students at Koitaleel Samoei University College (KSUC), Mosoriot" },
];

const CWA_GALLERY = [
  {
    src: "/images/cwa-1.png",
    title: "Stewardship of Parish Grounds",
    caption: "CWA women caring for the church environment as a witness of responsibility and service.",
    position: "center 36%",
  },
  {
    src: "/images/cwa-2.png",
    title: "Service in Unity",
    caption: "Working together in charity, fellowship, and joyful commitment to parish life.",
    position: "center 34%",
  },
  {
    src: "/images/cwa-3.png",
    title: "Faith in Action",
    caption: "Supporting liturgy, community outreach, and family life through practical love.",
    position: "center 26%",
  },
  {
    src: "/images/cwa-4.png",
    title: "Building Parish Family",
    caption: "CWA and parish members walking together in unity, witness, and shared mission.",
    position: "center 30%",
  },
];

const CMA_GALLERY = [
  {
    src: "/images/cma-1.png",
    title: "Men in Faith and Fellowship",
    caption: "CMA members standing with Fr. Richard in Christian brotherhood and witness.",
    position: "center 42%",
  },
  {
    src: "/images/cma-2.png",
    title: "Leadership in Parish Life",
    caption: "Men supporting parish formation, mentorship, and active service.",
    position: "center 44%",
  },
  {
    src: "/images/cma-3.png",
    title: "Unity in Mission",
    caption: "CMA at St. Francis Mosoriot strengthening faith and responsibility in families.",
    position: "center 43%",
  },
  {
    src: "/images/cma-4.png",
    title: "Serving with Fr. Richard",
    caption: "CMA committed to prayer, participation, and community leadership.",
    position: "center 44%",
  },
  {
    src: "/images/cma-5.png",
    title: "Witness of Catholic Men",
    caption: "Men of the parish offering a visible example of service and dedication.",
    position: "center 42%",
  },
];

const PMC_GALLERY = [
  {
    src: "/images/pmc-1.png",
    title: "Watoto wa Imani",
    caption: "Our children gather in church to grow in prayer, respect, and Catholic identity.",
    position: "center 38%",
  },
  {
    src: "/images/pmc-2.png",
    title: "Faith Formation",
    caption: "Kujifunza Neno la Mungu pamoja, with joy and active participation.",
    position: "center 34%",
  },
  {
    src: "/images/pmc-3.png",
    title: "Fr. Richard with Children",
    caption: "Guidance from our parish priest helping the young to love Christ and His Church.",
    position: "center 42%",
  },
  {
    src: "/images/pmc-4.png",
    title: "Prayer and Reverence",
    caption: "Children practicing worship, discipline, and devotion in parish life.",
    position: "center 40%",
  },
  {
    src: "/images/pmc-5.png",
    title: "Future of the Church",
    caption: "Hawa ni viongozi wa kesho, rooted in faith at St. Francis Mosoriot.",
    position: "center 38%",
  },
];

const CHOIR_GALLERY = [
  {
    src: "/images/choir-1.png",
    title: "Choir Leadership in Worship",
    caption: "Music leaders guide the congregation into prayer through sacred song.",
    position: "center 38%",
  },
  {
    src: "/images/choir-2.png",
    title: "Talent in Service",
    caption: "Young musicians offering their gifts to support the liturgy.",
    position: "center 42%",
  },
  {
    src: "/images/choir-3.png",
    title: "Parish Praise",
    caption: "Choir and faithful united in joyful worship before God.",
    position: "center 40%",
  },
  {
    src: "/images/choir-4.png",
    title: "Liturgy in Harmony",
    caption: "Voices and hearts together, enriching every Mass at St. Francis.",
    position: "center 40%",
  },
];

const YOUTH_GALLERY = [
  {
    src: "/images/youth-1.png",
    title: "Youth Fellowship",
    caption: "Young people gathering in faith, unity, and Christian friendship.",
    position: "center 40%",
  },
  {
    src: "/images/youth-2.png",
    title: "Family and Youth Growth",
    caption: "Building Catholic identity across generations in parish life.",
    position: "center 38%",
  },
  {
    src: "/images/youth-3.png",
    title: "Service and Community",
    caption: "Youth growing in responsibility, witness, and active service.",
    position: "center 40%",
  },
];

const CSA_GALLERY = [
  {
    src: KSUC_GATE_IMAGE_URL,
    title: "Koitaleel Samoei University College",
    caption: "Main campus gate — CSA walks with students here and at St. Francis Cheptarit.",
    position: KSUC_GATE_FRAMING_POSITION,
  },
];

const BISHOP_HERO_GALLERY = [
  {
    src: "/images/bishop-john-lelei-portrait-1.png",
    title: "Servant of the Gospel",
    caption: "Our diocesan shepherd in prayer and witness for the Church in Kapsabet.",
  },
  {
    src: "/images/bishop-john-lelei-portrait-2.png",
    title: "Successor of the Apostles",
    caption: "Teaching, sanctifying, and governing in charity — one flock in Christ.",
  },
  {
    src: "/images/bishop-john-lelei-outdoor-full.png",
    title: "Among God's people",
    caption: "Pastoral presence and quiet strength in the life of the Diocese of Kapsabet.",
  },
];

const BISHOP_SLIDE_MS = 2000;

const CrossSVG = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-7 w-7"><path d="M12 2v20M2 12h20"/></svg>;
const ChurchSVG = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7"><path d="M4 22V10l8-6 8 6v12H4z"/><rect x="9" y="14" width="6" height="8"/></svg>;

export function Home() {
  const [tickerIndex, setTickerIndex] = useState(0);
  const [showTicker, setShowTicker] = useState(true);
  const [readingLoading, setReadingLoading] = useState(true);
  const [dailyReading, setDailyReading] = useState<DailyReadingDisplay | null>(null);
  const reading = dailyReading;
  const [cwaSlide, setCwaSlide] = useState(0);
  const [cmaSlide, setCmaSlide] = useState(0);
  const [pmcSlide, setPmcSlide] = useState(0);
  const [choirSlide, setChoirSlide] = useState(0);
  const [youthSlide, setYouthSlide] = useState(0);
  const [csaSlide, setCsaSlide] = useState(0);
  const [bishopSlide, setBishopSlide] = useState(0);
  const [tickerLines, setTickerLines] = useState<string[]>(LIVE_ANNOUNCEMENTS);
  const [feedItems, setFeedItems] = useState<AnnouncementRow[]>([]);
  const [feedLoading, setFeedLoading] = useState(true);

  useScrollReveal();

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setFeedLoading(false);
      return;
    }
    let cancelled = false;
    void (async () => {
      const { data } = await fetchPublishedAnnouncements(8);
      if (cancelled) return;
      if (data?.length) {
        setFeedItems(data);
        const titles = data.map((a) => a.title.trim()).filter(Boolean);
        if (titles.length) setTickerLines(titles);
      }
      setFeedLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setTickerIndex(0);
  }, [tickerLines]);

  useEffect(() => {
    const len = Math.max(1, tickerLines.length);
    const iv = setInterval(() => {
      setShowTicker(false);
      setTimeout(() => {
        setTickerIndex((i) => (i + 1) % len);
        setShowTicker(true);
      }, 350);
    }, 5000);
    return () => clearInterval(iv);
  }, [tickerLines]);

  useEffect(() => {
    const iv = setInterval(() => {
      setCwaSlide((i) => (i + 1) % CWA_GALLERY.length);
    }, 4500);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      setCmaSlide((i) => (i + 1) % CMA_GALLERY.length);
    }, 4700);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      setPmcSlide((i) => (i + 1) % PMC_GALLERY.length);
    }, 4900);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      setChoirSlide((i) => (i + 1) % CHOIR_GALLERY.length);
    }, 5100);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      setYouthSlide((i) => (i + 1) % YOUTH_GALLERY.length);
    }, 5300);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (CSA_GALLERY.length <= 1) return;
    const iv = setInterval(() => {
      setCsaSlide((i) => (i + 1) % CSA_GALLERY.length);
    }, 5400);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      setBishopSlide((i) => (i + 1) % BISHOP_HERO_GALLERY.length);
    }, BISHOP_SLIDE_MS);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let dayInterval: ReturnType<typeof setInterval> | undefined;

    const load = async () => {
      setReadingLoading(true);
      try {
        const data = await fetchUsccbDailyReading();
        if (!cancelled) { setDailyReading(data); setReadingLoading(false); }
      } catch { setReadingLoading(false); }
    };
    void load();

    const now = new Date();
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 5);
    const delay = Math.max(1_000, nextMidnight.getTime() - now.getTime());
    const midnightTimer = setTimeout(() => {
      void load();
      dayInterval = setInterval(() => void load(), 24 * 60 * 60 * 1000);
    }, delay);

    return () => {
      cancelled = true;
      clearTimeout(midnightTimer);
      if (dayInterval !== undefined) clearInterval(dayInterval);
    };
  }, []);


  return (
    <div>
      <div style={{ background: "linear-gradient(90deg, #1a0a05, #5a2d14, #1a0a05)" }} className="py-2 px-4">
        <div className="container mx-auto flex items-center gap-3">
          <div className="live-badge flex-shrink-0 flex items-center gap-1.5 text-[10px]">
            <Bell className="h-3 w-3" />
            <span className="live-dot w-1.5 h-1.5 rounded-full bg-white inline-block"></span>
            NOTICE
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="text-white text-sm font-semibold transition-all duration-500" style={{ opacity: showTicker ? 1 : 0, transform: showTicker ? "translateY(0)" : "translateY(-6px)" }}>
              {tickerLines[tickerIndex % tickerLines.length]}
            </div>
          </div>
          <div className="flex items-center gap-1 mr-2">
            {tickerLines.slice(0,Math.min(tickerLines.length,6)).map((_,i) => (
              <span key={i} className="rounded-full transition-all duration-300" style={{ width: i===tickerIndex%tickerLines.length?"16px":"6px", height:"6px", background: i===tickerIndex%tickerLines.length?"#fed7aa":"rgba(255,255,255,0.3)", display:"inline-block" }} />
            ))}
          </div>
          <Link to="/announcements" className="flex-shrink-0 text-amber-200 text-xs hover:text-white flex items-center gap-1 font-semibold">
            View All <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <section
        className="relative flex min-h-screen flex-col text-white overflow-hidden parallax-section md:flex md:items-center md:justify-center"
        style={{
          backgroundImage: "url('/images/church.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 z-0"
          aria-hidden
          style={{
            backgroundImage: "url('/images/home-church-exterior-wash.png')",
            backgroundSize: "cover",
            backgroundPosition: "center 38%",
            opacity: 0.17,
            mixBlendMode: "soft-light",
          }}
        />
        <div className="absolute inset-0 z-[1] hero-overlay" />
        <div className="relative z-10 mx-auto w-full max-w-5xl px-4 pt-16 text-center md:flex md:min-h-screen md:flex-col md:justify-center md:pt-0">
          <div className="mb-6 flex justify-center animate-float">
            <div className="home-hero-logo h-36 w-36 md:h-44 md:w-44 rounded-full overflow-hidden border-4" style={{ borderColor: "#8d5439" }}>
              <img src="/images/church.jpg" alt="St. Francis Cheptarit Parish Logo" className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="home-hero-badge inline-block text-xs font-semibold px-4 py-1.5 rounded-full mb-5 tracking-widest uppercase" style={{ background: "rgba(124,45,18,0.3)", borderColor: "rgba(180,83,9,0.6)", color: "#fed7aa" }}>
            Diocese of Kapsabet &bull; Kenya
          </div>
          <h1 className="home-hero-title text-4xl md:text-6xl lg:text-7xl mb-4">
            St. Francis <span style={{ color: "#e6c7ad" }}>Cheptarit</span>
          </h1>
          <h2 className="home-hero-subtitle text-xl md:text-2xl mb-3">Catholic Parish &mdash; Mosoriot, Nandi County</h2>
          <p className="home-hero-tagline text-base md:text-xl mb-6 max-w-2xl mx-auto leading-relaxed">Rooted in Faith. United in Love. Serving Our Community.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/mass-times" className="inline-flex items-center justify-center gap-2 text-white font-bold px-8 py-4 rounded-full text-base transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 btn-ripple" style={{ background: "linear-gradient(135deg, #8d5439, #bf875f)" }}>
              <Calendar className="h-5 w-5" /> Mass Times
            </Link>
            <Link to="/livestream" className="inline-flex items-center justify-center gap-2 font-bold px-8 py-4 rounded-full text-base transition-all shadow-xl btn-ripple" style={{ background: "linear-gradient(135deg, #8d5439, #bf875f)", color: "white" }}>
              <Bell className="h-5 w-5" /> Watch Live
            </Link>
            <a href={PARISH_TEL_HREF} className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 border border-white/40 text-white font-semibold px-8 py-4 rounded-full text-base transition-all btn-ripple">
              <Phone className="h-5 w-5" /> {CHURCH_PHONE}
            </a>
          </div>
        </div>
        <div
          className={[
            "relative z-20 w-[min(100%-2rem,28rem)] transition-opacity duration-500",
            "mx-auto mt-8 shrink-0 px-0 text-center pb-6 max-md:mb-16 md:mt-0 md:mb-0 md:pb-0 md:text-left",
            "md:absolute md:left-8 md:right-auto md:top-1/2 md:-translate-y-1/2 md:translate-x-0 md:max-w-sm md:w-auto",
            readingLoading ? "opacity-60" : "opacity-100",
          ].join(" ")}
        >
          <div
            className="rounded-3xl border border-white/25 bg-white/[0.06] p-5 md:p-6 shadow-[0_8px_40px_rgba(0,0,0,0.25)] backdrop-blur-md"
          >
            <p className="text-[10px] md:text-xs uppercase tracking-[0.28em] text-white/90 font-bold mb-2">
              Daily reading · USCCB (NABRE)
            </p>
            {reading?.dayTitle ? (
              <p className="text-sm md:text-base text-white font-bold mb-3 leading-snug">{reading.dayTitle}</p>
            ) : null}
            <p className="text-sm md:text-lg text-white font-semibold leading-relaxed">
              {readingLoading && !reading ? (
                <span className="text-white/70">Loading today&apos;s readings…</span>
              ) : (
                <>“{reading?.snippet ?? "—"}”</>
              )}
            </p>
            {reading?.reference ? (
              <p className="text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/85 font-semibold mt-3">
                Reading I · {reading.reference}
              </p>
            ) : null}
            {reading?.gospelReference ? (
              <p className="text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/85 font-semibold mt-1.5">
                Gospel · {reading.gospelReference}
              </p>
            ) : null}
            {reading?.link ? (
              <a
                href={reading.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block break-all text-left max-md:text-center text-[11px] md:text-xs font-semibold text-emerald-200/95 underline-offset-2 hover:text-white hover:underline"
              >
                {reading.link}
              </a>
            ) : null}
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-1 animate-bounce max-md:bottom-4">
          <div className="w-0.5 h-8 bg-white/30 rounded-full"></div>
          <span className="text-xs tracking-widest uppercase">Scroll</span>
        </div>
      </section>

      <section style={{ background: "linear-gradient(90deg, #6e3c28, #8d5439, #6c412a)" }} className="py-5 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white text-center">
            {[
              { icon: <ChurchSVG />, label: "Sunday Mass", value: "7:00 AM & 9:00 AM" },
              { icon: <CrossSVG />, label: "Confessions", value: "Sat 4:00 – 5:30 PM" },
              { icon: <MapPin className="h-7 w-7 mx-auto" />, label: "Location", value: "Cheptarit, Mosoriot" },
              { icon: <Phone className="h-7 w-7 mx-auto" />, label: "Call Us", value: CHURCH_PHONE, href: PARISH_TEL_HREF },
            ].map((item, i) =>
              item.href ? (
                <a
                  key={i}
                  href={item.href}
                  className="flex flex-col items-center touch-card py-3 px-2 rounded-xl no-underline text-inherit min-h-[5.5rem] justify-center w-full"
                  aria-label={`Call parish at ${item.value}`}
                >
                  <div className="text-green-200 mb-1">{item.icon}</div>
                  <p className="text-xs text-green-300">{item.label}</p>
                  <span className="font-bold text-sm">{item.value}</span>
                </a>
              ) : (
                <div key={i} className="flex flex-col items-center touch-card py-1">
                  <div className="text-green-200 mb-1">{item.icon}</div>
                  <p className="text-xs text-green-300">{item.label}</p>
                  <p className="font-bold text-sm">{item.value}</p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="relative flex min-h-screen items-stretch overflow-hidden bg-[#0a0608] touch-pan-y">
        <div className="absolute inset-0 z-0">
          {BISHOP_HERO_GALLERY.map((slide, idx) => (
            <div
              key={slide.src}
              className={`absolute inset-0 bg-[#070506] transition-opacity duration-[900ms] ease-in-out will-change-[opacity] ${
                idx === bishopSlide ? "z-[1]" : "z-0"
              }`}
              style={{ opacity: idx === bishopSlide ? 1 : 0 }}
              aria-hidden={idx !== bishopSlide}
            >
              <img
                src={slide.src}
                alt=""
                aria-hidden
                className="pointer-events-none absolute left-0 right-0 top-0 h-screen w-full object-contain object-center opacity-[0.45] blur-[28px] saturate-[1.08] brightness-[0.62]"
                sizes="100vw"
                loading={idx === 0 ? "eager" : "lazy"}
                decoding="async"
              />
              <div
                className="pointer-events-none absolute inset-y-0 left-0 w-[40%] max-w-md bg-gradient-to-r from-[#1a0f0c]/90 via-[#1a0f0c]/25 to-transparent"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-y-0 right-0 w-[40%] max-w-md bg-gradient-to-l from-[#1a0f0c]/90 via-[#1a0f0c]/25 to-transparent"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-soft-light"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 70% at 50% 45%, rgba(253, 230, 138, 0.12) 0%, transparent 55%)",
                }}
                aria-hidden
              />
              <img
                src={slide.src}
                alt={`His Lordship Bishop John Kiplimo Lelei — ${slide.title}`}
                className="relative z-[1] h-screen w-full object-contain object-center drop-shadow-[0_12px_48px_rgba(0,0,0,0.45)]"
                sizes="100vw"
                loading={idx === 0 ? "eager" : "lazy"}
                decoding="async"
                fetchpriority={idx === 0 ? "high" : "auto"}
              />
            </div>
          ))}
          <div
            className="pointer-events-none absolute inset-0 z-[2]"
            style={{
              background:
                "linear-gradient(105deg, rgba(10, 8, 12, 0.82) 0%, rgba(22, 14, 18, 0.48) 36%, rgba(40, 28, 32, 0.2) 58%, transparent 78%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 z-[2]"
            style={{
              background: "linear-gradient(to top, rgba(6, 4, 8, 0.5) 0%, transparent 52%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 z-[2] opacity-[0.14] mix-blend-overlay"
            style={{
              background: "radial-gradient(ellipse 90% 60% at 20% 40%, rgba(212, 165, 116, 0.45) 0%, transparent 55%)",
            }}
          />
          <div className="absolute bottom-5 right-5 z-20 flex items-center gap-2 md:bottom-8 md:right-8">
            {BISHOP_HERO_GALLERY.map((slide, idx) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => setBishopSlide(idx)}
                className="h-2 rounded-full shadow-sm transition-all duration-300"
                style={{
                  width: idx === bishopSlide ? 22 : 8,
                  background: idx === bishopSlide ? "#fde68a" : "rgba(255,255,255,0.45)",
                  boxShadow: idx === bishopSlide ? "0 0 12px rgba(253, 230, 138, 0.55)" : "none",
                }}
                aria-label={`Show bishop portrait ${idx + 1}: ${slide.title}`}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 flex w-full max-w-xl flex-col justify-center px-4 py-16 md:px-8 md:py-24">
          <ScrollReveal direction="left">
            <div>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.32em] text-amber-200/95 md:text-xs">
                Diocese of Kapsabet · Our diocesan shepherd
              </p>
              <h2 className="mb-2 text-3xl font-bold leading-[1.12] text-white md:text-5xl lg:text-[3.25rem]">
                Bishop John Kiplimo Lelei
              </h2>
              <p className="mb-3 text-base font-medium italic text-emerald-100/95 md:text-lg">
                Mchungaji wetu wa jimbo — Baba wa kiroho katika imani
              </p>
              <p className="mb-6 max-w-md text-xs leading-relaxed text-amber-100/90 transition-opacity duration-500 md:text-sm" key={bishopSlide}>
                <span className="font-semibold text-amber-200/95">{BISHOP_HERO_GALLERY[bishopSlide].title}.</span>{" "}
                {BISHOP_HERO_GALLERY[bishopSlide].caption}
              </p>
              <div className="mb-6 h-px w-20 bg-gradient-to-r from-amber-300/90 to-transparent" />
              <p className="mb-4 text-sm leading-relaxed text-white/92 md:text-base">
                The Roman Catholic Diocese of Kapsabet — our spiritual home as St. Francis Cheptarit — is shepherded by{" "}
                <span className="font-semibold text-white">Rt. Rev. John Kiplimo Lelei</span>, its{" "}
                <span className="font-semibold text-white">first bishop</span>, appointed in 2025 when the Holy Father erected the diocese. A priest of Eldoret (ordained 1985), formator and former rector of St. Thomas Aquinas Major Seminary in Nairobi, and auxiliary bishop of Eldoret before his appointment to Kapsabet, he brings a lifetime of service to the altar, priestly formation, and the people of God.
              </p>
              <p className="mb-8 text-sm leading-relaxed text-white/88 md:text-base">
                In union with the Church in Nandi County, we look to our bishop as successor of the Apostles: teaching, sanctifying, and governing in charity — so that parishes like ours may flourish in faith, sacramental life, and mission.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  to="/about"
                  className="btn-ripple inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white shadow-xl transition-all hover:-translate-y-0.5 hover:shadow-2xl"
                  style={{ background: "linear-gradient(135deg, #6e3c28, #a1624a)" }}
                >
                  Our parish story <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="https://en.wikipedia.org/wiki/John_Kiplimo_Lelei"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-white/35 bg-white/10 px-5 py-3 text-sm font-semibold text-white/90 transition-colors hover:bg-white/15"
                >
                  Biography (public record)
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section
        className="border-t border-[#e8ddd4] px-4 py-14"
        style={{ background: "linear-gradient(180deg, #fdfbf7 0%, #f5efe8 100%)" }}
      >
        <div className="container mx-auto max-w-5xl">
          <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:gap-12">
            <ScrollReveal direction="left">
              <figure className="overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(58,31,19,0.12)] ring-1 ring-[#8d5439]/15">
                <img
                  src="/images/bishop-john-lelei-outdoor-full.png"
                  alt="Rt. Rev. John Kiplimo Lelei, Bishop of Kapsabet, in pastoral dress outdoors"
                  className="aspect-[4/5] w-full object-cover object-[42%_center] sm:aspect-[3/4]"
                  loading="eager"
                />
                <figcaption className="border-t border-[#827717]/12 bg-white/80 px-4 py-3 text-center text-xs font-medium text-[#5a3018] sm:text-sm">
                  Rt. Rev. John Kiplimo Lelei — Bishop of the Roman Catholic Diocese of Kapsabet
                </figcaption>
              </figure>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-green-700">Our bishop</p>
                <h3 className="mb-4 text-2xl font-bold leading-[1.2] text-[#3a1f13] md:text-3xl">
                  Shepherding with faith and humility
                </h3>
                <div className="mb-5 h-1 w-16 rounded bg-gradient-to-r from-amber-500 to-[#8d5439]" />
                <p className="mb-4 leading-relaxed text-gray-700">
                  Bishop John Kiplimo Lelei is the <span className="font-semibold text-[#3a1f13]">first bishop</span> of the Diocese of Kapsabet, called to teach, sanctify, and govern in union with the
                  Holy Father. His ministry is rooted in prayer, priestly formation, and love for the people of God across Nandi County and beyond.
                </p>
                <p className="text-sm leading-relaxed text-gray-600">
                  At St. Francis Cheptarit we rejoice in our communion with the bishop — the focus of unity in our diocese and a visible sign of Christ’s care for His Church.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="relative py-20 px-4">
        <div className="bg-logo-watermark"></div>
        <div className="container relative z-10 mx-auto max-w-5xl">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <ScrollReveal direction="left">
              <p className="home-welcome-eyebrow mb-2 text-sm font-semibold uppercase tracking-wider">Welcome to Our Parish</p>
              <h2 className="home-welcome-heading mb-4 text-3xl md:text-4xl">
                A Community of Faith in Mosoriot
              </h2>
              <div className="section-divider-left mb-5"></div>
              <p className="mb-4 leading-relaxed text-gray-800 drop-shadow-sm">
                St. Francis Cheptarit Catholic Parish is a vibrant faith community in Mosoriot, Nandi County. Dedicated to St. Francis of Assisi, we are a parish of the Diocese of Kapsabet.
              </p>
              <p className="mb-6 leading-relaxed text-gray-800 drop-shadow-sm">
                Whether you are a parishioner, a visitor, or someone seeking to know more about the Catholic faith, you are warmly welcome here.
              </p>
              <Link
                to="/about"
                className="btn-ripple inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #8d5439, #bf875f)" }}
              >
                Learn About Us <ArrowRight className="h-4 w-4" />
              </Link>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="relative">
                <div className="parish-glass-panel overflow-hidden rounded-2xl shadow-2xl">
                  <img src="/images/church.jpg" alt="St. Francis Cheptarit Catholic Church" className="h-72 w-full object-cover" />
                </div>
                <div
                  className="absolute -bottom-4 -left-4 flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-lg"
                  style={{ background: "linear-gradient(135deg, #6e3c28, #bf875f)" }}
                >
                  <MapPin className="h-4 w-4" /> Cheptarit, Mosoriot
                </div>
                <div className="absolute -right-4 -top-4 h-16 w-16 overflow-hidden rounded-full border-[3px] border-[#8d5439] shadow-xl ring-2 ring-white/40">
                  <img src="/images/church.jpg" alt="" className="h-full w-full object-cover" />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section
        className="py-20 px-4 relative parallax-section overflow-hidden page-background-section"
        style={{
          minHeight: "500px",
          backgroundImage: "url('/images/core-values-background.webp')",
        }}
      >
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(124,45,18,0.93) 0%, rgba(140,90,61,0.82) 50%, rgba(124,45,18,0.88) 100%)" }} />
        <div className="relative z-10 container mx-auto max-w-6xl">
          <div className="text-center mb-12 reveal">
            <p className="text-green-300 font-semibold text-sm uppercase tracking-wider mb-2">What We Stand For</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Our Core Values</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-green-400 to-orange-400 mx-auto rounded"></div>
          </div>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Heart className="h-10 w-10" />, title: "Love & Compassion", desc: "Following Christ's example of unconditional love for all people in our community." },
              { icon: <Users className="h-10 w-10" />, title: "Community & Fellowship", desc: "Building strong bonds among our parish family and the wider Mosoriot community." },
              { icon: <BookOpen className="h-10 w-10" />, title: "Faith & Learning", desc: "Growing together in knowledge, faith formation, and understanding of God's Word." },
            ].map((v) => (
              <StaggerItem
                key={v.title}
                className="home-value-card touch-card text-center shadow-lg"
              >
                <div className="mb-4 flex justify-center text-amber-200">{v.icon}</div>
                <h3 className="home-value-title mb-3 text-xl text-white">{v.title}</h3>
                <p className="text-sm leading-relaxed text-white/90">{v.desc}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="page-background-section py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 reveal">
            <p className="text-green-600 font-semibold text-sm uppercase tracking-wider mb-2">Get Involved</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: "#6e3c28" }}>Our Ministries & Groups</h2>
            <div className="section-divider"></div>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">Everyone has a place to serve and grow at St. Francis Parish</p>
          </div>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MINISTRIES_PREVIEW.map((m) => {
              const isCma = m.name === "Catholic Men Association";
              const isCwa = m.name === "Catholic Women Association";
              const isPmc = m.name === "PMC";
              const isChoir = m.name === "Choir Ministry";
              const isYouth = m.name === "Youth Ministry";
              const isCsa = m.name === "CSA";

              if (isCma) {
                return (
                  <StaggerItem
                    key={m.name}
                    className="ministry-card parish-glass-card rounded-xl border p-5 shadow-sm md:col-span-2 lg:col-span-1"
                    style={{ borderColor: "rgba(140,90,61,0.15)" }}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3 text-white" style={{ background: "#8d5439" }}>
                      <CrossSVG />
                    </div>
                    <h3 className="font-bold text-sm md:text-base mb-2" style={{ color: "#6e3c28" }}>{m.name}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed mb-3">{m.description}</p>

                    <div className="relative rounded-xl overflow-hidden border" style={{ borderColor: "rgba(140,90,61,0.18)" }}>
                      <div className="relative h-56">
                        {CMA_GALLERY.map((slide, idx) => (
                          <div
                            key={slide.src}
                            className="absolute inset-0 transition-opacity duration-700"
                            style={{ opacity: idx === cmaSlide ? 1 : 0 }}
                          >
                            <img
                              src={slide.src}
                              alt={`CMA men with Fr. Richard - ${slide.title}`}
                              className="w-full h-full object-cover"
                              style={{ objectPosition: slide.position }}
                            />
                            <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(31,18,12,0.82) 0%, rgba(31,18,12,0.08) 65%)" }} />
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                              <p className="text-white font-semibold text-sm">{slide.title}</p>
                              <p className="text-white/90 text-xs mt-1 leading-relaxed">{slide.caption}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setCmaSlide((prev) => (prev === 0 ? CMA_GALLERY.length - 1 : prev - 1))}
                        className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full flex items-center justify-center text-white"
                        style={{ background: "rgba(31,18,12,0.5)" }}
                        aria-label="Previous CMA photo"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setCmaSlide((prev) => (prev + 1) % CMA_GALLERY.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full flex items-center justify-center text-white"
                        style={{ background: "rgba(31,18,12,0.5)" }}
                        aria-label="Next CMA photo"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>

                      <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
                        {CMA_GALLERY.map((slide, idx) => (
                          <button
                            key={slide.src}
                            type="button"
                            onClick={() => setCmaSlide(idx)}
                            className="h-2 rounded-full transition-all"
                            style={{
                              width: idx === cmaSlide ? 16 : 8,
                              background: idx === cmaSlide ? "#ffffff" : "rgba(255,255,255,0.6)",
                            }}
                            aria-label={`Show CMA photo ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-gray-600 text-xs leading-relaxed mt-3">
                      CMA strengthens Catholic men to lead by faith at home and parish, supporting St. Francis Mosoriot through prayer,
                      mentorship, responsibility, and practical service with Fr. Richard and the wider church community.
                    </p>
                  </StaggerItem>
                );
              }

              if (isCwa) {
                return (
                  <StaggerItem
                    key={m.name}
                    className="ministry-card parish-glass-card rounded-xl border p-5 shadow-sm md:col-span-2 lg:col-span-1"
                    style={{ borderColor: "rgba(140,90,61,0.15)" }}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3 text-white" style={{ background: "#8d5439" }}>
                      <CrossSVG />
                    </div>
                    <h3 className="font-bold text-sm md:text-base mb-2" style={{ color: "#6e3c28" }}>{m.name}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed mb-3">{m.description}</p>

                    <div className="relative rounded-xl overflow-hidden border" style={{ borderColor: "rgba(140,90,61,0.18)" }}>
                      <div className="relative h-52">
                        {CWA_GALLERY.map((slide, idx) => (
                          <div
                            key={slide.src}
                            className="absolute inset-0 transition-opacity duration-700"
                            style={{ opacity: idx === cwaSlide ? 1 : 0 }}
                          >
                            <img
                              src={slide.src}
                              alt={`CWA women - ${slide.title}`}
                              className="w-full h-full object-cover"
                              style={{ objectPosition: slide.position }}
                            />
                            <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(31,18,12,0.85) 0%, rgba(31,18,12,0.1) 65%)" }} />
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                              <p className="text-white font-semibold text-sm">{slide.title}</p>
                              <p className="text-white/90 text-xs mt-1 leading-relaxed">{slide.caption}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setCwaSlide((prev) => (prev === 0 ? CWA_GALLERY.length - 1 : prev - 1))}
                        className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full flex items-center justify-center text-white"
                        style={{ background: "rgba(31,18,12,0.5)" }}
                        aria-label="Previous CWA photo"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setCwaSlide((prev) => (prev + 1) % CWA_GALLERY.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full flex items-center justify-center text-white"
                        style={{ background: "rgba(31,18,12,0.5)" }}
                        aria-label="Next CWA photo"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>

                      <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
                        {CWA_GALLERY.map((slide, idx) => (
                          <button
                            key={slide.src}
                            type="button"
                            onClick={() => setCwaSlide(idx)}
                            className="h-2 rounded-full transition-all"
                            style={{
                              width: idx === cwaSlide ? 16 : 8,
                              background: idx === cwaSlide ? "#ffffff" : "rgba(255,255,255,0.6)",
                            }}
                            aria-label={`Show CWA photo ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-gray-600 text-xs leading-relaxed mt-3">
                      In line with Catholic teaching on charity and service, CWA supports the parish through prayer, family mentorship,
                      care for the sick, and works of mercy that strengthen the Body of Christ.
                    </p>
                  </StaggerItem>
                );
              }

              if (isPmc) {
                return (
                  <StaggerItem
                    key={m.name}
                    className="ministry-card parish-glass-card rounded-xl border p-5 shadow-sm md:col-span-2 lg:col-span-1"
                    style={{ borderColor: "rgba(140,90,61,0.15)" }}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3 text-white" style={{ background: "#8d5439" }}>
                      <CrossSVG />
                    </div>
                    <h3 className="font-bold text-sm md:text-base mb-2" style={{ color: "#6e3c28" }}>{m.name}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed mb-3">{m.description}</p>

                    <div className="relative rounded-xl overflow-hidden border" style={{ borderColor: "rgba(140,90,61,0.18)" }}>
                      <div className="relative h-56">
                        {PMC_GALLERY.map((slide, idx) => (
                          <div
                            key={slide.src}
                            className="absolute inset-0 transition-opacity duration-700"
                            style={{ opacity: idx === pmcSlide ? 1 : 0 }}
                          >
                            <img
                              src={slide.src}
                              alt={`PMC children - ${slide.title}`}
                              className="w-full h-full object-cover"
                              style={{ objectPosition: slide.position }}
                            />
                            <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(31,18,12,0.84) 0%, rgba(31,18,12,0.1) 65%)" }} />
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                              <p className="text-white font-semibold text-sm">{slide.title}</p>
                              <p className="text-white/90 text-xs mt-1 leading-relaxed">{slide.caption}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setPmcSlide((prev) => (prev === 0 ? PMC_GALLERY.length - 1 : prev - 1))}
                        className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full flex items-center justify-center text-white"
                        style={{ background: "rgba(31,18,12,0.5)" }}
                        aria-label="Previous PMC photo"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPmcSlide((prev) => (prev + 1) % PMC_GALLERY.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full flex items-center justify-center text-white"
                        style={{ background: "rgba(31,18,12,0.5)" }}
                        aria-label="Next PMC photo"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>

                      <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
                        {PMC_GALLERY.map((slide, idx) => (
                          <button
                            key={slide.src}
                            type="button"
                            onClick={() => setPmcSlide(idx)}
                            className="h-2 rounded-full transition-all"
                            style={{
                              width: idx === pmcSlide ? 16 : 8,
                              background: idx === pmcSlide ? "#ffffff" : "rgba(255,255,255,0.6)",
                            }}
                            aria-label={`Show PMC photo ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-gray-600 text-xs leading-relaxed mt-3">
                      PMC ni malezi ya watoto wa Kanisa: faith, discipline, and mission. At St. Francis Mosoriot, this ministry helps watoto
                      kukua kwa maombi, huduma, na upendo wa Kristo kama future leaders wa parish.
                    </p>
                  </StaggerItem>
                );
              }

              if (isChoir) {
                return (
                  <StaggerItem
                    key={m.name}
                    className="ministry-card parish-glass-card rounded-xl border p-5 shadow-sm md:col-span-2 lg:col-span-1"
                    style={{ borderColor: "rgba(140,90,61,0.15)" }}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3 text-white" style={{ background: "#8d5439" }}>
                      <CrossSVG />
                    </div>
                    <h3 className="font-bold text-sm md:text-base mb-2" style={{ color: "#6e3c28" }}>{m.name}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed mb-3">{m.description}</p>

                    <div className="relative rounded-xl overflow-hidden border" style={{ borderColor: "rgba(140,90,61,0.18)" }}>
                      <div className="relative h-56">
                        {CHOIR_GALLERY.map((slide, idx) => (
                          <div
                            key={slide.src}
                            className="absolute inset-0 transition-opacity duration-700"
                            style={{ opacity: idx === choirSlide ? 1 : 0 }}
                          >
                            <img
                              src={slide.src}
                              alt={`Choir ministry - ${slide.title}`}
                              className="w-full h-full object-cover"
                              style={{ objectPosition: slide.position }}
                            />
                            <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(31,18,12,0.84) 0%, rgba(31,18,12,0.1) 65%)" }} />
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                              <p className="text-white font-semibold text-sm">{slide.title}</p>
                              <p className="text-white/90 text-xs mt-1 leading-relaxed">{slide.caption}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setChoirSlide((prev) => (prev === 0 ? CHOIR_GALLERY.length - 1 : prev - 1))}
                        className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full flex items-center justify-center text-white"
                        style={{ background: "rgba(31,18,12,0.5)" }}
                        aria-label="Previous choir photo"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setChoirSlide((prev) => (prev + 1) % CHOIR_GALLERY.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full flex items-center justify-center text-white"
                        style={{ background: "rgba(31,18,12,0.5)" }}
                        aria-label="Next choir photo"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>

                      <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
                        {CHOIR_GALLERY.map((slide, idx) => (
                          <button
                            key={slide.src}
                            type="button"
                            onClick={() => setChoirSlide(idx)}
                            className="h-2 rounded-full transition-all"
                            style={{
                              width: idx === choirSlide ? 16 : 8,
                              background: idx === choirSlide ? "#ffffff" : "rgba(255,255,255,0.6)",
                            }}
                            aria-label={`Show choir photo ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-gray-600 text-xs leading-relaxed mt-3">
                      Choir ministry animates liturgy through sacred music, helping the congregation pray deeply and actively participate in Mass.
                      At St. Francis Cheptarit, their service strengthens worship, unity, and spiritual joy in every celebration.
                    </p>
                  </StaggerItem>
                );
              }

              if (isYouth) {
                return (
                  <StaggerItem
                    key={m.name}
                    className="ministry-card parish-glass-card rounded-xl border p-5 shadow-sm md:col-span-2 lg:col-span-1"
                    style={{ borderColor: "rgba(140,90,61,0.15)" }}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3 text-white" style={{ background: "#8d5439" }}>
                      <CrossSVG />
                    </div>
                    <h3 className="font-bold text-sm md:text-base mb-2" style={{ color: "#6e3c28" }}>{m.name}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed mb-3">{m.description}</p>

                    <div className="relative rounded-xl overflow-hidden border" style={{ borderColor: "rgba(140,90,61,0.18)" }}>
                      <div className="relative h-56">
                        {YOUTH_GALLERY.map((slide, idx) => (
                          <div
                            key={slide.src}
                            className="absolute inset-0 transition-opacity duration-700"
                            style={{ opacity: idx === youthSlide ? 1 : 0 }}
                          >
                            <img
                              src={slide.src}
                              alt={`Youth ministry - ${slide.title}`}
                              className="w-full h-full object-cover"
                              style={{ objectPosition: slide.position }}
                            />
                            <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(31,18,12,0.84) 0%, rgba(31,18,12,0.1) 65%)" }} />
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                              <p className="text-white font-semibold text-sm">{slide.title}</p>
                              <p className="text-white/90 text-xs mt-1 leading-relaxed">{slide.caption}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setYouthSlide((prev) => (prev === 0 ? YOUTH_GALLERY.length - 1 : prev - 1))}
                        className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full flex items-center justify-center text-white"
                        style={{ background: "rgba(31,18,12,0.5)" }}
                        aria-label="Previous youth photo"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setYouthSlide((prev) => (prev + 1) % YOUTH_GALLERY.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full flex items-center justify-center text-white"
                        style={{ background: "rgba(31,18,12,0.5)" }}
                        aria-label="Next youth photo"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>

                      <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
                        {YOUTH_GALLERY.map((slide, idx) => (
                          <button
                            key={slide.src}
                            type="button"
                            onClick={() => setYouthSlide(idx)}
                            className="h-2 rounded-full transition-all"
                            style={{
                              width: idx === youthSlide ? 16 : 8,
                              background: idx === youthSlide ? "#ffffff" : "rgba(255,255,255,0.6)",
                            }}
                            aria-label={`Show youth photo ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-gray-600 text-xs leading-relaxed mt-3">
                      Youth ministry forms young Catholics in faith, leadership, and service. At St. Francis Cheptarit, vijana are mentored
                      to love the Church, live Gospel values, and become responsible witnesses in family and community.
                    </p>
                  </StaggerItem>
                );
              }

              if (isCsa) {
                return (
                  <StaggerItem
                    key={m.name}
                    className="ministry-card parish-glass-card rounded-xl border p-5 shadow-sm md:col-span-2 lg:col-span-1"
                    style={{ borderColor: "rgba(140,90,61,0.15)" }}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3 text-white" style={{ background: "#827717" }}>
                      <CrossSVG />
                    </div>
                    <h3 className="font-bold text-sm md:text-base mb-2" style={{ color: "#6e3c28" }}>{m.name}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed mb-3">{m.description}</p>

                    <div className="relative rounded-xl overflow-hidden border" style={{ borderColor: "rgba(140,90,61,0.18)" }}>
                      <div className="relative h-56">
                        {CSA_GALLERY.map((slide, idx) => (
                          <div
                            key={slide.src}
                            className="absolute inset-0 transition-opacity duration-700"
                            style={{ opacity: idx === csaSlide ? 1 : 0 }}
                          >
                            <img
                              src={slide.src}
                              alt={`CSA / KSUC — ${slide.title}`}
                              className="w-full h-full object-cover"
                              style={{ objectPosition: slide.position }}
                            />
                            <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(31,18,12,0.84) 0%, rgba(31,18,12,0.1) 65%)" }} />
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                              <p className="text-white font-semibold text-sm">{slide.title}</p>
                              <p className="text-white/90 text-xs mt-1 leading-relaxed">{slide.caption}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {CSA_GALLERY.length > 1 ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setCsaSlide((prev) => (prev === 0 ? CSA_GALLERY.length - 1 : prev - 1))}
                            className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full flex items-center justify-center text-white"
                            style={{ background: "rgba(31,18,12,0.5)" }}
                            aria-label="Previous CSA photo"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setCsaSlide((prev) => (prev + 1) % CSA_GALLERY.length)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full flex items-center justify-center text-white"
                            style={{ background: "rgba(31,18,12,0.5)" }}
                            aria-label="Next CSA photo"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                          <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
                            {CSA_GALLERY.map((slide, idx) => (
                              <button
                                key={slide.src}
                                type="button"
                                onClick={() => setCsaSlide(idx)}
                                className="h-2 rounded-full transition-all"
                                style={{
                                  width: idx === csaSlide ? 16 : 8,
                                  background: idx === csaSlide ? "#ffffff" : "rgba(255,255,255,0.6)",
                                }}
                                aria-label={`Show CSA photo ${idx + 1}`}
                              />
                            ))}
                          </div>
                        </>
                      ) : null}
                    </div>

                    <p className="text-gray-600 text-xs leading-relaxed mt-3">
                      CSA is the parish home for Catholic students—especially at KSUC—so faith stays at the centre of study and campus life.
                    </p>
                    <Link
                      to="/ministries/csa"
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#827717] hover:underline"
                    >
                      CSA page <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </StaggerItem>
                );
              }

              return (
                <StaggerItem key={m.name} className="ministry-card parish-glass-card rounded-xl border p-5 shadow-sm" style={{ borderColor: "rgba(140,90,61,0.15)" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3 text-white" style={{ background: "#8d5439" }}>
                    <CrossSVG />
                  </div>
                  <h3 className="font-bold text-sm md:text-base mb-2" style={{ color: "#6e3c28" }}>{m.name}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{m.description}</p>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
          <div className="text-center mt-8 reveal">
            <Link to="/ministries" className="inline-flex items-center gap-2 text-white font-semibold px-8 py-3 rounded-full transition-all hover:-translate-y-0.5 shadow-lg btn-ripple" style={{ background: "linear-gradient(135deg, #8d5439, #bf875f)" }}>
              View All Ministries <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 page-background-section" style={{ background: "linear-gradient(135deg, #f0fdf4, #fdf6ec)" }}>
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 reveal">
            <p className="text-green-600 font-semibold text-sm uppercase tracking-wider mb-2">Parish Schedule</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: "#6e3c28" }}>Upcoming Events</h2>
            <div className="section-divider"></div>
          </div>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {UPCOMING_EVENTS.map((event) => (
              <StaggerItem key={event.title} className="parish-glass-card rounded-2xl p-6 shadow-md transition-all hover:shadow-xl" style={{ borderColor: "rgba(140,90,61,0.12)" }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3 text-white" style={{ background: "#8d5439" }}>
                  <ChurchSVG />
                </div>
                <h3 className="font-bold text-lg mb-3" style={{ color: "#6e3c28" }}>{event.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2"><Calendar className="h-4 w-4 text-green-500" /><span>{event.date}</span></div>
                <div className="flex items-center gap-2 text-sm text-gray-500"><Clock className="h-4 w-4 text-green-500" /><span>{event.time}</span></div>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <div className="text-center mt-8 reveal">
            <Link to="/events" className="inline-flex items-center gap-2 font-semibold px-8 py-3 rounded-full transition-all btn-ripple" style={{ border: "2px solid #8d5439", color: "#6e3c28" }}>
              Full Calendar <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <section
        className="py-20 px-4 text-white relative parallax-section overflow-hidden"
        style={{
          backgroundImage: "url('/images/church.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 z-0"
          aria-hidden
          style={{
            backgroundImage: "url('/images/home-church-exterior-wash.png')",
            backgroundSize: "cover",
            backgroundPosition: "center 38%",
            opacity: 0.14,
            mixBlendMode: "soft-light",
          }}
        />
        <div
          className="absolute inset-0 z-[1]"
          style={{ background: "linear-gradient(160deg, rgba(124,45,18,0.92) 0%, rgba(124,45,18,0.88) 100%)" }}
        />
        <div className="relative z-10 container mx-auto max-w-5xl">
          <div className="text-center mb-10 reveal">
            <p className="font-semibold text-sm uppercase tracking-wider mb-2" style={{ color: "#e6c7ad" }}>Sadaka / Mchango</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Give to God's Work</h2>
            <div className="w-20 h-1 mx-auto rounded" style={{ background: "linear-gradient(90deg, #bf875f, #f97316)" }}></div>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="reveal glass-dark rounded-2xl p-8 border" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
              <h3 className="font-bold text-xl mb-6 flex items-center gap-2 text-green-300">
                <Smartphone className="h-6 w-6" /> M-PESA Payment
              </h3>
              <div className="space-y-4">
                <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.12)" }}>
                  <p className="text-green-300 text-xs mb-1">Lipa na M-PESA &rarr; Pay Bill</p>
                  <p className="home-giving-number">247247</p>
                  <p className="text-green-300 text-xs mt-1">Paybill Number</p>
                </div>
                <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.12)" }}>
                  <p className="text-green-300 text-xs mb-1">Account Number</p>
                  <p className="home-giving-number">341370</p>
                </div>
              </div>
            </div>
            <div className="space-y-3 reveal" data-delay="0.1s">
              <h3 className="font-bold text-xl mb-4 text-green-300">Your Gift Supports</h3>
              {[
                { Icon: ChurchSVG, title: "Parish Operations", desc: "Daily running, utilities, and maintenance" },
                { Icon: BookOpen, title: "Religious Education", desc: "Catechism, faith formation, sacraments" },
                { Icon: Users, title: "Community Outreach", desc: "Support for the sick, poor, and vulnerable" },
                { Icon: Heart, title: "Liturgy & Worship", desc: "Music ministry and altar supplies" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 rounded-xl p-4 touch-card" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div className="text-green-300 mt-0.5 flex-shrink-0"><item.Icon className="h-5 w-5" /></div>
                  <div>
                    <p className="font-semibold text-white text-sm">{item.title}</p>
                    <p className="text-green-300 text-xs">{item.desc}</p>
                  </div>
                </div>
              ))}
              <Link to="/giving" className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-full transition-all mt-2 btn-ripple" style={{ background: "linear-gradient(135deg, #8d5439, #bf875f)", color: "white" }}>
                More Ways to Give <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center reveal">
          <div className="flex justify-center mb-4">
            <div className="h-20 w-20 rounded-full overflow-hidden border-4 shadow-xl" style={{ borderColor: "#8d5439" }}>
              <img src="/images/church.jpg" alt="" className="h-full w-full object-cover" />
            </div>
          </div>
          <h2 className="home-cta-heading text-3xl md:text-4xl mb-4">Join Our Parish Family</h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed">All are welcome at St. Francis Cheptarit. Our doors and hearts are open to you.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20St.%20Francis%20Cheptarit%20Catholic%20Parish`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white font-bold px-8 py-4 rounded-full text-base transition-all shadow-lg btn-ripple touch-card" style={{ background: "#b8794d" }}>
              <svg viewBox="0 0 24 24" fill="white" className="h-5 w-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Connect on WhatsApp
            </a>
            <Link to="/contact" className="inline-flex items-center gap-2 font-semibold px-8 py-4 rounded-full transition-all btn-ripple touch-card" style={{ border: "2px solid #8d5439", color: "#6e3c28" }}>
              <Phone className="h-5 w-5" /> Get In Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
