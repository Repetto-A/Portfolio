#!/usr/bin/env node
/**
 * Lab audits for Performance + a11y (Lighthouse CLI + axe-core + Playwright).
 * Usage: node scripts/r8-perf-a11y-audit.mjs [before|after]
 */
import { execFile } from "node:child_process"
import { createRequire } from "node:module"
import { mkdirSync, writeFileSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { promisify } from "node:util"
import { chromium } from "@playwright/test"

const execFileP = promisify(execFile)
const require = createRequire(import.meta.url)
const axePath = require.resolve("axe-core/axe.min.js")

const PHASE = process.argv[2] === "after" ? "after" : "before"
const BASE = process.env.AUDIT_BASE || "http://localhost:3001"
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const OUT = join(ROOT, "docs/screenshots/sprint-premium/r8", PHASE)
mkdirSync(OUT, { recursive: true })

const PAGES = [
  { id: "home", path: "/", runs: { mobile: 3, desktop: 1 } },
  { id: "sprint", path: "/sprint", runs: { mobile: 3, desktop: 1 } },
  { id: "sprint-light", path: "/sprint?theme=light", runs: { mobile: 1, desktop: 0 } },
  { id: "nexa", path: "/projects/nexa", runs: { mobile: 1, desktop: 0 } },
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
  const failedA11y = Object.values(audits)
    .filter((a) => a?.scoreDisplayMode === "binary" && a.score === 0 && a.id)
    .filter((a) => {
      const cat = cats.accessibility?.auditRefs?.some((r) => r.id === a.id)
      return cat
    })
    .map((a) => ({
      id: a.id,
      title: a.title,
      items: (a.details?.items || []).slice(0, 8).map((item) => item.node?.snippet || item.node?.selector || item),
    }))
  const opportunities = Object.values(audits)
    .filter((a) => a?.details?.type === "opportunity" && (a.numericValue || 0) > 50)
    .sort((a, b) => (b.numericValue || 0) - (a.numericValue || 0))
    .slice(0, 6)
    .map((a) => ({ id: a.id, title: a.title, savingsMs: Math.round(a.numericValue || 0), display: a.displayValue }))
  return {
    fetchTime: report.fetchTime,
    lighthouseVersion: report.lighthouseVersion,
    userAgent: report.userAgent,
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
    lcpElement: audits["largest-contentful-paint-element"]?.details?.items?.[0] || null,
    failedA11y,
    opportunities,
    seoFails: Object.values(audits)
      .filter((a) => cats.seo?.auditRefs?.some((r) => r.id === a.id) && a.score === 0)
      .map((a) => ({ id: a.id, title: a.title })),
    bpFails: Object.values(audits)
      .filter((a) => cats["best-practices"]?.auditRefs?.some((r) => r.id === a.id) && a.score === 0)
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
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 })
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

function contrastRatio(fg, bg) {
  const parse = (c) => {
    const m = String(c).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
    if (!m) return null
    const toLin = (v) => {
      const n = Number(v) / 255
      return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4
    }
    return 0.2126 * toLin(m[1]) + 0.7152 * toLin(m[2]) + 0.0722 * toLin(m[3])
  }
  const L1 = parse(fg)
  const L2 = parse(bg)
  if (L1 == null || L2 == null) return null
  const [hi, lo] = L1 > L2 ? [L1, L2] : [L2, L1]
  return (hi + 0.05) / (lo + 0.05)
}

async function inspectPage(page, url) {
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 })
  return page.evaluate(() => {
    const fn = (fg, bg) => {
      const parse = (c) => {
        const m = String(c).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
        if (!m) return null
        const toLin = (v) => {
          const n = Number(v) / 255
          return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4
        }
        return 0.2126 * toLin(m[1]) + 0.7152 * toLin(m[2]) + 0.0722 * toLin(m[3])
      }
      const L1 = parse(fg)
      const L2 = parse(bg)
      if (L1 == null || L2 == null) return null
      const [hi, lo] = L1 > L2 ? [L1, L2] : [L2, L1]
      return (hi + 0.05) / (lo + 0.05)
    }
    const imgs = [...document.querySelectorAll("img")].map((img) => ({
      src: img.currentSrc || img.src,
      alt: img.getAttribute("alt"),
      width: img.naturalWidth,
      height: img.naturalHeight,
      hasDims: Boolean(img.getAttribute("width") || img.style.aspectRatio || img.parentElement?.className),
    }))
    const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => ({
      tag: h.tagName,
      text: h.textContent?.trim().slice(0, 80),
    }))
    const landmarks = [...document.querySelectorAll("header,nav,main,footer,aside,[role]")].map((el) => ({
      tag: el.tagName,
      role: el.getAttribute("role"),
      aria: el.getAttribute("aria-label"),
      id: el.id,
    }))
    const skip = document.querySelector(".skip-to-main, a[href='#main-content']")
    const muted = document.querySelector(".text-muted-foreground")
    const accent = document.querySelector("[class*='sprint-accent'], .text-\\[var\\(--sprint-accent\\)\\]")
    const sample = (el) => {
      if (!el) return null
      const cs = getComputedStyle(el)
      const bgEl = el.closest("section, main, body, html") || document.body
      const bg = getComputedStyle(bgEl).backgroundColor
      return {
        text: el.textContent?.trim().slice(0, 60),
        color: cs.color,
        bg,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        ratio: fn(cs.color, bg),
      }
    }
    const htmlLang = document.documentElement.lang
    const colorScheme = getComputedStyle(document.documentElement).colorScheme
    const themeClass = document.documentElement.className
    const bodyText = document.body.innerText
    const spacexsi = (bodyText.match(/SpaceXSI/g) || []).length
    const spacexai = (bodyText.match(/SpaceXAI|SpaceX AI/g) || []).length
    const photos = imgs.filter((i) => /alejandro|repetto|profile|foto/i.test(`${i.src} ${i.alt}`))
    const outlineNone = [...document.querySelectorAll("*")].filter((el) => {
      const cs = getComputedStyle(el)
      return cs.outlineStyle === "none" && (el.tagName === "A" || el.tagName === "BUTTON")
    }).length
    return {
      title: document.title,
      htmlLang,
      colorScheme,
      themeClass,
      hasSkip: Boolean(skip),
      skipText: skip?.textContent?.trim() || null,
      hasMain: Boolean(document.querySelector("main")),
      headings,
      landmarks: landmarks.slice(0, 40),
      imgs,
      photos,
      spacexsi,
      spacexai,
      mutedSample: sample(muted),
      accentSample: sample(accent),
      outlineNoneCount: outlineNone,
    }
  })
}

async function keyboardPass(page, url) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 })
  const order = []
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab")
    const info = await page.evaluate(() => {
      const el = document.activeElement
      if (!el) return null
      const r = el.getBoundingClientRect()
      const cs = getComputedStyle(el)
      return {
        tag: el.tagName,
        text: (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 60),
        href: el.getAttribute("href"),
        outline: `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}`,
        boxShadow: cs.boxShadow,
        visible: r.width > 0 && r.height > 0,
      }
    })
    order.push(info)
  }
  return order
}

const report = {
  phase: PHASE,
  base: BASE,
  startedAt: new Date().toISOString(),
  lighthouse: {},
  axe: {},
  inspect: {},
  keyboard: {},
  reducedMotion: {},
}

async function main() {
  console.error(`r8 audit ${PHASE} against ${BASE}`)

  for (const page of PAGES) {
    for (const form of ["mobile", "desktop"]) {
      const n = page.runs[form]
      if (!n) continue
      const runs = []
      for (let i = 0; i < n; i++) {
        const jsonPath = join(OUT, `lh-${page.id}-${form}-${i + 1}.json`)
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
  const page = await context.newPage()

  const axeTargets = [
    { id: "home", url: `${BASE}/` },
    { id: "home-about", url: `${BASE}/`, hash: "#about" },
    { id: "home-projects", url: `${BASE}/`, hash: "#projects" },
    { id: "home-contact", url: `${BASE}/`, hash: "#contact" },
    { id: "sprint", url: `${BASE}/sprint` },
    { id: "sprint-light", url: `${BASE}/sprint?theme=light` },
    { id: "nexa", url: `${BASE}/projects/nexa` },
  ]

  for (const t of axeTargets) {
    console.error(`axe ${t.id}`)
    report.axe[t.id] = await runAxeOn(page, t.url, { hash: t.hash })
  }

  for (const t of [
    { id: "home", url: `${BASE}/` },
    { id: "sprint", url: `${BASE}/sprint` },
    { id: "sprint-light", url: `${BASE}/sprint?theme=light` },
    { id: "nexa", url: `${BASE}/projects/nexa` },
  ]) {
    console.error(`inspect ${t.id}`)
    report.inspect[t.id] = await inspectPage(page, t.url)
  }

  report.keyboard.home = await keyboardPass(page, `${BASE}/`)
  report.keyboard.sprint = await keyboardPass(page, `${BASE}/sprint`)

  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto(`${BASE}/sprint`, { waitUntil: "domcontentloaded" })
  report.reducedMotion.sprint = await page.evaluate(() => {
    const hero = document.querySelector("[data-sprint-hero] h1")
    const cs = hero ? getComputedStyle(hero) : null
    return {
      animationDuration: cs?.animationDuration,
      transitionDuration: cs?.transitionDuration,
      scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
    }
  })

  await browser.close()
  report.finishedAt = new Date().toISOString()
  const summaryPath = join(OUT, "summary.json")
  writeFileSync(summaryPath, JSON.stringify(report, null, 2))
  console.log(summaryPath)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
