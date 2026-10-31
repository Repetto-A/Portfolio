/**
 * Before/after screenshots for portfolio-sprint-premium round 7 (mobile).
 * Usage: node scripts/sprint-premium-r7-mobile-shots.mjs before|after
 */
import { chromium } from "@playwright/test"
import { mkdir } from "node:fs/promises"
import path from "node:path"

const PHASE = process.argv[2] === "after" ? "after" : "before"
const BASE = process.env.BASE_URL || "http://localhost:3000"
const ROOT = path.resolve("docs/screenshots/sprint-premium/r7")
const ARTIFACT_ROOTS = [
  "/opt/cursor/artifacts/sprint-premium-r7",
  "/cursor/stores/self/artifacts/sprint-premium-r7",
]

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
]

const SHOTS = [
  {
    id: "sprint-hero",
    url: "/sprint",
    ready: "h1",
    expect: "Tu empresa deja",
    sprintTheme: "dark",
  },
  {
    id: "sprint-programa",
    url: "/sprint#programa",
    ready: "#programa",
    expect: "Programa modular",
    sprintTheme: "dark",
  },
  {
    id: "sprint-sticky",
    url: "/sprint#programa",
    ready: "#talk-after-program",
    expect: "Agendar una charla",
    sprintTheme: "dark",
    mobileOnly: true,
  },
  {
    id: "sprint-cta",
    url: "/sprint#agendar",
    ready: "#agendar",
    expect: "Hablemos",
    sprintTheme: "dark",
  },
  {
    id: "sprint-about",
    url: "/sprint#sobre-mi",
    ready: "#sobre-mi",
    expect: "SpaceXSI Ambassador",
    sprintTheme: "dark",
  },
  { id: "home", url: "/", ready: "h1", expect: "Alejandro Repetto" },
  { id: "home-about", url: "/#about", ready: "#about", expect: "SpaceXSI Ambassador" },
  { id: "projects", url: "/#projects", ready: "#projects", expect: "Proyectos" },
  { id: "trainings", url: "/#trainings", ready: "#trainings", expect: "De hablar de IA" },
  { id: "contact", url: "/#contact", ready: "#contact", expect: "Hablemos" },
  { id: "projects-cta", url: "/#projects-cta", ready: "#projects-cta", expect: "Agendar una charla" },
]

const LIGHT = [
  {
    id: "sprint-hero",
    url: "/sprint?theme=light",
    ready: "h1",
    expect: "Tu empresa deja",
    sprintTheme: "light",
  },
  { id: "home", url: "/", ready: "h1", expect: "Alejandro Repetto" },
  { id: "contact", url: "/#contact", ready: "#contact", expect: "Hablemos" },
]

async function shotTo(page, dirs, file) {
  for (const dir of dirs) {
    await mkdir(dir, { recursive: true })
    await page.screenshot({ path: path.join(dir, file), fullPage: false })
  }
  console.log("wrote", file)
}

async function preparePage(page, theme) {
  await page.addInitScript((themeValue) => {
    localStorage.setItem("preferred-locale", "es")
    localStorage.setItem("theme", themeValue)
    const root = document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(themeValue)
    root.style.colorScheme = themeValue
  }, theme)
}

async function waitForReady(page, item, theme) {
  await page.waitForSelector(item.ready, { timeout: 20000, state: "attached" })
  if (item.expect) {
    await page.waitForFunction(
      (needle) => document.body.innerText.toLowerCase().includes(needle.toLowerCase()),
      item.expect,
      { timeout: 15000 }
    )
  }
  if (item.sprintTheme) {
    await page.waitForFunction(
      (expected) =>
        document.querySelector(".sprint-page")?.getAttribute("data-sprint-theme") === expected,
      item.sprintTheme,
      { timeout: 10000 }
    )
  } else {
    await page.waitForFunction(
      (expected) => document.documentElement.classList.contains(expected),
      theme,
      { timeout: 10000 }
    )
  }
  await page.waitForFunction(() => {
    const el = document.querySelector("h1, h2, main")
    if (!el) return false
    const family = getComputedStyle(el).fontFamily
    return family.length > 0 && !family.includes("Times")
  })
  await page.evaluate(() => document.fonts?.ready)
  await page.waitForTimeout(400)
}

async function scrollToHash(page, url) {
  if (!url.includes("#")) return
  const hash = url.split("#")[1]
  const loc = page.locator(`#${hash}`)
  if ((await loc.count()) > 0) {
    await loc.evaluate((el) => {
      const top = el.getBoundingClientRect().top + window.scrollY - 72
      window.scrollTo({ top: Math.max(0, top), behavior: "instant" })
    })
    await page.waitForTimeout(350)
  }
}

async function auditMobile(page) {
  const report = await page.evaluate(() => {
    const doc = document.documentElement
    const overflowX = doc.scrollWidth - doc.clientWidth
    const small = []
    const nodes = document.querySelectorAll("a, button, [role='button']")
    for (const el of nodes) {
      const r = el.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) continue
      if (r.height < 44 || r.width < 44) {
        const label = (el.getAttribute("aria-label") || el.textContent || "")
          .trim()
          .replace(/\s+/g, " ")
          .slice(0, 48)
        small.push({
          label,
          w: Math.round(r.width),
          h: Math.round(r.height),
        })
      }
    }
    return { overflowX, small: small.slice(0, 16), smallCount: small.length }
  })
  console.log("audit", JSON.stringify(report))
}

async function captureSet({ browser, shots, theme, colorScheme, outName, viewports }) {
  const repoDir = path.join(ROOT, outName)
  const dirs = [repoDir, ...ARTIFACT_ROOTS.map((root) => path.join(root, outName))]

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
      colorScheme,
      hasTouch: vp.name === "mobile",
      isMobile: vp.name === "mobile",
    })
    const page = await context.newPage()
    await preparePage(page, theme)

    for (const item of shots) {
      if (item.mobileOnly && vp.name !== "mobile") continue
      const target = BASE + item.url
      const nextPath = target.split("#")[0]
      const currentPath = page.url().split("#")[0]
      if (currentPath !== nextPath) {
        await page.goto(nextPath, { waitUntil: "domcontentloaded" })
      }
      await waitForReady(page, item, theme)
      await scrollToHash(page, item.url)
      if (item.id === "sprint-sticky") {
        await page.waitForSelector("#sprint-contact-dock", { timeout: 8000, state: "visible" })
        await page.waitForTimeout(250)
      }
      if (vp.name === "mobile" && ["home", "sprint-hero", "contact"].includes(item.id)) {
        await auditMobile(page)
      }
      await shotTo(page, dirs, `${item.id}-${vp.name}.png`)
      if (vp.name === "mobile" && item.id === "home") {
        await page.evaluate(() => {
          const chip = [...document.querySelectorAll("p")].find((p) =>
            /personas capacitadas/i.test(p.textContent || "")
          )
          chip?.closest("div.grid")?.scrollIntoView({ block: "center", behavior: "instant" })
        })
        await page.waitForTimeout(250)
        await shotTo(page, dirs, `home-photo-${vp.name}.png`)
      }
      if (vp.name === "mobile" && item.id === "projects") {
        await page.evaluate(() => {
          const card = document.querySelector("[data-project-id]")
          const icons = card?.querySelector("a.inline-flex.size-11, a[class*='size-11']")
          ;(icons || card?.querySelector("a"))?.scrollIntoView({ block: "center", behavior: "instant" })
        })
        await page.waitForTimeout(250)
        await shotTo(page, dirs, `projects-icons-${vp.name}.png`)
      }
    }

    await context.close()
  }
}

async function run() {
  const browser = await chromium.launch({ headless: true })
  const viewports = PHASE === "before" ? VIEWPORTS.filter((v) => v.name === "mobile") : VIEWPORTS

  await captureSet({
    browser,
    shots: SHOTS,
    theme: "dark",
    colorScheme: "dark",
    outName: PHASE,
    viewports,
  })

  if (PHASE === "after") {
    await captureSet({
      browser,
      shots: LIGHT,
      theme: "light",
      colorScheme: "light",
      outName: "after-light",
      viewports: VIEWPORTS,
    })
  }

  await browser.close()
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
