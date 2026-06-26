"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useWorkspaceStore } from "@/stores/useWorkspaceStore"
import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { cn, formatDate, getGreeting, generateId } from "@/lib/utils"
import {
  Plus,
  FileText,
  FolderOpen,
  CheckSquare,
  Clock,
  ArrowRight,
  TrendingUp,
  Calendar,
  Users,
  ChevronRight,
} from "lucide-react"
import { motion } from "framer-motion"

export default function DashboardPage() {
  const router = useRouter()
  const pages = useWorkspaceStore((s) => s.pages)
  const databases = useWorkspaceStore((s) => s.databases)
  const teamMembers = useWorkspaceStore((s) => s.teamMembers)
  const activities = useWorkspaceStore((s) => s.activities)
  const addPage = useWorkspaceStore((s) => s.addPage)
  const addToast = useWorkspaceStore((s) => s.addToast)
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const allPages = pages.flatMap((p) => [p, ...(p.children || [])])
  const recentPages = [...allPages]
    .sort((a, b) => new Date(b.lastEditedAt).getTime() - new Date(a.lastEditedAt).getTime())
    .slice(0, 6)

  const tasksDb = databases.find((d) => d.id === "db-tasks")
  const projectsDb = databases.find((d) => d.id === "db-projects")
  const myTasks = tasksDb?.items
    .filter((item) => item.values["col-assignee"] === "user-sarah")
    .slice(0, 5) || []

  const recentProjects = projectsDb?.items
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4) || []

  const today = new Date()
  const dateString = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  const handleNewPage = () => {
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
      content: [{ id: generateId(), type: "paragraph" as const, content: "", commentIds: [] }],
    }
    addPage(newPage)
    router.push(`/${newPage.id}`)
    addToast({ type: "success", title: "New page created" })
  }

  const handleNewProject = () => {
    router.push("/database/db-projects")
    addToast({ type: "info", title: "Create a new project in the Projects database" })
  }

  const handleNewTask = () => {
    router.push("/database/db-tasks")
    addToast({ type: "info", title: "Create a new task in the Tasks database" })
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="space-y-2">
            <div className="h-8 w-64 shimmer rounded" />
            <div className="h-4 w-48 shimmer rounded" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 shimmer rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-64 shimmer rounded-xl" />
            <div className="h-64 shimmer rounded-xl" />
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            {getGreeting()}, Sarah
          </h1>
          <p className="text-muted-foreground mt-1">{dateString}</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <QuickActionButton
            icon={<FileText className="h-5 w-5" />}
            label="New page"
            description="Start with a blank page"
            onClick={handleNewPage}
            color="bg-blue-500"
          />
          <QuickActionButton
            icon={<FolderOpen className="h-5 w-5" />}
            label="New project"
            description="Create a project entry"
            onClick={handleNewProject}
            color="bg-green-500"
          />
          <QuickActionButton
            icon={<CheckSquare className="h-5 w-5" />}
            label="New task"
            description="Add a task to track"
            onClick={handleNewTask}
            color="bg-amber-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Pages */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Recent pages</h2>
                <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={() => router.push("/")}>
                  View all <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recentPages.map((page, idx) => (
                  <motion.div
                    key={page.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => router.push(page.type === "database" ? `/database/${page.id}` : `/${page.id}`)}
                    className="group cursor-pointer rounded-xl border bg-card overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5"
                  >
                    {page.cover ? (
                      <div className="h-24 w-full" style={{ background: page.cover }} />
                    ) : (
                      <div className="h-24 w-full bg-gradient-to-br from-muted to-muted/50" />
                    )}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{page.icon}</span>
                        <h3 className="text-sm font-medium truncate">{page.title}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Edited {formatDate(page.lastEditedAt)} by {page.lastEditedBy}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* My Tasks */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">My tasks</h2>
                <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={() => router.push("/database/db-tasks")}>
                  View all <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
              <div className="space-y-2">
                {myTasks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground border rounded-xl">
                    <CheckSquare className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No tasks assigned to you</p>
                  </div>
                ) : (
                  myTasks.map((task) => {
                    const statusId = task.values["col-status"] as string
                    const statusOpt = tasksDb?.columns.find((c) => c.id === "col-status")?.options?.find((o) => o.id === statusId)
                    const dueDate = task.values["col-due"] as string
                    const projectId = task.values["col-project"] as string
                    const project = projectsDb?.items.find((p) => p.id === projectId)
                    return (
                      <div
                        key={task.id}
                        onClick={() => router.push("/database/db-tasks")}
                        className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent/50 cursor-pointer transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{task.values["col-title"] as string}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {statusOpt && (
                              <span
                                className="rounded-md px-1.5 py-0.5 text-[10px] font-medium"
                                style={{ backgroundColor: statusOpt.color + "20", color: statusOpt.color }}
                              >
                                {statusOpt.name}
                              </span>
                            )}
                            {dueDate && (
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDate(dueDate, "short")}
                              </span>
                            )}
                            {project && (
                              <span className="text-[10px] text-muted-foreground truncate">
                                {project.values["col-title"] as string}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </section>

            {/* Projects Overview */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Projects overview</h2>
                <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={() => router.push("/database/db-projects")}>
                  View all <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {recentProjects.map((project) => {
                  const statusId = project.values["col-status"] as string
                  const statusOpt = projectsDb?.columns.find((c) => c.id === "col-status")?.options?.find((o) => o.id === statusId)
                  const progress = project.values["col-progress"] as number || 0
                  const dueDate = project.values["col-due"] as string
                  return (
                    <div
                      key={project.id}
                      onClick={() => router.push("/database/db-projects")}
                      className="min-w-[260px] rounded-xl border bg-card p-4 cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-sm font-medium truncate">{project.values["col-title"] as string}</h3>
                        {statusOpt && (
                          <span
                            className="rounded-md px-1.5 py-0.5 text-[10px] font-medium shrink-0"
                            style={{ backgroundColor: statusOpt.color + "20", color: statusOpt.color }}
                          >
                            {statusOpt.name}
                          </span>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{progress}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        {dueDate && (
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Due {formatDate(dueDate, "short")}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          </div>

          {/* Activity Feed Sidebar */}
          <div className="space-y-6">
            <section>
              <h2 className="text-lg font-semibold mb-4">Activity</h2>
              <div className="space-y-4">
                {activities.slice(0, 10).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div
                      className="h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-medium shrink-0"
                      style={{ backgroundColor: activity.userColor + "20", color: activity.userColor }}
                    >
                      {activity.userName.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs leading-relaxed">
                        <span className="font-medium">{activity.userName}</span>{" "}
                        <span className="text-muted-foreground">{activity.action}</span>
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{formatDate(activity.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Team Online */}
            <section>
              <h2 className="text-lg font-semibold mb-4">Team</h2>
              <div className="space-y-2">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 rounded-lg border p-2.5">
                    <div className="relative">
                      <div
                        className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium"
                        style={{ backgroundColor: member.color + "20", color: member.color }}
                      >
                        {member.initials}
                      </div>
                      <span
                        className={cn(
                          "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background",
                          member.status === "online" && "bg-green-500",
                          member.status === "away" && "bg-amber-500",
                          member.status === "offline" && "bg-gray-400"
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

function QuickActionButton({
  icon,
  label,
  description,
  onClick,
  color,
}: {
  icon: React.ReactNode
  label: string
  description: string
  onClick: () => void
  color: string
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 rounded-xl border bg-card p-4 text-left hover:shadow-lg transition-all hover:-translate-y-1 group focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center text-white shrink-0", color)}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium group-hover:text-primary transition-colors">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </button>
  )
}
