"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useWorkspaceStore } from "@/stores/useWorkspaceStore"
import { useThemeStore } from "@/stores/useThemeStore"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn, generateId } from "@/lib/utils"
import {
  ChevronDown,
  ChevronRight,
  Star,
  Plus,
  Lock,
  Globe,
  GripVertical,
} from "lucide-react"
import type { Page } from "@/types"

function WorkspaceSwitcher() {
  const workspaces = useWorkspaceStore((s) => s.workspaces)
  const currentWorkspace = useWorkspaceStore((s) => s.currentWorkspace)
  const setCurrentWorkspace = useWorkspaceStore((s) => s.setCurrentWorkspace)
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-accent transition-colors"
      >
        <span className="text-lg">{currentWorkspace.icon}</span>
        <span className="flex-1 truncate">{currentWorkspace.name}</span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-md border bg-popover p-1 shadow-lg">
          {workspaces.map((ws) => (
            <button
              key={ws.id}
              onClick={() => {
                setCurrentWorkspace(ws)
                setOpen(false)
              }}
              className={cn(
                "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors",
                ws.id === currentWorkspace.id
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/50"
              )}
            >
              <span className="text-lg">{ws.icon}</span>
              <span className="flex-1 truncate">{ws.name}</span>
              <span className="text-xs text-muted-foreground">{ws.plan}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function getPageHref(page: Page): string {
  if (page.type === "database") {
    return `/database/${page.id}`
  }
  return `/${page.id}`
}

function PageTreeItem({
  page,
  depth = 0,
  onDragStart,
  onDragOver,
  onDrop,
  draggingId,
  dragOverId,
}: {
  page: Page
  depth?: number
  onDragStart?: (e: React.DragEvent, pageId: string) => void
  onDragOver?: (e: React.DragEvent, pageId: string) => void
  onDrop?: (e: React.DragEvent, pageId: string) => void
  draggingId?: string | null
  dragOverId?: string | null
}) {
  const [expanded, setExpanded] = useState(true)
  const pathname = usePathname()
  const toggleFavorite = useWorkspaceStore((s) => s.toggleFavorite)
  const isActive = pathname === getPageHref(page) || pathname?.startsWith(getPageHref(page))
  const hasChildren = page.children && page.children.length > 0
  const isDragging = draggingId === page.id
  const isDragOver = dragOverId === page.id

  return (
    <div>
      {isDragOver && !isDragging && (
        <div className="h-0.5 bg-primary rounded-full mx-2" />
      )}
      <div
        draggable
        onDragStart={(e) => onDragStart?.(e, page.id)}
        onDragOver={(e) => onDragOver?.(e, page.id)}
        onDrop={(e) => onDrop?.(e, page.id)}
        className={cn(
          "transition-opacity",
          isDragging && "opacity-40"
        )}
      >
        <Link
          href={getPageHref(page)}
          className={cn(
            "group flex items-center gap-1 rounded-md px-2 py-1 text-sm cursor-pointer transition-colors",
            isActive
              ? "bg-accent text-accent-foreground"
              : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
          )}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          {/* Drag handle */}
          <div
            className="opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing p-0.5 hover:bg-accent rounded"
            onClick={(e) => e.preventDefault()}
          >
            <GripVertical className="h-3 w-3 text-muted-foreground" />
          </div>

          {hasChildren ? (
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setExpanded(!expanded)
              }}
              className="flex h-4 w-4 items-center justify-center"
            >
              {expanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          ) : (
            <span className="w-4" />
          )}

          <span className="text-base mr-1">{page.icon}</span>
          <span className="flex-1 truncate">{page.title}</span>

          {page.isPrivate && (
            <Lock className="h-3 w-3 opacity-0 group-hover:opacity-50" />
          )}
          {!page.isPrivate && (
            <Globe className="h-3 w-3 opacity-0 group-hover:opacity-50" />
          )}

          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleFavorite(page.id)
            }}
            className={cn(
              "opacity-0 group-hover:opacity-100 transition-opacity",
              page.isFavorite && "opacity-100 text-yellow-500"
            )}
          >
            <Star className={cn("h-3 w-3", page.isFavorite && "fill-current")} />
          </button>
        </Link>
      </div>
      {hasChildren && expanded && (
        <div>
          {page.children!.map((child) => (
            <PageTreeItem
              key={child.id}
              page={child}
              depth={depth + 1}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
              draggingId={draggingId}
              dragOverId={dragOverId}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function Sidebar() {
  const sidebarCollapsed = useWorkspaceStore((s) => s.sidebarCollapsed)
  const sidebarWidth = useWorkspaceStore((s) => s.sidebarWidth)
  const pages = useWorkspaceStore((s) => s.pages)
  const addPage = useWorkspaceStore((s) => s.addPage)
  const reorderPages = useWorkspaceStore((s) => s.reorderPages)
  const sidebarDensity = useThemeStore((s) => s.sidebarDensity)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)

  const rootPages = pages.filter((p) => !p.parentId)
  const favoritePages = pages.filter((p) => p.isFavorite)

  const handleNewPage = () => {
    const newPage: Page = {
      id: generateId(),
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
      type: "page",
      content: [{ id: generateId(), type: "paragraph", content: "" }],
    }
    addPage(newPage)
  }

  // Simple drag and drop for root pages
  const handleDragStart = (e: React.DragEvent, pageId: string) => {
    setDraggingId(pageId)
    e.dataTransfer.effectAllowed = "move"
    const ghost = document.createElement("div")
    ghost.style.width = "200px"
    ghost.style.height = "32px"
    ghost.style.background = "rgba(37, 99, 235, 0.1)"
    ghost.style.border = "2px dashed #2563eb"
    ghost.style.borderRadius = "6px"
    document.body.appendChild(ghost)
    e.dataTransfer.setDragImage(ghost, 100, 16)
    setTimeout(() => document.body.removeChild(ghost), 0)
  }

  const handleDragOver = (e: React.DragEvent, pageId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    if (pageId !== draggingId) {
      setDragOverId(pageId)
    }
  }

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!draggingId || draggingId === targetId) {
      setDraggingId(null)
      setDragOverId(null)
      return
    }

    const fromIndex = rootPages.findIndex((p) => p.id === draggingId)
    const toIndex = rootPages.findIndex((p) => p.id === targetId)
    if (fromIndex === -1 || toIndex === -1) {
      setDraggingId(null)
      setDragOverId(null)
      return
    }

    const newPages = [...pages]
    const [movedPage] = newPages.splice(fromIndex, 1)
    newPages.splice(toIndex > fromIndex ? toIndex : toIndex, 0, movedPage)
    reorderPages(newPages)
    setDraggingId(null)
    setDragOverId(null)
  }

  const handleDragEnd = () => {
    setDraggingId(null)
    setDragOverId(null)
  }

  if (sidebarCollapsed) {
    return (
      <aside
        className="fixed left-0 top-0 z-40 flex h-full w-[60px] flex-col border-r bg-[var(--base-sidebar)] transition-all duration-250 ease-in-out"
      >
        <div className="flex h-14 items-center justify-center border-b">
          <span className="text-xl">✨</span>
        </div>
        <ScrollArea className="flex-1 py-2">
          <div className="flex flex-col items-center gap-1 px-1">
            {rootPages.slice(0, 6).map((page) => (
              <TooltipProvider key={page.id} delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={getPageHref(page)}
                      className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent transition-colors"
                    >
                      <span className="text-lg">{page.icon}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{page.title}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </ScrollArea>
        <div className="border-t p-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={handleNewPage}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </aside>
    )
  }

  return (
    <aside
      className="fixed left-0 top-0 z-40 flex h-full flex-col border-r bg-[var(--base-sidebar)] transition-all duration-250 ease-in-out"
      style={{ width: sidebarWidth }}
    >
      <div className="flex h-14 items-center border-b px-3">
        <WorkspaceSwitcher />
      </div>

      <ScrollArea className="flex-1">
        <div className={cn("space-y-4", sidebarDensity === "compact" ? "p-2" : "p-3")}>
          {/* Favorites */}
          {favoritePages.length > 0 && (
            <div>
              <h3 className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Favorites
              </h3>
              <div className="space-y-0.5">
                {favoritePages.map((page) => (
                  <Link
                    key={page.id}
                    href={getPageHref(page)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2 py-1 text-sm transition-colors",
                      "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span className="text-base">{page.icon}</span>
                    <span className="flex-1 truncate text-left">{page.title}</span>
                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Page tree */}
          <div>
            <h3 className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Workspace
            </h3>
            <div className="space-y-0.5">
              {rootPages.map((page) => (
                <PageTreeItem
                  key={page.id}
                  page={page}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  draggingId={draggingId}
                  dragOverId={dragOverId}
                />
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* New page button */}
      <div className="border-t p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-sm text-muted-foreground hover:text-foreground"
          onClick={handleNewPage}
        >
          <Plus className="h-4 w-4" />
          New page
        </Button>
      </div>

      {/* User avatar */}
      <div className="flex items-center gap-2 border-t p-3">
        <div className="relative">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
            YU
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--base-sidebar)] bg-green-500" />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-sm font-medium truncate">You</span>
          <span className="text-xs text-muted-foreground truncate">Online</span>
        </div>
      </div>
    </aside>
  )
}
