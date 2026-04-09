
import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { isSupabaseConfigured, supabase } from "../../../lib/supabase"
import { normalizeExternalUrl } from "../../../lib/livestreamEmbed"
import { Save, ExternalLink, Youtube, Facebook, Video, X } from "lucide-react"
import { toast } from "sonner"

export function AdminLivestream() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ text: "", ok: true })
  const [quickLink, setQuickLink] = useState("")

  function handleQuickPost(url: string) {
    const link = url.trim().replace(/^`|`$/g, "").trim()
    if (!link) return

    if (link.includes("youtube.com") || link.includes("youtu.be")) {
      setForm((f) => ({ ...f, youtube_url: link }))
      notify("YouTube link detected and added!")
    } else if (link.includes("facebook.com") || link.includes("fb.watch")) {
      setForm((f) => ({ ...f, facebook_url: link }))
      notify("Facebook link detected and added!")
    } else if (link.includes("zoom.us")) {
      setForm((f) => ({ ...f, zoom_meeting_url: link }))
      notify("Zoom link detected and added!")
    } else {
      notify("Unknown link type. Please paste directly into the specific platform field.", false)
    }
    setQuickLink("")
  }

  const [form, setForm] = useState({
    youtube_url: "",
    youtube_title: "",
    youtube_description: "",
    youtube_poster_url: "",
    facebook_url: "",
    facebook_title: "",
    facebook_description: "",
    facebook_poster_url: "",
    zoom_meeting_url: "",
    zoom_meeting_id: "",
    zoom_passcode: "",
    zoom_title: "",
    zoom_description: "",
    zoom_poster_url: ""
  })

  function notify(text: string, ok = true) {
    if (ok) {
      toast.success(text)
    } else {
      toast.error(text)
    }
    setMessage({ text, ok })
    setTimeout(() => setMessage({ text: "", ok: true }), 3500)
  }

  useEffect(() => {
    const loadData = async () => {
      if (!isSupabaseConfigured) {
        notify("Supabase is not configured. Add VITE_SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and VITE_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY) to .env and restart the dev server.", false)
        return
      }
      try {
        const { data, error } = await supabase
          .from("livestream_config")
          .select("*")
          .eq("id", "main")
          .maybeSingle()

        if (error) {
          notify(error.message || "Could not load livestream settings.", false)
          console.error("Supabase fetch error:", error.message || error)
          return
        }

        if (data) {
          setForm({
            youtube_url: data.youtube_url ?? "",
            youtube_title: data.youtube_title ?? "",
            youtube_description: data.youtube_description ?? "",
            youtube_poster_url: data.youtube_poster_url ?? "",
            facebook_url: data.facebook_url ?? "",
            facebook_title: data.facebook_title ?? "",
            facebook_description: data.facebook_description ?? "",
            facebook_poster_url: data.facebook_poster_url ?? "",
            zoom_meeting_url: data.zoom_meeting_url ?? "",
            zoom_meeting_id: data.zoom_meeting_id ?? "",
            zoom_passcode: data.zoom_passcode ?? "",
            zoom_title: data.zoom_title ?? "",
            zoom_description: data.zoom_description ?? "",
            zoom_poster_url: data.zoom_poster_url ?? "",
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
    console.log("Attempting to save livestream configuration...", form)
    if (!isSupabaseConfigured) {
      notify("Supabase is not configured. Add VITE_SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and VITE_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY) to .env and restart the dev server.", false)
      return
    }

    setSaving(true)
    try {
      const emptyToNull = (v: string) => {
        const t = v.trim().replace(/^`|`$/g, "").trim()
        return t === "" ? null : t
      }

      const row = {
        id: "main",
        youtube_url: emptyToNull(normalizeExternalUrl(form.youtube_url)),
        youtube_title: emptyToNull(form.youtube_title),
        youtube_description: emptyToNull(form.youtube_description),
        youtube_poster_url: emptyToNull(normalizeExternalUrl(form.youtube_poster_url)),
        facebook_url: emptyToNull(normalizeExternalUrl(form.facebook_url)),
        facebook_title: emptyToNull(form.facebook_title),
        facebook_description: emptyToNull(form.facebook_description),
        facebook_poster_url: emptyToNull(normalizeExternalUrl(form.facebook_poster_url)),
        zoom_meeting_url: emptyToNull(normalizeExternalUrl(form.zoom_meeting_url)),
        zoom_meeting_id: emptyToNull(form.zoom_meeting_id),
        zoom_passcode: emptyToNull(form.zoom_passcode),
        zoom_title: emptyToNull(form.zoom_title),
        zoom_description: emptyToNull(form.zoom_description),
        zoom_poster_url: emptyToNull(normalizeExternalUrl(form.zoom_poster_url)),
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from("livestream_config")
        .upsert(row, { onConflict: "id" })
        .select("*")
        .maybeSingle()

      if (error) {
        console.error("Supabase upsert error:", error)
        const code = (error as { code?: string }).code
        const message = (error.message || "").toLowerCase()
        if (code === "42501") {
          notify("You are signed in, but your account is not allowed to edit livestream settings. Ask an admin to add your user in admin_profiles.", false)
        } else if (code === "42703" || message.includes("column") || message.includes("does not exist")) {
          notify("Database schema is outdated. Run church_website/database/livestream_config.sql in Supabase SQL editor, then try again.", false)
        } else {
          notify(error.message || "Failed to save configuration.", false)
        }
        return
      }

      notify("Livestream configuration updated successfully!")
      if (data) {
        setForm({
          youtube_url: data.youtube_url ?? "",
          youtube_title: data.youtube_title ?? "",
          youtube_description: data.youtube_description ?? "",
          youtube_poster_url: data.youtube_poster_url ?? "",
          facebook_url: data.facebook_url ?? "",
          facebook_title: data.facebook_title ?? "",
          facebook_description: data.facebook_description ?? "",
          facebook_poster_url: data.facebook_poster_url ?? "",
          zoom_meeting_url: data.zoom_meeting_url ?? "",
          zoom_meeting_id: data.zoom_meeting_id ?? "",
          zoom_passcode: data.zoom_passcode ?? "",
          zoom_title: data.zoom_title ?? "",
          zoom_description: data.zoom_description ?? "",
          zoom_poster_url: data.zoom_poster_url ?? "",
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

        <div style={{ background: "#fdf8f2", borderRadius: "14px", border: "1px dashed #d6bda4", padding: "20px", marginBottom: "24px" }}>
          <h3 style={{ margin: "0 0 12px 0", fontSize: "15px", fontWeight: 700, color: "#6e3c28" }}>
            Quick Link Post
          </h3>
          <p style={{ margin: "0 0 16px 0", fontSize: "12px", color: "#8d5439" }}>
            Paste any YouTube, Facebook, or Zoom link here. The system will automatically detect and place it in the correct field below.
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              placeholder="Paste link here (YouTube, Facebook, or Zoom)..."
              value={quickLink}
              onChange={(e) => setQuickLink(e.target.value)}
              style={{ ...inputStyle, flex: 1 }}
              onKeyDown={(e) => e.key === "Enter" && handleQuickPost(quickLink)}
            />
            <button
              onClick={() => handleQuickPost(quickLink)}
              style={{ ...buttonStyle, background: "#8d5439", color: "#fff" }}
            >
              Detect & Add
            </button>
          </div>
        </div>

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

          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="admin-livestream-youtube_title"
              style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3a1f13", marginBottom: "8px" }}
            >
              Stream Title (Optional)
            </label>
            <input
              id="admin-livestream-youtube_title"
              name="youtube_title"
              type="text"
              placeholder="e.g. Sunday Morning Mass"
              value={form.youtube_title}
              onChange={(e) => setForm({ ...form, youtube_title: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="admin-livestream-youtube_poster_url"
              style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3a1f13", marginBottom: "8px" }}
            >
              Custom Poster Image URL (Optional)
            </label>
            <input
              id="admin-livestream-youtube_poster_url"
              name="youtube_poster_url"
              type="text"
              inputMode="url"
              placeholder="https://example.com/poster.jpg"
              value={form.youtube_poster_url}
              onChange={(e) => setForm({ ...form, youtube_poster_url: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "0" }}>
            <label
              htmlFor="admin-livestream-youtube_description"
              style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3a1f13", marginBottom: "8px" }}
            >
              Stream Description / Explanation
            </label>
            <textarea
              id="admin-livestream-youtube_description"
              name="youtube_description"
              placeholder="Provide a small explanation about this stream..."
              value={form.youtube_description}
              onChange={(e) => setForm({ ...form, youtube_description: e.target.value })}
              style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
            />
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

          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="admin-livestream-facebook_title"
              style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3a1f13", marginBottom: "8px" }}
            >
              Stream Title (Optional)
            </label>
            <input
              id="admin-livestream-facebook_title"
              name="facebook_title"
              type="text"
              placeholder="e.g. Sunday Morning Mass"
              value={form.facebook_title}
              onChange={(e) => setForm({ ...form, facebook_title: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="admin-livestream-facebook_poster_url"
              style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3a1f13", marginBottom: "8px" }}
            >
              Custom Poster Image URL (Optional)
            </label>
            <input
              id="admin-livestream-facebook_poster_url"
              name="facebook_poster_url"
              type="text"
              inputMode="url"
              placeholder="https://example.com/poster.jpg"
              value={form.facebook_poster_url}
              onChange={(e) => setForm({ ...form, facebook_poster_url: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "0" }}>
            <label
              htmlFor="admin-livestream-facebook_description"
              style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3a1f13", marginBottom: "8px" }}
            >
              Stream Description / Explanation
            </label>
            <textarea
              id="admin-livestream-facebook_description"
              name="facebook_description"
              placeholder="Provide a small explanation about this stream..."
              value={form.facebook_description}
              onChange={(e) => setForm({ ...form, facebook_description: e.target.value })}
              style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
            />
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

          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="admin-livestream-zoom_title"
              style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3a1f13", marginBottom: "8px" }}
            >
              Meeting Title (Optional)
            </label>
            <input
              id="admin-livestream-zoom_title"
              name="zoom_title"
              type="text"
              placeholder="e.g. Wednesday Bible Study"
              value={form.zoom_title}
              onChange={(e) => setForm({ ...form, zoom_title: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="admin-livestream-zoom_poster_url"
              style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3a1f13", marginBottom: "8px" }}
            >
              Custom Poster Image URL (Optional)
            </label>
            <input
              id="admin-livestream-zoom_poster_url"
              name="zoom_poster_url"
              type="text"
              inputMode="url"
              placeholder="https://example.com/poster.jpg"
              value={form.zoom_poster_url}
              onChange={(e) => setForm({ ...form, zoom_poster_url: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "0" }}>
            <label
              htmlFor="admin-livestream-zoom_description"
              style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3a1f13", marginBottom: "8px" }}
            >
              Meeting Description / Explanation
            </label>
            <textarea
              id="admin-livestream-zoom_description"
              name="zoom_description"
              placeholder="Provide a small explanation about this meeting..."
              value={form.zoom_description}
              onChange={(e) => setForm({ ...form, zoom_description: e.target.value })}
              style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
            />
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
