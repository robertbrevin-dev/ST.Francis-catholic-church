import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

/** Must stay in sync with sign-out cleanup in auth.ts */
export const SUPABASE_AUTH_STORAGE_KEY = "stfrancis-admin-auth"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: false,
    autoRefreshToken: true,
    storageKey: SUPABASE_AUTH_STORAGE_KEY,
  }
})