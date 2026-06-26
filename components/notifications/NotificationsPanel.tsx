"use client"

import { useWorkspaceStore } from "@/stores/useWorkspaceStore"
import { cn, formatDate } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { X, Bell, Check, MessageSquare, Share2, AlertTriangle, UserPlus, FileEdit, Clock } from "lucide-react"

export function NotificationsPanel() {
  const notificationsOpen = useWorkspaceStore((s) => s.notificationsOpen)
  const toggleNotifications = useWorkspaceStore((s) => s.toggleNotifications)
  const notifications = useWorkspaceStore((s) => s.notifications)
  const markNotificationRead = useWorkspaceStore((s) => s.markNotificationRead)
  const markAllNotificationsRead = useWorkspaceStore((s) => s.markAllNotificationsRead)

  if (!notificationsOpen) return null

  const unreadCount = notifications.filter((n) => !n.read).length

  const getIcon = (type: string) => {
    switch (type) {
      case "mention": return <MessageSquare className="h-4 w-4 text-blue-500" />
      case "comment": return <MessageSquare className="h-4 w-4 text-purple-500" />
      case "share": return <Share2 className="h-4 w-4 text-green-500" />
      case "reminder": return <Clock className="h-4 w-4 text-amber-500" />
      case "assignment": return <UserPlus className="h-4 w-4 text-cyan-500" />
      case "edit": return <FileEdit className="h-4 w-4 text-orange-500" />
      default: return <Bell className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <div className="fixed top-14 right-4 z-50 w-[380px] rounded-xl border bg-popover shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold">Notifications</h2>
          {unreadCount > 0 && (
            <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">{unreadCount}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={markAllNotificationsRead}>
              Mark all read
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleNotifications}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="max-h-[400px]">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Bell className="h-8 w-8 mb-2 opacity-40" />
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={cn(
                  "flex items-start gap-3 px-4 py-3 transition-colors group cursor-pointer",
                  !notif.read ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-accent/50"
                )}
                onClick={() => markNotificationRead(notif.id)}
              >
                <div className="mt-0.5 shrink-0">{getIcon(notif.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm", !notif.read && "font-medium")}>{notif.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{formatDate(notif.createdAt)}</p>
                </div>
                {!notif.read && (
                  <div className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 shrink-0 -mr-1"
                  onClick={(e) => { e.stopPropagation(); markNotificationRead(notif.id) }}
                >
                  <Check className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
