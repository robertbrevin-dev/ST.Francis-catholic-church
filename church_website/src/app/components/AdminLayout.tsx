import { useMemo, useState } from "react"
import { NavLink, Outlet, useLocation } from "react-router"
import { signOut, useAdmin } from "../../lib/auth"

const NAV = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/announcements", label: "Announcements" },
  { to: "/admin/mass-times", label: "Mass schedule" },
  { to: "/admin/confessions", label: "Confessions" },
  { to: "/admin/events", label: "Events" },
  { to: "/admin/ministries", label: "Ministries" },
  { to: "/admin/services", label: "Sacraments" },
  { to: "/admin/giving", label: "Giving / Sadaka" },
  { to: "/admin/livestream", label: "Livestream" },
  { to: "/admin/settings", label: "Parish settings" },
]

const PAGE_META: Record<string, { title: string; subtitle: string }> = {
  "/admin": {
    title: "Dashboard",
    subtitle: "Manage parish content, schedules, and public-facing information.",
  },
  "/admin/announcements": {
    title: "Announcements",
    subtitle: "Post, pin, and manage all parish notices.",
  },
  "/admin/mass-times": {
    title: "Mass schedule",
    subtitle: "Update daily and Sunday Mass times for the parish.",
  },
  "/admin/confessions": {
    title: "Confessions",
    subtitle: "Update the Reconciliation schedule.",
  },
  "/admin/events": {
    title: "Events",
    subtitle: "Create and manage parish events.",
  },
  "/admin/ministries": {
    title: "Ministries",
    subtitle: "Edit ministry descriptions and meeting times.",
  },
  "/admin/services": {
    title: "Sacraments and services",
    subtitle: "Update sacrament descriptions and schedules.",
  },
  "/admin/giving": {
    title: "Giving / Sadaka",
    subtitle: "Update M-PESA details and giving purposes.",
  },
  "/admin/livestream": {
    title: "Livestream",
    subtitle: "Configure streaming links and meeting details.",
  },
  "/admin/settings": {
    title: "Parish settings",
    subtitle: "Church phone, office hours, address, and site-wide info.",
  },
}

export function AdminLayout() {
  const { profile } = useAdmin()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const meta = useMemo(() => {
    const path = location.pathname.replace(/\/$/, "") || "/admin"
    return PAGE_META[path] ?? PAGE_META["/admin"]
  }, [location.pathname])

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="admin-app-root">
      <div
        className={`admin-sidebar-backdrop${menuOpen ? " is-open" : ""}`}
        aria-hidden
        onClick={closeMenu}
      />
      <div className="admin-app-inner">
        <aside className={`admin-sidebar${menuOpen ? " is-open" : ""}`}>
          <div className="admin-sidebar-brand">
            <div className="admin-sidebar-brand-kicker">Parish console</div>
            <div className="admin-sidebar-brand-name">St. Francis Cheptarit</div>
            <div className="admin-sidebar-brand-sub">Catholic Parish · Mosoriot</div>
          </div>
          <nav className="admin-sidebar-nav" aria-label="Admin navigation">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/admin"}
                className={({ isActive }) => `admin-nav-link${isActive ? " active" : ""}`}
                onClick={closeMenu}
              >
                <span className="admin-nav-dot" aria-hidden />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="admin-sidebar-foot">
            Diocese of Kapsabet · Authorised administrators only.
          </div>
        </aside>

        <div className="admin-main-col">
          <header className="admin-topbar">
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button
                type="button"
                className="admin-menu-btn"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                onClick={() => setMenuOpen((o) => !o)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  {menuOpen ? (
                    <path d="M18 6L6 18M6 6l12 12" />
                  ) : (
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
              <div className="admin-breadcrumb-kicker">St. Francis Cheptarit · Admin</div>
            </div>
            <div className="admin-topbar-user">
              {profile?.role && (
                <span className="admin-role-pill" title={profile.role.replace(/_/g, " ")}>
                  {profile.role.replace(/_/g, " ")}
                </span>
              )}
              <span className="admin-user-name">{profile?.display_name ?? "—"}</span>
              <button type="button" className="admin-btn-signout" onClick={() => void signOut()}>
                Sign out
              </button>
            </div>
          </header>

          <section className="admin-hero" aria-labelledby="admin-page-title">
            <div className="admin-hero-inner">
              <h1 id="admin-page-title" className="admin-hero-title">
                {meta.title}
              </h1>
              <p className="admin-hero-sub">{meta.subtitle}</p>
            </div>
          </section>

          <div className="admin-outlet-wrap">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
