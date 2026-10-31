import { chromium } from "@playwright/test"
import { mkdir } from "node:fs/promises"

const OUT = process.env.SHOT_DIR || "/workspace/docs/screenshots/sprint-premium/r2"
const PREFIX = process.env.SHOT_PREFIX || "before"
const THEME = process.env.SHOT_THEME || "dark"
const MOBILE_WIDTH = Number(process.env.SHOT_MOBILE_WIDTH || 390)
const EXTRA = (process.env.SHOT_SECTIONS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean)

await mkdir(OUT, { recursive: true })

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: MOBILE_WIDTH, height: 844 },
]

const browser = await chromium.launch({ args: ["--font-render-hinting=none"] })

async function applyTheme(page, theme) {
  await page.evaluate((t) => {
    const root = document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(t)
    root.style.colorScheme = t
  }, theme)
}

async function openSprint(width, height) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 2,
    colorScheme: THEME,
  })
  const page = await context.newPage()
  await page.addInitScript((theme) => {
    try {
      localStorage.setItem("theme", theme)
    } catch {}
  }, THEME)
  await page.goto("http://localhost:3000/sprint", { waitUntil: "networkidle", timeout: 60000 })
  await applyTheme(page, THEME)
  await page.locator("h1").first().waitFor({ state: "visible", timeout: 30000 })
  await page.waitForTimeout(900)
  return { context, page }
}

for (const shot of viewports) {
  const { context, page } = await openSprint(shot.width, shot.height)
  await page.screenshot({
    path: `${OUT}/${PREFIX}-${shot.name}.png`,
    fullPage: false,
  })
  console.log("saved", `${OUT}/${PREFIX}-${shot.name}.png`)

  for (const section of EXTRA) {
    await page.evaluate((id) => {
      const el = document.getElementById(id)
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 12 })
    }, section)
    await page.waitForTimeout(400)
    await page.screenshot({
      path: `${OUT}/${PREFIX}-${shot.name}-${section}.png`,
      fullPage: false,
    })
    console.log("saved", `${OUT}/${PREFIX}-${shot.name}-${section}.png`)
  }

  await context.close()
}

await browser.close()
