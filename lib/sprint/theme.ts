export type SprintTheme = "light" | "dark"

/**
 * Preview del tema claro: `/sprint?theme=light`.
 * Cualquier otro valor (o ninguno) deja el default oscuro.
 * No se indexa el query param: el canonical sigue siendo /sprint.
 */
export function getSprintTheme(
  searchParams: { [key: string]: string | string[] | undefined } | undefined
): SprintTheme {
  const raw = searchParams?.theme
  const value = Array.isArray(raw) ? raw[0] : raw
  return value === "light" ? "light" : "dark"
}
