import sitemap from "@/app/sitemap"
import projectsData from "@/content/projects.json"
import type { ProjectCaseStudy } from "@/types/project"

const EMDASH = "\u2014"
const EN_DASH = "\u2013"

function collectStrings(value: unknown, acc: string[] = []): string[] {
  if (typeof value === "string") {
    acc.push(value)
    return acc
  }
  if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, acc)
    return acc
  }
  if (value && typeof value === "object") {
    for (const nested of Object.values(value)) collectStrings(nested, acc)
  }
  return acc
}

describe("projects data", () => {
  const projects = projectsData.projects

  it("includes Agromaq and does not include Kraken POS", () => {
    const ids = projects.map((p) => p.id)
    expect(ids).toContain("agromaq")
    expect(ids).not.toContain("kraken-pos")
    expect(JSON.stringify(projectsData).toLowerCase()).not.toContain("kraken")
  })

  it("places Agromaq first, at the same visual rank as the rest", () => {
    expect(projects[0].id).toBe("agromaq")
  })

  it("never re-adds Kraken POS in ids, titles, copy, images or routes", () => {
    const blob = JSON.stringify(projectsData).toLowerCase()
    expect(blob).not.toContain("kraken")
    expect(blob).not.toContain("kraken-pos")
    expect(blob).not.toContain("/projects/kraken")

    const urls = sitemap().map((entry) => entry.url.toLowerCase())
    expect(urls.some((url) => url.includes("kraken"))).toBe(false)
    expect(urls.some((url) => url.includes("/projects/agromaq"))).toBe(true)
  })

  it("every project has a unique id", () => {
    const ids = projects.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it("every project has bilingual title, short, description and features", () => {
    for (const project of projects) {
      for (const locale of ["en", "es"] as const) {
        const copy = project.locales[locale]
        expect(copy.title).toBeTruthy()
        expect(copy.short).toBeTruthy()
        expect(copy.description).toBeTruthy()
        expect(copy.features.length).toBeGreaterThan(0)
      }
    }
  })

  it("Agromaq copy has no em dashes", () => {
    const project = projects.find((p) => p.id === "agromaq")!
    const blob = JSON.stringify(project.locales)
    expect(blob).not.toContain("—")
    expect(blob).not.toContain("–")
  })

  it("Agromaq has a live demo and DEMO screenshots", () => {
    const agromaq = projects.find((p) => p.id === "agromaq")!
    expect(agromaq.demoUrl).toBe("https://cotizador.nexa.builders")
    expect(agromaq.images).toEqual([
      "/projects/agromaq-1.png",
      "/projects/agromaq-2.png",
      "/projects/agromaq-3.png",
    ])
    expect(agromaq.githubUrl).toBeNull()
  })
})

describe("project case studies", () => {
  const projects = projectsData.projects

  it("covers every existing project with bilingual case study copy", () => {
    expect(projects.length).toBeGreaterThanOrEqual(10)
    for (const project of projects) {
      const caseStudy = (project as { caseStudy?: ProjectCaseStudy }).caseStudy
      expect(caseStudy).toBeDefined()
      expect(caseStudy!.problem.es).toBeTruthy()
      expect(caseStudy!.problem.en).toBeTruthy()
      expect(caseStudy!.approach.es).toBeTruthy()
      expect(caseStudy!.approach.en).toBeTruthy()
      expect(caseStudy!.result.es).toBeTruthy()
      expect(caseStudy!.result.en).toBeTruthy()
      expect(caseStudy!.facts?.length).toBeGreaterThan(0)
    }
  })

  it("keeps user-facing project copy free of em dashes", () => {
    const strings = collectStrings(projects)
    for (const value of strings) {
      expect(value).not.toContain(EMDASH)
      expect(value).not.toContain(EN_DASH)
    }
  })

  it("does not invent testimonials or change the training figure", () => {
    const blob = collectStrings(projects).join("\n")
    expect(blob.toLowerCase()).not.toContain("testimonio")
    expect(blob.toLowerCase()).not.toContain("testimonial")
    expect(blob).not.toContain("+300")
    expect(blob).not.toMatch(/SpaceXSI/i)
  })

  it("keeps published facts for flagship projects", () => {
    const byId = Object.fromEntries(projects.map((project) => [project.id, project]))

    expect(byId.nexa.locales.es.short).toContain("+50")
    expect(byId.nexa.locales.es.short).toContain("+3M")
    expect(byId["somos-huella"].demoUrl).toBe("https://somoshuella.org")
    expect(byId.farmhero.locales.es.short).toMatch(/Ganador Regional/i)
    expect(byId["nasa-spaceapps"].locales.es.short).toMatch(/2do puesto/i)
    expect(byId["lavirginia-qc"].locales.es.description).toContain("La Virginia")
    expect(byId["braintumorai-web"].locales.en.description).toContain("95.4%")
    expect(byId.agromaq.demoUrl).toBe("https://cotizador.nexa.builders")
  })
})
