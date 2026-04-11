
import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { isSupabaseConfigured, supabase } from "../../../lib/supabase"
import { Save, ExternalLink, Youtube, Facebook, Video, X } from "lucide-react"

export function AdminLivestream() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ text: "", ok: true })

  const [form, setForm] = useState({
    youtube_url: "",
    facebook_url: "",
    zoom_meeting_url: "",
    zoom_meeting_id: "",
    zoom_passcode: ""
  })

  function notify(text: string, ok = true) {
    setMessage({ text, ok })
    setTimeout(() => setMessage({ text: "", ok: true }), 3500)
  }

  useEffect(() => {
    const loadData = async () => {
      if (!isSupabaseConfigured) {
        notify("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env and restart the dev server.", false)
        return
      }
      try {
        const { data, error } = await supabase.from("livestream_config").select("*").maybeSingle()

        if (error) {
          notify(error.message || "Could not load livestream settings.", false)
          return
        }

        if (data) {
          setForm({
            youtube_url: data.youtube_url ?? "",
            facebook_url: data.facebook_url ?? "",
            zoom_meeting_url: data.zoom_meeting_url ?? "",
            zoom_meeting_id: data.zoom_meeting_id ?? "",
            zoom_passcode: data.zoom_passcode ?? "",
          })
        }
      } catch (error) {
        const msg =
          error instanceof DOMException && error.name === "AbortError"
            ? "Request timed out. Check your network and Supabase URL, then try again."
            : error instanceof Error
              ? error.message
              : "Could not load livestream settings."
        notify(msg, false)
        console.error("Livestream load error:", error)
      }
    }

    void loadData()
  }, [])

  async function saveConfig() {
    if (!isSupabaseConfigured) {
      notify("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env and restart the dev server.", false)
      return
    }

    setSaving(true)
    try {
      const emptyToNull = (v: string) => {
        const t = v.trim()
        return t === "" ? null : t
      }

      const row = {
        id: "main",
        youtube_url: emptyToNull(form.youtube_url),
        facebook_url: emptyToNull(form.facebook_url),
        zoom_meeting_url: emptyToNull(form.zoom_meeting_url),
        zoom_meeting_id: emptyToNull(form.zoom_meeting_id),
        zoom_passcode: emptyToNull(form.zoom_passcode),
        updated_at: new Date().toISOString(),
      }

      const supaUrl = (import.meta.env.VITE_SUPABASE_URL as string).replace(/\/$/, "")
      const supaKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string
      const raw = localStorage.getItem("stfrancis-admin-auth")
      const jwt = raw ? (() => { try { return JSON.parse(raw)?.access_token } catch { return null } })() ?? supaKey : supaKey
      const ctrl = new AbortController(); setTimeout(() => ctrl.abort(), 8000)
      const resp = await fetch(`${supaUrl}/rest/v1/livestream_config`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supaKey,
          Authorization: `Bearer ${jwt}`,
          Prefer: "resolution=merge-duplicates,return=representation",
        },
        body: JSON.stringify(row),
        signal: ctrl.signal,
      })
      if (!resp.ok) {
        const errText = await resp.text().catch(() => resp.statusText)
        notify(`Save failed (${resp.status}): ${errText}`, false)
        return
      }
      const saved = (await resp.json())[0]
      notify("Livestream configuration saved!")
      if (saved) {
        setForm({
          youtube_url: saved.youtube_url ?? "",
          facebook_url: saved.facebook_url ?? "",
          zoom_meeting_url: saved.zoom_meeting_url ?? "",
          zoom_meeting_id: saved.zoom_meeting_id ?? "",
          zoom_passcode: saved.zoom_passcode ?? "",
        })
      }
    } catch (error) {
      const msg =
        error instanceof DOMException && error.name === "AbortError"
          ? "Save timed out. Check your network, VPN, or Supabase project status, then try again."
          : error instanceof Error
            ? error.message
            : "An error occurred while saving."
      notify(msg, false)
    } finally {
      setSaving(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #e0d0c0",
    fontSize: "13px",
    width: "100%",
    boxSizing: "border-box" as any,
    outline: "none",
    background: "#fff",
    color: "#3a1f13"
  }

  const buttonStyle: React.CSSProperties = {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px"
  }

  const clearFieldStyle: React.CSSProperties = {
    flexShrink: 0,
    padding: "0 12px",
    borderRadius: "8px",
    border: "1px solid #e0d0c0",
    background: "#faf6f0",
    color: "#7c4c2e",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  }

  return (
    <div className="admin-page-wrap">
        {message.text && (
          <div style={{
            background: message.ok ? "#d4edda" : "#f8d7da",
            border: `1px solid ${message.ok ? "#c3e6cb" : "#f5c6cb"}`,
            color: message.ok ? "#155724" : "#721c24",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "20px",
            fontSize: "13px"
          }}>
            {message.text}
          </div>
        )}

        <div style={{ background: "#fff", borderRadius: "14px", border: "0.5px solid #e0d0c0", padding: "24px", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "#ff0000", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Youtube className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "#3a1f13" }}>YouTube Stream</h3>
              <p style={{ margin: 0, fontSize: "12px", color: "#7c4c2e" }}>Configure YouTube live stream URL</p>
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="admin-livestream-youtube_url"
              style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3a1f13", marginBottom: "8px" }}
            >
              YouTube Stream URL
            </label>
            <div style={{ display: "flex", gap: "8px", alignItems: "stretch" }}>
              <input
                id="admin-livestream-youtube_url"
                name="youtube_url"
                type="text"
                inputMode="url"
                autoComplete="off"
                placeholder="https://www.youtube.com/watch?v=… or /live/…"
                value={form.youtube_url}
                onChange={(e) => setForm({ ...form, youtube_url: e.target.value })}
                style={{ ...inputStyle, flex: 1, minWidth: 0 }}
              />
              {form.youtube_url.trim() !== "" && (
                <button
                  type="button"
                  aria-label="Clear YouTube URL"
                  title="Remove link"
                  onClick={() => setForm((f) => ({ ...f, youtube_url: "" }))}
                  style={clearFieldStyle}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {form.youtube_url && (
              <a 
                href={form.youtube_url} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  display: "inline-flex", 
                  alignItems: "center", 
                  gap: "6px", 
                  marginTop: "8px", 
                  fontSize: "12px", 
                  color: "#7c4c2e", 
                  textDecoration: "none" 
                }}
              >
                <ExternalLink className="h-3 w-3" />
                Test link
              </a>
            )}
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: "14px", border: "0.5px solid #e0d0c0", padding: "24px", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "#1877f2", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Facebook className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "#3a1f13" }}>Facebook Live</h3>
              <p style={{ margin: 0, fontSize: "12px", color: "#7c4c2e" }}>Configure Facebook live stream URL</p>
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="admin-livestream-facebook_url"
              style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3a1f13", marginBottom: "8px" }}
            >
              Facebook Live URL
            </label>
            <div style={{ display: "flex", gap: "8px", alignItems: "stretch" }}>
              <input
                id="admin-livestream-facebook_url"
                name="facebook_url"
                type="text"
                inputMode="url"
                autoComplete="off"
                placeholder="https://www.facebook.com/…"
                value={form.facebook_url}
                onChange={(e) => setForm({ ...form, facebook_url: e.target.value })}
                style={{ ...inputStyle, flex: 1, minWidth: 0 }}
              />
              {form.facebook_url.trim() !== "" && (
                <button
                  type="button"
                  aria-label="Clear Facebook URL"
                  title="Remove link"
                  onClick={() => setForm((f) => ({ ...f, facebook_url: "" }))}
                  style={clearFieldStyle}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {form.facebook_url && (
              <a 
                href={form.facebook_url} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  display: "inline-flex", 
                  alignItems: "center", 
                  gap: "6px", 
                  marginTop: "8px", 
                  fontSize: "12px", 
                  color: "#7c4c2e", 
                  textDecoration: "none" 
                }}
              >
                <ExternalLink className="h-3 w-3" />
                Test link
              </a>
            )}
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: "14px", border: "0.5px solid #e0d0c0", padding: "24px", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "#2d8cff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Video className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "#3a1f13" }}>Zoom Meeting</h3>
              <p style={{ margin: 0, fontSize: "12px", color: "#7c4c2e" }}>Configure Zoom meeting details</p>
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="admin-livestream-zoom_meeting_url"
              style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3a1f13", marginBottom: "8px" }}
            >
              Zoom Meeting URL
            </label>
            <div style={{ display: "flex", gap: "8px", alignItems: "stretch" }}>
              <input
                id="admin-livestream-zoom_meeting_url"
                name="zoom_meeting_url"
                type="text"
                inputMode="url"
                autoComplete="off"
                placeholder="https://zoom.us/j/…"
                value={form.zoom_meeting_url}
                onChange={(e) => setForm({ ...form, zoom_meeting_url: e.target.value })}
                style={{ ...inputStyle, flex: 1, minWidth: 0 }}
              />
              {form.zoom_meeting_url.trim() !== "" && (
                <button
                  type="button"
                  aria-label="Clear Zoom meeting URL"
                  title="Remove link"
                  onClick={() => setForm((f) => ({ ...f, zoom_meeting_url: "" }))}
                  style={clearFieldStyle}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div>
              <label
                htmlFor="admin-livestream-zoom_meeting_id"
                style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3a1f13", marginBottom: "8px" }}
              >
                Meeting ID
              </label>
              <div style={{ display: "flex", gap: "8px", alignItems: "stretch" }}>
                <input
                  id="admin-livestream-zoom_meeting_id"
                  name="zoom_meeting_id"
                  type="text"
                  autoComplete="off"
                  placeholder="123 456 789"
                  value={form.zoom_meeting_id}
                  onChange={(e) => setForm({ ...form, zoom_meeting_id: e.target.value })}
                  style={{ ...inputStyle, flex: 1, minWidth: 0 }}
                />
                {form.zoom_meeting_id.trim() !== "" && (
                  <button
                    type="button"
                    aria-label="Clear meeting ID"
                    title="Clear"
                    onClick={() => setForm((f) => ({ ...f, zoom_meeting_id: "" }))}
                    style={clearFieldStyle}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="admin-livestream-zoom_passcode"
                style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3a1f13", marginBottom: "8px" }}
              >
                Passcode
              </label>
              <div style={{ display: "flex", gap: "8px", alignItems: "stretch" }}>
                <input
                  id="admin-livestream-zoom_passcode"
                  name="zoom_passcode"
                  type="text"
                  autoComplete="off"
                  placeholder="123456"
                  value={form.zoom_passcode}
                  onChange={(e) => setForm({ ...form, zoom_passcode: e.target.value })}
                  style={{ ...inputStyle, flex: 1, minWidth: 0 }}
                />
                {form.zoom_passcode.trim() !== "" && (
                  <button
                    type="button"
                    aria-label="Clear passcode"
                    title="Clear"
                    onClick={() => setForm((f) => ({ ...f, zoom_passcode: "" }))}
                    style={clearFieldStyle}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {form.zoom_meeting_url && (
            <a 
              href={form.zoom_meeting_url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                display: "inline-flex", 
                alignItems: "center", 
                gap: "6px", 
                fontSize: "12px", 
                color: "#7c4c2e", 
                textDecoration: "none" 
              }}
            >
              <ExternalLink className="h-3 w-3" />
              Test link
            </a>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
          <button
            onClick={() => navigate("/admin")}
            style={{
              ...buttonStyle,
              background: "#e0d0c0",
              color: "#3a1f13"
            }}
          >
            Cancel
          </button>
          <button
            onClick={saveConfig}
            disabled={saving}
            style={{
              ...buttonStyle,
              background: saving ? "#a0a0a0" : "#7c4c2e",
              color: "#fff"
            }}
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Configuration"}
          </button>
        </div>
    </div>
  )
}
