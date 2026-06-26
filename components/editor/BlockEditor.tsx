"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { useWorkspaceStore } from "@/stores/useWorkspaceStore"
import { cn, generateId } from "@/lib/utils"
import {
  GripVertical,
  Plus,
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Minus,
  Quote,
  AlertCircle,
  Code,
  ChevronRight,
  ChevronDown,
  Trash2,
  MessageSquare,
} from "lucide-react"
import type { Block, BlockType } from "@/types"

// ─── Slash Command Menu ───────────────────────────────────────────

const BLOCK_TYPES: { type: BlockType; label: string; icon: React.ReactNode; shortcut?: string }[] = [
  { type: "paragraph", label: "Text", icon: <Type className="h-4 w-4" />, shortcut: "Plain text" },
  { type: "heading_1", label: "Heading 1", icon: <Heading1 className="h-4 w-4" />, shortcut: "# " },
  { type: "heading_2", label: "Heading 2", icon: <Heading2 className="h-4 w-4" />, shortcut: "## " },
  { type: "heading_3", label: "Heading 3", icon: <Heading3 className="h-4 w-4" />, shortcut: "### " },
  { type: "bullet_list", label: "Bulleted list", icon: <List className="h-4 w-4" />, shortcut: "- " },
  { type: "numbered_list", label: "Numbered list", icon: <ListOrdered className="h-4 w-4" />, shortcut: "1. " },
  { type: "to_do", label: "To-do list", icon: <CheckSquare className="h-4 w-4" />, shortcut: "[] " },
  { type: "toggle", label: "Toggle list", icon: <ChevronRight className="h-4 w-4" />, shortcut: "> " },
  { type: "quote", label: "Quote", icon: <Quote className="h-4 w-4" />, shortcut: "> " },
  { type: "callout", label: "Callout", icon: <AlertCircle className="h-4 w-4" /> },
  { type: "divider", label: "Divider", icon: <Minus className="h-4 w-4" />, shortcut: "---" },
  { type: "code", label: "Code block", icon: <Code className="h-4 w-4" /> },
]

function SlashCommandMenu({
  position,
  onSelect,
  onClose,
}: {
  position: { top: number; left: number }
  onSelect: (type: BlockType) => void
  onClose: () => void
}) {
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = BLOCK_TYPES.filter((b) =>
    b.label.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === "Enter") {
        e.preventDefault()
        if (filtered[selectedIndex]) {
          onSelect(filtered[selectedIndex].type)
        }
      } else if (e.key === "Escape") {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [filtered, selectedIndex, onSelect, onClose])

  return (
    <div
      className="fixed z-50 w-72 rounded-lg border bg-popover shadow-xl overflow-hidden"
      style={{ top: position.top, left: position.left }}
    >
      <div className="border-b px-3 py-2">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          onKeyDown={(e) => e.stopPropagation()}
        />
      </div>
      <div className="max-h-64 overflow-y-auto py-1">
        {filtered.length === 0 ? (
          <div className="px-3 py-2 text-sm text-muted-foreground">No results</div>
        ) : (
          filtered.map((item, idx) => (
            <button
              key={item.type}
              onClick={() => onSelect(item.type)}
              className={cn(
                "flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors",
                idx === selectedIndex
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/50"
              )}
              onMouseEnter={() => setSelectedIndex(idx)}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                {item.icon}
              </span>
              <div className="flex-1">
                <div className="font-medium">{item.label}</div>
                {item.shortcut && (
                  <div className="text-xs text-muted-foreground">{item.shortcut}</div>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}

// ─── Individual Block Component ───────────────────────────────────

function EditableBlock({
  block,
  index,
  isActive,
  onUpdate,
  onDelete,
  onFocus,
  onAddBelow,
  onConvert,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging,
  pageId,
}: {
  pageId: string
  block: Block
  index: number
  isActive: boolean
  onUpdate: (content: string, checked?: boolean) => void
  onDelete: () => void
  onFocus: () => void
  onAddBelow: () => void
  onConvert: (type: BlockType) => void
  onDragStart: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  isDragging: boolean
}) {
  const [showSlash, setShowSlash] = useState(false)
  const [slashPosition, setSlashPosition] = useState({ top: 0, left: 0 })
  const [isEmpty, setIsEmpty] = useState(!block.content)
  const [showCommentButton, setShowCommentButton] = useState(false)
  const [commentButtonPos, setCommentButtonPos] = useState({ top: 0, left: 0 })
  const contentRef = useRef<HTMLDivElement>(null)
  const isMounted = useRef(false)


  useEffect(() => {
    isMounted.current = true
    return () => { isMounted.current = false }
  }, [])

  useEffect(() => {
    if (contentRef.current && isMounted.current) {
      const currentText = contentRef.current.textContent || ""
      if (currentText !== block.content) {
        contentRef.current.textContent = block.content
      }
    }
  }, [block.content, block.id])

  const handleMouseUp = () => {
    const selection = window.getSelection()
    const text = selection?.toString().trim()
    if (text && text.length > 0) {
      const range = selection?.getRangeAt(0)
      const rect = range?.getBoundingClientRect()
      if (rect) {
        setCommentButtonPos({ top: rect.top + window.scrollY - 40, left: rect.left + rect.width / 2 - 40 })
        setShowCommentButton(true)
        setSelectedText(text, block.id)
      }
    } else {
      setShowCommentButton(false)
    }
  }

  const handleInput = () => {
    const text = contentRef.current?.textContent || ""
    setIsEmpty(!text)
    onUpdate(text)

    if (text === "/") {
      const rect = contentRef.current?.getBoundingClientRect()
      if (rect) {
        setSlashPosition({ top: rect.bottom + 4, left: rect.left })
        setShowSlash(true)
      }
    } else if (!text.startsWith("/")) {
      setShowSlash(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showSlash) {
      if (e.key === "Escape") {
        setShowSlash(false)
        return
      }
      return
    }

    if (e.key === " ") {
      const text = contentRef.current?.textContent || ""
      if (text === "##") {
        e.preventDefault()
        onConvert("heading_2")
        return
      }
      if (text === "###") {
        e.preventDefault()
        onConvert("heading_3")
        return
      }
      if (text === "#") {
        e.preventDefault()
        onConvert("heading_1")
        return
      }
      if (text === "[]") {
        e.preventDefault()
        onConvert("to_do")
        return
      }
      if (text === ">") {
        e.preventDefault()
        onConvert("quote")
        return
      }
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onAddBelow()
    }

    if (e.key === "Backspace" && !block.content) {
      e.preventDefault()
      onDelete()
    }
  }

  const handleSlashSelect = (type: BlockType) => {
    setShowSlash(false)
    onConvert(type)
  }

  const baseClasses = cn(
    "relative w-full outline-none transition-colors rounded-sm px-1 py-0.5",
    isActive && "bg-accent/30",
    block.commentIds && block.commentIds.length > 0 && "border-l-2 border-amber-400 pl-2"
  )

  const renderBlockContent = () => {
    const commonProps = {
      ref: contentRef,
      contentEditable: true,
      suppressContentEditableWarning: true,
      onInput: handleInput,
      onKeyDown: handleKeyDown,
      onFocus: onFocus,
      onMouseUp: handleMouseUp,
      className: baseClasses,
    }

    switch (block.type) {
      case "heading_1":
        return <h1 {...commonProps} className={cn(baseClasses, "text-3xl font-bold tracking-tight mt-4 mb-2")} />
      case "heading_2":
        return <h2 {...commonProps} className={cn(baseClasses, "text-2xl font-semibold mt-3 mb-2")} />
      case "heading_3":
        return <h3 {...commonProps} className={cn(baseClasses, "text-xl font-semibold mt-2 mb-1")} />
      case "bullet_list":
        return (
          <div className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-foreground shrink-0" />
            <div {...commonProps} className={cn(baseClasses, "flex-1")} />
          </div>
        )
      case "numbered_list":
        return (
          <div className="flex items-start gap-2">
            <span className="mt-1 text-sm text-muted-foreground shrink-0 w-5 text-right">{index + 1}.</span>
            <div {...commonProps} className={cn(baseClasses, "flex-1")} />
          </div>
        )
      case "to_do":
        return (
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={block.checked || false}
              onChange={(e) => onUpdate(block.content, e.target.checked)}
              className="mt-1.5 h-4 w-4 rounded border-2 shrink-0 accent-primary"
            />
            <div {...commonProps} className={cn(baseClasses, "flex-1", block.checked && "line-through text-muted-foreground")} />
          </div>
        )
      case "toggle":
        return (
          <div className="flex items-start gap-1">
            <button className="mt-1 p-0.5 hover:bg-accent rounded">
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
            <div {...commonProps} className={cn(baseClasses, "flex-1 font-medium")} />
          </div>
        )
      case "quote":
        return (
          <blockquote className="border-l-4 border-primary/30 pl-4 py-1 my-2">
            <div {...commonProps} className={cn(baseClasses, "italic text-muted-foreground")} />
          </blockquote>
        )
      case "callout":
        return (
          <div className="flex items-start gap-3 rounded-lg border bg-accent/30 p-4 my-2">
            <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div {...commonProps} className={cn(baseClasses, "flex-1")} />
          </div>
        )
      case "divider":
        return <hr className="my-4 border-border" />
      case "code":
        return (
          <pre className="rounded-lg bg-muted p-4 my-2 overflow-x-auto">
            <code {...commonProps} className={cn(baseClasses, "font-mono text-sm")} />
          </pre>
        )
      default:
        return (
          <div className="relative">
            {isEmpty && !isActive && (
              <span className="absolute left-1 top-0.5 text-muted-foreground pointer-events-none select-none">
                Type &apos;/&apos; for commands
              </span>
            )}
            <div {...commonProps} className={cn(baseClasses, "min-h-[1.5em]")} />
          </div>
        )
    }
  }

  if (block.type === "divider") {
    return (
      <div
        draggable
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={cn("relative group transition-opacity", isDragging && "opacity-30")}
      >
        <div className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 flex items-center gap-1">
          <div className="cursor-grab active:cursor-grabbing p-1 hover:bg-accent rounded">
            <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <button onClick={onAddBelow} className="p-1 hover:bg-accent rounded">
            <Plus className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>
        {renderBlockContent()}
      </div>
    )
  }

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={cn("relative group transition-opacity", isDragging && "opacity-30")}
    >
      {/* Hover actions */}
      <div className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
        <div className="cursor-grab active:cursor-grabbing p-1 hover:bg-accent rounded">
          <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
        <button onClick={onAddBelow} className="p-1 hover:bg-accent rounded">
          <Plus className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>

      {renderBlockContent()}

      {showCommentButton && (
        <button
          onClick={() => {
            const selection = window.getSelection()
            const text = selection?.toString().trim()
            if (text) {
              addComment({
                id: generateId(),
                pageId: pageId,
                blockId: block.id,
                text,
                userId: "user-you",
                userName: "You",
                userAvatar: "",
                userColor: "#2563eb",
                createdAt: new Date().toISOString(),
                resolved: false,
                replies: [],
              })
            }
            toggleCommentsPanel()
            setShowCommentButton(false)
            window.getSelection()?.removeAllRanges()
          }}
          className="fixed z-50 bg-primary text-primary-foreground text-xs px-3 py-1.5 rounded-full shadow-lg hover:bg-primary/90 transition-colors flex items-center gap-1"
          style={{ top: commentButtonPos.top, left: commentButtonPos.left }}
        >
          <MessageSquare className="h-3 w-3" />
          Add comment
        </button>
      )}

      {showSlash && (
        <SlashCommandMenu
          position={slashPosition}
          onSelect={handleSlashSelect}
          onClose={() => setShowSlash(false)}
        />
      )}
    </div>
  )
}

// ─── Main Block Editor ────────────────────────────────────────────

export function BlockEditor({ pageId }: { pageId: string }) {
  const pages = useWorkspaceStore((s) => s.pages)
  const updatePageContent = useWorkspaceStore((s) => s.updatePageContent)
  const addComment = useWorkspaceStore((s) => s.addComment)
  const toggleCommentsPanel = useWorkspaceStore((s) => s.toggleCommentsPanel)
  const setSelectedText = useWorkspaceStore((s) => s.setSelectedText)
  const comments = useWorkspaceStore((s) => s.comments)
  const page = pages.find((p) => p.id === pageId)
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const blocks = page?.content || []

  const updateBlock = useCallback(
    (blockId: string, content: string, checked?: boolean) => {
      const newBlocks = blocks.map((b) =>
        b.id === blockId ? { ...b, content, ...(checked !== undefined && { checked }) } : b
      )
      updatePageContent(pageId, newBlocks)
    },
    [blocks, pageId, updatePageContent]
  )

  const deleteBlock = useCallback(
    (blockId: string) => {
      const newBlocks = blocks.filter((b) => b.id !== blockId)
      if (newBlocks.length === 0) {
        newBlocks.push({ id: generateId(), type: "paragraph", content: "" })
      }
      updatePageContent(pageId, newBlocks)
      const idx = blocks.findIndex((b) => b.id === blockId)
      if (idx > 0) {
        setActiveBlockId(newBlocks[Math.min(idx, newBlocks.length - 1)].id)
      }
    },
    [blocks, pageId, updatePageContent]
  )

  const addBlockBelow = useCallback(
    (index: number, type: BlockType = "paragraph") => {
      const newBlock: Block = {
        id: generateId(),
        type,
        content: "",
        ...(type === "to_do" && { checked: false }),
      }
      const newBlocks = [...blocks]
      newBlocks.splice(index + 1, 0, newBlock)
      updatePageContent(pageId, newBlocks)
      setActiveBlockId(newBlock.id)
    },
    [blocks, pageId, updatePageContent]
  )

  const convertBlock = useCallback(
    (blockId: string, type: BlockType) => {
      const newBlocks = blocks.map((b) =>
        b.id === blockId
          ? { ...b, type, content: "", ...(type === "to_do" ? { checked: false } : {}) }
          : b
      )
      updatePageContent(pageId, newBlocks)
      setActiveBlockId(blockId)
    },
    [blocks, pageId, updatePageContent]
  )

  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    setDraggingId(blockId)
    e.dataTransfer.effectAllowed = "move"
    const ghost = document.createElement("div")
    ghost.style.width = "300px"
    ghost.style.height = "40px"
    ghost.style.background = "rgba(37, 99, 235, 0.1)"
    ghost.style.border = "2px dashed #2563eb"
    ghost.style.borderRadius = "6px"
    document.body.appendChild(ghost)
    e.dataTransfer.setDragImage(ghost, 150, 20)
    setTimeout(() => document.body.removeChild(ghost), 0)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverIndex(index)
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    if (!draggingId) return

    const fromIndex = blocks.findIndex((b) => b.id === draggingId)
    if (fromIndex === -1 || fromIndex === targetIndex) {
      setDraggingId(null)
      setDragOverIndex(null)
      return
    }

    const newBlocks = [...blocks]
    const [removed] = newBlocks.splice(fromIndex, 1)
    newBlocks.splice(targetIndex > fromIndex ? targetIndex : targetIndex, 0, removed)

    updatePageContent(pageId, newBlocks)
    setDraggingId(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDraggingId(null)
    setDragOverIndex(null)
  }

  return (
    <div className="space-y-1 pl-8">
      {blocks.map((block, index) => (
        <div key={block.id}>
          {dragOverIndex === index && draggingId !== block.id && (
            <div className="h-0.5 bg-primary rounded-full my-1" />
          )}
          <EditableBlock
            block={block}
            index={index}
            isActive={activeBlockId === block.id}
            onUpdate={(content, checked) => updateBlock(block.id, content, checked)}
            onDelete={() => deleteBlock(block.id)}
            onFocus={() => setActiveBlockId(block.id)}
            onAddBelow={() => addBlockBelow(index)}
            onConvert={(type) => convertBlock(block.id, type)}
            onDragStart={(e) => handleDragStart(e, block.id)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            isDragging={draggingId === block.id}
            pageId={pageId}
          />
        </div>
      ))}
      {dragOverIndex === blocks.length && (
        <div className="h-0.5 bg-primary rounded-full my-1" />
      )}
      <div
        onDragOver={(e) => handleDragOver(e, blocks.length)}
        onDrop={(e) => handleDrop(e, blocks.length)}
        className="h-4"
      />
    </div>
  )
}
