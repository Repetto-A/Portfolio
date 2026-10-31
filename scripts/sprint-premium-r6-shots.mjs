/**
 * Before/after screenshots for portfolio-sprint-premium round 6 (CTA / contact).
 * Usage: node scripts/sprint-premium-r6-shots.mjs before|after
 */
import { chromium } from "@playwright/test"
import { mkdir } from "node:fs/promises"
import path from "node:path"

const PHASE = process.argv[2] === "after" ? "after" : "before"
const BASE = process.env.BASE_URL || "http://localhost:3000"
const ROOT = path.resolve("docs/screenshots/sprint-premium/r6")
const ARTIFACT_ROOTS = [
  "/opt/cursor/artifacts/sprint-premium-r6",
  "/cursor/stores/self/artifacts/sprint-premium-r6",
]

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
]

const BEFORE_SHOTS = [
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
    id: "sprint-cta",
    url: "/sprint#agendar",
    ready: "#agendar",
    expect: "siguiente paso",
    sprintTheme: "dark",
  },
  { id: "home", url: "/", ready: "h1", expect: "Alejandro Repetto" },
  {
    id: "trainings",
    url: "/#trainings",
    ready: "#trainings",
    expect: "De hablar de IA",
  },
  { id: "contact", url: "/#contact", ready: "#contact", expect: "Escribime" },
]

const AFTER_SHOTS = [
  {
    id: "sprint-hero",
    url: "/sprint",
    ready: "h1",
    expect: "Agendar una charla",
    sprintTheme: "dark",
  },
  {
    id: "sprint-programa",
    url: "/sprint#talk-after-program",
    ready: "#talk-after-program",
    expect: "¿El programa te cierra?",
    sprintTheme: "dark",
  },
  {
    id: "sprint-cta",
    url: "/sprint#agendar",
    ready: "#agendar",
    expect: "Hablemos",
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
  { id: "home", url: "/", ready: "h1", expect: "Agendar una charla" },
  {
    id: "trainings",
    url: "/#trainings-program",
    ready: "#trainings-program",
    expect: "Agendar una charla",
  },
  { id: "contact", url: "/#contact", ready: "#contact", expect: "Hablemos" },
  {
    id: "projects-cta",
    url: "/#projects-cta",
    ready: "#projects-cta",
    expect: "Agendar una charla",
  },
]

const AFTER_LIGHT = [
  {
    id: "sprint-hero",
    url: "/sprint?theme=light",
    ready: "h1",
    expect: "Agendar una charla",
    sprintTheme: "light",
  },
  {
    id: "sprint-cta",
    url: "/sprint?theme=light#agendar",
    ready: "#agendar",
    expect: "Hablemos",
    sprintTheme: "light",
  },
  { id: "home", url: "/", ready: "h1", expect: "Agendar una charla" },
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

async function captureSet({ browser, shots, theme, colorScheme, outName }) {
  const repoDir = path.join(ROOT, outName)
  const dirs = [repoDir, ...ARTIFACT_ROOTS.map((root) => path.join(root, outName))]

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
      colorScheme,
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
      const url = page.url()
      const title = await page.title()
      const h1 = (await page.locator("h1").first().textContent())?.slice(0, 80)
      const cls = await page.evaluate(() => document.documentElement.className)
      const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
      console.log(
        `[${outName}/${vp.name}/${item.id}] url=${url} title=${title} h1=${h1} class=${cls} bg=${bg}`
      )
      if (!title.includes("Alejandro") && !title.includes("AI Execution")) {
        throw new Error(`Unexpected title for ${item.id}: ${title}`)
      }
      await shotTo(page, dirs, `${item.id}-${vp.name}.png`)
    }

    await context.close()
  }
}

async function run() {
  const browser = await chromium.launch({ headless: true })
  const shots = PHASE === "after" ? AFTER_SHOTS : BEFORE_SHOTS

  await captureSet({
    browser,
    shots,
    theme: "dark",
    colorScheme: "dark",
    outName: PHASE,
  })

  if (PHASE === "after") {
    await captureSet({
      browser,
      shots: AFTER_LIGHT,
      theme: "light",
      colorScheme: "light",
      outName: "after-light",
    })
  }

  await browser.close()
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
