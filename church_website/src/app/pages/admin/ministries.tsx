import { useState, useEffect } from "react"
import { supabase } from "../../../lib/supabase"
import { useAdmin } from "../../../lib/auth"
type Ministry = {
  id: string
  slug: string
  title: string
  subtitle: string
  description: string
  activities: string[]
  meets: string
  contact_info: string
  color: string
  is_active: boolean
}
export function AdminMinistries() {
  const { profile } = useAdmin()
  const [list, setList] = useState<Ministry[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({ text: "", ok: true })
  const [editing, setEditing] = useState<Ministry | null>(null)
  const [form, setForm] = useState({ slug: "", title: "", subtitle: "", description: "", activities: "", meets: "", contact_info: "", color: "#7c4c2e" })
  const COLS = ["#7c4c2e", "#880e4f", "#e65100", "#1565c0", "#00695c", "#827717", "#4a148c", "#bf360c", "#2e7d32", "#00838f"]
  useEffect(() => {
    load()
  }, [])
  async function load() {
    const { data } = await supabase.from("ministries").select("*").order("title")
    if (data) setList(data)
    setLoading(false)
  }
  function notify(t: string, ok = true) {
    setMsg({ text: t, ok })
    setTimeout(() => setMsg({ text: "", ok: true }), 3500)
  }
  async function save() {
    if (!form.title.trim() || !form.description.trim()) return
    setSaving(true)
    const activities = form.activities.split("\n").map((a) => a.trim()).filter(Boolean)
    const payload = { ...form, activities, is_active: true, updated_by: profile?.id, updated_at: new Date().toISOString() }
    if (editing) {
      await supabase.from("ministries").update(payload).eq("id", editing.id)
      setEditing(null)
      notify("Updated.")
    } else {
      await supabase.from("ministries").insert(payload)
      notify("Ministry added.")
    }
    setForm({ slug: "", title: "", subtitle: "", description: "", activities: "", meets: "", contact_info: "", color: "#7c4c2e" })
    load()
    setSaving(false)
  }
  async function toggleActive(id: string, v: boolean) {
    await supabase.from("ministries").update({ is_active: !v }).eq("id", id)
    load()
  }
  async function del(id: string) {
    if (!confirm("Delete?")) return
    await supabase.from("ministries").delete().eq("id", id)
    load()
  }
  function startEdit(m: Ministry) {
    setEditing(m)
    setForm({
      slug: m.slug,
      title: m.title,
      subtitle: m.subtitle || "",
      description: m.description,
      activities: Array.isArray(m.activities) ? m.activities.join("\n") : "",
      meets: m.meets || "",
      contact_info: m.contact_info || "",
      color: m.color || "#7c4c2e",
    })
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
    <div className="admin-page-wrap admin-page-wrap--wide">
      <div style={{ background: "#fff", borderRadius: "14px", border: "0.5px solid #e0d0c0", padding: "24px", marginBottom: "28px" }}>
        <p style={{ fontSize: "13px", fontWeight: 600, color: "#3a1f13", margin: "0 0 16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: "4px", height: "16px", background: "#2e7d32", borderRadius: "2px", display: "inline-block" }} />
          {editing ? "Edit ministry" : "Add ministry"}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
          <input style={inp} placeholder="Slug (e.g. cma)" value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} />
          <input style={inp} placeholder="Title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
          <input style={inp} placeholder="Subtitle (tagline)" value={form.subtitle} onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))} />
          <input style={inp} placeholder="Meeting schedule" value={form.meets} onChange={(e) => setForm((p) => ({ ...p, meets: e.target.value }))} />
          <input style={inp} placeholder="Contact info" value={form.contact_info} onChange={(e) => setForm((p) => ({ ...p, contact_info: e.target.value }))} />
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "12px", color: "#9e8070" }}>Colour:</span>
            {COLS.map((c, i) => (
              <div
                key={`swatch-${i}`}
                onClick={() => setForm((p) => ({ ...p, color: c }))}
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  background: c,
                  cursor: "pointer",
                  border: form.color === c ? "3px solid #3a1f13" : "2px solid transparent",
                }}
              />
            ))}
          </div>
        </div>
        <textarea style={{ ...inp, height: "90px", resize: "vertical", marginBottom: "12px" }} placeholder="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
        <textarea style={{ ...inp, height: "90px", resize: "vertical", marginBottom: "16px" }} placeholder="Activities — one per line" value={form.activities} onChange={(e) => setForm((p) => ({ ...p, activities: e.target.value }))} />
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          {editing && (
            <button
              onClick={() => {
                setEditing(null)
                setForm({ slug: "", title: "", subtitle: "", description: "", activities: "", meets: "", contact_info: "", color: "#7c4c2e" })
              }}
              style={{ padding: "9px 18px", background: "#f0e8e0", color: "#7c4c2e", border: "none", borderRadius: "8px", fontSize: "13px", cursor: "pointer" }}
            >
              Cancel
            </button>
          )}
          <button
            onClick={save}
            disabled={saving || !form.title.trim() || !form.description.trim()}
            style={{ padding: "10px 28px", background: saving ? "#5a9e5a" : "#2e7d32", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}
          >
            {saving ? "Saving..." : editing ? "Update" : "Add ministry"}
          </button>
        </div>
        {msg.text && (
          <div style={{ marginTop: "12px", padding: "10px 14px", borderRadius: "8px", background: msg.ok ? "#eaf7ee" : "#fce4e4", fontSize: "13px", color: msg.ok ? "#2e7d32" : "#a32d2d" }}>
            {msg.text}
          </div>
        )}
      </div>
      {loading ? (
        <p style={{ color: "#9e8070", fontSize: "13px" }}>Loading...</p>
      ) : list.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px", color: "#9e8070" }}>No ministries yet.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {list.map((m) => (
            <div
              key={m.id}
              style={{
                background: "#fff",
                borderRadius: "12px",
                border: "0.5px solid #e0d0c0",
                padding: "16px 20px",
                display: "flex",
                alignItems: "flex-start",
                gap: "14px",
                opacity: m.is_active ? 1 : 0.6,
              }}
            >
              <div style={{ width: "4px", height: "48px", borderRadius: "2px", background: m.color, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "#3a1f13" }}>{m.title}</span>
                  {m.subtitle && <span style={{ fontSize: "11px", color: "#9e8070" }}>{m.subtitle}</span>}
                  {!m.is_active && <span style={{ fontSize: "10px", background: "#f0e8e0", color: "#9e8070", padding: "2px 8px", borderRadius: "10px" }}>Hidden</span>}
                </div>
                <p style={{ fontSize: "12px", color: "#9e8070", margin: "0 0 3px" }}>{m.meets}</p>
                <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
                  {m.description.slice(0, 100)}
                  {m.description.length > 100 ? "..." : ""}
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", flexShrink: 0 }}>
                <button
                  onClick={() => startEdit(m)}
                  style={{ fontSize: "11px", padding: "5px 12px", borderRadius: "6px", border: "0.5px solid #c8e6c9", background: "#fff", cursor: "pointer", color: "#2e7d32", fontWeight: 500 }}
                >
                  Edit
                </button>
                <button
                  onClick={() => toggleActive(m.id, m.is_active)}
                  style={{ fontSize: "11px", padding: "5px 12px", borderRadius: "6px", border: "0.5px solid #b5d4f4", background: "#fff", cursor: "pointer", color: "#1565c0", fontWeight: 500 }}
                >
                  {m.is_active ? "Hide" : "Show"}
                </button>
                <button
                  onClick={() => del(m.id)}
                  style={{ fontSize: "11px", padding: "5px 12px", borderRadius: "6px", border: "0.5px solid #f5c0c0", background: "#fff", cursor: "pointer", color: "#a32d2d", fontWeight: 500 }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
