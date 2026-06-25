"use client"

import { useWorkspaceStore } from "@/stores/useWorkspaceStore"
import { useThemeStore } from "@/stores/useThemeStore"
import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { cn, getGreeting, formatDate, generateId } from "@/lib/utils"
import {
  FileText,
  Plus,
  FolderKanban,
  CheckSquare,
  Clock,
  ArrowRight,
  Star,
  Activity,
} from "lucide-react"
import { useState, useEffect } from "react"
import type { Page } from "@/types"

function Greeting() {
  const teamMembers = useWorkspaceStore((s) => s.teamMembers)
  const user = teamMembers[0] // Sarah Chen as current user
  const greeting = getGreeting()
  const today = new Date()

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight" style={{ fontSize: "40px", fontWeight: 700, letterSpacing: "-0.02em" }}>
        {greeting}, {user?.name.split(" ")[0] || "there"}
      </h1>
      <p className="text-muted-foreground mt-1">
        {formatDate(today.toISOString(), "full")}
      </p>
    </div>
  )
}

function QuickActions() {
  const setCurrentPageId = useWorkspaceStore((s) => s.setCurrentPageId)
  const addPage = useWorkspaceStore((s) => s.addPage)

  const actions = [
    {
      label: "New page",
      icon: <FileText className="h-4 w-4" />,
      onClick: () => {
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
        }
        addPage(newPage)
        setCurrentPageId(newPage.id)
      },
    },
    {
      label: "New project",
      icon: <FolderKanban className="h-4 w-4" />,
      onClick: () => setCurrentPageId("page-projects"),
    },
    {
      label: "New task",
      icon: <CheckSquare className="h-4 w-4" />,
      onClick: () => setCurrentPageId("page-tasks"),
    },
  ]

  return (
    <div className="flex gap-2 mb-8">
      {actions.map((action) => (
        <Button
          key={action.label}
          variant="outline"
          className="gap-2"
          onClick={action.onClick}
        >
          {action.icon}
          {action.label}
        </Button>
      ))}
    </div>
  )
}

function RecentPages() {
  const pages = useWorkspaceStore((s) => s.pages)
  const setCurrentPageId = useWorkspaceStore((s) => s.setCurrentPageId)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const allPages = pages.flatMap((p) => [p, ...(p.children || [])])
  const recentPages = [...allPages]
    .sort((a, b) => new Date(b.lastEditedAt).getTime() - new Date(a.lastEditedAt).getTime())
    .slice(0, 6)

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {recentPages.map((page) => (
        <button
          key={page.id}
          onClick={() => setCurrentPageId(page.id)}
          className="group flex flex-col rounded-lg border p-4 text-left transition-all hover:shadow-md hover:border-primary/20 bg-card"
        >
          {page.cover ? (
            <div
              className="h-20 rounded-md mb-3 -mx-4 -mt-4"
              style={{ background: page.cover }}
            />
          ) : (
            <div className="h-20 rounded-md mb-3 -mx-4 -mt-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900" />
          )}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{page.icon}</span>
            <h3 className="font-medium truncate">{page.title}</h3>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Edited {formatDate(page.lastEditedAt)}</span>
          </div>
          {page.isFavorite && (
            <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 mt-2" />
          )}
        </button>
      ))}
    </div>
  )
}

function ActivityFeed() {
  const activities = useWorkspaceStore((s) => s.activities)
  const teamMembers = useWorkspaceStore((s) => s.teamMembers)
  const setCurrentPageId = useWorkspaceStore((s) => s.setCurrentPageId)

  const getActor = (userId: string) => teamMembers.find((m) => m.id === userId)

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Recent Activity
      </h3>
      <div className="space-y-3">
        {activities.slice(0, 6).map((activity) => {
          const actor = getActor(activity.userId)
          return (
            <button
              key={activity.id}
              onClick={() => setCurrentPageId(activity.pageId)}
              className="flex w-full items-start gap-3 rounded-md p-2 text-left transition-colors hover:bg-accent/50"
            >
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-medium"
                style={{
                  backgroundColor: actor?.color + "20",
                  color: actor?.color,
                }}
              >
                {actor?.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium">{activity.userName}</span>{" "}
                  <span className="text-muted-foreground">{activity.action}</span>{" "}
                  <span className="font-medium">{activity.pageTitle}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatDate(activity.createdAt)}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function HomePage() {
  const setCurrentPageId = useWorkspaceStore((s) => s.setCurrentPageId)

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <Greeting />
        <QuickActions />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent pages</h2>
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                View all <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
            <RecentPages />
          </div>

          <div className="w-full lg:w-72 shrink-0">
            <ActivityFeed />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
