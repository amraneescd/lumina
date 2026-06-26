"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useWorkspaceStore } from "@/stores/useWorkspaceStore"
import { useThemeStore } from "@/stores/useThemeStore"
import { Button } from "@/components/ui/button"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  Search,
  Bell,
  Settings,
  Share2,
  Clock,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  HelpCircle,
  Users,
  MessageSquare,
} from "lucide-react"
import { NotificationsPanel } from "@/components/notifications/NotificationsPanel"

export function TopBar() {
  const router = useRouter()
  const sidebarCollapsed = useWorkspaceStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useWorkspaceStore((s) => s.toggleSidebar)
  const setCommandPaletteOpen = useWorkspaceStore((s) => s.setCommandPaletteOpen)
  const toggleSettings = useWorkspaceStore((s) => s.toggleSettings)
  const toggleShareModal = useWorkspaceStore((s) => s.toggleShareModal)
  const toggleNotifications = useWorkspaceStore((s) => s.toggleNotifications)
  const toggleHelpModal = useWorkspaceStore((s) => s.toggleHelpModal)
  const toggleCommentsPanel = useWorkspaceStore((s) => s.toggleCommentsPanel)
  const notifications = useWorkspaceStore((s) => s.notifications)
  const currentPageId = useWorkspaceStore((s) => s.currentPageId)
  const pages = useWorkspaceStore((s) => s.pages)
  const teamMembers = useWorkspaceStore((s) => s.teamMembers)
  const notificationsOpen = useWorkspaceStore((s) => s.notificationsOpen)
  const currentPage = pages.flatMap((p) => [p, ...(p.children || [])]).find((p) => p.id === currentPageId)

  const unreadCount = notifications.filter((n) => !n.read).length

  // Fake presence — show 3 online members
  const onlineMembers = teamMembers.filter((m) => m.status === "online").slice(0, 3)
  const extraCount = teamMembers.filter((m) => m.status === "online").length - 3

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 z-10">
      {/* Left side */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 lg:hidden"
          aria-label="Toggle sidebar"
          onClick={() => {
            // Toggle mobile sidebar via custom event
            window.dispatchEvent(new CustomEvent('toggle-mobile-sidebar'))
          }}
          title="Toggle sidebar"
        >
          <PanelLeftOpen className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hidden lg:flex"
          aria-label="Toggle sidebar"
          onClick={toggleSidebar}
          title="Toggle sidebar"
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="hidden sm:flex items-center gap-2 text-muted-foreground h-8 px-2.5"
          onClick={() => setCommandPaletteOpen(true)}
          aria-label="Search"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="text-xs">Search...</span>
          <kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>

      {/* Breadcrumb / Page title */}
      <div className="flex-1 min-w-0">
        {currentPage && (
          <div className="flex items-center gap-2">
            <span className="text-base">{currentPage.icon}</span>
            <h1 className="text-sm font-medium truncate">{currentPage.title}</h1>
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1">
        {/* Presence indicators */}
        {currentPage && (
          <div className="hidden md:flex items-center gap-2 mr-2">
            <div className="flex -space-x-2">
              {onlineMembers.map((member) => (
                <div
                  key={member.id}
                  className="h-7 w-7 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-medium"
                  style={{ backgroundColor: member.color + "20", color: member.color }}
                  title={`${member.name} is viewing`}
                >
                  {member.initials}
                </div>
              ))}
              {extraCount > 0 && (
                <div className="h-7 w-7 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground">
                  +{extraCount}
                </div>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {onlineMembers.length + Math.max(0, extraCount)} viewing
            </span>
          </div>
        )}

        {/* Comments button */}
        {currentPage && currentPage.commentCount && currentPage.commentCount > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 relative"
            onClick={toggleCommentsPanel}
            aria-label="View comments"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-[9px] text-primary-foreground flex items-center justify-center">
              {currentPage.commentCount}
            </span>
          </Button>
        )}

        {/* Share button */}
        {currentPage && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-xs hidden sm:flex"
            onClick={() => toggleShareModal(currentPage.id)}
          aria-label="Share page"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </Button>
        )}

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 relative focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          onClick={toggleNotifications}
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-[9px] text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>

        {/* Help */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hidden sm:flex focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          onClick={toggleHelpModal}
          aria-label="Keyboard shortcuts"
          title="Keyboard shortcuts (⌘/)"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>

        {/* Settings */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          onClick={toggleSettings}
          aria-label="Settings"
          title="Settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {/* Notifications Panel */}
      {notificationsOpen && <NotificationsPanel />}
    </header>
  )
}
