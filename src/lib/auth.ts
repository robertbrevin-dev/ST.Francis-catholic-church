import { useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from './supabase'

export type AdminRole = 'father_1' | 'father_2' | 'parish_priest' | 'parish_secretary' | 'treasurer' | 'parish_it_officer'

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
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getAdminProfile(userId: string): Promise<AdminProfile | null> {
  const { data, error } = await supabase.from('admin_profiles').select('*').eq('auth_user_id', userId).single()
  if (error) return null
  return data
}

export function useAdmin() {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<AdminProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        const p = await getAdminProfile(session.user.id)
        setProfile(p)
      }
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: any, session: any) => {
      setSession(session)
      if (session?.user) {
        const p = await getAdminProfile(session.user.id)
        setProfile(p)
      } else {
        setProfile(null)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  return { session, profile, loading, isAdmin: !!session && !!profile }
}