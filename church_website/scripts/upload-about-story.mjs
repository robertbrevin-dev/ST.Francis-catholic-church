import { readFileSync, existsSync } from "node:fs"
import { resolve, dirname, extname, basename } from "node:path"
import { fileURLToPath } from "node:url"
import { randomUUID } from "node:crypto"
import { createClient } from "@supabase/supabase-js"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const MAX_PHOTOS = (() => {
  const n = parseInt(process.env.ABOUT_MAX_PHOTOS ?? "", 10)
  return Number.isFinite(n) && n > 0 ? n : 5
})()

function loadDotEnv() {
  for (const name of [".env.local", ".env"]) {
    const p = resolve(root, name)
    if (!existsSync(p)) continue
    for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
      const t = line.trim()
      if (!t || t.startsWith("#")) continue
      const eq = t.indexOf("=")
      if (eq <= 0) continue
      const key = t.slice(0, eq).trim()
      let val = t.slice(eq + 1).trim()
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1)
      }
      if (process.env[key] === undefined) process.env[key] = val
    }
  }
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40) || "story"
}

function contentTypeForExt(ext) {
  const e = ext.toLowerCase()
  if (e === "png") return "image/png"
  if (e === "webp") return "image/webp"
  if (e === "gif") return "image/gif"
  return "image/jpeg"
}

loadDotEnv()

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const paths = process.argv.slice(2).filter((a) => !a.startsWith("-"))

if (!supabaseUrl?.startsWith("http")) {
  console.error("Missing Supabase URL. Set VITE_SUPABASE_URL in .env or SUPABASE_URL.")
  process.exit(1)
}
if (!serviceKey || serviceKey.length < 40) {
  console.error(
    "Missing SUPABASE_SERVICE_ROLE_KEY. Add it only to .env.local (never commit). Dashboard → Project Settings → API → service_role.",
  )
  process.exit(1)
}
if (paths.length === 0) {
  console.error(`Usage: node scripts/upload-about-story.mjs <image1> [image2] ... (max ${MAX_PHOTOS})`)
  console.error("Set STORY_TITLE and STORY_DESCRIPTION (required). Optional: STORY_IMPACT, STORY_DATE=YYYY-MM-DD, STORY_LOCATION, STORY_PEOPLE, STORY_OCCASION, STORY_FEATURED=true|false")
  process.exit(1)
}

const title = (process.env.STORY_TITLE || "").trim()
const description = (process.env.STORY_DESCRIPTION || "").trim()
if (!title || !description) {
  console.error("Set STORY_TITLE and STORY_DESCRIPTION before running.")
  process.exit(1)
}

const impact = (process.env.STORY_IMPACT || "").trim()
const eventDate = (process.env.STORY_DATE || "").trim() || null
const location = (process.env.STORY_LOCATION || "").trim()
const peoplePresent = (process.env.STORY_PEOPLE || "").trim()
const occasionType = (process.env.STORY_OCCASION || "Other").trim()
const isFeatured = (process.env.STORY_FEATURED || "false").toLowerCase() !== "false"
const displayOrder = Number(process.env.STORY_DISPLAY_ORDER) || 0

const files = paths.slice(0, MAX_PHOTOS)
if (paths.length > MAX_PHOTOS) {
  console.warn(`Only first ${MAX_PHOTOS} files used (database limit per story).`)
}

for (const p of files) {
  if (!existsSync(p)) {
    console.error("File not found:", p)
    process.exit(1)
  }
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const year = new Date().getFullYear()
const slug = slugify(title)
const uploaded = []

for (const fp of files) {
  const buf = readFileSync(fp)
  const ext = (extname(fp).replace(".", "") || "jpg").toLowerCase()
  const storagePath = `${year}/${randomUUID()}-${slug}.${ext}`
  const { error: upErr } = await supabase.storage.from("about-gallery").upload(storagePath, buf, {
    contentType: contentTypeForExt(ext),
    upsert: false,
  })
  if (upErr) {
    console.error("Storage upload failed:", upErr.message)
    process.exit(1)
  }
  const { data: pub } = supabase.storage.from("about-gallery").getPublicUrl(storagePath)
  uploaded.push({ path: storagePath, url: pub.publicUrl })
  console.log("Uploaded:", basename(fp), "→", storagePath)
}

const primary = uploaded[0]
const { data: story, error: storyErr } = await supabase
  .from("about_stories")
  .insert({
    title,
    occasion_type: occasionType,
    event_date: eventDate,
    location,
    people_present: peoplePresent,
    description,
    impact,
    photo_url: primary.url,
    photo_path: primary.path,
    display_order: displayOrder,
    is_featured: isFeatured,
    is_active: true,
    updated_at: new Date().toISOString(),
  })
  .select("id")
  .single()

if (storyErr || !story) {
  console.error("about_stories insert failed:", storyErr?.message || "no row")
  process.exit(1)
}

const photoRows = uploaded.map((p, i) => ({
  story_id: story.id,
  photo_url: p.url,
  photo_path: p.path,
  sort_order: i + 1,
}))

const { error: photosErr } = await supabase.from("about_story_photos").insert(photoRows)
if (photosErr) {
  console.error("about_story_photos insert failed:", photosErr.message)
  console.error("Story row exists; fix photos in Supabase Table Editor or delete the story and re-run.")
  process.exit(1)
}

console.log("Done. Story id:", story.id)
console.log("Reload the public About page and admin list.")
