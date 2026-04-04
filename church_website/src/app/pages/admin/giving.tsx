import { useState, useEffect } from "react"
import { supabase } from "../../../lib/supabase"
import { useAdmin } from "../../../lib/auth"
type Purpose = { id: string; title: string; description: string; display_order: number; is_active: boolean }
type Setting = { id: string; key: string; value: string; label: string }
export function AdminGiving() {
  const { profile } = useAdmin()
  const [purposes, setPurposes] = useState<Purpose[]>([])
  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({ text: "", ok: true })
  const [form, setForm] = useState({ title: "", description: "", display_order: 0 })
  const [editing, setEditing] = useState<Purpose | null>(null)
  const [svals, setSvals] = useState<Record<string, string>>({})
  const [ssaved, setSsaved] = useState<Record<string, boolean>>({})
  useEffect(() => {
    loadAll()
  }, [])
  async function loadAll() {
    const [p, s] = await Promise.all([
      supabase.from("giving_purposes").select("*").order("display_order"),
      supabase.from("parish_settings").select("*").order("key"),
    ])
    if (p.data) setPurposes(p.data)
    if (s.data) {
      setSettings(s.data)
      const v: Record<string, string> = {}
      s.data.forEach((x: Setting) => (v[x.key] = x.value))
      setSvals(v)
    }
    setLoading(false)
  }
  function notify(t: string, ok = true) {
    setMsg({ text: t, ok })
    setTimeout(() => setMsg({ text: "", ok: true }), 3500)
  }
  async function savePurpose() {
    if (!form.title.trim() || !form.description.trim()) return
    setSaving(true)
    if (editing) {
      await supabase.from("giving_purposes").update({ ...form, updated_by: profile?.id, updated_at: new Date().toISOString() }).eq("id", editing.id)
      setEditing(null)
      notify("Updated.")
    } else {
      await supabase.from("giving_purposes").insert({ ...form, is_active: true, updated_by: profile?.id })
      notify("Purpose added.")
    }
    setForm({ title: "", description: "", display_order: 0 })
    loadAll()
    setSaving(false)
  }
  async function saveSetting(key: string) {
    await supabase.from("parish_settings").update({ value: svals[key], updated_by: profile?.id, updated_at: new Date().toISOString() }).eq("key", key)
    setSsaved((p) => ({ ...p, [key]: true }))
    setTimeout(() => setSsaved((p) => ({ ...p, [key]: false })), 2500)
  }
  async function togglePurpose(id: string, v: boolean) {
    await supabase.from("giving_purposes").update({ is_active: !v }).eq("id", id)
    loadAll()
  }
  async function delPurpose(id: string) {
    if (!confirm("Delete?")) return
    await supabase.from("giving_purposes").delete().eq("id", id)
    loadAll()
  }
  function startEdit(p: Purpose) {
    setEditing(p)
    setForm({ title: p.title, description: p.description, display_order: p.display_order })
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
  const MPESA = ["mpesa_paybill", "mpesa_account", "church_phone", "whatsapp", "office_hours"]
  return (
    <div className="admin-page-wrap">
      <div style={{ background: "#fff", borderRadius: "14px", border: "0.5px solid #e0d0c0", padding: "24px", marginBottom: "24px" }}>
        <p style={{ fontSize: "13px", fontWeight: 600, color: "#3a1f13", margin: "0 0 16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: "4px", height: "16px", background: "#c8a84b", borderRadius: "2px", display: "inline-block" }} />
          M-PESA and Contact Settings
        </p>
        {loading ? (
          <p style={{ color: "#9e8070", fontSize: "13px" }}>Loading...</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            {MPESA.map((key) => {
              const s = settings.find((x) => x.key === key)
              if (!s) return null
              return (
                <div key={key}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#7c4c2e", marginBottom: "5px" }}>{s.label}</label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input style={{ ...inp, flex: 1 }} value={svals[key] || ""} onChange={(e) => setSvals((p) => ({ ...p, [key]: e.target.value }))} />
                    <button
                      onClick={() => saveSetting(key)}
                      style={{
                        padding: "10px 16px",
                        background: ssaved[key] ? "#2e7d32" : "#c8a84b",
                        color: ssaved[key] ? "#fff" : "#3a1f13",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                    >
                      {ssaved[key] ? "Saved" : "Save"}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      {msg.text && (
        <div style={{ marginBottom: "16px", padding: "10px 14px", borderRadius: "8px", background: msg.ok ? "#eaf7ee" : "#fce4e4", fontSize: "13px", color: msg.ok ? "#2e7d32" : "#a32d2d" }}>
          {msg.text}
        </div>
      )}
      <div style={{ background: "#fff", borderRadius: "14px", border: "0.5px solid #e0d0c0", padding: "24px", marginBottom: "24px" }}>
        <p style={{ fontSize: "13px", fontWeight: 600, color: "#3a1f13", margin: "0 0 16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: "4px", height: "16px", background: "#c8a84b", borderRadius: "2px", display: "inline-block" }} />
          {editing ? "Edit purpose" : "Add giving purpose"}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
          <input style={inp} placeholder="Purpose title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
          <input style={inp} type="number" placeholder="Display order" value={form.display_order} onChange={(e) => setForm((p) => ({ ...p, display_order: Number(e.target.value) }))} />
        </div>
        <textarea style={{ ...inp, height: "80px", resize: "vertical", marginBottom: "14px" }} placeholder="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          {editing && (
            <button
              onClick={() => {
                setEditing(null)
                setForm({ title: "", description: "", display_order: 0 })
              }}
              style={{ padding: "9px 18px", background: "#f0e8e0", color: "#7c4c2e", border: "none", borderRadius: "8px", fontSize: "13px", cursor: "pointer" }}
            >
              Cancel
            </button>
          )}
          <button
            onClick={savePurpose}
            disabled={saving || !form.title.trim() || !form.description.trim()}
            style={{ padding: "10px 28px", background: "#c8a84b", color: "#3a1f13", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
          >
            {saving ? "Saving..." : editing ? "Update" : "Add purpose"}
          </button>
        </div>
      </div>
      <p style={{ fontSize: "11px", fontWeight: 600, color: "#9e8070", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "12px" }}>
        Giving purposes ({purposes.length})
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {purposes.map((p, i) => (
          <div
            key={p.id}
            style={{
              background: "#fff",
              borderRadius: "10px",
              border: "0.5px solid #e0d0c0",
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              opacity: p.is_active ? 1 : 0.6,
            }}
          >
            <span style={{ fontSize: "18px", fontWeight: 700, color: "#c8a84b", minWidth: "24px" }}>{i + 1}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#3a1f13" }}>{p.title}</span>
                {!p.is_active && <span style={{ fontSize: "10px", background: "#f0e8e0", color: "#9e8070", padding: "2px 8px", borderRadius: "10px" }}>Hidden</span>}
              </div>
              <p style={{ fontSize: "12px", color: "#9e8070", margin: 0 }}>
                {p.description.slice(0, 90)}
                {p.description.length > 90 ? "..." : ""}
              </p>
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                onClick={() => startEdit(p)}
                style={{ fontSize: "11px", padding: "5px 12px", borderRadius: "6px", border: "0.5px solid #f5dfa0", background: "#fff", cursor: "pointer", color: "#8a6a0a", fontWeight: 500 }}
              >
                Edit
              </button>
              <button
                onClick={() => togglePurpose(p.id, p.is_active)}
                style={{ fontSize: "11px", padding: "5px 12px", borderRadius: "6px", border: "0.5px solid #b5d4f4", background: "#fff", cursor: "pointer", color: "#1565c0", fontWeight: 500 }}
              >
                {p.is_active ? "Hide" : "Show"}
              </button>
              <button
                onClick={() => delPurpose(p.id)}
                style={{ fontSize: "11px", padding: "5px 12px", borderRadius: "6px", border: "0.5px solid #f5c0c0", background: "#fff", cursor: "pointer", color: "#a32d2d", fontWeight: 500 }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
