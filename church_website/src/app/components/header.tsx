import { useState } from "react";
import { Link, useLocation } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { PARISH_PHONE_DISPLAY, PARISH_TEL_HREF, PARISH_WHATSAPP_E164 } from "../../lib/parishContact";

const MotionLink = motion.create(Link);

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
          <motion.a
            href={PARISH_TEL_HREF}
            className="flex items-center gap-1.5 hover:text-green-300 transition-colors py-1 px-1 -mx-1 rounded min-h-[44px] sm:min-h-0 sm:py-0 sm:px-0 sm:mx-0"
            whileTap={{ scale: 0.97 }}
          >
            <Phone className="h-3 w-3" /> {PARISH_PHONE_DISPLAY}
          </motion.a>
          <motion.a
            href={`https://wa.me/${PARISH_WHATSAPP_E164}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-green-300 transition-colors"
            whileTap={{ scale: 0.97 }}
          >
            <MessageCircle className="h-3 w-3" /> WhatsApp
          </motion.a>
        </div>
      </div>

      <header className="sticky top-0 z-50 shadow-xl" style={{ background: "linear-gradient(135deg, #4b2e1b 0%, #7c2d12 60%, #9c4e1d 100%)" }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <MotionLink
              to="/"
              className="flex items-center gap-3 hover:opacity-90 transition-opacity"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="h-14 w-14 rounded-full overflow-hidden border-2 shadow-lg flex-shrink-0" style={{ borderColor: "#8d5439" }}>
                <img src="/images/church.jpg" alt="St. Francis Cheptarit Logo" className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-white font-bold text-lg">St. Francis Cheptarit</span>
                <span className="text-green-200 text-xs">Catholic Parish &bull; Mosoriot</span>
              </div>
            </MotionLink>

            <nav className="hidden xl:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <MotionLink
                    key={link.path}
                    to={link.path}
                    className="relative px-3 py-2 rounded-lg text-sm font-medium text-white overflow-hidden"
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 420, damping: 28 }}
                  >
                    {active ? (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 rounded-lg bg-white/20 border border-amber-400/50 shadow-[0_0_20px_rgba(251,191,36,0.15)]"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        aria-hidden
                      />
                    ) : null}
                    {link.path === "/livestream" ? (
                      <span className="absolute -top-0.5 right-0.5 z-20 h-2 w-2 rounded-full bg-emerald-400 live-dot md:right-1" aria-hidden />
                    ) : null}
                    <span className="relative z-10">{link.label}</span>
                  </MotionLink>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <motion.a
                href={PARISH_TEL_HREF}
                className="hidden md:flex items-center gap-2 font-semibold px-4 py-2 rounded-full text-sm transition-all shadow-md btn-ripple"
                style={{ background: "#7c2d12", color: "white" }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <Phone className="h-4 w-4" /> Call
              </motion.a>
              <motion.button
                className="xl:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
                onClick={() => setOpen(!open)}
                aria-label="Toggle menu"
                whileTap={{ scale: 0.92 }}
              >
                {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </motion.button>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {open ? (
              <motion.nav
                key="mobile-nav"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="xl:hidden overflow-hidden border-t border-white/20"
              >
                <div className="grid grid-cols-2 gap-1 mb-3 pt-3">
                  {navLinks.map((link) => (
                    <MotionLink
                      key={link.path}
                      to={link.path}
                      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-white ${isActive(link.path) ? "bg-white/20 ring-1 ring-amber-400/40" : "hover:bg-white/10"}`}
                      onClick={() => setOpen(false)}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    >
                      {link.path === "/livestream" && <span className="w-2 h-2 rounded-full bg-red-500 live-dot flex-shrink-0" />}
                      {link.label}
                    </MotionLink>
                  ))}
                </div>
                <motion.a
                  href={PARISH_TEL_HREF}
                  className="flex items-center justify-center gap-2 text-white font-semibold px-4 py-3 rounded-xl text-sm mb-4"
                  style={{ background: "#8d5439" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Phone className="h-4 w-4" /> {PARISH_PHONE_DISPLAY}
                </motion.a>
              </motion.nav>
            ) : null}
          </AnimatePresence>
        </div>
      </header>

      <motion.a
        href={`https://wa.me/${PARISH_WHATSAPP_E164}?text=Hello%20St.%20Francis%20Cheptarit%20Catholic%20Parish`}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="WhatsApp"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
      >
        <svg viewBox="0 0 24 24" fill="white" width="30" height="30">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </motion.a>
    </>
  );
}
