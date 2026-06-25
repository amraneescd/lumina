"use client"

import { useState, useEffect, useMemo } from "react"
import { useWorkspaceStore } from "@/stores/useWorkspaceStore"
import { useThemeStore } from "@/stores/useThemeStore"
import { cn, formatDate } from "@/lib/utils"
import {
  Search,
  FileText,
  Database,
  Settings,
  Moon,
  Sun,
  Monitor,
  Home,
  Star,
  Clock,
  Command,
  X,
} from "lucide-react"
import type { Page } from "@/types"

interface CommandItem {
  id: string
  title: string
  subtitle?: string
  icon: React.ReactNode
  shortcut?: string
  action: () => void
  category: string
}

export function CommandPalette() {
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const setCommandPaletteOpen = useWorkspaceStore((s) => s.setCommandPaletteOpen)
  const pages = useWorkspaceStore((s) => s.pages)
  const setCurrentPageId = useWorkspaceStore((s) => s.setCurrentPageId)
  const toggleSettings = useWorkspaceStore((s) => s.toggleSettings)
  const theme = useThemeStore((s) => s.theme)
  const setTheme = useThemeStore((s) => s.setTheme)

  const allCommands: CommandItem[] = useMemo(() => {
    const items: CommandItem[] = []

    // Pages
    const flattenPages = (pageList: Page[]): Page[] => {
      return pageList.flatMap((p) => [p, ...(p.children ? flattenPages(p.children) : [])])
    }
    const allPages = flattenPages(pages)

    items.push(
      ...allPages.map((page) => ({
        id: `page-${page.id}`,
        title: page.title,
        subtitle: page.type === "database" ? "Database" : "Page",
        icon: <span className="text-base">{page.icon}</span>,
        action: () => {
          setCurrentPageId(page.id)
          setCommandPaletteOpen(false)
        },
        category: "Pages",
      }))
    )

    // Actions
    items.push(
      {
        id: "action-home",
        title: "Go to Dashboard",
        subtitle: "Navigate to home",
        icon: <Home className="h-4 w-4" />,
        shortcut: "G D",
        action: () => {
          setCurrentPageId(null)
          setCommandPaletteOpen(false)
        },
        category: "Actions",
      },
      {
        id: "action-favorites",
        title: "Show Favorites",
        subtitle: "View starred pages",
        icon: <Star className="h-4 w-4" />,
        action: () => setCommandPaletteOpen(false),
        category: "Actions",
      },
      {
        id: "action-recent",
        title: "Recent Items",
        subtitle: "View recently edited",
        icon: <Clock className="h-4 w-4" />,
        action: () => setCommandPaletteOpen(false),
        category: "Actions",
      },
      {
        id: "action-settings",
        title: "Open Settings",
        subtitle: "Preferences and account",
        icon: <Settings className="h-4 w-4" />,
        shortcut: "⌘ ,",
        action: () => {
          toggleSettings()
          setCommandPaletteOpen(false)
        },
        category: "Actions",
      }
    )

    // Theme
    items.push(
      {
        id: "theme-light",
        title: "Light Mode",
        subtitle: "Switch to light theme",
        icon: <Sun className="h-4 w-4" />,
        action: () => {
          setTheme("light")
          setCommandPaletteOpen(false)
        },
        category: "Preferences",
      },
      {
        id: "theme-dark",
        title: "Dark Mode",
        subtitle: "Switch to dark theme",
        icon: <Moon className="h-4 w-4" />,
        action: () => {
          setTheme("dark")
          setCommandPaletteOpen(false)
        },
        category: "Preferences",
      },
      {
        id: "theme-system",
        title: "System Theme",
        subtitle: "Follow system preference",
        icon: <Monitor className="h-4 w-4" />,
        action: () => {
          setTheme("system")
          setCommandPaletteOpen(false)
        },
        category: "Preferences",
      }
    )

    return items
  }, [pages, setCurrentPageId, setCommandPaletteOpen, toggleSettings, setTheme])

  const filtered = useMemo(() => {
    if (!query.trim()) return allCommands
    const q = query.toLowerCase()
    return allCommands.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle?.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    )
  }, [allCommands, query])

  const grouped = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {}
    filtered.forEach((item) => {
      if (!groups[item.category]) groups[item.category] = []
      groups[item.category].push(item)
    })
    return groups
  }, [filtered])

  const flatItems = useMemo(() => Object.values(grouped).flat(), [grouped])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((i) => Math.min(i + 1, flatItems.length - 1))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === "Enter") {
        e.preventDefault()
        flatItems[selectedIndex]?.action()
      } else if (e.key === "Escape") {
        setCommandPaletteOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [flatItems, selectedIndex, setCommandPaletteOpen])

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm pt-[20vh]">
      <div className="w-full max-w-2xl rounded-xl border bg-popover shadow-2xl overflow-hidden">
        {/* Search input */}
        <div className="flex items-center border-b px-4 py-3">
          <Search className="h-5 w-5 text-muted-foreground mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, databases, actions..."
            className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground"
            autoFocus
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="rounded-md border px-2 py-1 text-xs text-muted-foreground hover:bg-accent"
          >
            Esc
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto py-2">
          {flatItems.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-muted-foreground">
              <Search className="h-8 w-8 mb-2 opacity-50" />
              <p>No results found</p>
            </div>
          ) : (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <h3 className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {category}
                </h3>
                {items.map((item, idx) => {
                  const globalIdx = flatItems.indexOf(item)
                  const isSelected = globalIdx === selectedIndex
                  return (
                    <button
                      key={item.id}
                      onClick={item.action}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
                        isSelected
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-accent/50"
                      )}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                        {item.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{item.title}</div>
                        {item.subtitle && (
                          <div className="text-xs text-muted-foreground">{item.subtitle}</div>
                        )}
                      </div>
                      {item.shortcut && (
                        <kbd className="rounded border bg-muted px-1.5 py-0.5 text-xs">
                          {item.shortcut}
                        </kbd>
                      )}
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t px-4 py-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border px-1">↑</kbd>
              <kbd className="rounded border px-1">↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border px-1">↵</kbd>
              <span>to select</span>
            </span>
          </div>
          <span>{flatItems.length} results</span>
        </div>
      </div>
    </div>
  )
}
