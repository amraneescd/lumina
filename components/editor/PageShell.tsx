"use client"

import { useState, useRef } from "react"
import { useWorkspaceStore } from "@/stores/useWorkspaceStore"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn, formatDate, generateId } from "@/lib/utils"
import {
  ImageIcon,
  Smile,
  Clock,
  Share2,
  Lock,
  Globe,
  ChevronRight,
  Link2,
  Copy,
  Check,
  X,
} from "lucide-react"
import { BlockEditor } from "@/components/editor/BlockEditor"
import type { Page } from "@/types"

const EMOJIS = [
  "📝", "📄", "📋", "✅", "🗓️", "👥", "💡", "📊", "🎨", "🔤", "🏷️",
  "🚀", "⭐", "🔥", "💎", "🎯", "📈", "🔧", "🛠️", "📱", "💻", "🌐",
  "📁", "📂", "🗂️", "📑", "📒", "📕", "📗", "📘", "📙", "📚", "📖",
  "🏠", "🏢", "🏬", "🏭", "🏪", "🏫", "🏩", "💼", "🔑", "🗝️", "⚙️",
  "🔔", "📣", "📢", "🔊", "📡", "🔍", "🕐", "⏰", "⏳", "⌛", "🗓️",
]

function IconPicker({ currentIcon, onSelect }: { currentIcon: string; onSelect: (icon: string) => void }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-5xl hover:opacity-70 transition-opacity leading-none"
      >
        {currentIcon || "📝"}
      </button>
      {open && (
        <div className="absolute top-full left-0 z-50 mt-2 w-64 rounded-lg border bg-popover shadow-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Choose icon</span>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-8 gap-1">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  onSelect(emoji)
                  setOpen(false)
                }}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-md text-lg hover:bg-accent transition-colors",
                  emoji === currentIcon && "bg-accent"
                )}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function Breadcrumbs({ page }: { page: Page }) {
  const pages = useWorkspaceStore((s) => s.pages)
  const setCurrentPageId = useWorkspaceStore((s) => s.setCurrentPageId)

  const getBreadcrumbs = (page: Page): Page[] => {
    const crumbs: Page[] = [page]
    let current = page
    while (current.parentId) {
      const parent = pages.find((p) => p.id === current.parentId)
      if (!parent) break
      crumbs.unshift(parent)
      current = parent
    }
    return crumbs
  }

  const breadcrumbs = getBreadcrumbs(page)

  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
      {breadcrumbs.map((crumb, idx) => (
        <span key={crumb.id} className="flex items-center gap-1">
          {idx > 0 && <ChevronRight className="h-3.5 w-3.5" />}
          <button
            onClick={() => setCurrentPageId(crumb.id)}
            className="hover:text-foreground transition-colors flex items-center gap-1"
          >
            <span>{crumb.icon}</span>
            <span className="truncate max-w-[120px]">{crumb.title}</span>
          </button>
        </span>
      ))}
    </nav>
  )
}

function ShareModal({ page, onClose }: { page: Page; onClose: () => void }) {
  const [copied, setCopied] = useState(false)
  const [isPublic, setIsPublic] = useState(!page.isPrivate)

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://base.lumina.studio/${page.id}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-xl border bg-popover shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Share</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Link</label>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 rounded-md border bg-muted px-3 py-2 text-sm text-muted-foreground">
                <Link2 className="h-3.5 w-3.5" />
                <span className="truncate">base.lumina.studio/{page.id}</span>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={handleCopy}>
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium">Public access</p>
              <p className="text-xs text-muted-foreground">
                {isPublic ? "Anyone with the link can view" : "Only invited people can access"}
              </p>
            </div>
            <button
              onClick={() => setIsPublic(!isPublic)}
              className={cn(
                "relative h-6 w-11 rounded-full transition-colors",
                isPublic ? "bg-primary" : "bg-muted"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
                  isPublic ? "translate-x-5" : "translate-x-0.5"
                )}
              />
            </button>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium mb-2">People with access</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                  YU
                </div>
                <div className="flex-1">
                  <p className="text-sm">You</p>
                  <p className="text-xs text-muted-foreground">Owner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function PageShell({ pageId }: { pageId: string }) {
  const pages = useWorkspaceStore((s) => s.pages)
  const updatePage = useWorkspaceStore((s) => s.updatePage)
  const toggleShareModal = useWorkspaceStore((s) => s.toggleShareModal)
  const shareModalOpen = useWorkspaceStore((s) => s.shareModalOpen)
  const shareModalPageId = useWorkspaceStore((s) => s.shareModalPageId)
  const [title, setTitle] = useState("")
  const [showCoverInput, setShowCoverInput] = useState(false)

  const allPages = pages.flatMap((p) => [p, ...(p.children || [])])
  const page = allPages.find((p) => p.id === pageId)

  // Sync title when page changes
  const titleRef = useRef(page?.title || "")
  if (page && titleRef.current !== page.title) {
    titleRef.current = page.title
    setTitle(page.title)
  }

  if (!page) return null

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    updatePage(page.id, { title: newTitle, lastEditedAt: new Date().toISOString(), lastEditedBy: "You" })
  }

  const handleIconChange = (icon: string) => {
    updatePage(page.id, { icon, lastEditedAt: new Date().toISOString(), lastEditedBy: "You" })
  }

  const handleCoverChange = (cover: string) => {
    updatePage(page.id, { cover, lastEditedAt: new Date().toISOString(), lastEditedBy: "You" })
    setShowCoverInput(false)
  }

  const gradients = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    "linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)",
    "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  ]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumbs */}
      <Breadcrumbs page={page} />

      {/* Cover */}
      {page.cover ? (
        <div className="relative group h-48 rounded-xl mb-6 -mx-6 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{ background: page.cover }}
          />
          <button
            onClick={() => updatePage(page.id, { cover: null })}
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white rounded-md px-2 py-1 text-xs"
          >
            Remove cover
          </button>
        </div>
      ) : (
        <div className="group relative h-20 -mx-6 mb-6 flex items-center justify-center">
          <button
            onClick={() => setShowCoverInput(!showCoverInput)}
            className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground bg-accent/50 rounded-md px-3 py-1.5"
          >
            <ImageIcon className="h-4 w-4" />
            Add cover
          </button>
          {showCoverInput && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 z-50 mt-2 w-80 rounded-lg border bg-popover shadow-xl p-3">
              <p className="text-sm font-medium mb-2">Choose a cover</p>
              <div className="grid grid-cols-4 gap-2">
                {gradients.map((gradient, i) => (
                  <button
                    key={i}
                    onClick={() => handleCoverChange(gradient)}
                    className="h-12 rounded-md hover:ring-2 hover:ring-primary transition-all"
                    style={{ background: gradient }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Icon + Title */}
      <div className="mb-4">
        <IconPicker currentIcon={page.icon || "📝"} onSelect={handleIconChange} />
        <input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full bg-transparent text-4xl font-bold outline-none tracking-tight mt-3"
          style={{ fontSize: "40px", fontWeight: 700, letterSpacing: "-0.02em" }}
          placeholder="Untitled"
        />
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-6">
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          Last edited {formatDate(page.lastEditedAt)} by {page.lastEditedBy}
        </span>
        {page.isPrivate ? (
          <span className="flex items-center gap-1">
            <Lock className="h-3.5 w-3.5" /> Private
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <Globe className="h-3.5 w-3.5" /> Shared
          </span>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-xs h-7"
          onClick={() => toggleShareModal(page.id)}
        >
          <Share2 className="h-3.5 w-3.5" />
          Share
        </Button>
      </div>

      <Separator className="mb-6" />

      {/* Block Editor */}
      <BlockEditor pageId={pageId} />

      {/* Share Modal */}
      {shareModalOpen && shareModalPageId === page.id && (
        <ShareModal page={page} onClose={() => toggleShareModal()} />
      )}
    </div>
  )
}
