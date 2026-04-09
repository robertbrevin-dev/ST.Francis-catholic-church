import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const envUrl = ((import.meta.env.VITE_SUPABASE_URL as string) || "").trim()
const envKey = ((import.meta.env.VITE_SUPABASE_ANON_KEY as string) || "").trim()

const supabaseUrl = envUrl.startsWith("http") ? envUrl : "http://127.0.0.1:59999"
const supabaseAnonKey = envKey.length > 20 ? envKey : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid"

export const SUPABASE_AUTH_STORAGE_KEY = "stfrancis-admin-auth"

const SUPABASE_FETCH_TIMEOUT_MS = 120_000
const SUPABASE_REST_TIMEOUT_MS = 60_000
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
      : url.includes("/rest/v1/")
        ? SUPABASE_REST_TIMEOUT_MS
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

export function getSupabaseConnectionInfo(): { origin: string; host: string } {
  try {
    const u = new URL(supabaseUrl)
    return { origin: u.origin, host: u.hostname }
  } catch {
    return { origin: "", host: "" }
  }
}

function restPingAbort(ms: number): AbortSignal {
  if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function") {
    return AbortSignal.timeout(ms)
  }
  const c = new AbortController()
  globalThis.setTimeout(() => c.abort(), ms)
  return c.signal
}

/**
 * Reachability + anon key sanity. Note: GET /rest/v1/ alone often returns 401 in the browser console;
 * we use /auth/v1/health and a minimal REST query instead.
 */
export async function pingSupabaseRest(): Promise<{ ok: boolean; detail: string }> {
  if (!isSupabaseConfigured) return { ok: false, detail: "VITE_SUPABASE_URL / ANON_KEY not set" }
  try {
    const u = new URL(supabaseUrl)
    const health = await fetch(`${u.origin}/auth/v1/health`, {
      method: "GET",
      signal: restPingAbort(8_000),
    })
    if (!health.ok && health.status !== 401) {
      return {
        ok: false,
        detail: `Auth health HTTP ${health.status}. Project paused, wrong URL, or network blocked.`,
      }
    }

    const r = await fetch(`${u.origin}/rest/v1/announcements?select=id&limit=1`, {
      method: "GET",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      signal: restPingAbort(10_000),
    })

    if (r.status === 401) {
      return {
        ok: false,
        detail:
          "REST 401: anon key does not match this project URL. In Supabase: Settings > API — copy anon key again into VITE_SUPABASE_ANON_KEY (no spaces).",
      }
    }

    if (r.status === 404) {
      return {
        ok: false,
        detail:
          "REST 404: announcements table missing. Run database/announcements_complete.sql in Supabase SQL editor.",
      }
    }

    return {
      ok: true,
      detail: `OK (auth health ${health.status}, announcements REST ${r.status})`,
    }
  } catch (e) {
    const m = e instanceof Error ? e.message : String(e)
    return {
      ok: false,
      detail: `${m}. Check URL, resume project in Supabase dashboard if paused, VPN/firewall.`,
    }
  }
}
