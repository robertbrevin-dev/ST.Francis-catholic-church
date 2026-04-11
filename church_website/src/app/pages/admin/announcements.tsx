import { useState, useEffect } from "react"
import { supabase, isSupabaseConfigured, getSupabaseConnectionInfo, pingSupabaseRest } from "../../../lib/supabase"
import { useAdmin } from "../../../lib/auth"
import { withTimeout } from "../../../lib/withTimeout"
import {
  defaultExpiryDateInput,
  endOfDayIsoFromDateInput,
  uploadPosterAndLinkToAnnouncement,
  removeAnnouncementPosterFromStorage,
} from "../../../lib/announcements"

function newAnnouncementId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID()
  throw new Error("This browser cannot create row IDs (needs crypto.randomUUID).")
}

const CATS = ["General", "Mass", "Sacraments", "Finance", "Community", "Events"]
const COLS = ["#7c4c2e", "#2e7d32", "#1565c0", "#6a1b9a", "#e65100", "#c8a84b", "#880e4f", "#8b0000"]
const POSTER_MAX_BYTES = 6 * 1024 * 1024

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
  poster_url: string | null
}

export function AdminAnnouncements() {
  const { profile, session } = useAdmin()
  const [list, setList] = useState<Ann[]>([])
  const [loading, setLoading] = useState(true)
  const [listError, setListError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({ text: "", ok: true })
  const [diag, setDiag] = useState<string | null>(null)
  const [diagBusy, setDiagBusy] = useState(false)
  const [form, setForm] = useState({
    title: "",
    content: "",
    display_date: "",
    category: "General",
    color: "#7c4c2e",
    pinned: false,
    expires_date: defaultExpiryDateInput(),
  })
  const [posterFile, setPosterFile] = useState<File | null>(null)
  const [posterPreviewUrl, setPosterPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    return () => {
      if (posterPreviewUrl) URL.revokeObjectURL(posterPreviewUrl)
    }
  }, [posterPreviewUrl])

  async function load() {
    setListError(null)
    setLoading(true)
    try {
      const supaUrl=(import.meta.env.VITE_SUPABASE_URL as string).replace(/\/$/,"")
      const supaKey=import.meta.env.VITE_SUPABASE_ANON_KEY as string
      const raw=localStorage.getItem("stfrancis-admin-auth")
      const jwt=raw?(()=>{try{return JSON.parse(raw)?.access_token}catch{return null}})()??supaKey:supaKey
      const ctrl=new AbortController()
      setTimeout(()=>ctrl.abort(),8000)
      const resp=await fetch(supaUrl+"/rest/v1/announcements?select=*&order=created_at.desc",{headers:{apikey:supaKey,Authorization:"Bearer "+jwt},signal:ctrl.signal})
      if(!resp.ok){setListError("Load failed: HTTP "+resp.status);setList([]);return}
      setList(await resp.json() as Ann[])
    }catch(e){setListError(e instanceof Error?e.message:String(e));setList([])}
    finally{setLoading(false)}
  }

  async function runConnectionCheck() {
    setDiagBusy(true)
    setDiag(null)
    const lines: string[] = []
    try {
      const conn = getSupabaseConnectionInfo()
      lines.push(`Supabase URL host: ${conn.host || "(invalid)"}`)
      const ping = await pingSupabaseRest()
      lines.push(ping.ok ? `REST reachability: ${ping.detail}` : `REST reachability: FAIL - ${ping.detail}`)
      const { data: sess } = await supabase.auth.getSession()
      lines.push(`Auth session: ${sess.session?.user?.id ? "yes (" + sess.session.user.email + ")" : "NO - sign in again"}`)
      lines.push(`Admin profile id: ${profile?.id ?? "missing"}`)
      const { error: e1, count } = await withTimeout(
        supabase.from("announcements").select("*", { count: "exact", head: true }),
        12_000,
        "Count query timed out.",
      )
      lines.push(e1 ? `announcements count error: ${e1.message}` : `announcements table: readable (count=${count ?? "?"})`)
      const { error: e2 } = await withTimeout(
        supabase.storage.from("announcement-posters").list("", { limit: 1 }),
        12_000,
        "Storage list timed out.",
      )
      lines.push(e2 ? `storage announcement-posters: ${e2.message}` : "storage announcement-posters: list OK")
    } catch (e) {
      lines.push(e instanceof Error ? e.message : String(e))
    }
    setDiag(lines.join("\n"))
    setDiagBusy(false)
  }

  function notify(text: string, ok = true) {
    setMsg({ text, ok })
    setTimeout(() => setMsg({ text: "", ok: true }), 4500)
  }

  function onPosterPick(file: File | null) {
    setPosterPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return file ? URL.createObjectURL(file) : null
    })
    setPosterFile(file)
  }

  async function post() {
    if (!form.title.trim() || !form.content.trim()) return
    if (!isSupabaseConfigured) {
      notify("Supabase is not configured (.env).", false)
      return
    }
    if (!session?.user) {
      notify("You are not signed in. Please sign out and sign back in.", false)
      return
    }

    if (posterFile) {
      if (posterFile.size > POSTER_MAX_BYTES) {
        notify("Poster must be 6MB or smaller.", false)
        return
      }
      if (!posterFile.type.startsWith("image/")) {
        notify("Poster must be an image (JPEG, PNG, or WebP).", false)
        return
      }
    }

    setSaving(true)
    try {
      const newId = newAnnouncementId()
      const expires_at = endOfDayIsoFromDateInput(form.expires_date)
      const baseRow: Record<string, unknown> = {
        id: newId,
        title: form.title.trim(),
        content: form.content.trim(),
        display_date: form.display_date.trim(),
        category: form.category,
        color: form.color,
        pinned: form.pinned,
        author_id: profile?.id ?? null,
        is_active: true,
        expires_at,
      }

      const storageKey = "stfrancis-admin-auth"
      const rawSession = localStorage.getItem(storageKey)
      const jwt = rawSession ? (() => { try { return JSON.parse(rawSession)?.access_token } catch { return null } })() : null
      if (!jwt) {
        notify("Session token missing — please sign out and sign back in.", false)
        setSaving(false)
        return
      }
      const supaUrl = import.meta.env.VITE_SUPABASE_URL as string
      const supaKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string
      let insertError: { message: string } | null = null
      try {
        const ctrl = new AbortController()
        const timer = setTimeout(() => ctrl.abort(), 2000)
        const resp = await fetch(`${supaUrl}/rest/v1/announcements`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": supaKey,
            "Authorization": `Bearer ${jwt}`,
            "Prefer": "return=minimal",
          },
          body: JSON.stringify(baseRow),
          signal: ctrl.signal,
        })
        clearTimeout(timer)
        if (!resp.ok) {
          const errText = await resp.text()
          insertError = { message: `Failed (${resp.status}): ${errText}` }
        }
      } catch (fetchErr) {
        const msg = fetchErr instanceof Error ? fetchErr.message : "Insert failed"
        insertError = { message: msg.includes("abort") ? "Post failed — request timed out after 2 seconds." : msg }
      }

      if (insertError) {
        const msgLower = typeof insertError.message === "string" ? insertError.message.toLowerCase() : ""
        const abortHint =
          msgLower.includes("abort") || msgLower.includes("aborted") || msgLower.includes("signal")
            ? " Request aborted or timed out. Check .env URL, Supabase project (not paused), firewall. Use Run Supabase checks below."
            : ""
        const hint =
          typeof insertError.message === "string" && insertError.message.includes("poster_url")
            ? " Add column poster_url (text) in Supabase."
            : ""
        const code = "code" in insertError ? String((insertError as { code?: string }).code ?? "") : ""
        const rls =
          typeof insertError.message === "string" &&
          (insertError.message.toLowerCase().includes("row-level security") || code === "42501")
            ? " RLS: your auth user must exist in admin_profiles (auth_user_id = auth.uid())."
            : ""
        notify(`Failed to post: ${insertError.message}.${hint}${rls}${abortHint}`, false)
        return
      }
      const posterToUpload = posterFile

      setForm({
        title: "",
        content: "",
        display_date: "",
        category: "General",
        color: "#7c4c2e",
        pinned: false,
        expires_date: defaultExpiryDateInput(),
      })
      onPosterPick(null)
      notify("Announcement posted.")
      void load()

      if (posterToUpload) {
        void uploadPosterAndLinkToAnnouncement(newId, posterToUpload)
          .then(() => void load())
          .catch((e) => notify(e instanceof Error ? e.message : "Poster upload failed.", false))
      }
    } catch (e) {
      notify(e instanceof Error ? e.message : "Failed to post.", false)
    } finally {
      setSaving(false)
    }
  }

  async function togglePin(id: string, v: boolean) {
    const supaUrl=(import.meta.env.VITE_SUPABASE_URL as string).replace(/\/$/,"")
    const supaKey=import.meta.env.VITE_SUPABASE_ANON_KEY as string
    const raw=localStorage.getItem("stfrancis-admin-auth")
    const jwt=raw?(()=>{try{return JSON.parse(raw)?.access_token}catch{return null}})()??supaKey:supaKey
    await fetch(supaUrl+"/rest/v1/announcements?id=eq."+id,{method:"PATCH",headers:{"Content-Type":"application/json",apikey:supaKey,Authorization:"Bearer "+jwt,Prefer:"return=minimal"},body:JSON.stringify({pinned:!v})})
    load()
  }

  async function toggleActive(id: string, v: boolean) {
    const supaUrl=(import.meta.env.VITE_SUPABASE_URL as string).replace(/\/$/,"")
    const supaKey=import.meta.env.VITE_SUPABASE_ANON_KEY as string
    const raw=localStorage.getItem("stfrancis-admin-auth")
    const jwt=raw?(()=>{try{return JSON.parse(raw)?.access_token}catch{return null}})()??supaKey:supaKey
    await fetch(supaUrl+"/rest/v1/announcements?id=eq."+id,{method:"PATCH",headers:{"Content-Type":"application/json",apikey:supaKey,Authorization:"Bearer "+jwt,Prefer:"return=minimal"},body:JSON.stringify({is_active:!v})})
    load()
  }

  async function del(id: string) {
    if (!confirm("Delete this announcement?")) return
    const row=list.find((a)=>a.id===id)
    const supaUrl=(import.meta.env.VITE_SUPABASE_URL as string).replace(/\/$/,"")
    const supaKey=import.meta.env.VITE_SUPABASE_ANON_KEY as string
    const raw=localStorage.getItem("stfrancis-admin-auth")
    const jwt=raw?(()=>{try{return JSON.parse(raw)?.access_token}catch{return null}})()??supaKey:supaKey
    await fetch(supaUrl+"/rest/v1/announcements?id=eq."+id,{method:"DELETE",headers:{apikey:supaKey,Authorization:"Bearer "+jwt}})
    if(row?.poster_url) await removeAnnouncementPosterFromStorage(row.poster_url)
    load()
  }

  const [editId, setEditId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<{title:string,content:string,display_date:string,category:string,color:string,pinned:boolean,is_active:boolean,expires_date:string}>({title:"",content:"",display_date:"",category:"General",color:"#7c4c2e",pinned:false,is_active:true,expires_date:""})
  const [editPosterFile, setEditPosterFile] = useState<File|null>(null)
  const [editSaving, setEditSaving] = useState(false)

  function startEdit(a: Ann) {
    setEditId(a.id)
    setEditForm({title:a.title,content:a.content,display_date:a.display_date,category:a.category,color:a.color,pinned:a.pinned,is_active:a.is_active,expires_date:a.expires_at?.slice(0,10)??"" })
    setEditPosterFile(null)
  }

  async function saveEdit() {
    if(!editId) return
    setEditSaving(true)
    try {
      const supaUrl=(import.meta.env.VITE_SUPABASE_URL as string).replace(/\/$/,"")
      const supaKey=import.meta.env.VITE_SUPABASE_ANON_KEY as string
      const raw=localStorage.getItem("stfrancis-admin-auth")
      const jwt=raw?(()=>{try{return JSON.parse(raw)?.access_token}catch{return null}})()??supaKey:supaKey
      const body={title:editForm.title,content:editForm.content,display_date:editForm.display_date,category:editForm.category,color:editForm.color,pinned:editForm.pinned,is_active:editForm.is_active,expires_at:editForm.expires_date?new Date(editForm.expires_date+"T23:59:59").toISOString():undefined}
      const resp=await fetch(supaUrl+"/rest/v1/announcements?id=eq."+editId,{method:"PATCH",headers:{"Content-Type":"application/json",apikey:supaKey,Authorization:"Bearer "+jwt,Prefer:"return=minimal"},body:JSON.stringify(body)})
      if(!resp.ok){notify("Update failed: "+resp.status,false);return}
      if(editPosterFile){try{await uploadPosterAndLinkToAnnouncement(editId,editPosterFile)}catch(e){notify(e instanceof Error?e.message:"Poster upload failed",false)}}
      notify("Announcement updated.")
      setEditId(null)
      load()
    }catch(e){notify(e instanceof Error?e.message:"Update failed",false)}
    finally{setEditSaving(false)}
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
        <div style={{ marginBottom: "12px" }}>
          <label style={{ fontSize: "12px", color: "#9e8070", display: "block", marginBottom: "6px" }}>Visible until (expiry)</label>
          <input
            type="date"
            style={{ ...inp, maxWidth: "220px" }}
            value={form.expires_date}
            min={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setForm((p) => ({ ...p, expires_date: e.target.value }))}
          />
          <p style={{ fontSize: "11px", color: "#9e8070", margin: "6px 0 0" }}>Announcements disappear from the site after this date.</p>
        </div>
        <textarea
          style={{ ...inp, height: "110px", resize: "vertical", marginBottom: "14px" }}
          placeholder="Full announcement content..."
          value={form.content}
          onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
        />
        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "12px", color: "#9e8070", display: "block", marginBottom: "6px" }}>Poster (optional)</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            style={{ fontSize: "13px", color: "#3a1f13" }}
            onChange={(e) => onPosterPick(e.target.files?.[0] ?? null)}
          />
          {posterPreviewUrl && (
            <div style={{ marginTop: "10px" }}>
              <img
                src={posterPreviewUrl}
                alt="Poster preview"
                style={{ maxHeight: "160px", borderRadius: "8px", border: "1px solid #e0d0c0" }}
              />
            </div>
          )}
        </div>
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
        <div style={{ marginTop: "18px", paddingTop: "14px", borderTop: "1px solid #e8ddd5" }}>
          <p style={{ fontSize: "12px", fontWeight: 600, color: "#7c4c2e", margin: "0 0 8px" }}>Troubleshoot connection</p>
          <button
            type="button"
            disabled={diagBusy}
            onClick={() => void runConnectionCheck()}
            style={{
              padding: "8px 14px",
              borderRadius: "8px",
              border: "1px solid #e0d0c0",
              background: "#fff",
              fontSize: "12px",
              cursor: diagBusy ? "wait" : "pointer",
              color: "#3a1f13",
            }}
          >
            {diagBusy ? "Running checks" : "Run Supabase checks"}
          </button>
          {diag ? (
            <pre
              style={{
                marginTop: "10px",
                padding: "10px 12px",
                borderRadius: "8px",
                background: "#f7f2ed",
                fontSize: "11px",
                color: "#3a1f13",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                maxHeight: "200px",
                overflow: "auto",
              }}
            >
              {diag}
            </pre>
          ) : null}
        </div>
      </div>
      {listError ? (
        <div style={{ padding: "12px 16px", borderRadius: "10px", background: "#fce4e4", color: "#a32d2d", fontSize: "13px", marginBottom: "14px" }}>
          List load failed: {listError}
        </div>
      ) : null}
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
                  {a.display_date ? `${a.display_date} ` : ""}Expires {new Date(a.expires_at).toLocaleDateString()}
                </p>
                {a.poster_url ? (
                  <img
                    src={a.poster_url}
                    alt=""
                    style={{ maxHeight: "100px", borderRadius: "8px", marginBottom: "8px", display: "block", border: "1px solid #e8ddd5" }}
                  />
                ) : null}
                <p style={{ fontSize: "12px", color: "#666", margin: 0, whiteSpace: "pre-line", lineHeight: 1.5 }}>
                  {a.content.slice(0, 140)}
                  {a.content.length > 140 ? "..." : ""}
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", flexShrink: 0 }}>
                <button onClick={() => startEdit(a)} style={{ fontSize: "11px", padding: "5px 12px", borderRadius: "6px", border: "0.5px solid #c8a84b", background: "#fff", cursor: "pointer", color: "#7a6010", fontWeight: 500 }}>Edit</button>
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
            {editId === a.id && (
            <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setEditId(null)}>
              <div style={{background:"#fff",borderRadius:"14px",padding:"28px",width:"min(540px,95vw)",maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
                <p style={{fontWeight:700,fontSize:"15px",color:"#3a1f13",marginBottom:"16px"}}>Edit Announcement</p>
                <input style={{padding:"9px 12px",borderRadius:"7px",border:"1px solid #e0d0c0",fontSize:"13px",width:"100%",boxSizing:"border-box",marginBottom:"10px"}} value={editForm.title} onChange={e=>setEditForm(p=>({...p,title:e.target.value}))} placeholder="Title" />
                <input style={{padding:"9px 12px",borderRadius:"7px",border:"1px solid #e0d0c0",fontSize:"13px",width:"100%",boxSizing:"border-box",marginBottom:"10px"}} value={editForm.display_date} onChange={e=>setEditForm(p=>({...p,display_date:e.target.value}))} placeholder="Display date" />
                <input type="date" style={{padding:"9px 12px",borderRadius:"7px",border:"1px solid #e0d0c0",fontSize:"13px",width:"100%",boxSizing:"border-box",marginBottom:"10px"}} value={editForm.expires_date} onChange={e=>setEditForm(p=>({...p,expires_date:e.target.value}))} />
                <textarea style={{padding:"9px 12px",borderRadius:"7px",border:"1px solid #e0d0c0",fontSize:"13px",width:"100%",boxSizing:"border-box",height:"100px",resize:"vertical",marginBottom:"10px"}} value={editForm.content} onChange={e=>setEditForm(p=>({...p,content:e.target.value}))} />
                <div style={{display:"flex",gap:"10px",alignItems:"center",flexWrap:"wrap",marginBottom:"12px"}}>
                  <select style={{padding:"7px 10px",borderRadius:"7px",border:"1px solid #e0d0c0",fontSize:"13px"}} value={editForm.category} onChange={e=>setEditForm(p=>({...p,category:e.target.value}))}>{["General","Mass","Sacraments","Finance","Community","Events"].map(cat=><option key={cat} value={cat}>{cat}</option>)}</select>
                  <div style={{display:"flex",gap:"4px"}}>{["#7c4c2e","#2e7d32","#1565c0","#6a1b9a","#e65100","#c8a84b","#880e4f","#8b0000"].map(col=><div key={col} onClick={()=>setEditForm(p=>({...p,color:col}))} style={{width:"20px",height:"20px",borderRadius:"50%",background:col,cursor:"pointer",border:editForm.color===col?"3px solid #3a1f13":"2px solid transparent"}} />)}</div>
                  <label style={{fontSize:"13px",display:"flex",gap:"6px",alignItems:"center"}}><input type="checkbox" checked={editForm.pinned} onChange={e=>setEditForm(p=>({...p,pinned:e.target.checked}))} />Pinned</label>
                  <label style={{fontSize:"13px",display:"flex",gap:"6px",alignItems:"center"}}><input type="checkbox" checked={editForm.is_active} onChange={e=>setEditForm(p=>({...p,is_active:e.target.checked}))} />Active</label>
                </div>
                <div style={{marginBottom:"14px"}}><p style={{fontSize:"12px",color:"#9e8070",marginBottom:"5px"}}>Replace poster (optional)</p><input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>setEditPosterFile(e.target.files?.[0]??null)} style={{fontSize:"13px"}} /></div>
                <div style={{display:"flex",gap:"10px",justifyContent:"flex-end"}}>
                  <button onClick={()=>setEditId(null)} style={{padding:"9px 20px",borderRadius:"8px",border:"1px solid #e0d0c0",background:"#fff",fontSize:"13px",cursor:"pointer"}}>Cancel</button>
                  <button onClick={saveEdit} disabled={editSaving} style={{padding:"9px 22px",borderRadius:"8px",border:"none",background:editSaving?"#b08060":"#7c4c2e",color:"#fff",fontSize:"13px",fontWeight:600,cursor:"pointer"}}>{editSaving?"Saving...":"Save changes"}</button>
                </div>
              </div>
            </div>
          )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
