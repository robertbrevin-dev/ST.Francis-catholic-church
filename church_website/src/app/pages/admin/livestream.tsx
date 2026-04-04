
import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { supabase } from "../../../lib/supabase"
import { Save, ExternalLink, Youtube, Facebook, Video } from "lucide-react"

type StreamConfig = {
  id: string
  youtube_url: string
  facebook_url: string
  zoom_meeting_url: string
  zoom_meeting_id: string
  zoom_passcode: string
  created_at: string
  updated_at: string
}

export function AdminLivestream() {
  const navigate = useNavigate()
  const [config, setConfig] = useState<StreamConfig | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ text: "", ok: true })

  const [form, setForm] = useState({
    youtube_url: "",
    facebook_url: "",
    zoom_meeting_url: "",
    zoom_meeting_id: "",
    zoom_passcode: ""
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data, error } = await supabase
          .from("livestream_config")
          .select("*")
          .single()

        if (data && !error) {
          setConfig(data)
          setForm({
            youtube_url: data.youtube_url || "",
            facebook_url: data.facebook_url || "",
            zoom_meeting_url: data.zoom_meeting_url || "",
            zoom_meeting_id: data.zoom_meeting_id || "",
            zoom_passcode: data.zoom_passcode || ""
          })
        }
      } catch (error) {
        console.error('Background load error:', error)
      }
    }
    
    loadData()
  }, [])

  function notify(text: string, ok = true) {
    setMessage({ text, ok })
    setTimeout(() => setMessage({ text: "", ok: true }), 3500)
  }

  async function saveConfig() {
    setSaving(true)
    try {
      const { error } = await supabase
        .from("livestream_config")
        .upsert({
          id: config?.id || 'main',
          ...form,
          updated_at: new Date().toISOString()
        })

      if (error) {
        notify("Failed to save configuration.", false)
      } else {
        notify("Livestream configuration updated successfully!")
        // Reload the data in background
        const loadData = async () => {
          try {
            const { data, error } = await supabase
              .from("livestream_config")
              .select("*")
              .single()

            if (data && !error) {
              setConfig(data)
            }
          } catch (error) {
            console.error('Background load error:', error)
          }
        }
        loadData()
      }
    } catch (error) {
      notify("An error occurred while saving.", false)
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

  // Removed loading check - page loads immediately

  return (
    <div className="admin-page-wrap">
        {/* Message */}
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

        {/* YouTube Configuration */}
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
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3a1f13", marginBottom: "8px" }}>
              YouTube Stream URL
            </label>
            <input
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              value={form.youtube_url}
              onChange={(e) => setForm({ ...form, youtube_url: e.target.value })}
              style={inputStyle}
            />
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

        {/* Facebook Configuration */}
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
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3a1f13", marginBottom: "8px" }}>
              Facebook Live URL
            </label>
            <input
              type="url"
              placeholder="https://facebook.com/..."
              value={form.facebook_url}
              onChange={(e) => setForm({ ...form, facebook_url: e.target.value })}
              style={inputStyle}
            />
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

        {/* Zoom Configuration */}
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
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3a1f13", marginBottom: "8px" }}>
              Zoom Meeting URL
            </label>
            <input
              type="url"
              placeholder="https://zoom.us/j/..."
              value={form.zoom_meeting_url}
              onChange={(e) => setForm({ ...form, zoom_meeting_url: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3a1f13", marginBottom: "8px" }}>
                Meeting ID
              </label>
              <input
                type="text"
                placeholder="123 456 789"
                value={form.zoom_meeting_id}
                onChange={(e) => setForm({ ...form, zoom_meeting_id: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3a1f13", marginBottom: "8px" }}>
                Passcode
              </label>
              <input
                type="text"
                placeholder="123456"
                value={form.zoom_passcode}
                onChange={(e) => setForm({ ...form, zoom_passcode: e.target.value })}
                style={inputStyle}
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

        {/* Save Button */}
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
