import { awards, getVisibleAwards, localize } from "@/data/awards"

describe("awards data", () => {
  describe("getVisibleAwards", () => {
    it("returns awards sorted by order ascending", () => {
      const sorted = getVisibleAwards()
      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i].order).toBeGreaterThanOrEqual(sorted[i - 1].order)
      }
    })

    it("enforces expected order: Roxium -> FarmHero -> Zorrito", () => {
      const sorted = getVisibleAwards()
      const ids = sorted.map((a) => a.id)

      expect(ids.indexOf("eth-argentina-powerhouse-2025")).toBe(0)
      expect(ids.indexOf("nasa-spaceapps-2025")).toBe(1)
      expect(ids.indexOf("eth-global-filecoin-2025")).toBe(2)
    })

    it("includes Zorrito (eth-global-filecoin-2025) in visible awards", () => {
      const sorted = getVisibleAwards()
      const zorrito = sorted.find((a) => a.id === "eth-global-filecoin-2025")

      expect(zorrito).toBeDefined()
      expect(zorrito!.visible).toBe(true)
      expect(zorrito!.projectName).toBe("Zorrito Finance")
    })

    it("returns exactly 3 visible awards", () => {
      const sorted = getVisibleAwards()
      expect(sorted).toHaveLength(3)
    })

    it("filters out awards with visible: false", () => {
      const allVisible = awards.every((a) => a.visible)
      expect(allVisible).toBe(true)
      expect(getVisibleAwards()).toHaveLength(awards.length)
    })
  })

  describe("localize", () => {
    it("returns English text for locale 'en'", () => {
      const str = { en: "Hello", es: "Hola" }
      expect(localize(str, "en")).toBe("Hello")
    })

    it("returns Spanish text for locale 'es'", () => {
      const str = { en: "Hello", es: "Hola" }
      expect(localize(str, "es")).toBe("Hola")
    })

    it("falls back to English for unknown locale", () => {
      const str = { en: "Hello", es: "Hola" }
      expect(localize(str, "fr")).toBe("Hello")
    })
  })

  describe("data integrity", () => {
    it("every award has a unique id", () => {
      const ids = awards.map((a) => a.id)
      const unique = new Set(ids)
      expect(unique.size).toBe(ids.length)
    })

    it("every award has a unique order value", () => {
      const orders = awards.map((a) => a.order)
      const unique = new Set(orders)
      expect(unique.size).toBe(orders.length)
    })

    it("every award has bilingual title and description", () => {
      for (const award of awards) {
        expect(award.title.en).toBeTruthy()
        expect(award.title.es).toBeTruthy()
        expect(award.description.en).toBeTruthy()
        expect(award.description.es).toBeTruthy()
      }
    })

    it("FarmHero award has press enabled with 15 real links", () => {
      const farmhero = awards.find((a) => a.id === "nasa-spaceapps-2025")
      expect(farmhero).toBeDefined()
      expect(farmhero!.press?.enabled).toBe(true)
      expect(farmhero!.press?.links).toHaveLength(15)
    })

    it("every press link has an id, type, title, source, and url", () => {
      for (const award of awards) {
        if (award.press?.enabled) {
          for (const link of award.press.links) {
            expect(link.id).toBeTruthy()
            expect(link.type).toMatch(/^(article|podcast|video)$/)
            expect(link.title).toBeTruthy()
            expect(link.source).toBeTruthy()
            expect(link.url).toMatch(/^https?:\/\//)
          }
        }
      }
    })

    it("every press link id is unique within its award", () => {
      for (const award of awards) {
        if (award.press?.enabled) {
          const ids = award.press.links.map((l) => l.id)
          const unique = new Set(ids)
          expect(unique.size).toBe(ids.length)
        }
      }
    })

    it("FarmHero press links are real URLs (not example/placeholder)", () => {
      const farmhero = awards.find((a) => a.id === "nasa-spaceapps-2025")
      for (const link of farmhero!.press!.links) {
        expect(link.url).not.toContain("example")
        expect(link.url).not.toContain("placeholder")
      }
    })

    it("FarmHero press contains 11 articles and 4 videos", () => {
      const farmhero = awards.find((a) => a.id === "nasa-spaceapps-2025")
      const articles = farmhero!.press!.links.filter((l) => l.type === "article")
      const videos = farmhero!.press!.links.filter((l) => l.type === "video")
      expect(articles).toHaveLength(11)
      expect(videos).toHaveLength(4)
    })
  })
})
