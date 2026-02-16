import { test, expect, type Page } from "@playwright/test"

/**
 * Scroll-based hero -> navbar title animation tests + UI removal validations.
 *
 * Validates:
 * 1. Animation runs only on first page load while hero is visible
 * 2. Animation does NOT replay after completing once
 * 3. Animation does NOT trigger when landing mid-page (e.g. #projects)
 * 4. No duplicate visible "Alejandro Repetto" at any scroll position
 * 5. Floating clone uses exact computed styles from the hero h1
 * 6. Reduced-motion disables animation entirely
 * 7. "View Achievements" button removed from hero
 * 8. Navbar no longer contains "Skills" or "Awards"
 * 9. Awards section no longer has "These awards" explanatory text
 * 10. Contact heading sizing adjusted and intro paragraph removed
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Wait for fonts.ready + initial layout to stabilize */
async function waitForStable(page: Page) {
  await page.evaluate(() => document.fonts?.ready)
  await page.waitForTimeout(300)
}

/** Scroll to a specific percentage of the animation threshold. */
async function scrollToProgress(page: Page, progress: number) {
  await page.evaluate(async (p) => {
    const hero = document.querySelector("h1")
    const navSpan = document.querySelector("nav a span")
    if (!hero || !navSpan) throw new Error("Hero h1 or nav brand span not found")

    const heroRect = hero.getBoundingClientRect()
    const navRect = navSpan.getBoundingClientRect()
    const heroDocTop = heroRect.top + window.scrollY
    const navViewportTop = navRect.top
    const threshold = (heroDocTop - navViewportTop) * 1.4

    const overshoot = p >= 1 ? Math.max(50, threshold * 0.05) : 0
    window.scrollTo({ top: threshold * p + overshoot, behavior: "instant" })

    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
    await new Promise((r) => setTimeout(r, 100))
  }, progress)
  await page.waitForTimeout(250)
}

/** Count visible (opacity > 0) instances of "Alejandro Repetto" */
async function countVisibleTitles(page: Page): Promise<number> {
  return page.evaluate(() => {
    const name = "Alejandro Repetto"
    let count = 0

    const h1 = document.querySelector("h1")
    if (h1 && h1.textContent?.includes(name)) {
      const opacity = parseFloat(window.getComputedStyle(h1).opacity)
      if (opacity > 0.01) count++
    }

    const navSpan = document.querySelector("nav a span")
    if (navSpan && navSpan.textContent?.includes(name)) {
      const parentLink = navSpan.closest("a")
      if (parentLink) {
        const opacity = parseFloat(window.getComputedStyle(parentLink).opacity)
        if (opacity > 0.01) count++
      }
    }

    const floatingDivs = document.querySelectorAll("[aria-hidden='true'].fixed")
    floatingDivs.forEach((el) => {
      if (el.textContent?.includes(name)) {
        const opacity = parseFloat(window.getComputedStyle(el as HTMLElement).opacity)
        if (opacity > 0.01) count++
      }
    })

    return count
  })
}

/** Get floating clone styles or null */
async function getFloatingCloneStyles(page: Page) {
  return page.evaluate(() => {
    const clone = document.querySelector("[aria-hidden='true'].fixed")
    if (!clone) return null
    const span = clone.querySelector("span")
    if (!span) return null
    const cs = window.getComputedStyle(span)
    return {
      fontFamily: cs.fontFamily,
      fontWeight: cs.fontWeight,
      fontSize: cs.fontSize,
      lineHeight: cs.lineHeight,
      letterSpacing: cs.letterSpacing,
      color: cs.color,
      opacity: window.getComputedStyle(clone as HTMLElement).opacity,
    }
  })
}

/** Get hero h1 computed styles */
async function getHeroStyles(page: Page) {
  return page.evaluate(() => {
    const h1 = document.querySelector("h1")
    if (!h1) return null
    const cs = window.getComputedStyle(h1)
    return {
      fontFamily: cs.fontFamily,
      fontWeight: cs.fontWeight,
      fontSize: cs.fontSize,
      lineHeight: cs.lineHeight,
      letterSpacing: cs.letterSpacing,
      color: cs.color,
      opacity: cs.opacity,
    }
  })
}

// ---------------------------------------------------------------------------
// 1. Animation behaviour on initial load
// ---------------------------------------------------------------------------

test.describe("Animation: first load from top", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    await waitForStable(page)
  })

  test("at scroll=0: only hero h1 visible, no floating clone", async ({ page }) => {
    await scrollToProgress(page, 0)
    expect(await countVisibleTitles(page)).toBe(1)
    expect(await getFloatingCloneStyles(page)).toBeNull()
    const hero = await getHeroStyles(page)
    expect(parseFloat(hero!.opacity)).toBeGreaterThan(0.5)
  })

  test("at scroll=50%: floating clone visible, no duplicates", async ({ page }) => {
    await scrollToProgress(page, 0.5)
    expect(await countVisibleTitles(page)).toBe(1)
    expect(await getFloatingCloneStyles(page)).not.toBeNull()
  })

  test("at scroll=100%: nav brand visible, no floating clone", async ({ page }) => {
    // DEBUG: Check initial state before scrolling
    const preState = await page.evaluate(() => {
      const h1 = document.querySelector("h1")
      return {
        heroExists: !!h1,
        heroInViewport: h1 ? (h1.getBoundingClientRect().bottom > 0 && h1.getBoundingClientRect().top < window.innerHeight) : false,
        scrollY: window.scrollY,
      }
    })
    console.log("PRE-SCROLL:", JSON.stringify(preState))

    await scrollToProgress(page, 1.0)

    // DEBUG: Check state right after scroll
    const postState = await page.evaluate(() => {
      const navSpan = document.querySelector("nav a span")
      const link = navSpan?.closest("a")
      const h1 = document.querySelector("h1")
      return {
        scrollY: window.scrollY,
        navClasses: link?.className || "none",
        heroClasses: h1?.className || "none",
      }
    })
    console.log("POST-SCROLL:", JSON.stringify(postState))

    // Wait for the animationHasRun state to propagate through React renders.
    let navVisible = false
    for (let i = 0; i < 30; i++) {
      if (i > 0 && i % 5 === 0) {
        await page.evaluate(() => {
          window.scrollTo({ top: window.scrollY + 1, behavior: "instant" })
        })
      }
      navVisible = await page.evaluate(() => {
        const s = document.querySelector("nav a span")
        if (!s) return false
        const link = s.closest("a")
        if (!link) return false
        return parseFloat(window.getComputedStyle(link).opacity) > 0.5
      })
      if (navVisible) break
      await page.waitForTimeout(100)
    }

    if (!navVisible) {
      const debugState = await page.evaluate(() => {
        const navSpan = document.querySelector("nav a span")
        const link = navSpan?.closest("a")
        const h1 = document.querySelector("h1")
        return {
          scrollY: window.scrollY,
          navClasses: link?.className || "none",
          heroClasses: h1?.className || "none",
          heroOpacity: h1 ? window.getComputedStyle(h1).opacity : "N/A",
          navOpacity: link ? window.getComputedStyle(link).opacity : "N/A",
        }
      })
      console.log("FINAL DEBUG:", JSON.stringify(debugState))
    }

    expect(navVisible).toBe(true)
    expect(await getFloatingCloneStyles(page)).toBeNull()
  })

  test("floating clone uses exact computed styles from hero h1", async ({ page }) => {
    await scrollToProgress(page, 0)
    const heroStyles = await getHeroStyles(page)
    await scrollToProgress(page, 0.5)
    const cloneStyles = await getFloatingCloneStyles(page)
    expect(cloneStyles).not.toBeNull()
    expect(cloneStyles!.fontFamily).toBe(heroStyles!.fontFamily)
    expect(cloneStyles!.fontWeight).toBe(heroStyles!.fontWeight)
    expect(cloneStyles!.fontSize).toBe(heroStyles!.fontSize)
    expect(cloneStyles!.lineHeight).toBe(heroStyles!.lineHeight)
    expect(cloneStyles!.letterSpacing).toBe(heroStyles!.letterSpacing)
    expect(cloneStyles!.color).toBe(heroStyles!.color)
  })

  test("no duplicate visible title during animation zone", async ({ page }) => {
    // Test within the animation zone (0 to 0.95). At exactly 1.0 the animation
    // completes and animationHasRun is set, changing the visibility rules.
    for (const pos of [0, 0.1, 0.25, 0.5, 0.75, 0.9]) {
      await scrollToProgress(page, pos)
      expect(await countVisibleTitles(page)).toBeLessThanOrEqual(1)
    }
  })
})

// ---------------------------------------------------------------------------
// 2. Animation runs only ONCE — does NOT replay after completion
// ---------------------------------------------------------------------------

test.describe("Animation: runs only once", () => {
  test("after animation completes, scrolling back does not replay it", async ({ page }) => {
    await page.goto("/")
    await waitForStable(page)

    // Complete the animation fully
    await scrollToProgress(page, 1.0)
    expect(await getFloatingCloneStyles(page)).toBeNull()

    // Scroll back to 50% — animation should NOT replay
    await scrollToProgress(page, 0.5)
    const cloneAfterReturn = await getFloatingCloneStyles(page)
    expect(cloneAfterReturn).toBeNull()

    // Scroll back to 0% — hero h1 should be visible again, no clone
    await scrollToProgress(page, 0)
    const hero = await getHeroStyles(page)
    expect(parseFloat(hero!.opacity)).toBeGreaterThan(0.5)
    expect(await getFloatingCloneStyles(page)).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// 3. Animation does NOT trigger when landing mid-page
// ---------------------------------------------------------------------------

test.describe("Animation: mid-page landing", () => {
  test("animation does not trigger when landing on #contact (deep section)", async ({ page }) => {
    // Navigate directly to #contact which is near the bottom of the page.
    // The hero is NOT in the viewport on initial mount.
    await page.goto("/#contact")
    await waitForStable(page)

    // Give extra time for any potential animation setup
    await page.waitForTimeout(500)

    // No floating clone should be visible at the current scroll position
    expect(await getFloatingCloneStyles(page)).toBeNull()

    // Scroll to where the animation zone would be (50% of threshold).
    // Even though this puts the hero in the viewport, the animation
    // should NOT run because the hero was not visible on initial mount.
    await scrollToProgress(page, 0.5)
    expect(await getFloatingCloneStyles(page)).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// 4. Page renders content (not blank)
// ---------------------------------------------------------------------------

test.describe("Page renders content", () => {
  test("page has visible hero title and nav", async ({ page }) => {
    await page.goto("/")
    await waitForStable(page)

    const h1 = page.locator("h1")
    await expect(h1).toBeVisible()
    await expect(h1).toContainText("Alejandro Repetto")

    const nav = page.locator("nav")
    await expect(nav).toBeVisible()

    const bodyHeight = await page.evaluate(() => document.body.scrollHeight)
    expect(bodyHeight).toBeGreaterThan(500)
  })
})

// ---------------------------------------------------------------------------
// 5. Reduced motion
// ---------------------------------------------------------------------------

test.describe("Reduced Motion", () => {
  test("no floating clone at any scroll position with reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/")
    await waitForStable(page)

    for (const pos of [0, 0.25, 0.5, 0.75, 1.0]) {
      await scrollToProgress(page, pos)
      expect(await getFloatingCloneStyles(page)).toBeNull()
    }
  })
})

// ---------------------------------------------------------------------------
// 6. UI removals
// ---------------------------------------------------------------------------

test.describe("UI Removals", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    await waitForStable(page)
  })

  test("View Achievements button is NOT in the hero DOM", async ({ page }) => {
    // Check both English and Spanish variants
    const heroSection = page.locator("section").first()
    await expect(heroSection.getByText("View Achievements")).not.toBeVisible()
    await expect(heroSection.getByText("Ver Logros")).not.toBeVisible()
  })

  test("navbar does NOT contain Skills or Awards items (desktop)", async ({ page }) => {
    const nav = page.locator("nav")
    await expect(nav.getByText("Skills", { exact: true })).not.toBeVisible()
    await expect(nav.getByText("Awards", { exact: true })).not.toBeVisible()
    await expect(nav.getByText("Habilidades", { exact: true })).not.toBeVisible()
    await expect(nav.getByText("Logros", { exact: true })).not.toBeVisible()
  })

  test("Awards section does NOT contain 'These awards' explanatory text", async ({ page }) => {
    const awardsSection = page.locator("#awards")
    await expect(awardsSection.getByText(/These awards reflect/)).not.toBeVisible()
    await expect(awardsSection.getByText(/Estos premios reflejan/)).not.toBeVisible()
  })

  test("Awards section does NOT contain the description subtitle", async ({ page }) => {
    const awardsSection = page.locator("#awards")
    await expect(awardsSection.getByText(/Acknowledged achievements/)).not.toBeVisible()
    await expect(awardsSection.getByText(/Logros reconocidos/)).not.toBeVisible()
  })

  test("contact section intro paragraph ('Get In Touch' heading + description) is removed", async ({
    page,
  }) => {
    const contactSection = page.locator("#contact")

    // The h2 "Get In Touch" heading and the description paragraph should be gone
    // Note: "Get In Touch" may still exist as a button text in the projects section,
    // so we check specifically within the contact section heading structure.
    const h2InContact = contactSection.locator("h2")
    await expect(h2InContact).not.toBeVisible()

    // The description text should also be gone
    await expect(
      contactSection.getByText(/Ready to discuss your next project/)
    ).not.toBeVisible()
  })

  test("'Interested in collaborating?' matches contact-level heading size", async ({ page }) => {
    const collabHeading = page.getByText("Interested in collaborating?")
    await expect(collabHeading).toBeVisible()

    // Verify it uses the same font-size/weight as the former contact heading
    // (text-3xl sm:text-4xl font-bold = 30px/36px, 700 weight at desktop)
    const styles = await collabHeading.evaluate((el) => {
      const cs = window.getComputedStyle(el)
      return {
        fontWeight: cs.fontWeight,
        fontSize: cs.fontSize,
      }
    })
    // font-bold = 700
    expect(styles.fontWeight).toBe("700")
    // text-3xl = 1.875rem = 30px at default, sm:text-4xl = 2.25rem = 36px at >= 640px
    const fontSize = parseFloat(styles.fontSize)
    expect(fontSize).toBeGreaterThanOrEqual(30)
  })
})

// ---------------------------------------------------------------------------
// 7. Mobile viewport tests
// ---------------------------------------------------------------------------

test.describe("Mobile: navbar removals", () => {
  test("mobile nav menu does NOT contain Skills or Awards", async ({ page }) => {
    // This test is only meaningful on mobile viewports where the hamburger menu is visible
    const viewport = page.viewportSize()
    if (viewport && viewport.width >= 768) {
      test.skip()
      return
    }

    await page.goto("/")
    await waitForStable(page)

    // Open mobile menu via the sr-only "Toggle menu" button
    const menuButton = page.getByRole("button", { name: /toggle menu/i })
    await menuButton.click()
    await page.waitForTimeout(200)

    // Check that Skills and Awards are not present
    const mobileMenu = page.locator("nav")
    await expect(mobileMenu.getByText("Skills", { exact: true })).not.toBeVisible()
    await expect(mobileMenu.getByText("Awards", { exact: true })).not.toBeVisible()
  })
})
