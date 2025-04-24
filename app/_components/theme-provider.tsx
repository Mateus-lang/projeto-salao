"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"

// Defina o tipo Attribute para corresponder ao esperado pelo NextThemesProvider
type Attribute = "class" | "data-theme" | "data-mode"

type ThemeProviderProps = {
  children: React.ReactNode
  attribute?: Attribute | Attribute[]
  defaultTheme?: string
  enableSystem?: boolean
  storageKey?: string
  forcedTheme?: string
  disableTransitionOnChange?: boolean
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
