export const designTokens = {
  spacing: {
    section: {
      default: "py-24",
      compact: "py-16",
      relaxed: "py-32",
    },
    container: {
      padding: "px-4 sm:px-6 lg:px-8",
    },
  },
  maxWidth: {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "4xl": "max-w-4xl",
    "7xl": "max-w-7xl",
  },
  typography: {
    heading: {
      h1: "text-4xl sm:text-5xl lg:text-6xl font-bold",
      h2: "text-3xl sm:text-4xl font-bold",
      h3: "text-2xl sm:text-3xl font-bold",
      h4: "text-xl sm:text-2xl font-semibold",
    },
    body: {
      large: "text-lg leading-relaxed",
      base: "text-base leading-normal",
      small: "text-sm leading-normal",
    },
  },
  borderRadius: {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    full: "rounded-full",
  },
  shadow: {
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
  },
} as const

export type DesignTokens = typeof designTokens
