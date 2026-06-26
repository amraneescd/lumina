"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

type Theme = "light" | "dark" | "system"
type SidebarDensity = "default" | "compact"
type AccentColor = "blue" | "purple" | "teal" | "rose"

interface ThemeState {
  theme: Theme
  sidebarDensity: SidebarDensity
  fontSize: "small" | "medium" | "large"
  reducedMotion: boolean
  accentColor: AccentColor

  setTheme: (theme: Theme) => void
  setSidebarDensity: (density: SidebarDensity) => void
  setFontSize: (size: "small" | "medium" | "large") => void
  setReducedMotion: (reduced: boolean) => void
  setAccentColor: (color: AccentColor) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "system",
      sidebarDensity: "default",
      fontSize: "medium",
      reducedMotion: false,
      accentColor: "blue",

      setTheme: (theme) => set({ theme }),
      setSidebarDensity: (sidebarDensity) => set({ sidebarDensity }),
      setFontSize: (fontSize) => set({ fontSize }),
      setReducedMotion: (reducedMotion) => set({ reducedMotion }),
      setAccentColor: (accentColor) => set({ accentColor }),
    }),
    {
      name: "base-theme-storage",
    }
  )
)
