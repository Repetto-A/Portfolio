import { render, screen } from "@testing-library/react"
import { Navigation } from "@/components/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import jest from "jest" // Import jest to fix the undeclared variable error

// Mock next-themes
jest.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "dark",
    setTheme: jest.fn(),
  }),
}))

const NavigationWithTheme = () => (
  <ThemeProvider attribute="class" defaultTheme="dark">
    <Navigation />
  </ThemeProvider>
)

describe("Navigation", () => {
  it("renders navigation items", () => {
    render(<NavigationWithTheme />)

    expect(screen.getByText("Alejandro Repetto")).toBeInTheDocument()
    expect(screen.getByText("About")).toBeInTheDocument()
    expect(screen.getByText("Projects")).toBeInTheDocument()
    expect(screen.getByText("Blog")).toBeInTheDocument()
    expect(screen.getByText("Contact")).toBeInTheDocument()
  })

  it("has proper accessibility attributes", () => {
    render(<NavigationWithTheme />)

    const nav = screen.getByRole("navigation")
    expect(nav).toBeInTheDocument()

    const themeToggle = screen.getByLabelText("Toggle theme")
    expect(themeToggle).toBeInTheDocument()
  })
})
