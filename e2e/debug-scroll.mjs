import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/");
await page.evaluate(() => document.fonts?.ready);
await page.waitForTimeout(500);

// Step 1: Layout info at scroll=0
const layoutInfo = await page.evaluate(() => {
  const hero = document.querySelector("h1");
  const navSpan = document.querySelector("nav a span");
  if (!hero || !navSpan) return { error: "missing elements" };

  const heroRect = hero.getBoundingClientRect();
  const navRect = navSpan.getBoundingClientRect();
  return {
    heroDocTop: heroRect.top + window.scrollY,
    navViewportTop: navRect.top,
    rawThreshold: heroRect.top + window.scrollY - navRect.top,
    scaledThreshold: (heroRect.top + window.scrollY - navRect.top) * 1.4,
    scrollY: window.scrollY,
  };
});
console.log("Layout at scroll=0:", JSON.stringify(layoutInfo, null, 2));

// Step 2: Scroll to 100% + overshoot
const scrollInfo = await page.evaluate(() => {
  const hero = document.querySelector("h1");
  const navSpan = document.querySelector("nav a span");
  const heroRect = hero.getBoundingClientRect();
  const navRect = navSpan.getBoundingClientRect();
  const heroDocTop = heroRect.top + window.scrollY;
  const threshold = (heroDocTop - navRect.top) * 1.4;
  const overshoot = Math.max(50, threshold * 0.05);
  const target = threshold + overshoot;
  window.scrollTo({ top: target, behavior: "instant" });
  return { threshold, overshoot, target };
});
console.log("Scroll info:", JSON.stringify(scrollInfo, null, 2));

// Wait for React to process
await page.waitForTimeout(2000);

// Step 3: Check nav brand state
const navState = await page.evaluate(() => {
  const navSpan = document.querySelector("nav a span");
  const link = navSpan?.closest("a");
  const floatingClone = document.querySelector("[aria-hidden='true'].fixed");

  return {
    scrollY: window.scrollY,
    navLinkOpacity: link ? window.getComputedStyle(link).opacity : "no link",
    navLinkClasses: link?.className || "no link",
    floatingCloneExists: !!floatingClone,
    // Check hero opacity
    heroOpacity: (() => {
      const h1 = document.querySelector("h1");
      return h1 ? window.getComputedStyle(h1).opacity : "no h1";
    })(),
    heroClasses: document.querySelector("h1")?.className || "no h1",
  };
});
console.log("Nav state after scroll:", JSON.stringify(navState, null, 2));

// Step 4: Try scrolling even further
await page.evaluate(() => {
  window.scrollTo({ top: 1000, behavior: "instant" });
});
await page.waitForTimeout(1000);

const navState2 = await page.evaluate(() => {
  const navSpan = document.querySelector("nav a span");
  const link = navSpan?.closest("a");
  return {
    scrollY: window.scrollY,
    navLinkOpacity: link ? window.getComputedStyle(link).opacity : "no link",
    navLinkClasses: link?.className || "no link",
  };
});
console.log("Nav state at scrollY=1000:", JSON.stringify(navState2, null, 2));

await browser.close();
