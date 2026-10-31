/**
 * @jest-environment node
 */
import {
  TRAINED_PEOPLE_PHRASE,
  generateHomeGraph,
  generateMetadata,
  generatePersonSchema,
  generateProjectPageGraph,
  generateProjectSchema,
  generateSprintPageGraph,
  generateWebSiteSchema,
  serializeJsonLd,
  siteConfig,
  sprintSeo,
} from "@/lib/seo"
import sitemap from "@/app/sitemap"
import robots from "@/app/robots"
import { generateSprintFaqSchema } from "@/lib/sprint/offer"

const EM_DASH = /[\u2014\u2013]/

function dump(...values: unknown[]) {
  return JSON.stringify(values)
}

describe("SEO copy and share metadata", () => {
  it("uses Spanish rioplatense titles and descriptions from existing copy", () => {
    expect(siteConfig.title).toBe("Alejandro Repetto: de hablar de IA a ejecutar con IA")
    expect(siteConfig.description).toContain(
      "Capacito equipos para que dejen de hablar de IA y empiecen a ejecutar"
    )
    expect(siteConfig.locale).toBe("es_AR")
    expect(siteConfig.language).toBe("es-AR")
  })

  it("uses the exact trained-people phrase when the figure appears in meta", () => {
    expect(TRAINED_PEOPLE_PHRASE).toBe("+300 personas capacitadas")
    expect(siteConfig.description).toContain("+300 personas capacitadas")
    expect(siteConfig.description).not.toMatch(/\+300(?! personas capacitadas)/)
  })

  it("does not invent English job titles, Twitter handles, or em dashes", () => {
    const meta = generateMetadata({
      title: siteConfig.title,
      description: siteConfig.description,
    })
    const blob = dump(siteConfig, meta, generatePersonSchema(), generateHomeGraph())

    expect(blob).not.toMatch(EM_DASH)
    expect(blob).not.toContain("Systems Engineer")
    expect(blob).not.toContain("Award-winning")
    expect(blob).not.toContain("@repetto_a")
    expect(meta.twitter).not.toHaveProperty("creator")
    expect(meta.openGraph?.locale).toBe("es_AR")
  })

  it("uses the existing home share card for og:image, not a second portrait", () => {
    expect(siteConfig.ogImage).toBe("https://www.repetto-a.com/og-image.png")
    expect(siteConfig.profileImage).toBe("https://www.repetto-a.com/alejandro.webp")
    expect(siteConfig.ogImage).not.toBe(siteConfig.profileImage)

    const meta = generateMetadata({
      title: siteConfig.title,
      description: siteConfig.description,
      ogImage: siteConfig.ogImage,
      ogImageAlt: siteConfig.ogImageAlt,
    })
    const ogImages = meta.openGraph?.images
    const first = Array.isArray(ogImages) ? ogImages[0] : ogImages
    expect(first).toMatchObject({ url: siteConfig.ogImage, width: 1200, height: 630 })
  })
})

describe("JSON-LD", () => {
  it("describes Alejandro from existing copy without reviews or fake ratings", () => {
    const person = generatePersonSchema()
    const website = generateWebSiteSchema()
    const blob = dump(person, website, generateHomeGraph(), generateSprintPageGraph())

    expect(person.jobTitle).toBe("Software Engineer")
    expect(person.image).toBe(siteConfig.profileImage)
    expect(person.worksFor).toMatchObject({ name: "NEXA" })
    expect(person.memberOf).toMatchObject({ name: "SpaceXSI" })
    expect(blob).not.toContain("aggregateRating")
    expect(blob).not.toContain("reviewCount")
    expect(blob.toLowerCase()).not.toContain("testimonial")
    expect(blob).not.toContain("Banco Nación")
    expect(blob).not.toContain("Universidad Tecnológica Nacional")
    expect(website.description).toBe(siteConfig.description)
  })

  it("does not attach a commercial offer or rating to project schema", () => {
    const withRepo = generateProjectSchema({
      id: "nexa",
      title: "NEXA",
      description: "Red de comunidades tech",
      techStack: ["Next.js"],
      githubUrl: "https://github.com/example/nexa",
      demoUrl: "https://nexa.builders",
    })
    const withoutRepo = generateProjectSchema({
      id: "agromaq",
      title: "Agromaq",
      description: "Cotizador",
      techStack: [],
    })
    const graph = generateProjectPageGraph({
      id: "agromaq",
      title: "Agromaq",
      description: "Cotizador",
      techStack: ["React"],
    })
    const blob = dump(withRepo, withoutRepo, graph)

    expect(withRepo["@type"]).toBe("SoftwareSourceCode")
    expect(withoutRepo["@type"]).toBe("CreativeWork")
    expect(blob).not.toContain("aggregateRating")
    expect(blob).not.toContain('"offers"')
    expect(blob).not.toMatch(EM_DASH)
  })

  it("keeps sprint service schema without prices or ratings", () => {
    const sprint = generateSprintPageGraph()
    const faq = generateSprintFaqSchema()
    const blob = dump(sprint, faq, sprintSeo)

    expect(blob).toContain("AI Execution Sprint")
    expect(blob).not.toContain("aggregateRating")
    expect(blob).not.toContain('"price"')
    expect(blob).not.toMatch(EM_DASH)
    expect(faq["@type"]).toBe("FAQPage")
  })

  it("escapes < in JSON-LD serialization", () => {
    expect(serializeJsonLd({ html: "</script>" })).toContain("\\u003c/script>")
  })
})

describe("sitemap and robots", () => {
  it("lists home, sprint and project URLs on the canonical host", () => {
    const entries = sitemap()
    const urls = entries.map((entry) => entry.url)

    expect(urls).toContain(siteConfig.url)
    expect(urls).toContain(sprintSeo.canonical)
    expect(urls).toContain(`${siteConfig.url}/projects/agromaq`)
    expect(urls).toContain(`${siteConfig.url}/projects/nexa`)
    expect(urls.some((url) => /kraken/i.test(url))).toBe(false)
    expect(urls.some((url) => url.includes("/api/"))).toBe(false)
  })

  it("allows the site and points crawlers to the sitemap", () => {
    const doc = robots()
    expect(doc.sitemap).toBe(`${siteConfig.url}/sitemap.xml`)
    expect(doc.host).toBe(siteConfig.url)
    const rules = Array.isArray(doc.rules) ? doc.rules[0] : doc.rules
    expect(rules?.allow).toBe("/")
    expect(rules?.disallow).toEqual(expect.arrayContaining(["/api/", "/_next/", "/admin/"]))
  })
})
