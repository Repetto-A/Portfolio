import { chromium } from "@playwright/test"
import { mkdir } from "node:fs/promises"

const OUT = process.env.SHOT_DIR || "/workspace/docs/screenshots/sprint-premium/r1"
const PREFIX = process.env.SHOT_PREFIX || "before"
const THEME = process.env.SHOT_THEME || "dark"

await mkdir(OUT, { recursive: true })

const shots = [
  { name: `${PREFIX}-desktop`, width: 1440, height: 900 },
  { name: `${PREFIX}-mobile`, width: 375, height: 812 },
]

const browser = await chromium.launch({ args: ["--font-render-hinting=none"] })

for (const shot of shots) {
  const context = await browser.newContext({
    viewport: { width: shot.width, height: shot.height },
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
  await page.evaluate((theme) => {
    const root = document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
    root.style.colorScheme = theme
  }, THEME)
  await page.waitForTimeout(900)
  await page.screenshot({
    path: `${OUT}/${shot.name}.png`,
    fullPage: false,
  })
  console.log("saved", `${OUT}/${shot.name}.png`)
  await context.close()
}

await browser.close()
