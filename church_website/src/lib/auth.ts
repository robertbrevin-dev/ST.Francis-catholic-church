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
    /* ignore */
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

export function useAdmin() {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<AdminProfile | null>(getCachedProfile)
  const [loading, setLoading] = useState(!getCachedProfile())

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        const cached = getCachedProfile()
        if (!cached || cached.auth_user_id !== session.user.id) {
          const p = await getAdminProfile(session.user.id)
          setProfile(p)
          setCachedProfile(p)
        }
      } else {
        setProfile(null)
        setCachedProfile(null)
      }
      setLoading(false)
    }).catch(() => setLoading(false))

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: any, session: any) => {
      setSession(session)
      if (session?.user) {
        const p = await getAdminProfile(session.user.id)
        setProfile(p)
        setCachedProfile(p)
      } else {
        setProfile(null)
        setCachedProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return { session, profile, loading, isAdmin: !!profile }
}