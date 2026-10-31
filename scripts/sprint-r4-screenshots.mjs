import { chromium } from "@playwright/test"
import { mkdir } from "node:fs/promises"
import path from "node:path"

const BASE = process.env.BASE_URL || "http://localhost:3000"
const OUT = process.argv[2] || "docs/screenshots/sprint-premium/r4/after"
const THEME = process.env.THEME || "dark"

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
]

const SHOTS = [
  { page: "/sprint", file: "hero", ready: "h1" },
  { page: "/sprint#para-quien", file: "para-quien", ready: "#para-quien" },
  { page: "/sprint#como-funciona", file: "como-funciona", ready: "#como-funciona" },
  { page: "/sprint#ritmo", file: "ritmo", ready: "#ritmo" },
  { page: "/sprint#programa", file: "programa", ready: "#programa" },
  { page: "/sprint#sobre-mi", file: "sobre-mi", ready: "#sobre-mi" },
  { page: "/sprint#faq", file: "faq", ready: "#faq" },
  { page: "/", file: "home", ready: "h1" },
  { page: "/#about", file: "home-about", ready: "#about" },
]

function withTheme(pagePath) {
  if (THEME !== "light") return `${BASE}${pagePath}`
  const [pathname, hash] = pagePath.split("#")
  if (pathname === "/") return `${BASE}${pagePath}`
  const url = `${BASE}${pathname}?theme=light`
  return hash ? `${url}#${hash}` : url
}

const browser = await chromium.launch({ headless: true })
await mkdir(OUT, { recursive: true })

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    colorScheme: THEME === "light" ? "light" : "dark",
    deviceScaleFactor: 1,
  })
  const page = await context.newPage()
  await page.addInitScript((theme) => {
    localStorage.setItem("theme", theme)
    document.documentElement.classList.toggle("dark", theme === "dark")
    document.documentElement.classList.toggle("light", theme === "light")
  }, THEME)

  for (const item of SHOTS) {
    const dest = path.join(OUT, `${item.file}-${vp.name}.png`)
    await page.goto(withTheme(item.page.split("#")[0]), { waitUntil: "networkidle" })
    await page.waitForSelector(item.ready, { timeout: 15000, state: "attached" })
    await page.waitForFunction(() => {
      const bg = getComputedStyle(document.body).backgroundColor
      return bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent"
    })
    await page.waitForTimeout(400)
    if (item.page.includes("#")) {
      const id = item.page.split("#")[1]
      const loc = page.locator(`#${id}`)
      if ((await loc.count()) > 0) {
        await loc.scrollIntoViewIfNeeded()
        await page.waitForTimeout(300)
        if (item.file === "faq") {
          for (const name of ["¿El temario es fijo?", "¿Cuánto tiempo requiere del equipo?"]) {
            const trigger = page.getByRole("button", { name, exact: true })
            if ((await trigger.count()) > 0) {
              await trigger.click({ force: true })
              await page.waitForTimeout(250)
            }
          }
        }
        await loc.screenshot({ path: dest })
        console.log(dest)
        continue
      }
    }
    await page.screenshot({ path: dest, fullPage: false })
    console.log(dest)
  }

  await context.close()
}

await browser.close()
