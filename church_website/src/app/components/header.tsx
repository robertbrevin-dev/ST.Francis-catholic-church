import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { PARISH_PHONE_DISPLAY, PARISH_PHONE_TEL, PARISH_WHATSAPP_E164 } from "../../lib/parishContact";

export function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/mass-times", label: "Mass Times" },
    { path: "/ministries", label: "Ministries" },
    { path: "/services", label: "Services" },
    { path: "/events", label: "Events" },
    { path: "/announcements", label: "Announcements" },
    { path: "/livestream", label: "Live" },
    { path: "/contact", label: "Contact" },
    { path: "/giving", label: "Give" },
  ];

  const isActive = (path: string) => path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <>
      <div className="hidden md:flex items-center justify-between px-6 py-1.5 text-xs text-white/80" style={{ background: "#321d11" }}>
        <span className="opacity-70">St. Francis Cheptarit Catholic Parish &mdash; Mosoriot, Nandi County, Kenya &bull; Diocese of Kapsabet</span>
        <div className="flex items-center gap-5">
          <a href={`tel:${PARISH_PHONE_TEL}`} className="flex items-center gap-1.5 hover:text-green-300 transition-colors">
            <Phone className="h-3 w-3" /> {PARISH_PHONE_DISPLAY}
          </a>
          <a href={`https://wa.me/${PARISH_WHATSAPP_E164}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-green-300 transition-colors">
            <MessageCircle className="h-3 w-3" /> WhatsApp
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-50 shadow-xl" style={{ background: "linear-gradient(135deg, #4b2e1b 0%, #7c2d12 60%, #9c4e1d 100%)" }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <div className="h-14 w-14 rounded-full overflow-hidden border-2 shadow-lg flex-shrink-0" style={{ borderColor: "#8d5439" }}>
                <img src="/images/logo_color.jpeg" alt="St. Francis Cheptarit Logo" className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/images/logo.jpeg"; }} />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-white font-bold text-lg">St. Francis Cheptarit</span>
                <span className="text-green-200 text-xs">Catholic Parish &bull; Mosoriot</span>
              </div>
            </Link>

            <nav className="hidden xl:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all text-white relative ${isActive(link.path) ? "bg-white/20 border-b-2 border-amber-400" : "hover:bg-white/10"}`}>
                  {link.path === "/livestream" && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 live-dot"></span>
                  )}
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <a href={`tel:${PARISH_PHONE_TEL}`}
                className="hidden md:flex items-center gap-2 font-semibold px-4 py-2 rounded-full text-sm transition-all shadow-md btn-ripple"
                style={{ background: "#7c2d12", color: "white" }}>
                <Phone className="h-4 w-4" /> Call
              </a>
              <button className="xl:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
                onClick={() => setOpen(!open)} aria-label="Toggle menu">
                {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {open && (
            <nav className="xl:hidden pb-4 border-t border-white/20 pt-3">
              <div className="grid grid-cols-2 gap-1 mb-3">
                {navLinks.map((link) => (
                  <Link key={link.path} to={link.path}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-white ${isActive(link.path) ? "bg-white/20" : "hover:bg-white/10"}`}
                    onClick={() => setOpen(false)}>
                    {link.path === "/livestream" && <span className="w-2 h-2 rounded-full bg-red-500 live-dot flex-shrink-0"></span>}
                    {link.label}
                  </Link>
                ))}
              </div>
              <a href={`tel:${PARISH_PHONE_TEL}`}
                className="flex items-center justify-center gap-2 text-white font-semibold px-4 py-3 rounded-xl text-sm"
                style={{ background: "#8d5439" }}>
                <Phone className="h-4 w-4" /> {PARISH_PHONE_DISPLAY}
              </a>
            </nav>
          )}
        </div>
      </header>

      <a href={`https://wa.me/${PARISH_WHATSAPP_E164}?text=Hello%20St.%20Francis%20Cheptarit%20Catholic%20Parish`}
        target="_blank" rel="noopener noreferrer" className="whatsapp-float" aria-label="WhatsApp">
        <svg viewBox="0 0 24 24" fill="white" width="30" height="30">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </>
  );
}
