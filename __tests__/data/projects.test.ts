import projectsData from "@/content/projects.json"

describe("projects data", () => {
  const projects = projectsData.projects

  it("includes Agromaq and Kraken POS", () => {
    const ids = projects.map((p) => p.id)
    expect(ids).toContain("agromaq")
    expect(ids).toContain("kraken-pos")
  })

  it("places Agromaq and Kraken POS first, at the same visual rank as the rest", () => {
    expect(projects[0].id).toBe("agromaq")
    expect(projects[1].id).toBe("kraken-pos")
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

  it("Agromaq and Kraken POS copy has no em dashes", () => {
    for (const id of ["agromaq", "kraken-pos"]) {
      const project = projects.find((p) => p.id === id)!
      const blob = JSON.stringify(project.locales)
      expect(blob).not.toContain("—")
      expect(blob).not.toContain("–")
    }
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

  it("Kraken POS stays generic without invented clients or a fake demo", () => {
    const kraken = projects.find((p) => p.id === "kraken-pos")!
    expect(kraken.githubUrl).toBeNull()
    expect(kraken.demoUrl).toBeNull()
    expect(kraken.images).toEqual(["/projects/kraken-1.png"])
    expect(kraken.techStack).toEqual([])
    expect(JSON.stringify(kraken.locales).toLowerCase()).not.toContain("testimonio")
    expect(JSON.stringify(kraken.locales).toLowerCase()).not.toContain("testimonial")
  })
})
