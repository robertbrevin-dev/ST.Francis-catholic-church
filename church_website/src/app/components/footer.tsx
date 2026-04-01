import { Mail, Phone, MapPin, Facebook, Youtube, Instagram, ArrowUp, Heart } from "lucide-react";
import { Link } from "react-router";

// ============================
// UPDATE THESE CONTACT DETAILS
// ============================
const CHURCH_PHONE = "+254 700 000 000"; // ← Replace with actual phone number
const CHURCH_EMAIL = "info@stfrancischeptarit.org"; // ← Update email
const FACEBOOK_URL = "#"; // ← Add Facebook page link
const YOUTUBE_URL = "#";  // ← Add YouTube channel link
const INSTAGRAM_URL = "#"; // ← Add Instagram link
// ============================

export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="text-white" style={{ background: "linear-gradient(135deg, #0d3320 0%, #1b6b35 100%)" }}>
      {/* Donation Banner */}
      <div className="py-6 px-4" style={{ background: "linear-gradient(90deg, #c8a84b, #e8c96a, #c8a84b)" }}>
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              <p className="text-green-950 font-bold text-lg">Support Our Parish — Sadaka / Mchango</p>
            </div>
            <p className="text-green-800 text-sm">Your contribution helps us serve God and community</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 text-center">
            <div className="bg-green-950 text-yellow-400 px-5 py-2 rounded-xl shadow-md">
              <p className="text-xs text-green-300 font-medium">M-PESA Paybill</p>
              <p className="text-xl font-bold tracking-wider">247247</p>
            </div>
            <div className="bg-green-950 text-yellow-400 px-5 py-2 rounded-xl shadow-md">
              <p className="text-xs text-green-300 font-medium">Account No.</p>
              <p className="text-xl font-bold tracking-wider">341370</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Parish Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-yellow-400 shadow-lg flex-shrink-0">
                <img src="/images/church.jpg" alt="Logo" className="h-full w-full object-cover" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">St. Francis Cheptarit</h3>
                <p className="text-green-300 text-xs">Catholic Parish</p>
              </div>
            </div>
            <p className="text-sm text-green-200 leading-relaxed mb-4">
              A vibrant Catholic parish rooted in faith, serving the community of Mosoriot and surrounding areas in Nandi County with love, hope, and dedication.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-blue-600 flex items-center justify-center transition-all" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
              <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-red-600 flex items-center justify-center transition-all" aria-label="YouTube">
                <Youtube className="h-4 w-4" />
              </a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-pink-600 flex items-center justify-center transition-all" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-yellow-300 mb-4 text-sm uppercase tracking-wider border-b border-white/20 pb-2">Quick Links</h3>
            <nav className="space-y-2">
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About Us" },
                { to: "/mass-times", label: "Mass Times" },
                { to: "/ministries", label: "Ministries" },
                { to: "/services", label: "Parish Services" },
                { to: "/events", label: "Events & Calendar" },
                { to: "/announcements", label: "Announcements" },
                { to: "/giving", label: "Give / Sadaka" },
                { to: "/contact", label: "Contact Us" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block text-sm text-green-200 hover:text-yellow-300 transition-colors hover:pl-1 duration-200"
                >
                  › {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Mass Times */}
          <div>
            <h3 className="font-bold text-yellow-300 mb-4 text-sm uppercase tracking-wider border-b border-white/20 pb-2">Mass Schedule</h3>
            <div className="space-y-3 text-sm text-green-200">
              <div className="border-l-2 border-yellow-400 pl-3">
                <p className="font-semibold text-white">Sunday Masses</p>
                <p>7:00 AM — Early Morning</p>
                <p>9:00 AM — Main Mass</p>
                <p>11:00 AM — (as scheduled)</p>
              </div>
              <div className="border-l-2 border-green-400 pl-3">
                <p className="font-semibold text-white">Weekday Masses</p>
                <p>Mon – Fri: 6:30 AM</p>
                <p>Saturday: 7:00 AM</p>
              </div>
              <div className="border-l-2 border-blue-400 pl-3">
                <p className="font-semibold text-white">Confessions</p>
                <p>Saturday: 4:00 PM – 5:30 PM</p>
                <p>Before Sunday Masses</p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-yellow-300 mb-4 text-sm uppercase tracking-wider border-b border-white/20 pb-2">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-green-200">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-yellow-400" />
                <span>Cheptarit, Mosoriot<br />Nandi County, Kenya</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 flex-shrink-0 text-yellow-400" />
                <a href={`tel:${CHURCH_PHONE.replace(/\s/g, "")}`} className="text-green-200 hover:text-yellow-300 transition-colors">
                  {CHURCH_PHONE}
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 flex-shrink-0 text-yellow-400" />
                <a href={`mailto:${CHURCH_EMAIL}`} className="text-green-200 hover:text-yellow-300 transition-colors break-all">
                  {CHURCH_EMAIL}
                </a>
              </div>
              <div className="mt-4 p-3 rounded-lg border border-white/15 bg-white/5">
                <p className="text-xs text-green-300 font-semibold mb-1">Parish Office Hours</p>
                <p className="text-xs text-green-200">Mon – Fri: 8:00 AM – 5:00 PM</p>
                <p className="text-xs text-green-200">Saturday: 9:00 AM – 12:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-green-400">
            © {new Date().getFullYear()} St. Francis Cheptarit Catholic Parish — Mosoriot, Nandi County. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-green-400">Diocese of Eldoret</span>
            <button
              onClick={scrollToTop}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-yellow-500 flex items-center justify-center transition-all"
              aria-label="Back to top"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
