import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const envUrl = (import.meta.env.VITE_SUPABASE_URL as string) || ""
const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || ""

const supabaseUrl = envUrl.startsWith("http") ? envUrl : "http://127.0.0.1:59999"
const supabaseAnonKey = envKey.length > 20 ? envKey : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid"

export const SUPABASE_AUTH_STORAGE_KEY = "stfrancis-admin-auth"

const SUPABASE_FETCH_TIMEOUT_MS = 120_000
const SUPABASE_STORAGE_TIMEOUT_MS = 90_000
const SUPABASE_AUTH_TIMEOUT_MS = 45_000

function requestUrl(input: RequestInfo | URL): string {
  if (typeof input === "string") return input
  if (input instanceof URL) return input.href
  if (input instanceof Request) return input.url
  return String(input)
}

function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const url = requestUrl(input)
  const ms = url.includes("/auth/v1/")
    ? SUPABASE_AUTH_TIMEOUT_MS
    : url.includes("/storage/v1/")
      ? SUPABASE_STORAGE_TIMEOUT_MS
      : SUPABASE_FETCH_TIMEOUT_MS
  const controller = new AbortController()
  const timeoutId = globalThis.setTimeout(() => controller.abort(), ms)
  return fetch(input, { ...init, signal: controller.signal }).finally(() => {
    globalThis.clearTimeout(timeoutId)
  })
}

export const isSupabaseConfigured = Boolean(envUrl.startsWith("http") && envKey.length > 20)

if (import.meta.env.DEV && !isSupabaseConfigured) {
  console.warn(
    "[Supabase] Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in church_website/.env then restart `vite`.",
  )
}

type GlobalSupabase = typeof globalThis & { __stfrancis_supabase?: SupabaseClient }

function createSupabase(): SupabaseClient {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: { fetch: fetchWithTimeout },
    auth: {
      persistSession: true,
      detectSessionInUrl: false,
      autoRefreshToken: true,
      storageKey: SUPABASE_AUTH_STORAGE_KEY,
    },
  })
}

const g = globalThis as GlobalSupabase
if (!g.__stfrancis_supabase) {
  g.__stfrancis_supabase = createSupabase()
}

export const supabase: SupabaseClient = g.__stfrancis_supabase
