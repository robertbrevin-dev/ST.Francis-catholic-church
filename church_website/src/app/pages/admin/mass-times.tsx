import { useState, useEffect } from "react"
import { supabase } from "../../../lib/supabase"
import { useAdmin } from "../../../lib/auth"
type Mass = { id: string; day_type: string; time: string; label: string; note: string; display_order: number; is_active: boolean }
export function AdminMassTimes() {
  const { profile } = useAdmin()
  const [list, setList] = useState<Mass[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({ text: "", ok: true })
  const [form, setForm] = useState({ day_type: "sunday", time: "", label: "", note: "", display_order: 0 })
  const [editing, setEditing] = useState<Mass | null>(null)
  const DAYS: Record<string, string> = {
    sunday: "Sunday",
    weekday: "Weekday (Mon–Fri)",
    saturday: "Saturday",
    special: "Special/Seasonal",
  }
  useEffect(() => {
    load()
  }, [])
  async function load() {
    const { data } = await supabase.from("mass_schedules").select("*").order("display_order")
    if (data) setList(data)
    setLoading(false)
  }
  function notify(t: string, ok = true) {
    setMsg({ text: t, ok })
    setTimeout(() => setMsg({ text: "", ok: true }), 3500)
  }
  async function save() {
    if (!form.time.trim() || !form.label.trim()) return
    setSaving(true)
    if (editing) {
      await supabase.from("mass_schedules").update({ ...form, updated_by: profile?.id, updated_at: new Date().toISOString() }).eq("id", editing.id)
      setEditing(null)
      notify("Updated.")
    } else {
      await supabase.from("mass_schedules").insert({ ...form, is_active: true, updated_by: profile?.id })
      notify("Added.")
    }
    setForm({ day_type: "sunday", time: "", label: "", note: "", display_order: 0 })
    load()
    setSaving(false)
  }
  async function toggleActive(id: string, v: boolean) {
    await supabase.from("mass_schedules").update({ is_active: !v }).eq("id", id)
    load()
  }
  async function del(id: string) {
    if (!confirm("Delete?")) return
    await supabase.from("mass_schedules").delete().eq("id", id)
    load()
  }
  function startEdit(m: Mass) {
    setEditing(m)
    setForm({ day_type: m.day_type, time: m.time, label: m.label, note: m.note || " ", display_order: m.display_order })
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
          <span style={{ width: "4px", height: "16px", background: "#2e7d32", borderRadius: "2px", display: "inline-block" }} />
          {editing ? "Edit entry" : "Add mass entry"}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
          <select style={inp} value={form.day_type} onChange={(e) => setForm((p) => ({ ...p, day_type: e.target.value }))}>
            {Object.entries(DAYS).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
          <input style={inp} placeholder="Time (e.g. 7:00 AM)" value={form.time} onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))} />
          <input style={inp} placeholder="Label (e.g. Main Sunday Mass)" value={form.label} onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))} />
          <input style={inp} placeholder="Note (optional)" value={form.note} onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))} />
        </div>
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          {editing && (
            <button
              onClick={() => {
                setEditing(null)
                setForm({ day_type: "sunday", time: "", label: "", note: "", display_order: 0 })
              }}
              style={{ padding: "9px 18px", background: "#f0e8e0", color: "#7c4c2e", border: "none", borderRadius: "8px", fontSize: "13px", cursor: "pointer" }}
            >
              Cancel
            </button>
          )}
          <button
            onClick={save}
            disabled={saving || !form.time.trim() || !form.label.trim()}
            style={{
              padding: "10px 28px",
              background: saving ? "#5a9e5a" : "#2e7d32",
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
      ) : (
        (["sunday", "weekday", "saturday", "special"] as const).map((day) => {
          const entries = list.filter((m) => m.day_type === day)
          if (!entries.length) return null
          return (
            <div key={day} style={{ marginBottom: "20px" }}>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "#2e7d32", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "10px" }}>{DAYS[day]}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {entries.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      background: "#fff",
                      borderRadius: "10px",
                      border: "0.5px solid #e0d0c0",
                      padding: "14px 18px",
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      opacity: m.is_active ? 1 : 0.6,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "18px", fontWeight: 700, color: "#2e7d32" }}>{m.time}</span>
                        <span style={{ fontSize: "13px", fontWeight: 500, color: "#3a1f13" }}>{m.label}</span>
                        {!m.is_active && <span style={{ fontSize: "10px", background: "#f0e8e0", color: "#9e8070", padding: "2px 8px", borderRadius: "10px" }}>Hidden</span>}
                      </div>
                      {m.note && <p style={{ fontSize: "11px", color: "#9e8070", margin: "3px 0 0" }}>{m.note}</p>}
                    </div>
                    <div style={{ display: "flex", gap: "6px" }}>
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
            </div>
          )
        })
      )}
    </div>
  )
}
