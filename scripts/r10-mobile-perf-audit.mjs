#!/usr/bin/env node
/**
 * Lab: Lighthouse + axe + viewport nav for mobile/perf PR.
 * Usage: AUDIT_BASE=http://127.0.0.1:3001 node scripts/r10-mobile-perf-audit.mjs
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
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const STORE = process.env.AUDIT_STORE || "/cursor/stores/self"
const MEDIA = join(STORE, "media/mobile-performance")
const INTERNAL = join(STORE, "internal/mobile-performance")
mkdirSync(MEDIA, { recursive: true })
mkdirSync(INTERNAL, { recursive: true })

const PAGES = [
  { id: "home", path: "/", runs: { mobile: 3, desktop: 3 } },
  { id: "sprint", path: "/sprint", runs: { mobile: 3, desktop: 1 } },
  { id: "nexa", path: "/projects/nexa", runs: { mobile: 1, desktop: 1 } },
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
  if (formFactor === "desktop") {
    args.push("--preset=desktop")
  } else {
    args.push("--form-factor=mobile", "--screenEmulation.mobile=true")
  }
  await execFileP("npx", args, {
    timeout: 180000,
    maxBuffer: 20 * 1024 * 1024,
    env: { ...process.env, CHROME_PATH: "/usr/local/bin/google-chrome" },
  })
  return JSON.parse(readFileSync(jsonPath, "utf8"))
}

function summarizeLh(report) {
  const audits = report.audits || {}
  const cats = report.categories || {}
  const score = (id) => (cats[id]?.score == null ? null : Math.round(cats[id].score * 100))
  const numeric = (id) => audits[id]?.numericValue ?? null
  const display = (id) => audits[id]?.displayValue ?? null
  const lcpItems = audits["largest-contentful-paint-element"]?.details?.items || []
  const lcpEl = lcpItems[0] || null
  const failedA11y = (cats.accessibility?.auditRefs || [])
    .map((r) => audits[r.id])
    .filter((a) => a && a.score === 0 && a.scoreDisplayMode === "binary")
    .map((a) => ({
      id: a.id,
      title: a.title,
      items: (a.details?.items || []).slice(0, 8).map((item) => item.node?.snippet || item.node?.selector || item),
    }))
  const opportunities = Object.values(audits)
    .filter((a) => a?.details?.type === "opportunity" && (a.numericValue || 0) > 50)
    .sort((a, b) => (b.numericValue || 0) - (a.numericValue || 0))
    .slice(0, 8)
    .map((a) => ({ id: a.id, title: a.title, savingsMs: Math.round(a.numericValue || 0), display: a.displayValue }))
  return {
    fetchTime: report.fetchTime,
    lighthouseVersion: report.lighthouseVersion,
    formFactor: report.configSettings?.formFactor,
    scores: {
      performance: score("performance"),
      accessibility: score("accessibility"),
      bestPractices: score("best-practices"),
      seo: score("seo"),
    },
    metrics: {
      lcpMs: numeric("largest-contentful-paint"),
      cls: numeric("cumulative-layout-shift"),
      tbtMs: numeric("total-blocking-time"),
      fcpMs: numeric("first-contentful-paint"),
      siMs: numeric("speed-index"),
      ttfbMs: numeric("server-response-time") ?? numeric("time-to-first-byte"),
      lcpDisplay: display("largest-contentful-paint"),
      clsDisplay: display("cumulative-layout-shift"),
    },
    lcpElement: lcpEl,
    failedA11y,
    opportunities,
    seoFails: (cats.seo?.auditRefs || [])
      .map((r) => audits[r.id])
      .filter((a) => a && a.score === 0)
      .map((a) => ({ id: a.id, title: a.title })),
    bpFails: (cats["best-practices"]?.auditRefs || [])
      .map((r) => audits[r.id])
      .filter((a) => a && a.score === 0)
      .map((a) => ({ id: a.id, title: a.title })),
  }
}

function median(values) {
  const nums = values.filter((v) => typeof v === "number").toSorted((a, b) => a - b)
  if (!nums.length) return null
  const mid = Math.floor(nums.length / 2)
  return nums.length % 2 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2
}

async function runAxeOn(page, url, extra = {}) {
  await page.goto(url, { waitUntil: "load", timeout: 60000 })
  if (extra.hash) {
    await page.evaluate((hash) => {
      location.hash = hash
      document.querySelector(hash)?.scrollIntoView()
    }, extra.hash)
    await page.waitForTimeout(400)
  }
  await page.addScriptTag({ path: axePath })
  const results = await page.evaluate(async () => {
    // eslint-disable-next-line no-undef
    return await axe.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] },
    })
  })
  return {
    url,
    extra,
    violations: results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      help: v.help,
      nodes: v.nodes.slice(0, 8).map((n) => ({
        target: n.target,
        html: n.html?.slice(0, 220),
        failureSummary: n.failureSummary?.slice(0, 400),
      })),
    })),
    passes: results.passes.length,
    incomplete: results.incomplete.map((v) => ({ id: v.id, nodes: v.nodes.length })),
  }
}

function scorecardHtml(report) {
  const rows = Object.entries(report.lighthouse)
    .map(([key, val]) => {
      const m = val.median
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
<title>Lighthouse lab</title>
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
  <p>${BASE} · Lighthouse ${report.lab?.lighthouseVersion || ""} · medians</p>
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

async function exerciseNav(page, width, height) {
  await page.setViewportSize({ width, height })
  await page.goto(`${BASE}/`, { waitUntil: "load", timeout: 60000 })
  const log = { width, height, steps: [] }
  const photos = await page.locator('img[alt*="Alejandro"]').count()
  log.steps.push({ photos })
  const menu = page.getByRole("button", { name: /menú|menu/i })
  if (await menu.isVisible()) {
    await menu.click()
    await page.waitForTimeout(250)
    const about = page.getByRole("link", { name: /acerca|about/i }).first()
    if (await about.isVisible()) {
      await about.click()
      await page.waitForTimeout(400)
      log.steps.push({ openedMenu: true, clickedAbout: true, hash: await page.evaluate(() => location.hash) })
    }
    if (await menu.isVisible()) {
      const expanded = await menu.getAttribute("aria-expanded")
      if (expanded !== "true") await menu.click()
      await page.waitForTimeout(200)
      const sprintNav = page.getByRole("link", { name: /^sprint$/i }).first()
      if (await sprintNav.isVisible()) {
        await sprintNav.click()
        await page.waitForURL(/\/sprint/, { timeout: 15000 })
        log.steps.push({ openedSprint: true, href: page.url() })
        await page.goBack({ waitUntil: "load" })
      }
    }
  }
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(400)
  await page.evaluate(() => window.scrollTo(0, 0))
  const talk = page.getByRole("link", { name: /agendar|book a chat/i }).first()
  log.steps.push({
    talkHref: (await talk.getAttribute("href")) || null,
    scrollY: await page.evaluate(() => window.scrollY),
  })
  return log
}

const report = {
  lab: {
    tool: "Lighthouse CLI + axe-core + Playwright",
    chrome: "HeadlessChrome",
    base: BASE,
    startedAt: new Date().toISOString(),
  },
  lighthouse: {},
  axe: {},
  nav: {},
}

async function main() {
  console.error(`r10 audit against ${BASE}`)
  for (const page of PAGES) {
    for (const form of ["mobile", "desktop"]) {
      const n = page.runs[form]
      if (!n) continue
      const runs = []
      for (let i = 0; i < n; i++) {
        const jsonPath = join(INTERNAL, `lh-${page.id}-${form}-${i + 1}.json`)
        console.error(`LH ${page.id} ${form} #${i + 1}`)
        const raw = await lighthouseOnce(`${BASE}${page.path}`, form, jsonPath)
        runs.push(summarizeLh(raw))
      }
      report.lighthouse[`${page.id}:${form}`] = {
        runs,
        median: {
          performance: median(runs.map((r) => r.scores.performance)),
          accessibility: median(runs.map((r) => r.scores.accessibility)),
          bestPractices: median(runs.map((r) => r.scores.bestPractices)),
          seo: median(runs.map((r) => r.scores.seo)),
          lcpMs: median(runs.map((r) => r.metrics.lcpMs)),
          cls: median(runs.map((r) => r.metrics.cls)),
          tbtMs: median(runs.map((r) => r.metrics.tbtMs)),
          fcpMs: median(runs.map((r) => r.metrics.fcpMs)),
        },
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

  const axeTargets = [
    { id: "home", url: `${BASE}/` },
    { id: "home-375", url: `${BASE}/`, viewport: { width: 375, height: 667 } },
    { id: "sprint", url: `${BASE}/sprint` },
    { id: "nexa", url: `${BASE}/projects/nexa` },
    { id: "agromaq", url: `${BASE}/projects/agromaq` },
  ]
  for (const t of axeTargets) {
    if (t.viewport) await page.setViewportSize(t.viewport)
    else await page.setViewportSize({ width: 390, height: 844 })
    console.error(`axe ${t.id}`)
    report.axe[t.id] = await runAxeOn(page, t.url)
  }

  report.nav["375"] = await exerciseNav(page, 375, 667)
  report.nav["390"] = await exerciseNav(page, 390, 844)

  async function gotoHomeEs(width, height) {
    await page.setViewportSize({ width, height })
    await page.goto(`${BASE}/`, { waitUntil: "load", timeout: 60000 })
    await page.waitForTimeout(250)
  }

  await gotoHomeEs(390, 844)
  const product = {
    photos: await page.locator("img[data-lcp-photo]").count(),
    spacexsi: await page.locator("text=SpaceXSI Ambassador").count(),
    trained: await page.locator("text=+300").count(),
    trainedLabel: await page.locator("text=personas capacitadas").count(),
    kraken: await page.locator("text=Kraken").count(),
    agromaq: await page.locator("text=Agromaq").count(),
  }
  report.product = product
  await page.screenshot({ path: join(MEDIA, "home-mobile.png"), fullPage: false })
  await gotoHomeEs(1440, 900)
  await page.screenshot({ path: join(MEDIA, "home-desktop.png"), fullPage: false })

  const scorePath = join(INTERNAL, "scorecard.html")
  writeFileSync(scorePath, scorecardHtml(report))
  await page.setViewportSize({ width: 1100, height: 720 })
  await page.goto(`file://${scorePath}`, { waitUntil: "networkidle" })
  await page.screenshot({ path: join(MEDIA, "lighthouse.png"), fullPage: false })

  await browser.close()
  report.finishedAt = new Date().toISOString()
  report.artifacts = {
    "home-mobile.png": join(MEDIA, "home-mobile.png"),
    "home-desktop.png": join(MEDIA, "home-desktop.png"),
    "lighthouse.png": join(MEDIA, "lighthouse.png"),
  }
  for (const [name, p] of Object.entries(report.artifacts)) {
    report.artifacts[name] = { path: p, exists: existsSync(p) }
  }
  const summaryPath = join(INTERNAL, "summary.json")
  writeFileSync(summaryPath, JSON.stringify(report, null, 2))
  console.log(summaryPath)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
