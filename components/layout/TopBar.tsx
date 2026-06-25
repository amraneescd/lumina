"use client"

import { useWorkspaceStore } from "@/stores/useWorkspaceStore"
import { useThemeStore } from "@/stores/useThemeStore"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import {
  Bell,
  Command,
  Moon,
  Settings,
  Share2,
  Sun,
  Users,
  PanelLeftClose,
  PanelLeftOpen,
  Home,
} from "lucide-react"
import { useTheme } from "next-themes"

export function TopBar() {
  const currentPageId = useWorkspaceStore((s) => s.currentPageId)
  const pages = useWorkspaceStore((s) => s.pages)
  const databases = useWorkspaceStore((s) => s.databases)
  const teamMembers = useWorkspaceStore((s) => s.teamMembers)
  const notifications = useWorkspaceStore((s) => s.notifications)
  const sidebarCollapsed = useWorkspaceStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useWorkspaceStore((s) => s.toggleSidebar)
  const toggleNotifications = useWorkspaceStore((s) => s.toggleNotifications)
  const toggleSettings = useWorkspaceStore((s) => s.toggleSettings)
  const toggleCommandPalette = useWorkspaceStore((s) => s.toggleCommandPalette)
  const unreadCount = notifications.filter((n) => !n.read).length

  const { theme, setTheme } = useTheme()

  // Find current page or database
  const allPages = pages.flatMap((p) => [p, ...(p.children || [])])
  let currentPage = allPages.find((p) => p.id === currentPageId)
  let currentDatabase = databases.find((d) => d.id === currentPageId)

  const viewingMembers = teamMembers.filter((m) => m.status === "online").slice(0, 3)

  return (
    <header className="flex h-14 items-center justify-between border-b px-4 bg-background/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={toggleSidebar}
              >
                {sidebarCollapsed ? (
                  <PanelLeftOpen className="h-4 w-4" />
                ) : (
                  <PanelLeftClose className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {currentPageId === null ? (
          <div className="flex items-center gap-2">
            <Home className="h-4 w-4 text-muted-foreground" />
            <h1 className="text-sm font-medium text-foreground">Dashboard</h1>
          </div>
        ) : currentPage ? (
          <div className="flex items-center gap-2">
            <span className="text-lg">{currentPage.icon}</span>
            <h1 className="text-sm font-medium text-foreground">
              {currentPage.title}
            </h1>
            {currentPage.isPrivate && (
              <span className="text-xs text-muted-foreground">Private</span>
            )}
          </div>
        ) : currentDatabase ? (
          <div className="flex items-center gap-2">
            <span className="text-lg">{currentDatabase.icon}</span>
            <h1 className="text-sm font-medium text-foreground">
              {currentDatabase.title}
            </h1>
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        {/* Presence indicators */}
        <div className="flex items-center gap-2 mr-2">
          <div className="flex -space-x-2">
            {viewingMembers.map((member) => (
              <Avatar key={member.id} className="h-6 w-6 border-2 border-background">
                <AvatarFallback
                  className="text-[10px]"
                  style={{ backgroundColor: member.color + "20", color: member.color }}
                >
                  {member.initials}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {viewingMembers.length + 1} viewing
          </span>
        </div>

        {/* Share button */}
        <Button variant="ghost" size="sm" className="gap-2 text-xs">
          <Share2 className="h-3.5 w-3.5" />
          Share
        </Button>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 relative"
          onClick={toggleNotifications}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadCount}
            </span>
          )}
        </Button>

        {/* Command palette trigger */}
        <Button
          variant="ghost"
          size="sm"
          className="hidden md:flex items-center gap-2 text-xs text-muted-foreground"
          onClick={toggleCommandPalette}
        >
          <Command className="h-3.5 w-3.5" />
          <span>Search</span>
          <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  YU
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-green-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center gap-2 p-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  YU
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">You</span>
                <span className="text-xs text-muted-foreground">
                  you@lumina.studio
                </span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={toggleSettings}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Users className="mr-2 h-4 w-4" />
              Team
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
