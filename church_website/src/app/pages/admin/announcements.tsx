import { useState, useEffect } from "react"
import { supabase } from "../../../lib/supabase"
import { useAdmin } from "../../../lib/auth"
const CATS = ["General", "Mass", "Sacraments", "Finance", "Community", "Events"]
const COLS = ["#7c4c2e", "#2e7d32", "#1565c0", "#6a1b9a", "#e65100", "#c8a84b", "#880e4f", "#8b0000"]
type Ann = {
  id: string
  title: string
  content: string
  display_date: string
  category: string
  color: string
  pinned: boolean
  is_active: boolean
  created_at: string
  expires_at: string
}
export function AdminAnnouncements() {
  const { profile } = useAdmin()
  const [list, setList] = useState<Ann[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({ text: "", ok: true })
  const [form, setForm] = useState({
    title: "",
    content: "",
    display_date: "",
    category: "General",
    color: "#7c4c2e",
    pinned: false,
  })
  useEffect(() => {
    load()
  }, [])
  async function load() {
    const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false })
    if (data) setList(data)
    setLoading(false)
  }
  function notify(text: string, ok = true) {
    setMsg({ text, ok })
    setTimeout(() => setMsg({ text: "", ok: true }), 3500)
  }
  async function post() {
    if (!form.title.trim() || !form.content.trim()) return
    setSaving(true)
    const { error } = await supabase.from("announcements").insert({ ...form, author_id: profile?.id, is_active: true })
    if (!error) {
      setForm({ title: "", content: "", display_date: "", category: "General", color: "#7c4c2e", pinned: false })
      notify("Announcement posted.")
      load()
    } else notify("Failed to post.", false)
    setSaving(false)
  }
  async function togglePin(id: string, v: boolean) {
    await supabase.from("announcements").update({ pinned: !v }).eq("id", id)
    load()
  }
  async function toggleActive(id: string, v: boolean) {
    await supabase.from("announcements").update({ is_active: !v }).eq("id", id)
    load()
  }
  async function del(id: string) {
    if (!confirm("Delete this announcement?")) return
    await supabase.from("announcements").delete().eq("id", id)
    load()
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
        <p
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#3a1f13",
            margin: "0 0 16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ width: "4px", height: "16px", background: "#7c4c2e", borderRadius: "2px", display: "inline-block" }} />
          New announcement
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
          <input style={inp} placeholder="Announcement title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
          <input
            style={inp}
            placeholder="Display date (e.g. Sunday 6th April)"
            value={form.display_date}
            onChange={(e) => setForm((p) => ({ ...p, display_date: e.target.value }))}
          />
        </div>
        <textarea
          style={{ ...inp, height: "110px", resize: "vertical", marginBottom: "14px" }}
          placeholder="Full announcement content..."
          value={form.content}
          onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap", marginBottom: "16px" }}>
          <select style={{ ...inp, width: "auto" }} value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}>
            {CATS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
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
          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#3a1f13", cursor: "pointer" }}>
            <input type="checkbox" checked={form.pinned} onChange={(e) => setForm((p) => ({ ...p, pinned: e.target.checked }))} />
            Pin to top
          </label>
          <button
            onClick={post}
            disabled={saving || !form.title.trim() || !form.content.trim()}
            style={{
              marginLeft: "auto",
              padding: "10px 28px",
              background: saving || !form.title.trim() || !form.content.trim() ? "#b08060" : "#7c4c2e",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {saving ? "Posting..." : "Post announcement"}
          </button>
        </div>
        {msg.text && (
          <div style={{ padding: "10px 14px", borderRadius: "8px", background: msg.ok ? "#eaf7ee" : "#fce4e4", fontSize: "13px", color: msg.ok ? "#2e7d32" : "#a32d2d" }}>
            {msg.text}
          </div>
        )}
      </div>
      <p style={{ fontSize: "11px", fontWeight: 600, color: "#9e8070", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "14px" }}>
        {list.length} announcement{list.length !== 1 ? "s" : ""}
      </p>
      {loading ? (
        <p style={{ color: "#9e8070", fontSize: "13px" }}>Loading...</p>
      ) : list.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px", color: "#9e8070", fontSize: "14px" }}>No announcements yet. Post your first one above.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {list.map((a) => (
            <div
              key={a.id}
              style={{
                background: "#fff",
                borderRadius: "12px",
                border: "0.5px solid #e8ddd5",
                padding: "18px 20px",
                display: "flex",
                alignItems: "flex-start",
                gap: "14px",
                opacity: a.is_active ? 1 : 0.6,
              }}
            >
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: a.color, flexShrink: 0, marginTop: "3px" }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "#3a1f13" }}>{a.title}</span>
                  {a.pinned && <span style={{ fontSize: "10px", background: "#7c4c2e", color: "#fff", padding: "2px 8px", borderRadius: "10px" }}>Pinned</span>}
                  {!a.is_active && <span style={{ fontSize: "10px", background: "#f0e8e0", color: "#9e8070", padding: "2px 8px", borderRadius: "10px" }}>Hidden</span>}
                  <span style={{ fontSize: "11px", background: "#f0e8e0", color: "#7c4c2e", padding: "2px 8px", borderRadius: "10px" }}>{a.category}</span>
                </div>
                <p style={{ fontSize: "11px", color: "#9e8070", margin: "0 0 6px" }}>
                  {a.display_date ? a.display_date + " · " : ""} Expires {new Date(a.expires_at).toLocaleDateString()}
                </p>
                <p style={{ fontSize: "12px", color: "#666", margin: 0, whiteSpace: "pre-line", lineHeight: 1.5 }}>
                  {a.content.slice(0, 140)}
                  {a.content.length > 140 ? "..." : ""}
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", flexShrink: 0 }}>
                <button
                  onClick={() => togglePin(a.id, a.pinned)}
                  style={{ fontSize: "11px", padding: "5px 12px", borderRadius: "6px", border: "0.5px solid #e0d0c0", background: "#fff", cursor: "pointer", color: "#7c4c2e", fontWeight: 500 }}
                >
                  {a.pinned ? "Unpin" : "Pin"}
                </button>
                <button
                  onClick={() => toggleActive(a.id, a.is_active)}
                  style={{ fontSize: "11px", padding: "5px 12px", borderRadius: "6px", border: "0.5px solid #b5d4f4", background: "#fff", cursor: "pointer", color: "#1565c0", fontWeight: 500 }}
                >
                  {a.is_active ? "Hide" : "Show"}
                </button>
                <button
                  onClick={() => del(a.id)}
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
