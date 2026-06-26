"use client"

import { useParams } from "next/navigation"
import { useWorkspaceStore } from "@/stores/useWorkspaceStore"
import { AppLayout } from "@/components/layout/AppLayout"
import dynamic from "next/dynamic"

const DatabaseView = dynamic(() => import("@/components/database/DatabaseView").then((mod) => mod.DatabaseView), {
  loading: () => (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-48 bg-muted rounded" />
      <div className="flex gap-2">
        <div className="h-9 w-24 bg-muted rounded" />
        <div className="h-9 w-24 bg-muted rounded" />
        <div className="h-9 w-24 bg-muted rounded" />
      </div>
      <div className="space-y-2">
        <div className="h-10 w-full bg-muted rounded" />
        <div className="h-10 w-full bg-muted rounded" />
        <div className="h-10 w-full bg-muted rounded" />
        <div className="h-10 w-full bg-muted rounded" />
      </div>
    </div>
  ),
  ssr: false,
})
import { Breadcrumbs } from "@/components/editor/PageShell"
import { cn, formatDate } from "@/lib/utils"
import { ImageIcon } from "lucide-react"

export default function DatabasePage() {
  const params = useParams()
  const dbId = params.dbId as string
  const databases = useWorkspaceStore((s) => s.databases)
  const pages = useWorkspaceStore((s) => s.pages)
  const database = databases.find((d) => d.id === dbId)

  // Find the page that represents this database
  const allPages = pages.flatMap((p) => [p, ...(p.children || [])])
  const page = allPages.find((p) => p.id === dbId || p.title === database?.title)

  if (!database) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <p className="text-lg font-medium">Database not found</p>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* Database Header */}
        <div className="mb-6">
          {page && <Breadcrumbs page={page} />}

          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{database.icon}</span>
            <h1 className="text-3xl font-bold">{database.title}</h1>
          </div>

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{database.items.length} items</span>
            <span>·</span>
            <span>{database.views.length} views</span>
          </div>
        </div>

        {/* Database Content */}
        <DatabaseView databaseId={dbId} />
      </div>
    </AppLayout>
  )
}
