import { useState, useEffect } from "react"
import { supabase } from "../../../lib/supabase"
import { useAdmin } from "../../../lib/auth"
type Setting = { id: string; key: string; value: string; label: string }
export function AdminSettings() {
  const { profile } = useAdmin()
  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(true)
  const [vals, setVals] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState<Record<string, boolean>>({})
  useEffect(() => {
    load()
  }, [])
  async function load() {
    const { data } = await supabase.from("parish_settings").select("*").order("key")
    if (data) {
      setSettings(data)
      const v: Record<string, string> = {}
      data.forEach((x: Setting) => (v[x.key] = x.value))
      setVals(v)
    }
    setLoading(false)
  }
  async function save(key: string) {
    await supabase.from("parish_settings").update({ value: vals[key], updated_by: profile?.id, updated_at: new Date().toISOString() }).eq("key", key)
    setSaved((p) => ({ ...p, [key]: true }))
    setTimeout(() => setSaved((p) => ({ ...p, [key]: false })), 2500)
  }
  const inp: React.CSSProperties = {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #e0d0c0",
    fontSize: "13px",
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
    background: "#fff",
    color: "#3a1f13",
  }
  return (
    <div className="admin-page-wrap">
      {loading ? (
        <p style={{ color: "#9e8070", fontSize: "13px" }}>Loading...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          {settings.map((s) => (
            <div key={s.key} style={{ background: "#fff", borderRadius: "12px", border: "0.5px solid #e0d0c0", padding: "18px 20px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#7c4c2e", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.label}</label>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input style={{ ...inp, flex: 1 }} value={vals[s.key] || ""} onChange={(e) => setVals((p) => ({ ...p, [s.key]: e.target.value }))} />
                <button
                  onClick={() => save(s.key)}
                  style={{
                    padding: "10px 14px",
                    background: saved[s.key] ? "#2e7d32" : "#3a1f13",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 500,
                    cursor: "pointer",
                    flexShrink: 0,
                    transition: "background 0.2s",
                  }}
                >
                  {saved[s.key] ? "Saved" : "Save"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
