import { fireEvent, render, screen } from "@testing-library/react"
import { I18nProvider } from "@/lib/i18n-context"
import { ProjectsSection } from "@/components/sections/projects-section"
import { PROFILE_PHOTO_SRC } from "@/lib/media"
import projectsData from "@/content/projects.json"

const push = jest.fn()

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}))

function renderProjects(projects?: Parameters<typeof ProjectsSection>[0]["projects"]) {
  return render(
    <I18nProvider>
      <ProjectsSection projects={projects} />
    </I18nProvider>
  )
}

describe("ProjectsSection grid", () => {
  beforeEach(() => {
    push.mockReset()
  })

  it("renders each project as a link to its case page", () => {
    renderProjects()

    const agromaq = screen.getByRole("link", { name: /open project agromaq/i })
    expect(agromaq).toHaveAttribute("href", "/projects/agromaq")

    const nexa = screen.getByRole("link", { name: /open project nexa/i })
    expect(nexa).toHaveAttribute("href", "/projects/nexa")
  })

  it("exposes the grid as a labelled list", () => {
    renderProjects()
    expect(screen.getByRole("list", { name: "Project list" })).toBeInTheDocument()
    expect(screen.getAllByRole("listitem")).toHaveLength(projectsData.projects.length)
  })

  it("keeps github and demo as real links with accessible names", () => {
    renderProjects()

    const demo = screen.getByRole("link", { name: /open live demo of agromaq/i })
    expect(demo).toHaveAttribute("href", "https://cotizador.nexa.builders")
    expect(demo).toHaveAttribute("target", "_blank")
  })

  it("does not put Alejandro's photo on the cards", () => {
    const { container } = renderProjects()
    expect(container.innerHTML).not.toContain(PROFILE_PHOTO_SRC)
    expect(container.innerHTML).not.toContain("alejandro.webp")
  })

  it("does not add a SpaceXSI logo on the cards", () => {
    const { container } = renderProjects()
    expect(container.innerHTML.toLowerCase()).not.toContain("spacexsi")
    expect(container.querySelectorAll("img[alt*='SpaceX' i]")).toHaveLength(0)
  })

  it("shows an empty state when there are no projects", () => {
    renderProjects([])
    expect(screen.getByRole("status")).toHaveTextContent("There are no projects to show")
    expect(screen.queryByRole("list", { name: "Project list" })).not.toBeInTheDocument()
  })

  it("opens an existing project from the awards event", () => {
    renderProjects()
    fireEvent(window, new CustomEvent("open-project", { detail: "nexa" }))
    expect(push).toHaveBeenCalledWith("/projects/nexa")
  })
})
