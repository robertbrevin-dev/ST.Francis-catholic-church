import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X, Phone, MessageCircle, MapPin } from "lucide-react";

const CHURCH_PHONE = "+254 700 000 000";
const WHATSAPP_NUMBER = "254700000000";
// church.jpg = St. Francis badge (logo seal)
// logo.jpeg  = church building photo
const LOGO_IMG = "/images/church.jpg";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/mass-times", label: "Mass Times" },
    { path: "/ministries", label: "Ministries" },
    { path: "/services", label: "Services" },
    { path: "/events", label: "Events" },
    { path: "/announcements", label: "Announcements" },
    { path: "/contact", label: "Contact" },
    { path: "/giving", label: "Giving" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Top bar */}
      <div className="bg-green-950 text-green-100 text-sm py-1.5 px-4 hidden md:flex items-center justify-between">
        <span className="opacity-80 text-xs flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          St. Francis Cheptarit Catholic Parish — Mosoriot, Nandi County, Kenya
        </span>
        <div className="flex items-center gap-4">
          <a href={`tel:${CHURCH_PHONE.replace(/\s/g,"")}`}
            className="flex items-center gap-1.5 hover:text-green-300 transition-colors">
            <Phone className="h-3.5 w-3.5" />
            <span>{CHURCH_PHONE}</span>
          </a>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-green-300 transition-colors">
            <MessageCircle className="h-3.5 w-3.5" />
            <span>WhatsApp Us</span>
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-50 shadow-xl" style={{ background: "linear-gradient(135deg, #0d3320 0%, #1b6b35 100%)" }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <div className="h-14 w-14 rounded-full overflow-hidden flex-shrink-0"
                style={{ border: "2.5px solid #c8a84b", boxShadow: "0 0 15px rgba(200,168,75,0.4)" }}>
                <img src={LOGO_IMG} alt="St. Francis Cheptarit Catholic Parish"
                  className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-black text-lg leading-tight">St. Francis</span>
                <span className="text-xs font-semibold leading-tight" style={{ color: "#f0d070" }}>Cheptarit Catholic Parish</span>
                <span className="text-green-300 text-xs opacity-80 leading-tight">Mosoriot, Nandi County</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all text-white ${
                    isActive(link.path)
                      ? "bg-white/20 border-b-2 border-yellow-400"
                      : "hover:bg-white/10"
                  }`}>
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Call button + mobile menu */}
            <div className="flex items-center gap-2">
              <a href={`tel:${CHURCH_PHONE.replace(/\s/g,"")}`}
                className="hidden md:flex items-center gap-2 font-bold px-5 py-2 rounded-full text-sm transition-all shadow-md hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #c8a84b, #f0d070)", color: "#0d3320" }}>
                <Phone className="h-4 w-4" /> Call Us
              </a>
              <button className="lg:hidden p-2 rounded-md text-white hover:bg-white/10 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Nav */}
          {mobileMenuOpen && (
            <nav className="lg:hidden pb-4 border-t border-white/20 pt-2">
              <div className="grid grid-cols-2 gap-1">
                {navLinks.map((link) => (
                  <Link key={link.path} to={link.path}
                    className={`block px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors text-white ${
                      isActive(link.path) ? "bg-white/20" : "hover:bg-white/10"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}>
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-white/20 px-1">
                <a href={`tel:${CHURCH_PHONE.replace(/\s/g,"")}`}
                  className="flex items-center justify-center gap-2 font-bold px-4 py-3 rounded-full text-sm w-full"
                  style={{ background: "linear-gradient(135deg, #c8a84b, #f0d070)", color: "#0d3320" }}>
                  <Phone className="h-4 w-4" /> {CHURCH_PHONE}
                </a>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* WhatsApp Floating Button */}
      <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20St.%20Francis%20Cheptarit%20Catholic%20Parish`}
        target="_blank" rel="noopener noreferrer"
        className="whatsapp-float" aria-label="Chat on WhatsApp" title="Chat with us on WhatsApp">
        <svg viewBox="0 0 24 24" fill="white" width="30" height="30">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </>
  );
}
