#!/usr/bin/env node
/**
 * Lab Lighthouse + axe + screenshots for the preview-integrada branch.
 * Usage: AUDIT_BASE=http://127.0.0.1:3001 node scripts/preview-integrada-audit.mjs
 */
import { execFile } from "node:child_process"
import { createRequire } from "node:module"
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { promisify } from "node:util"
import { chromium } from "@playwright/test"

const execFileP = promisify(execFile)
const require = createRequire(import.meta.url)
const axePath = require.resolve("axe-core/axe.min.js")

const BASE = process.env.AUDIT_BASE || "http://127.0.0.1:3001"
const STORE = "/cursor/stores/bc-080f2c86-8fce-5951-830d-7140dbb408ed"
const MEDIA = join(STORE, "media/preview-integrada")
const INTERNAL = join(STORE, "internal/preview-integrada")
mkdirSync(MEDIA, { recursive: true })
mkdirSync(INTERNAL, { recursive: true })

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const PROJECT_IDS = JSON.parse(readFileSync(join(ROOT, "content/projects.json"), "utf8")).projects.map(
  (p) => p.id
)

const PAGES = [
  { id: "home", path: "/", screenshot: ["desktop", "mobile"] },
  { id: "sprint", path: "/sprint", screenshot: ["desktop", "mobile"] },
  ...PROJECT_IDS.map((id) => ({
    id,
    path: `/projects/${id}`,
    screenshot: id === "agromaq" ? ["desktop", "mobile"] : ["desktop"],
  })),
]

function chromeFlags() {
  return "--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage"
}

async function lighthouseOnce(url, formFactor, jsonPath) {
  const args = [
    "-y",
    "lighthouse",
    url,
    "--quiet",
    "--output=json",
    `--output-path=${jsonPath}`,
    "--only-categories=performance,accessibility,best-practices,seo",
    `--chrome-flags=${chromeFlags()}`,
    "--disable-full-page-screenshot",
  ]
  if (formFactor === "desktop") args.push("--preset=desktop")
  else args.push("--form-factor=mobile", "--screenEmulation.mobile=true")
  await execFileP("npx", args, {
    timeout: 180000,
    maxBuffer: 20 * 1024 * 1024,
    env: { ...process.env, CHROME_PATH: "/usr/local/bin/google-chrome" },
  })
  return JSON.parse(readFileSync(jsonPath, "utf8"))
}

function score(cats, id) {
  const v = cats[id]?.score
  return v == null ? null : Math.round(v * 100)
}

function summarizeLh(report) {
  const audits = report.audits || {}
  const cats = report.categories || {}
  const failedA11y = (cats.accessibility?.auditRefs || [])
    .map((r) => audits[r.id])
    .filter((a) => a && a.score === 0 && a.scoreDisplayMode === "binary")
    .map((a) => a.id)
  return {
    scores: {
      performance: score(cats, "performance"),
      accessibility: score(cats, "accessibility"),
      bestPractices: score(cats, "best-practices"),
      seo: score(cats, "seo"),
    },
    lcpMs: audits["largest-contentful-paint"]?.numericValue ?? null,
    tbtMs: audits["total-blocking-time"]?.numericValue ?? null,
    failedA11y,
  }
}

function scorecardHtml(report) {
  const rows = Object.entries(report.lighthouse)
    .map(([key, val]) => {
      const m = val
      const warn =
        m.performance < 95 || m.accessibility < 95 || m.bestPractices < 95 || m.seo < 95
      return `<tr class="${warn ? "warn" : "ok"}">
        <td>${key}</td>
        <td>${m.performance}</td>
        <td>${m.accessibility}</td>
        <td>${m.bestPractices}</td>
        <td>${m.seo}</td>
        <td>${Math.round(m.lcpMs)} ms</td>
      </tr>`
    })
    .join("")
  const axeRows = Object.entries(report.axe)
    .map(([key, val]) => {
      const n = val.violations.length
      const ids = val.violations.map((v) => v.id).join(", ") || "0"
      return `<tr class="${n ? "warn" : "ok"}"><td>${key}</td><td>${n}</td><td>${ids}</td></tr>`
    })
    .join("")
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<title>Lighthouse preview integrada</title>
<style>
  body { font-family: ui-sans-serif, system-ui, sans-serif; background: #0f1115; color: #f4f4f5; margin: 0; padding: 32px; }
  h1 { font-size: 28px; margin: 0 0 8px; }
  p { color: #a1a1aa; margin: 0 0 24px; }
  table { border-collapse: collapse; width: 100%; margin-bottom: 28px; }
  th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #27272a; font-variant-numeric: tabular-nums; }
  th { color: #a1a1aa; font-weight: 600; font-size: 12px; letter-spacing: .04em; text-transform: uppercase; }
  .ok td { color: #86efac; }
  .warn td { color: #fbbf24; }
  .ok td:first-child, .warn td:first-child { color: #f4f4f5; }
</style></head>
<body>
  <h1>Lighthouse + axe</h1>
  <p>${BASE} · preview integrada · un run por superficie</p>
  <table>
    <thead><tr><th>URL</th><th>Perf</th><th>A11y</th><th>BP</th><th>SEO</th><th>LCP</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <table>
    <thead><tr><th>Axe</th><th>Violaciones</th><th>IDs</th></tr></thead>
    <tbody>${axeRows}</tbody>
  </table>
</body></html>`
}

async function runAxeOn(page, url) {
  await page.goto(url, { waitUntil: "load", timeout: 60000 })
  await page.addScriptTag({ path: axePath })
  const results = await page.evaluate(async () => {
    return await axe.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] },
    })
  })
  return {
    url,
    violations: results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.slice(0, 6).map((n) => ({
        target: n.target,
        html: n.html?.slice(0, 220),
      })),
    })),
  }
}

const report = {
  lab: { base: BASE, startedAt: new Date().toISOString() },
  lighthouse: {},
  axe: {},
  screenshots: {},
  product: {},
}

async function main() {
  console.error(`preview audit against ${BASE}`)
  for (const page of PAGES) {
    for (const form of ["mobile", "desktop"]) {
      const jsonPath = join(INTERNAL, `lh-${page.id}-${form}.json`)
      console.error(`LH ${page.id} ${form}`)
      const raw = await lighthouseOnce(`${BASE}${page.path}`, form, jsonPath)
      const sum = summarizeLh(raw)
      report.lighthouse[`${page.id}:${form}`] = {
        ...sum.scores,
        lcpMs: sum.lcpMs,
        tbtMs: sum.tbtMs,
        failedA11y: sum.failedA11y,
      }
    }
  }

  const browser = await chromium.launch({
    executablePath: "/usr/local/bin/google-chrome",
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  })
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  await context.addInitScript(() => {
    localStorage.setItem("preferred-locale", "es")
  })
  const page = await context.newPage()

  for (const t of PAGES) {
    console.error(`axe ${t.id}`)
    await page.setViewportSize({ width: 390, height: 844 })
    report.axe[t.id] = await runAxeOn(page, `${BASE}${t.path}`)
  }

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(`${BASE}/`, { waitUntil: "load" })
  report.product = {
    photos: await page.locator("img[data-lcp-photo]").count(),
    spacexsi: await page.locator("text=SpaceXSI Ambassador").count(),
    trained: await page.locator("text=+300").count(),
    trainedLabel: await page.locator("text=personas capacitadas").count(),
    kraken: await page.locator("text=Kraken").count(),
    agromaq: await page.locator("text=Agromaq").count(),
  }

  const shot = async (name, url, width, height) => {
    await page.setViewportSize({ width, height })
    await page.goto(`${BASE}${url}`, { waitUntil: "load", timeout: 60000 })
    await page.waitForTimeout(350)
    const dest = join(MEDIA, name)
    await page.screenshot({ path: dest, fullPage: false })
    report.screenshots[name] = { path: dest, exists: existsSync(dest) }
  }

  await shot("home-mobile.png", "/", 390, 844)
  await shot("home-desktop.png", "/", 1440, 900)
  await shot("sprint-mobile.png", "/sprint", 390, 844)
  await shot("sprint-desktop.png", "/sprint", 1440, 900)
  await shot("agromaq-mobile.png", "/projects/agromaq", 390, 844)
  await shot("agromaq-desktop.png", "/projects/agromaq", 1440, 900)
  for (const id of PROJECT_IDS) {
    if (id === "agromaq") continue
    await shot(`${id}-desktop.png`, `/projects/${id}`, 1440, 900)
  }

  const scorePath = join(INTERNAL, "scorecard.html")
  writeFileSync(scorePath, scorecardHtml(report))
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto(`file://${scorePath}`, { waitUntil: "networkidle" })
  await page.screenshot({ path: join(MEDIA, "lighthouse.png"), fullPage: true })
  report.screenshots["lighthouse.png"] = {
    path: join(MEDIA, "lighthouse.png"),
    exists: existsSync(join(MEDIA, "lighthouse.png")),
  }

  await browser.close()
  report.finishedAt = new Date().toISOString()
  const summaryPath = join(INTERNAL, "summary.json")
  writeFileSync(summaryPath, JSON.stringify(report, null, 2))
  console.log(summaryPath)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
