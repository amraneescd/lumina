"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useWorkspaceStore } from "@/stores/useWorkspaceStore"
import { useThemeStore } from "@/stores/useThemeStore"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  ChevronRight,
  ChevronDown,
  Star,
  Plus,
  Search,
  Settings,
  Trash2,
  MoreHorizontal,
  GripVertical,
  MessageSquare,
  Lock,
} from "lucide-react"
import type { Page } from "@/types"

export function Sidebar() {
  const router = useRouter()
  const sidebarCollapsed = useWorkspaceStore((s) => s.sidebarCollapsed)
  const sidebarWidth = useWorkspaceStore((s) => s.sidebarWidth)
  const currentWorkspace = useWorkspaceStore((s) => s.currentWorkspace)
  const pages = useWorkspaceStore((s) => s.pages)
  const currentPageId = useWorkspaceStore((s) => s.currentPageId)
  const toggleFavorite = useWorkspaceStore((s) => s.toggleFavorite)
  const addPage = useWorkspaceStore((s) => s.addPage)
  const deletePage = useWorkspaceStore((s) => s.deletePage)
  const toggleSettings = useWorkspaceStore((s) => s.toggleSettings)
  const setCommandPaletteOpen = useWorkspaceStore((s) => s.setCommandPaletteOpen)
  const setCurrentPageId = useWorkspaceStore((s) => s.setCurrentPageId)
  const sidebarDensity = useThemeStore((s) => s.sidebarDensity)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    favorites: true,
    workspace: true,
    private: true,
  })
  const [hoveredPage, setHoveredPage] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handlePageClick = (page: Page) => {
    setCurrentPageId(page.id)
    if (page.type === "database") {
      router.push(`/database/${page.id}`)
    } else {
      router.push(`/${page.id}`)
    }
  }

  const favoritePages = pages.filter((p) => p.isFavorite)
  const workspacePages = pages.filter((p) => !p.isPrivate && !p.isFavorite)
  const privatePages = pages.filter((p) => p.isPrivate)

  const densityClasses = sidebarDensity === "compact"
    ? "py-1 text-xs"
    : "py-1.5 text-sm"

  if (sidebarCollapsed) {
    return (
      <div className="fixed left-0 top-0 z-20 flex h-full w-12 flex-col items-center border-r bg-background py-3">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          aria-label="Open search"
          className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent"
        >
          <Search className="h-4 w-4" />
        </button>
        <Separator className="my-2 w-6" />
        {favoritePages.slice(0, 3).map((page) => (
          <button
            key={page.id}
            onClick={() => handlePageClick(page)}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent mb-1",
              currentPageId === page.id && "bg-accent"
            )}
            title={page.title}
          >
            <span className="text-base">{page.icon}</span>
          </button>
        ))}
        <div className="flex-1" />
        <button
          onClick={() => toggleSettings()}
          className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <div
      className="fixed left-0 top-0 z-20 flex h-full flex-col border-r bg-background"
      style={{ width: sidebarWidth }}
    >
      {/* Workspace Header */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-medium">
          {currentWorkspace.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{currentWorkspace.name}</p>
          <p className="text-[10px] text-muted-foreground">{currentWorkspace.plan} Plan</p>
        </div>
      </div>

      <Separator />

      {/* Search */}
      <div className="px-3 py-2">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          aria-label="Open search"
          className="flex w-full items-center gap-2 rounded-md border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted transition-colors"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="flex-1 text-left">Search</span>
          <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px]">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </div>

      <Separator />

      <ScrollArea className="flex-1">
        <div className="px-2 py-2 space-y-0.5">
          {/* Favorites */}
          {favoritePages.length > 0 && (
            <div>
              <button
                onClick={() => toggleSection("favorites")}
                className="flex w-full items-center gap-1 px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                {expandedSections.favorites ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
                <Star className="h-3 w-3 mr-1" />
                Favorites
              </button>
              {expandedSections.favorites && (
                <div className="ml-4 space-y-0.5">
                  {favoritePages.map((page) => (
                    <PageItem
                      key={page.id}
                      page={page}
                      isActive={currentPageId === page.id}
                      onClick={() => handlePageClick(page)}
                      onToggleFavorite={() => toggleFavorite(page.id)}
                      onDelete={() => deletePage(page.id)}
                      hoveredPage={hoveredPage}
                      setHoveredPage={setHoveredPage}
                      densityClasses={densityClasses}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Workspace Pages */}
          <div>
            <button
              onClick={() => toggleSection("workspace")}
              className="flex w-full items-center gap-1 px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              {expandedSections.workspace ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
              <span className="mr-1">📁</span>
              Workspace
            </button>
            {expandedSections.workspace && (
              <div className="ml-4 space-y-0.5">
                {workspacePages.map((page) => (
                  <div key={page.id}>
                    <PageItem
                      page={page}
                      isActive={currentPageId === page.id}
                      onClick={() => handlePageClick(page)}
                      onToggleFavorite={() => toggleFavorite(page.id)}
                      onDelete={() => deletePage(page.id)}
                      hoveredPage={hoveredPage}
                      setHoveredPage={setHoveredPage}
                      densityClasses={densityClasses}
                    />
                    {page.children && page.children.length > 0 && (
                      <div className="ml-4 space-y-0.5">
                        {page.children.map((child) => (
                          <PageItem
                            key={child.id}
                            page={child}
                            isActive={currentPageId === child.id}
                            onClick={() => handlePageClick(child)}
                            onToggleFavorite={() => toggleFavorite(child.id)}
                            onDelete={() => deletePage(child.id)}
                            hoveredPage={hoveredPage}
                            setHoveredPage={setHoveredPage}
                            densityClasses={densityClasses}
                            isChild
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Private Pages */}
          {privatePages.length > 0 && (
            <div>
              <button
                onClick={() => toggleSection("private")}
                className="flex w-full items-center gap-1 px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                {expandedSections.private ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
                <Lock className="h-3 w-3 mr-1" />
                Private
              </button>
              {expandedSections.private && (
                <div className="ml-4 space-y-0.5">
                  {privatePages.map((page) => (
                    <PageItem
                      key={page.id}
                      page={page}
                      isActive={currentPageId === page.id}
                      onClick={() => handlePageClick(page)}
                      onToggleFavorite={() => toggleFavorite(page.id)}
                      onDelete={() => deletePage(page.id)}
                      hoveredPage={hoveredPage}
                      setHoveredPage={setHoveredPage}
                      densityClasses={densityClasses}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* New Page Button */}
      <div className="p-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-xs text-muted-foreground hover:text-foreground"
          title="Create new page"
            aria-label="Create new page"
            onClick={() => {
            const newPage = {
              id: `page-${Date.now()}`,
              title: "Untitled",
              icon: "📝",
              cover: null,
              parentId: null,
              workspaceId: "ws-lumina",
              isFavorite: false,
              isPrivate: false,
              lastEditedAt: new Date().toISOString(),
              lastEditedBy: "You",
              createdAt: new Date().toISOString(),
              type: "page" as const,
              content: [],
            }
            addPage(newPage)
            router.push(`/${newPage.id}`)
          }}
        >
          <Plus className="h-3.5 w-3.5" />
          New page
        </Button>
      </div>

      <Separator />

      {/* Demo Badge */}
      <div className="px-3 py-2">
        <div className="flex items-center gap-2 rounded-md bg-muted/50 px-2 py-1.5">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Demo</span>
          <span className="text-[10px] text-muted-foreground">— Built by Rebase</span>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-3">
        <button
          onClick={() => toggleSettings()}
          className="flex w-full items-center gap-2 rounded-md p-2 hover:bg-accent transition-colors"
          title="Open settings"
          aria-label="Open settings"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
            YU
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-medium">You</p>
            <p className="text-[10px] text-muted-foreground">you@lumina.studio</p>
          </div>
          <Settings className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>
    </div>
  )
}

function PageItem({
  page,
  isActive,
  onClick,
  onToggleFavorite,
  onDelete,
  hoveredPage,
  setHoveredPage,
  densityClasses,
  isChild = false,
}: {
  page: Page
  isActive: boolean
  onClick: () => void
  onToggleFavorite: () => void
  onDelete: () => void
  hoveredPage: string | null
  setHoveredPage: (id: string | null) => void
  densityClasses: string
  isChild?: boolean
}) {
  const [showMenu, setShowMenu] = useState(false)
  const isHovered = hoveredPage === page.id

  return (
    <div
      className={cn("group relative flex items-center", densityClasses)}
      onMouseEnter={() => setHoveredPage(page.id)}
      onMouseLeave={() => setHoveredPage(null)}
    >
      <button
        onClick={onClick}
        className={cn(
          "flex flex-1 items-center gap-2 rounded-md px-2 transition-colors min-w-0",
          isActive
            ? "bg-accent text-accent-foreground font-medium"
            : "hover:bg-accent/50 text-foreground"
        )}
      >
        <span className={cn("text-base shrink-0", isChild && "text-sm")}>{page.icon}</span>
        <span className="truncate text-sm">{page.title}</span>
        {page.isPrivate && <Lock className="h-3 w-3 text-muted-foreground shrink-0" />}
        {page.commentCount && page.commentCount > 0 && (
          <span className="ml-auto flex items-center gap-0.5 text-[10px] text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 px-1 rounded-full shrink-0">
            <MessageSquare className="h-2.5 w-2.5" />
            {page.commentCount}
          </span>
        )}
      </button>

      {isHovered && (
        <div className="absolute right-1 flex items-center gap-0.5">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite() }}
            className={cn(
              "rounded p-0.5 hover:bg-accent",
              page.isFavorite && "text-amber-500"
            )}
          >
            <Star className="h-3 w-3" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete() }}
            className="rounded p-0.5 hover:bg-accent text-red-500"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  )
}
