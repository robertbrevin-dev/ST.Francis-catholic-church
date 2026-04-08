import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Calendar, Clock, Phone, ArrowRight, Bell, ChevronRight, Smartphone, MapPin, Heart, Users, BookOpen } from "lucide-react";
import { useScrollReveal, ScrollReveal, StaggerContainer, StaggerItem } from "../components/scroll-reveal";
import { CHURCH_PHONE, PARISH_TEL_HREF, WHATSAPP_NUMBER } from "../../lib/parishContact";
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
  { name: "CSA", description: "Catholic Students Association — faith formation for students" },
];

const CrossSVG = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-7 w-7"><path d="M12 2v20M2 12h20"/></svg>;
const ChurchSVG = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7"><path d="M4 22V10l8-6 8 6v12H4z"/><rect x="9" y="14" width="6" height="8"/></svg>;

export function Home() {
  const [tickerIndex, setTickerIndex] = useState(0);
  const [showTicker, setShowTicker] = useState(true);
  const [dailyReading, setDailyReading] = useState<DailyReadingDisplay | null>(null);
  const [readingLoading, setReadingLoading] = useState(true);
  useScrollReveal();

  useEffect(() => {
    const iv = setInterval(() => {
      setShowTicker(false);
      setTimeout(() => { setTickerIndex(i => (i + 1) % LIVE_ANNOUNCEMENTS.length); setShowTicker(true); }, 350);
    }, 5000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let dayInterval: ReturnType<typeof setInterval> | undefined;

    const load = async () => {
      setReadingLoading(true);
      const data = await fetchUsccbDailyReading();
      if (!cancelled) {
        setDailyReading(data);
        setReadingLoading(false);
      }
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

  const reading = dailyReading;

  return (
    <div>
      <div style={{ background: "linear-gradient(90deg, #25140d, #6e3c28)" }} className="py-2.5 px-4">
        <div className="container mx-auto flex items-center gap-3">
          <div className="live-badge flex-shrink-0 flex items-center gap-1.5">
            <Bell className="h-3 w-3" />
            <span className="live-dot w-2 h-2 rounded-full bg-white inline-block"></span>
            LIVE
          </div>
          <div className="text-white text-sm font-medium transition-opacity duration-300" style={{ opacity: showTicker ? 1 : 0 }}>
            {LIVE_ANNOUNCEMENTS[tickerIndex]}
          </div>
          <Link to="/announcements" className="ml-auto flex-shrink-0 text-green-300 text-xs hover:text-green-200 flex items-center gap-1">
            View All <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden parallax-section"
        style={{ backgroundImage: "url('/images/church.jpg')" }}>
        <div className="absolute inset-0 hero-overlay" />
        <div className="absolute inset-0 flex items-center justify-center opacity-8 pointer-events-none">
          <img src="/images/church.jpg" alt="" className="w-96 h-96 object-contain mix-blend-overlay" style={{ opacity: 0.07 }} />
        </div>
        <div
          className={[
            "absolute z-20 w-[min(100%-2rem,28rem)] transition-opacity duration-500",
            /* Mobile: sit below hero copy, above scroll cue — does not cover the logo */
            "max-md:left-1/2 max-md:-translate-x-1/2 max-md:top-auto max-md:bottom-28 max-md:text-center max-md:translate-y-0",
            /* Desktop: left column, vertically centered */
            "md:left-8 md:right-auto md:top-1/2 md:-translate-y-1/2 md:translate-x-0 md:max-w-sm md:w-auto md:text-left",
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
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="mb-6 flex justify-center animate-float">
            <div className="h-36 w-36 md:h-44 md:w-44 rounded-full overflow-hidden border-4 shadow-2xl" style={{ borderColor: "#8d5439" }}>
              <img src="/images/church.jpg" alt="St. Francis Cheptarit Parish Logo" className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="inline-block border text-xs font-semibold px-4 py-1.5 rounded-full mb-5 tracking-widest uppercase" style={{ background: "rgba(124,45,18,0.3)", borderColor: "rgba(180,83,9,0.6)", color: "#fed7aa" }}>
            Diocese of Kapsabet &bull; Kenya
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-white leading-tight">
            St. Francis <span style={{ color: "#e6c7ad" }}>Cheptarit</span>
          </h1>
          <h2 className="text-xl md:text-2xl font-medium text-green-200 mb-3">Catholic Parish &mdash; Mosoriot, Nandi County</h2>
          <p className="text-base md:text-xl text-white/85 mb-6 max-w-2xl mx-auto leading-relaxed">Rooted in Faith. United in Love. Serving Our Community.</p>
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
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-1 animate-bounce">
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

      <section className="py-20 px-4 bg-white relative">
        <div className="bg-logo-watermark"></div>
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left">
              <p className="text-green-600 font-semibold text-sm uppercase tracking-wider mb-2">Welcome to Our Parish</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#6e3c28" }}>A Community of Faith in Mosoriot</h2>
              <div className="section-divider-left mb-5"></div>
              <p className="text-gray-600 leading-relaxed mb-4">
                St. Francis Cheptarit Catholic Parish is a vibrant faith community in Mosoriot, Nandi County. Dedicated to St. Francis of Assisi, we are a parish of the Diocese of Kapsabet.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Whether you are a parishioner, a visitor, or someone seeking to know more about the Catholic faith, you are warmly welcome here.
              </p>
              <Link to="/about" className="inline-flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-full text-sm transition-all hover:-translate-y-0.5 shadow-md btn-ripple" style={{ background: "linear-gradient(135deg, #8d5439, #bf875f)" }}>
                Learn About Us <ArrowRight className="h-4 w-4" />
              </Link>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ border: "4px solid white", boxShadow: "0 24px 64px rgba(140,90,61,0.22)" }}>
                  <img src="/images/church.jpg" alt="St. Francis Cheptarit Catholic Church" className="w-full h-72 object-cover" />
                </div>
                <div className="absolute -bottom-4 -left-4 text-white px-5 py-3 rounded-xl shadow-lg font-bold text-sm flex items-center gap-2" style={{ background: "linear-gradient(135deg, #6e3c28, #bf875f)" }}>
                  <MapPin className="h-4 w-4" /> Cheptarit, Mosoriot
                </div>
                <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full overflow-hidden border-3 shadow-xl" style={{ border: "3px solid #8d5439" }}>
                  <img src="/images/church.jpg" alt="" className="h-full w-full object-cover" />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 relative parallax-section overflow-hidden page-background-section"
        style={{ backgroundImage: "url('/images/saint_francis.png')", minHeight: "500px" }}>
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
              <StaggerItem key={v.title} className="touch-card glass-white rounded-2xl p-8 text-center border" style={{ borderColor: "rgba(140,90,61,0.15)" }}>
                <div className="flex justify-center mb-4" style={{ color: "#8d5439" }}>{v.icon}</div>
                <h3 className="font-bold text-xl mb-3" style={{ color: "#6e3c28" }}>{v.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="py-20 px-4 bg-white page-background-section">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 reveal">
            <p className="text-green-600 font-semibold text-sm uppercase tracking-wider mb-2">Get Involved</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: "#6e3c28" }}>Our Ministries & Groups</h2>
            <div className="section-divider"></div>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">Everyone has a place to serve and grow at St. Francis Parish</p>
          </div>
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {MINISTRIES_PREVIEW.map((m) => (
              <StaggerItem key={m.name} className="ministry-card bg-white border rounded-xl p-5 shadow-sm" style={{ borderColor: "rgba(140,90,61,0.15)" }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3 text-white" style={{ background: "#8d5439" }}>
                  <CrossSVG />
                </div>
                <h3 className="font-bold text-sm md:text-base mb-2" style={{ color: "#6e3c28" }}>{m.name}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{m.description}</p>
              </StaggerItem>
            ))}
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
              <StaggerItem key={event.title} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border" style={{ borderColor: "rgba(140,90,61,0.12)" }}>
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

      <section className="py-20 px-4 text-white relative parallax-section"
        style={{ backgroundImage: "url('/images/church.jpg')" }}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(124,45,18,0.92) 0%, rgba(124,45,18,0.88) 100%)" }} />
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
                  <p className="text-white font-black text-4xl tracking-widest">247247</p>
                  <p className="text-green-300 text-xs mt-1">Paybill Number</p>
                </div>
                <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.12)" }}>
                  <p className="text-green-300 text-xs mb-1">Account Number</p>
                  <p className="text-white font-black text-4xl tracking-widest">341370</p>
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

      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center reveal">
          <div className="flex justify-center mb-4">
            <div className="h-20 w-20 rounded-full overflow-hidden border-4 shadow-xl" style={{ borderColor: "#8d5439" }}>
              <img src="/images/church.jpg" alt="" className="h-full w-full object-cover" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#6e3c28" }}>Join Our Parish Family</h2>
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
