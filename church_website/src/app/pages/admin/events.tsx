import { useState, useEffect } from "react"
import { supabase } from "../../../lib/supabase"
import { useAdmin } from "../../../lib/auth"
const CATS = ["Mass", "Sacrament", "Formation", "Ministry", "Youth", "Students", "Feast Day"]
const COLS = ["#7c4c2e", "#1565c0", "#2e7d32", "#6a1b9a", "#e65100", "#880e4f", "#c8a84b", "#8b0000"]
type Ev = {
  id: string
  title: string
  category: string
  date_display: string
  time_display: string
  location: string
  color: string
  is_recurring: boolean
  is_active: boolean
}
export function AdminEvents() {
  const { profile } = useAdmin()
  const [list, setList] = useState<Ev[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({ text: "", ok: true })
  const [form, setForm] = useState({
    title: "",
    category: "Mass",
    date_display: "",
    time_display: "",
    location: "",
    color: "#7c4c2e",
    is_recurring: false,
  })
  const [editing, setEditing] = useState<Ev | null>(null)
  useEffect(() => {
    load()
  }, [])
  async function load() {
    const { data } = await supabase.from("events").select("*").order("created_at", { ascending: false })
    if (data) setList(data)
    setLoading(false)
  }
  function notify(t: string, ok = true) {
    setMsg({ text: t, ok })
    setTimeout(() => setMsg({ text: "", ok: true }), 3500)
  }
  async function save() {
    if (!form.title.trim() || !form.date_display.trim()) return
    setSaving(true)
    if (editing) {
      await supabase.from("events").update({ ...form }).eq("id", editing.id)
      setEditing(null)
      notify("Updated.")
    } else {
      await supabase.from("events").insert({ ...form, is_active: true, created_by: profile?.id })
      notify("Event added.")
    }
    setForm({ title: "", category: "Mass", date_display: "", time_display: "", location: "", color: "#7c4c2e", is_recurring: false })
    load()
    setSaving(false)
  }
  async function toggleActive(id: string, v: boolean) {
    await supabase.from("events").update({ is_active: !v }).eq("id", id)
    load()
  }
  async function del(id: string) {
    if (!confirm("Delete?")) return
    await supabase.from("events").delete().eq("id", id)
    load()
  }
  function startEdit(e: Ev) {
    setEditing(e)
    setForm({
      title: e.title,
      category: e.category,
      date_display: e.date_display,
      time_display: e.time_display || "",
      location: e.location || "",
      color: e.color || "#7c4c2e",
      is_recurring: e.is_recurring,
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
    <div className="admin-page-wrap">
      <div style={{ background: "#fff", borderRadius: "14px", border: "0.5px solid #e0d0c0", padding: "24px", marginBottom: "28px" }}>
        <p style={{ fontSize: "13px", fontWeight: 600, color: "#3a1f13", margin: "0 0 16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: "4px", height: "16px", background: "#1565c0", borderRadius: "2px", display: "inline-block" }} />
          {editing ? "Edit event" : "Add event"}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
          <input style={inp} placeholder="Event title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
          <select style={inp} value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}>
            {CATS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input style={inp} placeholder="Date (e.g. Every Sunday)" value={form.date_display} onChange={(e) => setForm((p) => ({ ...p, date_display: e.target.value }))} />
          <input style={inp} placeholder="Time (e.g. 9:00 AM)" value={form.time_display} onChange={(e) => setForm((p) => ({ ...p, time_display: e.target.value }))} />
          <input style={inp} placeholder="Location (e.g. Main Church)" value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} />
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "12px", color: "#9e8070" }}>Colour:</span>
            {COLS.map((c) => (
              <div
                key={c}
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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#3a1f13", cursor: "pointer" }}>
            <input type="checkbox" checked={form.is_recurring} onChange={(e) => setForm((p) => ({ ...p, is_recurring: e.target.checked }))} />
            Recurring event
          </label>
          <div style={{ display: "flex", gap: "10px" }}>
            {editing && (
              <button
                onClick={() => {
                  setEditing(null)
                  setForm({ title: "", category: "Mass", date_display: "", time_display: "", location: "", color: "#7c4c2e", is_recurring: false })
                }}
                style={{ padding: "9px 18px", background: "#f0e8e0", color: "#7c4c2e", border: "none", borderRadius: "8px", fontSize: "13px", cursor: "pointer" }}
              >
                Cancel
              </button>
            )}
            <button
              onClick={save}
              disabled={saving || !form.title.trim() || !form.date_display.trim()}
              style={{
                padding: "10px 28px",
                background: saving ? "#5e8ecb" : "#1565c0",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {saving ? "Saving..." : editing ? "Update" : "Add event"}
            </button>
          </div>
        </div>
        {msg.text && (
          <div style={{ padding: "10px 14px", borderRadius: "8px", background: msg.ok ? "#eaf7ee" : "#fce4e4", fontSize: "13px", color: msg.ok ? "#2e7d32" : "#a32d2d" }}>
            {msg.text}
          </div>
        )}
      </div>
      {loading ? (
        <p style={{ color: "#9e8070", fontSize: "13px" }}>Loading...</p>
      ) : list.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px", color: "#9e8070" }}>No events yet.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {list.map((e) => (
            <div
              key={e.id}
              style={{
                background: "#fff",
                borderRadius: "12px",
                border: "0.5px solid #e0d0c0",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                opacity: e.is_active ? 1 : 0.6,
              }}
            >
              <div style={{ width: "4px", height: "48px", borderRadius: "2px", background: e.color, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "#3a1f13" }}>{e.title}</span>
                  <span style={{ fontSize: "10px", background: "#e3f2fd", color: "#1565c0", padding: "2px 8px", borderRadius: "10px" }}>{e.category}</span>
                  {e.is_recurring && <span style={{ fontSize: "10px", background: "#eaf7ee", color: "#2e7d32", padding: "2px 8px", borderRadius: "10px" }}>Recurring</span>}
                  {!e.is_active && <span style={{ fontSize: "10px", background: "#f0e8e0", color: "#9e8070", padding: "2px 8px", borderRadius: "10px" }}>Hidden</span>}
                </div>
                <p style={{ fontSize: "12px", color: "#9e8070", margin: 0 }}>
                  {e.date_display}
                  {e.time_display ? " · " + e.time_display : ""}
                  {e.location ? " · " + e.location : ""}
                </p>
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  onClick={() => startEdit(e)}
                  style={{ fontSize: "11px", padding: "5px 12px", borderRadius: "6px", border: "0.5px solid #b5d4f4", background: "#fff", cursor: "pointer", color: "#1565c0", fontWeight: 500 }}
                >
                  Edit
                </button>
                <button
                  onClick={() => toggleActive(e.id, e.is_active)}
                  style={{ fontSize: "11px", padding: "5px 12px", borderRadius: "6px", border: "0.5px solid #e0d0c0", background: "#fff", cursor: "pointer", color: "#9e8070", fontWeight: 500 }}
                >
                  {e.is_active ? "Hide" : "Show"}
                </button>
                <button
                  onClick={() => del(e.id)}
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
