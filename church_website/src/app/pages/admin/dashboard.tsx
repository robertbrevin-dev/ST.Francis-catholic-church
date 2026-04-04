import { useNavigate } from "react-router"
import { useAdmin } from "../../../lib/auth"

const SECTIONS = [
  { title: "Announcements", desc: "Post, pin and remove parish notices", path: "/admin/announcements", color: "#e65100" },
  { title: "Mass schedule", desc: "Update daily and Sunday Mass times", path: "/admin/mass-times", color: "#2e7d32" },
  { title: "Confessions", desc: "Update Reconciliation schedule", path: "/admin/confessions", color: "#6a1b9a" },
  { title: "Events", desc: "Create and manage parish events", path: "/admin/events", color: "#1565c0" },
  { title: "Ministries", desc: "Edit ministry descriptions and times", path: "/admin/ministries", color: "#2e7d32" },
  { title: "Sacraments", desc: "Update sacrament schedules", path: "/admin/services", color: "#bf360c" },
  { title: "Giving / Sadaka", desc: "Update M-PESA and michango info", path: "/admin/giving", color: "#c8a84b" },
  { title: "Livestream", desc: "Post YouTube links and toggle live", path: "/admin/livestream", color: "#880e4f" },
  { title: "Parish settings", desc: "Phone, office hours, address", path: "/admin/settings", color: "#5f5e5a" },
]

export function AdminDashboard() {
  const navigate = useNavigate()
  const { profile } = useAdmin()

  return (
    <>
      <div className="admin-welcome">
        <div className="admin-welcome-card">
          <h2>Good day, {profile?.display_name ?? "administrator"}</h2>
          <p>St. Francis Cheptarit Catholic Parish · Diocese of Kapsabet</p>
        </div>
      </div>
      <p className="admin-section-label">Content management</p>
      <div className="admin-dash-grid">
        {SECTIONS.map((s, i) => (
          <div
            key={i}
            role="button"
            tabIndex={0}
            onClick={() => s.path && navigate(s.path)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                if (s.path) navigate(s.path)
              }
            }}
            className="admin-dash-tile"
            style={{ opacity: s.path ? 1 : 0.5 }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: `${s.color}20`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <div style={{ width: 11, height: 11, borderRadius: "50%", background: s.color }} />
            </div>
            <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "#3a1f13", margin: "0 0 4px" }}>{s.title}</p>
            <p style={{ fontSize: "0.72rem", color: "#6e3c28", margin: 0, lineHeight: 1.5, opacity: 0.9 }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </>
  )
}
