import { useState, useEffect } from "react"
import { supabase } from "../../../lib/supabase"
import { useAdmin } from "../../../lib/auth"

type ScheduleEntry = { day: string; times: string[] }
type Service = {
  id: string
  slug: string
  title: string
  subtitle: string
  description: string
  schedule: ScheduleEntry[] | null
  note: string
  color: string
  is_active: boolean
}

function parseScheduleText(text: string): ScheduleEntry[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const i = line.indexOf("|")
      if (i === -1) return { day: line, times: [] }
      const day = line.slice(0, i).trim()
      const rest = line.slice(i + 1).trim()
      const times = rest ? rest.split(",").map((t) => t.trim()).filter(Boolean) : []
      return { day, times }
    })
}

function formatScheduleText(sched: unknown): string {
  if (!Array.isArray(sched)) return ""
  return (sched as ScheduleEntry[])
    .map((s) => `${s.day}|${(s.times || []).join(", ")}`)
    .join("\n")
}
export function AdminServices() {
  const { profile } = useAdmin()
  const [list, setList] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({ text: "", ok: true })
  const [editing, setEditing] = useState<Service | null>(null)
  const [form, setForm] = useState({ slug: "", title: "", subtitle: "", description: "", note: "", schedule_text: "", color: "#7c4c2e" })
  const COLS = ["#7c4c2e", "#1565c0", "#6a1b9a", "#bf360c", "#2e7d32", "#880e4f", "#c8a84b", "#e65100"]
  useEffect(() => {
    load()
  }, [])
  async function load() {
    const { data } = await supabase.from("services").select("*").order("title")
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
    const schedule = parseScheduleText(form.schedule_text)
    const payload = {
      slug: form.slug,
      title: form.title,
      subtitle: form.subtitle,
      description: form.description,
      note: form.note,
      color: form.color,
      schedule,
      is_active: true,
      updated_by: profile?.id,
      updated_at: new Date().toISOString(),
    }
    if (editing) {
      await supabase.from("services").update(payload).eq("id", editing.id)
      setEditing(null)
      notify("Updated.")
    } else {
      await supabase.from("services").insert(payload)
      notify("Sacrament added.")
    }
    setForm({ slug: "", title: "", subtitle: "", description: "", note: "", schedule_text: "", color: "#7c4c2e" })
    load()
    setSaving(false)
  }
  async function toggleActive(id: string, v: boolean) {
    await supabase.from("services").update({ is_active: !v }).eq("id", id)
    load()
  }
  async function del(id: string) {
    if (!confirm("Delete?")) return
    await supabase.from("services").delete().eq("id", id)
    load()
  }
  function startEdit(s: Service) {
    setEditing(s)
    setForm({
      slug: s.slug,
      title: s.title,
      subtitle: s.subtitle || "",
      description: s.description,
      note: s.note || "",
      schedule_text: formatScheduleText(s.schedule),
      color: s.color || "#7c4c2e",
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
          <span style={{ width: "4px", height: "16px", background: "#bf360c", borderRadius: "2px", display: "inline-block" }} />
          {editing ? "Edit sacrament" : "Add sacrament"}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
          <input style={inp} placeholder="Slug (e.g. baptism)" value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} />
          <input style={inp} placeholder="Title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
          <input style={inp} placeholder="Subtitle" value={form.subtitle} onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))} />
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
        <p style={{ fontSize: "11px", color: "#9e8070", margin: "0 0 6px" }}>
          Schedule: one line per row, format <strong>Day or heading|time 1, time 2</strong> (e.g. Sunday|7:00 AM, 9:00 AM)
        </p>
        <textarea
          style={{ ...inp, height: "100px", resize: "vertical", marginBottom: "12px" }}
          placeholder={"Sunday|7:00 AM, 9:00 AM\nMonday – Friday|6:30 AM"}
          value={form.schedule_text}
          onChange={(e) => setForm((p) => ({ ...p, schedule_text: e.target.value }))}
        />
        <textarea style={{ ...inp, height: "70px", resize: "vertical", marginBottom: "16px" }} placeholder="Important note for parishioners (optional)" value={form.note} onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))} />
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          {editing && (
            <button
              onClick={() => {
                setEditing(null)
                setForm({ slug: "", title: "", subtitle: "", description: "", note: "", schedule_text: "", color: "#7c4c2e" })
              }}
              style={{ padding: "9px 18px", background: "#f0e8e0", color: "#7c4c2e", border: "none", borderRadius: "8px", fontSize: "13px", cursor: "pointer" }}
            >
              Cancel
            </button>
          )}
          <button
            onClick={save}
            disabled={saving || !form.title.trim() || !form.description.trim()}
            style={{ padding: "10px 28px", background: saving ? "#e57373" : "#bf360c", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}
          >
            {saving ? "Saving..." : editing ? "Update" : "Add sacrament"}
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
        <div style={{ textAlign: "center", padding: "48px", color: "#9e8070" }}>No sacraments yet.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {list.map((s) => (
            <div
              key={s.id}
              style={{
                background: "#fff",
                borderRadius: "12px",
                border: "0.5px solid #e0d0c0",
                padding: "16px 20px",
                display: "flex",
                alignItems: "flex-start",
                gap: "14px",
                opacity: s.is_active ? 1 : 0.6,
              }}
            >
              <div style={{ width: "4px", height: "48px", borderRadius: "2px", background: s.color, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "#3a1f13" }}>{s.title}</span>
                  {s.subtitle && <span style={{ fontSize: "11px", color: "#9e8070" }}>{s.subtitle}</span>}
                  {!s.is_active && <span style={{ fontSize: "10px", background: "#f0e8e0", color: "#9e8070", padding: "2px 8px", borderRadius: "10px" }}>Hidden</span>}
                </div>
                <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
                  {s.description.slice(0, 100)}
                  {s.description.length > 100 ? "..." : ""}
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", flexShrink: 0 }}>
                <button
                  onClick={() => startEdit(s)}
                  style={{ fontSize: "11px", padding: "5px 12px", borderRadius: "6px", border: "0.5px solid #ffccbc", background: "#fff", cursor: "pointer", color: "#bf360c", fontWeight: 500 }}
                >
                  Edit
                </button>
                <button
                  onClick={() => toggleActive(s.id, s.is_active)}
                  style={{ fontSize: "11px", padding: "5px 12px", borderRadius: "6px", border: "0.5px solid #b5d4f4", background: "#fff", cursor: "pointer", color: "#1565c0", fontWeight: 500 }}
                >
                  {s.is_active ? "Hide" : "Show"}
                </button>
                <button
                  onClick={() => del(s.id)}
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
