"use client"

import { useParams } from "next/navigation"
import { useWorkspaceStore } from "@/stores/useWorkspaceStore"
import { AppLayout } from "@/components/layout/AppLayout"
import dynamic from "next/dynamic"

const PageShell = dynamic(() => import("@/components/editor/PageShell").then((mod) => mod.PageShell), {
  loading: () => (
    <div className="max-w-4xl mx-auto space-y-4 animate-pulse">
      <div className="h-8 w-64 bg-muted rounded" />
      <div className="h-4 w-48 bg-muted rounded" />
      <div className="h-48 bg-muted rounded-xl" />
      <div className="space-y-2">
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-3/4 bg-muted rounded" />
        <div className="h-4 w-1/2 bg-muted rounded" />
      </div>
    </div>
  ),
  ssr: false,
})

export default function PageViewer() {
  const params = useParams()
  const pageId = params.pageId as string
  const pages = useWorkspaceStore((s) => s.pages)

  const allPages = pages.flatMap((p) => [p, ...(p.children || [])])
  const page = allPages.find((p) => p.id === pageId)

  if (!page) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <p className="text-lg font-medium">Page not found</p>
          <p className="text-sm">This page may have been deleted or moved.</p>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-6">
        <PageShell pageId={page.id} />
      </div>
    </AppLayout>
  )
}
