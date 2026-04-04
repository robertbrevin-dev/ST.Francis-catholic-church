import { Mail, Phone, MapPin, ArrowUp, MessageCircle } from "lucide-react";
import { Link } from "react-router";
import {
  PARISH_EMAIL,
  PARISH_PHONE_DISPLAY,
  PARISH_PHONE_TEL,
  PARISH_POSTAL_LINES,
  PARISH_WHATSAPP_E164,
} from "../../lib/parishContact";
const FACEBOOK_URL = "#";
const YOUTUBE_URL = "#";
const INSTAGRAM_URL = "#";
const TWITTER_URL = "#";
const TIKTOK_URL = "#";

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);
const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
  </svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
  </svg>
);

export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="text-white" style={{ background: "linear-gradient(160deg, #25140d 0%, #6e3c28 60%, #6e3c28 100%)" }}>
      <div className="py-6 px-4" style={{ background: "linear-gradient(90deg, #6e3c28, #bf875f, #6e3c28)" }}>
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-white font-bold text-lg">Support Our Parish &mdash; Sadaka / Mchango</p>
            <p className="text-orange-100 text-sm">Your contribution helps us serve God and community</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-emerald-900/30 text-emerald-100 px-5 py-2 rounded-xl border border-emerald-400/30">
              <p className="text-xs text-emerald-200">M-PESA Paybill</p>
              <p className="text-2xl font-black tracking-widest">247247</p>
            </div>
            <div className="bg-emerald-900/30 text-emerald-100 px-5 py-2 rounded-xl border border-emerald-400/30">
              <p className="text-xs text-emerald-200">Account No.</p>
              <p className="text-2xl font-black tracking-widest">341370</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-14 w-14 rounded-full overflow-hidden border-2 shadow-lg flex-shrink-0" style={{ borderColor: "#8d5439" }}>
                <img src="/images/logo_color.jpeg" alt="Logo" className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/images/logo.jpeg"; }} />
              </div>
              <div>
                <h3 className="font-bold text-white">St. Francis Cheptarit</h3>
                <p className="text-green-300 text-xs">Catholic Parish</p>
              </div>
            </div>
            <p className="text-sm text-green-200 leading-relaxed mb-4">A vibrant Catholic parish rooted in faith, serving Mosoriot and Nandi County with love and dedication.</p>
            <div className="flex items-center gap-2 mt-4">
              {[
                { href: FACEBOOK_URL, label: "Facebook", Icon: FacebookIcon, hover: "hover:bg-blue-600" },
                { href: YOUTUBE_URL, label: "YouTube", Icon: YoutubeIcon, hover: "hover:bg-red-600" },
                { href: INSTAGRAM_URL, label: "Instagram", Icon: InstagramIcon, hover: "hover:bg-pink-600" },
                { href: TWITTER_URL, label: "X/Twitter", Icon: TwitterIcon, hover: "hover:bg-black" },
                { href: TIKTOK_URL, label: "TikTok", Icon: TikTokIcon, hover: "hover:bg-gray-800" },
              ].map(({ href, label, Icon, hover }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className={`w-9 h-9 rounded-full bg-white/10 ${hover} flex items-center justify-center transition-all touch-card`}>
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-green-300 mb-4 text-xs uppercase tracking-wider border-b border-white/15 pb-2">Quick Links</h3>
            <nav className="space-y-1.5">
              {[
                ["/", "Home"], ["/about", "About Us"], ["/mass-times", "Mass Times"],
                ["/ministries", "Ministries"], ["/services", "Parish Services"],
                ["/events", "Events"], ["/announcements", "Announcements"],
                ["/livestream", "Live Stream"], ["/giving", "Give / Sadaka"], ["/contact", "Contact"],
              ].map(([to, label]) => (
                <Link key={to} to={to} className="block text-sm text-green-200 hover:text-green-300 transition-colors hover:pl-2 duration-200">
                  &rsaquo; {label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="font-bold text-green-300 mb-4 text-xs uppercase tracking-wider border-b border-white/15 pb-2">Mass Schedule</h3>
            <div className="space-y-3 text-sm text-green-200">
              <div className="border-l-2 border-green-400 pl-3">
                <p className="font-semibold text-white text-xs">Sunday Masses</p>
                <p className="text-xs">7:00 AM &mdash; Early Mass</p>
                <p className="text-xs">9:00 AM &mdash; Main Mass</p>
              </div>
              <div className="border-l-2 border-green-300 pl-3">
                <p className="font-semibold text-white text-xs">Weekday Masses</p>
                <p className="text-xs">Mon &ndash; Fri: 6:30 AM</p>
                <p className="text-xs">Saturday: 7:00 AM</p>
              </div>
              <div className="border-l-2 pl-3" style={{ borderColor: "#8d5439" }}>
                <p className="font-semibold text-white text-xs">Confessions</p>
                <p className="text-xs">Saturday: 4:00 PM &ndash; 5:30 PM</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-green-300 mb-4 text-xs uppercase tracking-wider border-b border-white/15 pb-2">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-green-200">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-400" />
                <span className="text-xs whitespace-pre-line">{PARISH_POSTAL_LINES}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 flex-shrink-0 text-green-400" />
                <a href={`tel:${PARISH_PHONE_TEL}`} className="text-green-200 hover:text-green-300 transition-colors text-xs">
                  Parish: {PARISH_PHONE_DISPLAY}
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MessageCircle className="h-4 w-4 flex-shrink-0 text-green-400" />
                <a
                  href={`https://wa.me/${PARISH_WHATSAPP_E164}?text=Hello%20St.%20Francis%20Cheptarit%20Parish`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-200 hover:text-green-300 transition-colors text-xs"
                >
                  WhatsApp: {PARISH_PHONE_DISPLAY}
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 flex-shrink-0 text-green-400" />
                <a href={`mailto:${PARISH_EMAIL}`} className="text-green-200 hover:text-green-300 transition-colors text-xs break-all">{PARISH_EMAIL}</a>
              </div>
              <div className="mt-3 p-3 rounded-xl border border-white/10 bg-white/5">
                <p className="text-xs text-green-300 font-semibold mb-1">Office Hours</p>
                <p className="text-xs text-green-200">Mon &ndash; Fri: 8:00 AM &ndash; 5:00 PM</p>
                <p className="text-xs text-green-200">Saturday: 9:00 AM &ndash; 12:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-green-400">&copy; {new Date().getFullYear()} St. Francis Cheptarit Catholic Parish &mdash; Mosoriot, Nandi County. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-green-400">Diocese of Kapsabet</span>
            <button onClick={scrollToTop} className="w-8 h-8 rounded-full bg-white/10 hover:bg-green-600 flex items-center justify-center transition-all touch-card" aria-label="Back to top">
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
