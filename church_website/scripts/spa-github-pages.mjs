import { copyFileSync, existsSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const dist = resolve(__dirname, "..", "dist")
const indexHtml = resolve(dist, "index.html")
const notFound = resolve(dist, "404.html")

if (!existsSync(indexHtml)) {
  console.warn("[spa-github-pages] dist/index.html missing; skip 404.html copy.")
  process.exit(0)
}
copyFileSync(indexHtml, notFound)
console.log("[spa-github-pages] Wrote dist/404.html (copy of index.html) for GitHub Pages SPA routing.")
