"use client"

import { useWorkspaceStore } from "@/stores/useWorkspaceStore"
import { cn, formatDate } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileEdit, MessageSquare, Plus, Trash2, ArrowRightLeft, UserPlus, GitCommit } from "lucide-react"

export function ActivityFeed() {
  const activities = useWorkspaceStore((s) => s.activities)
  const activityPanelOpen = useWorkspaceStore((s) => s.activityPanelOpen)

  if (!activityPanelOpen) return null

  const getIcon = (type: string) => {
    switch (type) {
      case "edit": return <FileEdit className="h-3.5 w-3.5" />
      case "comment": return <MessageSquare className="h-3.5 w-3.5" />
      case "create": return <Plus className="h-3.5 w-3.5" />
      case "delete": return <Trash2 className="h-3.5 w-3.5" />
      case "move": return <ArrowRightLeft className="h-3.5 w-3.5" />
      case "assign": return <UserPlus className="h-3.5 w-3.5" />
      default: return <GitCommit className="h-3.5 w-3.5" />
    }
  }

  return (
    <div className="w-[280px] border-l bg-background flex flex-col shrink-0">
      <div className="px-4 py-3 border-b">
        <h2 className="text-sm font-semibold">Activity</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="px-4 py-3 space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-2.5">
              <div
                className="mt-0.5 h-6 w-6 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: activity.userColor + "15", color: activity.userColor }}
              >
                {getIcon(activity.type)}
              </div>
              <div className="min-w-0">
                <p className="text-xs leading-relaxed">
                  <span className="font-medium">{activity.userName}</span>{" "}
                  <span className="text-muted-foreground">{activity.action}</span>{" "}
                  <span className="font-medium">{activity.pageTitle}</span>
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{formatDate(activity.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
