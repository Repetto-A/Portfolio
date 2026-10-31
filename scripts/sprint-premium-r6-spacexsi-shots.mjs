/**
 * Screenshots for the SpaceXSI low-key credential (plain text in about).
 * Usage: node scripts/sprint-premium-r6-spacexsi-shots.mjs
 */
import { chromium } from "@playwright/test"
import { mkdir } from "node:fs/promises"
import path from "node:path"

const BASE = process.env.BASE_URL || "http://localhost:3000"
const ROOT = path.resolve("docs/screenshots/sprint-premium/r6-spacexsi")
const ARTIFACT_ROOTS = [
  "/opt/cursor/artifacts/sprint-premium-r6-spacexsi",
  "/cursor/stores/self/artifacts/sprint-premium-r6-spacexsi",
]

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
]

const SHOTS = [
  {
    id: "sprint-about",
    url: "/sprint#sobre-mi",
    ready: "#sobre-mi",
    expect: "SpaceXSI Ambassador",
    sprintTheme: "dark",
  },
  {
    id: "sprint-programa",
    url: "/sprint#programa",
    ready: "#programa",
    expect: "El eje es Cursor y Grok Bot",
    sprintTheme: "dark",
  },
  { id: "home-about", url: "/#about", ready: "#about", expect: "SpaceXSI Ambassador" },
  { id: "home-skills", url: "/#skills", ready: "#skills", expect: "Cursor, Grok Bot" },
  { id: "home-trainings", url: "/#trainings", ready: "#trainings", expect: "Cursor y Grok Bot" },
]

const LIGHT = [
  {
    id: "sprint-about",
    url: "/sprint?theme=light#sobre-mi",
    ready: "#sobre-mi",
    expect: "SpaceXSI Ambassador",
    sprintTheme: "light",
  },
  { id: "home-about", url: "/#about", ready: "#about", expect: "SpaceXSI Ambassador" },
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
      const target = BASE + item.url
      const nextPath = target.split("#")[0]
      const currentPath = page.url().split("#")[0]
      if (currentPath !== nextPath) {
        await page.goto(nextPath, { waitUntil: "domcontentloaded" })
      }
      await waitForReady(page, item, theme)
      await scrollToHash(page, item.url)
      await shotTo(page, dirs, `${item.id}-${vp.name}.png`)
    }

    await context.close()
  }
}

async function run() {
  const browser = await chromium.launch({ headless: true })
  await captureSet({
    browser,
    shots: SHOTS,
    theme: "dark",
    colorScheme: "dark",
    outName: "after",
  })
  await captureSet({
    browser,
    shots: LIGHT,
    theme: "light",
    colorScheme: "light",
    outName: "after-light",
  })
  await browser.close()
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
