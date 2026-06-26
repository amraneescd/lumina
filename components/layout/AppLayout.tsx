"use client"

import { useEffect, useState } from "react"
import { X, Sparkles } from "lucide-react"
import { usePathname } from "next/navigation"
import { useWorkspaceStore } from "@/stores/useWorkspaceStore"
import { useThemeStore } from "@/stores/useThemeStore"
import { Sidebar } from "@/components/sidebar/Sidebar"
import { TopBar } from "@/components/layout/TopBar"
import { CommandPalette } from "@/components/command-palette/CommandPalette"
import { SettingsModal } from "@/components/settings/SettingsModal"
import { ToastSystem } from "@/components/toast/ToastSystem"
import { HelpModal } from "@/components/help/HelpModal"
import { CommentsPanel } from "@/components/comments/CommentsPanel"
import { cn } from "@/lib/utils"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const sidebarCollapsed = useWorkspaceStore((s) => s.sidebarCollapsed)
  const sidebarWidth = useWorkspaceStore((s) => s.sidebarWidth)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const commandPaletteOpen = useWorkspaceStore((s) => s.commandPaletteOpen)
  const settingsOpen = useWorkspaceStore((s) => s.settingsOpen)
  const helpModalOpen = useWorkspaceStore((s) => s.helpModalOpen)
  const commentsPanelOpen = useWorkspaceStore((s) => s.commentsPanelOpen)
  const setCommandPaletteOpen = useWorkspaceStore((s) => s.setCommandPaletteOpen)
  const toggleHelpModal = useWorkspaceStore((s) => s.toggleHelpModal)
  const theme = useThemeStore((s) => s.theme)
  const fontSize = useThemeStore((s) => s.fontSize)
  const reducedMotion = useThemeStore((s) => s.reducedMotion)
  const accentColor = useThemeStore((s) => s.accentColor)
  const pathname = usePathname()

  // Mobile sidebar toggle listener
  useEffect(() => {
    const handleToggleMobile = () => setMobileMenuOpen((prev) => !prev)
    window.addEventListener('toggle-mobile-sidebar', handleToggleMobile)
    return () => window.removeEventListener('toggle-mobile-sidebar', handleToggleMobile)
  }, [])

  // Welcome tooltip - show on first visit
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('base-welcome-seen')
    if (!hasSeenWelcome) {
      const timer = setTimeout(() => setShowWelcome(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const dismissWelcome = () => {
    localStorage.setItem('base-welcome-seen', 'true')
    setShowWelcome(false)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setCommandPaletteOpen(true)
      }
      // Cmd/Ctrl + / (Help)
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault()
        toggleHelpModal()
      }
      // Cmd/Ctrl + Shift + L (Toggle theme)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "L") {
        e.preventDefault()
        const themes: Array<"light" | "dark" | "system"> = ["light", "dark", "system"]
        const currentIdx = themes.indexOf(theme)
        const nextTheme = themes[(currentIdx + 1) % themes.length]
        useThemeStore.getState().setTheme(nextTheme)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [setCommandPaletteOpen, toggleHelpModal, theme])

  // Apply theme
  useEffect(() => {
    const root = document.documentElement
    if (theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [theme])

  // Apply font size
  useEffect(() => {
    const root = document.documentElement
    root.style.fontSize = fontSize === "small" ? "14px" : fontSize === "large" ? "18px" : "16px"
  }, [fontSize])

  // Apply accent color
  useEffect(() => {
    const root = document.documentElement
    const accentColors = {
      blue: "217 91% 60%",
      purple: "258 90% 66%",
      teal: "168 76% 42%",
      rose: "340 82% 52%",
    }
    root.style.setProperty("--primary", accentColors[accentColor])
  }, [accentColor])

  // Reduced motion
  useEffect(() => {
    const root = document.documentElement
    if (reducedMotion) {
      root.classList.add("reduce-motion")
    } else {
      root.classList.remove("reduce-motion")
    }
  }, [reducedMotion])

  return (
    <div className={cn("flex h-screen w-full overflow-hidden bg-background", reducedMotion && "motion-reduce:transition-none")}>
      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 lg:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed lg:static z-40 h-full transition-transform duration-300 ease-in-out",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div
        className="flex flex-1 flex-col min-w-0 transition-all duration-300"
        style={{
          marginLeft: sidebarCollapsed ? 0 : sidebarWidth,
        }}
      >
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>

      {/* Global Overlays */}
      {commandPaletteOpen && <CommandPalette />}
      {settingsOpen && <SettingsModal />}
      {helpModalOpen && <HelpModal />}
      {commentsPanelOpen && <CommentsPanel />}
      <ToastSystem />

      {/* Welcome Tooltip */}
      {showWelcome && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-sm">
          <div className="rounded-xl border bg-popover shadow-2xl p-4 animate-in slide-in-from-bottom-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold">Welcome to the demo</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  This is a live demo of Base — a Notion-inspired workspace. Try the command palette (⌘K), drag cards, or switch themes.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={dismissWelcome}
                    className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Got it
                  </button>
                  <button
                    onClick={dismissWelcome}
                    className="text-xs text-muted-foreground hover:text-foreground px-2 py-1.5"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
              <button onClick={dismissWelcome} className="shrink-0 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
