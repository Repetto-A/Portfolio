import { test, expect } from "@playwright/test"

test("debug scroll=100% state deep", async ({ page }) => {
  await page.goto("/")
  await page.evaluate(() => document.fonts?.ready)
  await page.waitForTimeout(500)

  // Check pre-scroll state
  const preState = await page.evaluate(() => {
    const hero = document.querySelector("h1")
    const navSpan = document.querySelector("nav a span")
    return {
      heroExists: !!hero,
      heroRect: hero?.getBoundingClientRect(),
      heroInViewport: hero
        ? hero.getBoundingClientRect().bottom > 0 &&
          hero.getBoundingClientRect().top < window.innerHeight
        : false,
      navSpanExists: !!navSpan,
      scrollY: window.scrollY,
    }
  })
  console.log("Pre-scroll:", JSON.stringify(preState, null, 2))

  // Scroll to 100%
  const scrollResult = await page.evaluate(async () => {
    const hero = document.querySelector("h1")
    const navSpan = document.querySelector("nav a span")
    if (!hero || !navSpan) throw new Error("Missing elements")

    const heroRect = hero.getBoundingClientRect()
    const navRect = navSpan.getBoundingClientRect()
    const heroDocTop = heroRect.top + window.scrollY
    const navViewportTop = navRect.top
    const threshold = (heroDocTop - navViewportTop) * 1.4
    const overshoot = Math.max(50, threshold * 0.05)
    const target = threshold + overshoot

    window.scrollTo({ top: target, behavior: "instant" })
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
    await new Promise((r) => setTimeout(r, 100))

    return { threshold, overshoot, target, scrollY: window.scrollY }
  })
  console.log("Scroll result:", JSON.stringify(scrollResult))

  // Wait and poll
  for (let i = 0; i < 15; i++) {
    await page.waitForTimeout(200)

    const state = await page.evaluate(() => {
      const navSpan = document.querySelector("nav a span")
      const link = navSpan?.closest("a")
      const floatingClone = document.querySelector("[aria-hidden='true'].fixed")
      const h1 = document.querySelector("h1")

      // Try to read the scroll-context state by reading what React rendered
      // We can infer animationHasRun from the nav link classes
      const navClasses = link?.className || ""
      const heroClasses = h1?.className || ""

      return {
        scrollY: window.scrollY,
        navOpacity: link ? window.getComputedStyle(link).opacity : "N/A",
        navHasOpacity0: navClasses.includes("opacity-0"),
        heroOpacity: h1 ? window.getComputedStyle(h1).opacity : "N/A",
        heroHasOpacity0: heroClasses.includes("opacity-0"),
        floatingExists: !!floatingClone,
        // The hero gets opacity-0 when: fontsReady && !animationHasRun && (isFloatingTitleActive || scrollProgress >= 1)
        // The nav gets opacity-0 when: !(fontsReady && animationHasRun && scrollProgress >= 1)
        // If both have opacity-0, it means animationHasRun is false but scrollProgress >= 1
      }
    })
    console.log(`Poll ${i}:`, JSON.stringify(state))

    if (!state.navHasOpacity0) {
      console.log("SUCCESS at poll", i)
      break
    }
  }

  // Final check: try triggering scroll events manually
  for (let i = 0; i < 3; i++) {
    await page.evaluate(() => {
      window.scrollTo({ top: window.scrollY + 1, behavior: "instant" })
    })
    await page.waitForTimeout(100)
  }

  const finalState = await page.evaluate(() => {
    const navSpan = document.querySelector("nav a span")
    const link = navSpan?.closest("a")
    return {
      navOpacity: link ? window.getComputedStyle(link).opacity : "N/A",
      navHasOpacity0: link?.className.includes("opacity-0") ?? false,
    }
  })
  console.log("Final:", JSON.stringify(finalState))
})
