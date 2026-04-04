import { useState, useEffect } from "react"
import { supabase } from "../../../lib/supabase"
import { useAdmin } from "../../../lib/auth"
type Conf = { id: string; day: string; time_range: string; note: string; is_active: boolean }
export function AdminConfessions() {
  const { profile } = useAdmin()
  const [list, setList] = useState<Conf[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({ text: "", ok: true })
  const [form, setForm] = useState({ day: "", time_range: "", note: "" })
  const [editing, setEditing] = useState<Conf | null>(null)
  useEffect(() => {
    load()
  }, [])
  async function load() {
    const { data } = await supabase.from("confessions").select("*").order("id")
    if (data) setList(data)
    setLoading(false)
  }
  function notify(t: string, ok = true) {
    setMsg({ text: t, ok })
    setTimeout(() => setMsg({ text: "", ok: true }), 3500)
  }
  async function save() {
    if (!form.day.trim() || !form.time_range.trim()) return
    setSaving(true)
    if (editing) {
      await supabase.from("confessions").update({ ...form, updated_by: profile?.id, updated_at: new Date().toISOString() }).eq("id", editing.id)
      setEditing(null)
      notify("Updated.")
    } else {
      await supabase.from("confessions").insert({ ...form, is_active: true, updated_by: profile?.id })
      notify("Added.")
    }
    setForm({ day: "", time_range: "", note: "" })
    load()
    setSaving(false)
  }
  async function toggleActive(id: string, v: boolean) {
    await supabase.from("confessions").update({ is_active: !v }).eq("id", id)
    load()
  }
  async function del(id: string) {
    if (!confirm("Delete?")) return
    await supabase.from("confessions").delete().eq("id", id)
    load()
  }
  function startEdit(c: Conf) {
    setEditing(c)
    setForm({ day: c.day, time_range: c.time_range, note: c.note || "" })
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
          <span style={{ width: "4px", height: "16px", background: "#6a1b9a", borderRadius: "2px", display: "inline-block" }} />
          {editing ? "Edit entry" : "Add confession time"}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
          <input style={inp} placeholder="Day (e.g. Every Saturday)" value={form.day} onChange={(e) => setForm((p) => ({ ...p, day: e.target.value }))} />
          <input style={inp} placeholder="Time range (e.g. 4:00 PM – 5:30 PM)" value={form.time_range} onChange={(e) => setForm((p) => ({ ...p, time_range: e.target.value }))} />
        </div>
        <textarea style={{ ...inp, height: "80px", resize: "vertical", marginBottom: "14px" }} placeholder="Additional note (optional)" value={form.note} onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))} />
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          {editing && (
            <button
              onClick={() => {
                setEditing(null)
                setForm({ day: "", time_range: "", note: "" })
              }}
              style={{ padding: "9px 18px", background: "#f0e8e0", color: "#7c4c2e", border: "none", borderRadius: "8px", fontSize: "13px", cursor: "pointer" }}
            >
              Cancel
            </button>
          )}
          <button
            onClick={save}
            disabled={saving || !form.day.trim() || !form.time_range.trim()}
            style={{
              padding: "10px 28px",
              background: saving ? "#9c4dcc" : "#6a1b9a",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {saving ? "Saving..." : editing ? "Update" : "Add"}
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
        <div style={{ textAlign: "center", padding: "48px", color: "#9e8070" }}>No confession times yet.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {list.map((c) => (
            <div
              key={c.id}
              style={{
                background: "#fff",
                borderRadius: "12px",
                border: "0.5px solid #e0d0c0",
                padding: "18px 20px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                opacity: c.is_active ? 1 : 0.6,
              }}
            >
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#6a1b9a", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "3px" }}>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "#3a1f13" }}>{c.day}</span>
                  <span style={{ fontSize: "13px", color: "#6a1b9a", fontWeight: 500 }}>{c.time_range}</span>
                  {!c.is_active && <span style={{ fontSize: "10px", background: "#f0e8e0", color: "#9e8070", padding: "2px 8px", borderRadius: "10px" }}>Hidden</span>}
                </div>
                {c.note && <p style={{ fontSize: "12px", color: "#9e8070", margin: 0 }}>{c.note}</p>}
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  onClick={() => startEdit(c)}
                  style={{ fontSize: "11px", padding: "5px 12px", borderRadius: "6px", border: "0.5px solid #e1bee7", background: "#fff", cursor: "pointer", color: "#6a1b9a", fontWeight: 500 }}
                >
                  Edit
                </button>
                <button
                  onClick={() => toggleActive(c.id, c.is_active)}
                  style={{ fontSize: "11px", padding: "5px 12px", borderRadius: "6px", border: "0.5px solid #b5d4f4", background: "#fff", cursor: "pointer", color: "#1565c0", fontWeight: 500 }}
                >
                  {c.is_active ? "Hide" : "Show"}
                </button>
                <button
                  onClick={() => del(c.id)}
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
