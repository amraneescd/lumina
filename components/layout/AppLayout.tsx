"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useWorkspaceStore } from "@/stores/useWorkspaceStore"
import { useThemeStore } from "@/stores/useThemeStore"
import { Sidebar } from "@/components/sidebar/Sidebar"
import { TopBar } from "@/components/layout/TopBar"
import { CommandPalette } from "@/components/command-palette/CommandPalette"
import { SettingsModal } from "@/components/settings/SettingsModal"
import { FakeCursors } from "@/components/collaboration/FakeCursors"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const sidebarCollapsed = useWorkspaceStore((s) => s.sidebarCollapsed)
  const sidebarWidth = useWorkspaceStore((s) => s.sidebarWidth)
  const commandPaletteOpen = useWorkspaceStore((s) => s.commandPaletteOpen)
  const settingsOpen = useWorkspaceStore((s) => s.settingsOpen)
  const setCurrentPageId = useWorkspaceStore((s) => s.setCurrentPageId)
  const sidebarDensity = useThemeStore((s) => s.sidebarDensity)

  // Sync current page from URL
  useEffect(() => {
    if (pathname === "/") {
      setCurrentPageId(null)
    } else if (pathname.startsWith("/database/")) {
      const dbId = pathname.replace("/database/", "")
      setCurrentPageId(dbId)
    } else if (pathname.startsWith("/")) {
      const pageId = pathname.replace("/", "")
      setCurrentPageId(pageId)
    }
  }, [pathname, setCurrentPageId])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        useWorkspaceStore.getState().toggleCommandPalette()
      }
      if (e.key === "Escape") {
        useWorkspaceStore.getState().setCommandPaletteOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <Sidebar />
      <div
        className="flex flex-1 flex-col transition-all duration-250 ease-in-out"
        style={{
          marginLeft: sidebarCollapsed ? 60 : sidebarWidth,
        }}
      >
        <TopBar />
        <main
          className={cn(
            "flex-1 overflow-y-auto overflow-x-hidden",
            sidebarDensity === "compact" ? "p-4" : "p-6"
          )}
        >
          {children}
        </main>
      </div>

      {commandPaletteOpen && <CommandPalette />}
      {settingsOpen && <SettingsModal />}
      <FakeCursors />
      <Toaster />
    </div>
  )
}
