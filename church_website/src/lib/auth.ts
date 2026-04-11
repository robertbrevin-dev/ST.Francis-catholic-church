import { useEffect, useState } from "react"
import { Session } from "@supabase/supabase-js"
import { supabase, SUPABASE_AUTH_STORAGE_KEY } from "./supabase"

export type AdminRole = "father_2" | "parish_priest" | "parish_secretary" | "treasurer" | "parish_it_officer" | "parish_it_officer_2"

export type AdminProfile = {
  id: string
  auth_user_id: string
  role: AdminRole
  display_name: string
  email: string
  phone: string | null
  created_at: string
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  try {
    localStorage.removeItem("parish_admin_profile")
    localStorage.removeItem(SUPABASE_AUTH_STORAGE_KEY)
  } catch {
  }

  const remoteSignOut = supabase.auth.signOut({ scope: "local" }).catch(() => undefined)
  const cap = new Promise<void>((resolve) => setTimeout(resolve, 1200))
  await Promise.race([remoteSignOut, cap])

  window.location.replace("/")
}

export async function getAdminProfile(userId: string): Promise<AdminProfile | null> {
  const { data, error } = await supabase.from("admin_profiles").select("*").eq("auth_user_id", userId).single()
  if (error) return null
  return data
}

function getCachedProfile(): AdminProfile | null {
  try {
    const raw = localStorage.getItem("parish_admin_profile")
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function setCachedProfile(p: AdminProfile | null) {
  if (p) localStorage.setItem("parish_admin_profile", JSON.stringify(p))
  else localStorage.removeItem("parish_admin_profile")
}

function getSessionFromStorage() {
  try {
    const raw = localStorage.getItem(SUPABASE_AUTH_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    const session = parsed?.currentSession ?? parsed
    if (!session?.access_token) return null
    if (session.expires_at && session.expires_at * 1000 < Date.now()) return null
    return session
  } catch { return null }
}

export function useAdmin() {
  const [session, setSession] = useState<Session | null>(() => getSessionFromStorage())
  const [profile, setProfile] = useState<AdminProfile | null>(getCachedProfile)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const s = getSessionFromStorage()
    setSession(s)
    if (s?.user) {
      const cached = getCachedProfile()
      if (!cached || cached.auth_user_id !== s.user.id) {
        const supaUrl = (import.meta.env.VITE_SUPABASE_URL as string).replace(/[/]$/, "")
        const supaKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string
        fetch(supaUrl + "/rest/v1/admin_profiles?auth_user_id=eq." + s.user.id + "&select=*&limit=1", {
          headers: { apikey: supaKey, Authorization: "Bearer " + s.access_token }
        }).then(r => r.ok ? r.json() : null)
          .then(rows => { const p = rows?.[0] ?? null; setProfile(p); setCachedProfile(p) })
          .catch(() => {})
      }
    } else { setProfile(null); setCachedProfile(null) }
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setSession(session)
      if (session?.user) {
        const supaUrl = (import.meta.env.VITE_SUPABASE_URL as string).replace(/[/]$/, "")
        const supaKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string
        fetch(supaUrl + "/rest/v1/admin_profiles?auth_user_id=eq." + session.user.id + "&select=*&limit=1", {
          headers: { apikey: supaKey, Authorization: "Bearer " + session.access_token }
        }).then(r => r.ok ? r.json() : null)
          .then(rows => { const p = rows?.[0] ?? null; setProfile(p); setCachedProfile(p) })
          .catch(() => {})
      } else { setProfile(null); setCachedProfile(null) }
    })
    return () => subscription.unsubscribe()
  }, [])
  return { session, profile, loading, isAdmin: !!(session && profile) }
}
