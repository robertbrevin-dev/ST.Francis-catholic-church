import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Calendar, Clock, Phone, ArrowRight, Bell, ChevronRight, Smartphone, MapPin, Heart, Users, BookOpen } from "lucide-react";

const CHURCH_PHONE = "+254 700 000 000";
const WHATSAPP_NUMBER = "254700000000";

const LIVE_ANNOUNCEMENTS = [
  "Welcome to St. Francis Cheptarit Catholic Parish — Mosoriot, Nandi County",
  "Sunday Masses: 7:00 AM & 9:00 AM every week",
  "Confessions: Every Saturday 4:00 PM – 5:30 PM",
  "Bible Study: Wednesdays 6:00 PM at the Parish Hall",
  "Sadaka via M-PESA: Paybill 247247, Account 341370",
  "Parish announcements will appear here — update this content regularly",
];

const UPCOMING_EVENTS = [
  { title: "Sunday Mass", date: "Every Sunday", time: "7:00 AM & 9:00 AM" },
  { title: "Confession", date: "Every Saturday", time: "4:00 PM – 5:30 PM" },
  { title: "Bible Study", date: "Every Wednesday", time: "6:00 PM" },
  { title: "Youth Meeting", date: "To be announced", time: "As scheduled" },
];

const DAILY_VERSES = [
  {
    reference: "John 3:16",
    english: "For God so loved the world that he gave his only Son, that whoever believes in him should not perish but have eternal life.",
    kiswahili: "Kwa maana Mungu aliupenda ulimwengu hivi, hata akaweka Mwanawe wa pekee, ili kila asiyeaminiye asipotee, bali awe na uzima wa milele.",
    kalenjin: "Godoki aiu ng'uono arap kebaroni ko, mong'ore aeng'ene naki amu nali utemo, ko bo ak'i ng'won amai, tei aree ng'eni bwee.",
  },
  {
    reference: "Philippians 4:13",
    english: "I can do all things through him who strengthens me.",
    kiswahili: "Ninaweza kufanya yote kwa yeye anayonipa nguvu.",
    kalenjin: "Arai ak'ong'ene ing'etinya, atengelech ab ko upointiinge.",
  },
  {
    reference: "Psalm 23:1",
    english: "The Lord is my shepherd; I shall not want.",
    kiswahili: "Bwana ndiye mchungaji wangu; sitapungukiwa na kitu.",
    kalenjin: "Ng'wono ko tuk oisyo; amu ayie ng'won ataare.",
  },
];

const DAILY_LANGUAGES = ["english", "kiswahili", "kalenjin"] as const;
const LANGUAGE_LABELS = ["English", "Kiswahili", "Kalenjin"];

const MINISTRIES_PREVIEW = [
  { name: "Catholic Men Association", description: "Faith, brotherhood, service and leadership for men of the parish" },
  { name: "Catholic Women Association", description: "Women united in faith, prayer, service and community support" },
  { name: "Youth Ministry", description: "Young people growing in faith, fellowship and Catholic identity" },
  { name: "PMC", description: "Parish Missionary Council — spreading faith in the community" },
  { name: "Choir Ministry", description: "Lifting voices in praise and worship at all parish Masses" },
  { name: "CSA", description: "Catholic Students Association — faith formation for students" },
];

const CrossIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
    <path d="M12 2v20M2 12h20" />
  </svg>
);

const ChurchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
    <path d="M12 2v4M10 4h4" />
    <path d="M4 22V10l8-6 8 6v12H4z" />
    <rect x="9" y="14" width="6" height="8" />
  </svg>
);

const MusicIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

const GraduationIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
    <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

const MINISTRY_ICONS = [
  <CrossIcon key="cross" />,
  <Heart key="heart" className="h-8 w-8" />,
  <Users key="users" className="h-8 w-8" />,
  <ChurchIcon key="church" />,
  <MusicIcon key="music" />,
  <GraduationIcon key="grad" />,
];

export function Home() {
  const [tickerIndex, setTickerIndex] = useState(0);
  const [showTicker, setShowTicker] = useState(true);
  const [verseLanguageIndex, setVerseLanguageIndex] = useState(0);
  const [showDailyVerse, setShowDailyVerse] = useState(true);

  const today = new Date();
  const dailyVerseIndex = Math.floor(today.setHours(0, 0, 0, 0) / 86400000) % DAILY_VERSES.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setShowTicker(false);
      setTimeout(() => {
        setTickerIndex((i) => (i + 1) % LIVE_ANNOUNCEMENTS.length);
        setShowTicker(true);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let hideTimeout = 0;
    const verseInterval = window.setInterval(() => {
      setShowDailyVerse(false);
      hideTimeout = window.setTimeout(() => {
        setVerseLanguageIndex((index) => (index + 1) % DAILY_LANGUAGES.length);
        setShowDailyVerse(true);
      }, 500);
    }, 5000);

    return () => {
      clearInterval(verseInterval);
      clearTimeout(hideTimeout);
    };
  }, []);

  return (
    <div>
      {/* Live Announcements Ticker */}
      <div style={{ background: "linear-gradient(90deg, #0d3320, #1b6b35)" }} className="py-2.5 px-4">
        <div className="container mx-auto flex items-center gap-3">
          <div className="live-badge flex-shrink-0 flex items-center gap-1.5">
            <Bell className="h-3.5 w-3.5" />
            <span className="live-dot w-2 h-2 rounded-full bg-white inline-block"></span>
            LIVE
          </div>
          <div className="text-white text-sm font-medium overflow-hidden transition-opacity duration-400" style={{ opacity: showTicker ? 1 : 0 }}>
            {LIVE_ANNOUNCEMENTS[tickerIndex]}
          </div>
          <Link to="/announcements" className="ml-auto flex-shrink-0 text-yellow-300 text-xs hover:text-yellow-200 flex items-center gap-1">
            View All <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/church.jpg" alt="St. Francis Cheptarit Catholic Parish" className="w-full h-full object-cover" />
          <div className="absolute inset-0 hero-overlay" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto animate-fade-in-up">
          <div className="mb-6 flex justify-center">
            <div className="h-32 w-32 md:h-40 md:w-40 rounded-full overflow-hidden border-4 border-yellow-400 shadow-2xl animate-float">
              <img src="/images/logo.jpeg" alt="St. Francis Cheptarit Parish Logo" className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="inline-block bg-yellow-500/20 border border-yellow-400/50 text-yellow-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase">
            Diocese of Eldoret &bull; Kenya
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-white leading-tight">
            St. Francis <span className="text-yellow-300">Cheptarit</span>
          </h1>
          <h2 className="text-xl md:text-2xl font-medium text-green-200 mb-3">Catholic Parish — Mosoriot, Nandi County</h2>
          <p className="text-base md:text-xl text-white/85 mb-10 max-w-2xl mx-auto leading-relaxed">
            Rooted in Faith. United in Love. Serving Our Community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/mass-times" className="inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-green-950 font-bold px-8 py-4 rounded-full text-base transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              <Calendar className="h-5 w-5" /> Mass Times
            </Link>
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 border border-white/40 text-white font-semibold px-8 py-4 rounded-full text-base transition-all">
              <ArrowRight className="h-5 w-5" /> Visit Us
            </Link>
            <a href={`tel:${CHURCH_PHONE.replace(/\s/g, "")}`} className="inline-flex items-center justify-center gap-2 bg-green-600/80 hover:bg-green-600 border border-green-400/50 text-white font-semibold px-8 py-4 rounded-full text-base transition-all">
              <Phone className="h-5 w-5" /> {CHURCH_PHONE}
            </a>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 flex flex-col items-center gap-1 animate-bounce">
          <div className="w-0.5 h-8 bg-white/40 rounded-full"></div>
          <span className="text-xs">Scroll</span>
        </div>
      </section>

      {/* Daily Verse of the Day */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8">
            <p className="text-green-600 font-semibold text-sm uppercase tracking-wider mb-2">Daily Scripture Reading</p>
            <h2 className="text-3xl md:text-4xl font-bold text-green-900">Verse of the Day</h2>
            <div className="mx-auto mt-4 w-20 h-1 rounded bg-green-800"></div>
          </div>
          <div className="rounded-3xl border border-green-100 shadow-lg p-8 bg-[#f7fcf6]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-green-500 font-semibold">Today's Daily Reading</p>
                <p className="text-xs text-gray-500 mt-1">Auto-updates by date and rotates English, Kiswahili, and Kalenjin every 5 seconds.</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-green-100 text-green-800 text-xs font-semibold px-4 py-2">
                {LANGUAGE_LABELS[verseLanguageIndex]}
              </span>
            </div>
            <div className={`transition-opacity duration-500 min-h-[120px] ${showDailyVerse ? "opacity-100" : "opacity-0"}`}>
              <p className="text-xl md:text-2xl text-green-900 italic leading-relaxed">&ldquo;{DAILY_VERSES[dailyVerseIndex][DAILY_LANGUAGES[verseLanguageIndex]]}&rdquo;</p>
              <p className="mt-4 text-sm text-gray-600">{DAILY_VERSES[dailyVerseIndex].reference}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Strip */}
      <section style={{ background: "linear-gradient(90deg, #1b6b35, #2d8a48)" }} className="py-5 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white text-center">
            {[
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-7 w-7 mx-auto mb-1"><path d="M4 22V10l8-6 8 6v12H4z"/><rect x="9" y="14" width="6" height="8"/></svg>, label: "Sunday Mass", value: "7:00 AM & 9:00 AM" },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-7 w-7 mx-auto mb-1"><path d="M12 2v20M2 12h20"/></svg>, label: "Confessions", value: "Sat 4:00 – 5:30 PM" },
              { icon: <MapPin className="h-7 w-7 mx-auto mb-1" />, label: "Location", value: "Cheptarit, Mosoriot" },
              { icon: <Phone className="h-7 w-7 mx-auto mb-1" />, label: "Call Us", value: CHURCH_PHONE, href: `tel:${CHURCH_PHONE.replace(/\s/g,"")}` },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="text-green-200">{item.icon}</div>
                <p className="text-xs text-green-200">{item.label}</p>
                {item.href ? (
                  <a href={item.href} className="font-bold text-sm hover:text-yellow-300 transition-colors">{item.value}</a>
                ) : (
                  <p className="font-bold text-sm">{item.value}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Welcome */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-green-600 font-semibold text-sm uppercase tracking-wider mb-2">Welcome to Our Parish</p>
              <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">A Community of Faith in Mosoriot</h2>
              <div className="w-16 h-1 rounded mb-5" style={{ background: "linear-gradient(90deg, #1b6b35, #c8a84b)" }}></div>
              <p className="text-gray-600 leading-relaxed mb-4">
                St. Francis Cheptarit Catholic Parish is a vibrant faith community located in Mosoriot, Nandi County, Kenya. Dedicated to St. Francis of Assisi, we are a parish of the Diocese of Eldoret.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Whether you are a parishioner, a visitor, or someone seeking to know more about the Catholic faith, you are warmly welcome here. We celebrate the Sacraments, gather for fellowship, and serve our community with joy.
              </p>
              <Link to="/about" className="inline-flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-full text-sm transition-all hover:-translate-y-0.5 shadow-md" style={{ background: "linear-gradient(135deg, #1b6b35, #2d8a48)" }}>
                Learn About Us <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white" style={{ boxShadow: "0 20px 60px rgba(27,107,53,0.2)" }}>
                <img src="/images/church.jpg" alt="St. Francis Cheptarit Catholic Church Building" className="w-full h-72 object-cover" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-yellow-500 text-green-950 px-5 py-3 rounded-xl shadow-lg font-bold text-sm flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Cheptarit, Mosoriot
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-4" style={{ background: "#eaf7ee" }}>
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-green-600 font-semibold text-sm uppercase tracking-wider mb-2">What We Stand For</p>
            <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-3">Our Core Values</h2>
            <div className="section-divider"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Heart className="h-10 w-10" />, title: "Love & Compassion", desc: "Following Christ's example of unconditional love for all people in our community and beyond." },
              { icon: <Users className="h-10 w-10" />, title: "Community & Fellowship", desc: "Building strong, lasting bonds among our parish family and the wider Mosoriot community." },
              { icon: <BookOpen className="h-10 w-10" />, title: "Faith & Learning", desc: "Growing together in knowledge, faith formation, and a deeper understanding of God's Word." },
            ].map((v, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 text-center border border-green-100">
                <div className="text-green-600 flex justify-center mb-4">{v.icon}</div>
                <h3 className="font-bold text-green-900 text-xl mb-3">{v.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ministries Preview */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-green-600 font-semibold text-sm uppercase tracking-wider mb-2">Get Involved</p>
            <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-3">Our Ministries & Groups</h2>
            <div className="section-divider"></div>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">Everyone has a place to serve and grow at St. Francis Parish</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {MINISTRIES_PREVIEW.map((m, i) => (
              <div key={i} className="ministry-card bg-white border border-green-100 rounded-xl p-5 shadow-sm">
                <div className="text-green-600 mb-3">{MINISTRY_ICONS[i]}</div>
                <h3 className="font-bold text-green-900 text-sm md:text-base mb-2">{m.name}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{m.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/ministries" className="inline-flex items-center gap-2 text-white font-semibold px-8 py-3 rounded-full transition-all hover:-translate-y-0.5 shadow-lg" style={{ background: "linear-gradient(135deg, #1b6b35, #2d8a48)" }}>
              View All Ministries <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 px-4" style={{ background: "linear-gradient(135deg, #f0faf2, #eaf7ee)" }}>
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-green-600 font-semibold text-sm uppercase tracking-wider mb-2">Parish Schedule</p>
            <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-3">Upcoming Events</h2>
            <div className="section-divider"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {UPCOMING_EVENTS.map((event, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 border border-green-100">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ background: "#eaf7ee" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#1b6b35" strokeWidth="2" className="h-5 w-5"><path d="M4 22V10l8-6 8 6v12H4z"/><rect x="9" y="14" width="6" height="8"/></svg>
                </div>
                <h3 className="font-bold text-green-900 text-lg mb-3">{event.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Calendar className="h-4 w-4 text-green-500" /><span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4 text-green-500" /><span>{event.time}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/events" className="inline-flex items-center gap-2 border-2 border-green-600 text-green-700 font-semibold px-8 py-3 rounded-full hover:bg-green-600 hover:text-white transition-all">
              Full Calendar <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* M-PESA Giving */}
      <section className="py-16 px-4 text-white" style={{ background: "linear-gradient(135deg, #0d3320 0%, #1b6b35 50%, #2d8a48 100%)" }}>
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <p className="text-yellow-300 font-semibold text-sm uppercase tracking-wider mb-2">Sadaka / Mchango</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Give to God's Work</h2>
            <div className="w-20 h-1 bg-yellow-400 mx-auto rounded"></div>
            <p className="text-green-200 mt-4 max-w-xl mx-auto">Support our parish through your generous contributions. Every gift makes a difference in our community.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-white/10 rounded-2xl p-8 border border-white/20">
              <h3 className="text-yellow-300 font-bold text-xl mb-6 flex items-center gap-2">
                <Smartphone className="h-6 w-6" /> M-PESA Payment Details
              </h3>
              <div className="space-y-4">
                <div className="bg-white/15 rounded-xl p-4">
                  <p className="text-green-300 text-xs mb-1">Lipa na M-PESA &rarr; Pay Bill &rarr; Business Number</p>
                  <p className="text-white font-bold text-3xl tracking-widest">247247</p>
                  <p className="text-green-300 text-xs mt-1">Paybill Number</p>
                </div>
                <div className="bg-white/15 rounded-xl p-4">
                  <p className="text-green-300 text-xs mb-1">Account Number</p>
                  <p className="text-white font-bold text-3xl tracking-widest">341370</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-yellow-300 font-bold text-xl mb-4">What Your Gift Supports</h3>
              {[
                { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><path d="M4 22V10l8-6 8 6v12H4z"/><rect x="9" y="14" width="6" height="8"/></svg>, title: "Parish Operations", desc: "Daily running of the parish, utilities, and maintenance" },
                { icon: <BookOpen className="h-5 w-5" />, title: "Religious Education", desc: "Catechism, faith formation, and sacramental preparation" },
                { icon: <Users className="h-5 w-5" />, title: "Community Outreach", desc: "Support for the sick, poor, and vulnerable in our community" },
                { icon: <Heart className="h-5 w-5" />, title: "Liturgy & Worship", desc: "Music ministry, altar supplies, and liturgical needs" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 bg-white/10 rounded-xl p-4 border border-white/10">
                  <div className="text-yellow-300 mt-0.5 flex-shrink-0">{item.icon}</div>
                  <div>
                    <p className="font-semibold text-white text-sm">{item.title}</p>
                    <p className="text-green-300 text-xs">{item.desc}</p>
                  </div>
                </div>
              ))}
              <Link to="/giving" className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-green-950 font-bold px-6 py-3 rounded-full transition-all mt-2">
                More Ways to Give <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex justify-center mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="#1b6b35" strokeWidth="1.5" className="h-14 w-14">
              <path d="M12 2v20M2 12h20" strokeLinecap="round"/>
              <circle cx="12" cy="12" r="9" strokeLinecap="round"/>
            </svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">Join Our Parish Family</h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed">
            All are welcome at St. Francis Cheptarit. Whether you're new to the area, returning to the Church, or simply looking for a spiritual home — our doors and hearts are open to you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hello%2C%20I%20am%20interested%20in%20joining%20St.%20Francis%20Cheptarit%20Catholic%20Parish`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-4 rounded-full text-base transition-all shadow-lg">
              <svg viewBox="0 0 24 24" fill="white" className="h-5 w-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Connect on WhatsApp
            </a>
            <Link to="/contact" className="inline-flex items-center gap-2 border-2 border-green-600 text-green-700 font-semibold px-8 py-4 rounded-full hover:bg-green-600 hover:text-white transition-all">
              <Phone className="h-5 w-5" /> Get In Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
