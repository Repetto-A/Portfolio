import projectsData from "@/content/projects.json"

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
