"use client"

import { useState } from "react"
import { useWorkspaceStore } from "@/stores/useWorkspaceStore"
import { cn, formatDate, generateId } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { X, Check, MessageCircle, CornerDownRight, Send } from "lucide-react"
import type { Reply } from "@/types"

export function CommentsPanel() {
  const commentsPanelOpen = useWorkspaceStore((s) => s.commentsPanelOpen)
  const toggleCommentsPanel = useWorkspaceStore((s) => s.toggleCommentsPanel)
  const comments = useWorkspaceStore((s) => s.comments)
  const resolveComment = useWorkspaceStore((s) => s.resolveComment)
  const addReply = useWorkspaceStore((s) => s.addReply)
  const currentPageId = useWorkspaceStore((s) => s.currentPageId)
  const pages = useWorkspaceStore((s) => s.pages)

  const [replyText, setReplyText] = useState<Record<string, string>>({})

  if (!commentsPanelOpen) return null

  const allPages = pages.flatMap((p) => [p, ...(p.children || [])])
  const currentPage = allPages.find((p) => p.id === currentPageId)
  const pageComments = comments.filter((c) => c.pageId === currentPageId && !c.resolved)
  const resolvedComments = comments.filter((c) => c.pageId === currentPageId && c.resolved)

  const handleReply = (commentId: string) => {
    const text = replyText[commentId]?.trim()
    if (!text) return
    const reply: Reply = {
      id: generateId(),
      text,
      userId: "user-you",
      userName: "You",
      userAvatar: "",
      userColor: "#2563eb",
      createdAt: new Date().toISOString(),
    }
    addReply(commentId, reply)
    setReplyText((prev) => ({ ...prev, [commentId]: "" }))
  }

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-[360px] border-l bg-background shadow-xl flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold">Comments</h2>
          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">{pageComments.length}</span>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleCommentsPanel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-4 py-3">
        {pageComments.length === 0 && resolvedComments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageCircle className="h-8 w-8 text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">No comments yet</p>
            <p className="text-xs text-muted-foreground mt-1">Select text and click "Add comment" to start a discussion.</p>
          </div>
        )}

        <div className="space-y-4">
          {pageComments.map((comment) => (
            <div key={comment.id} className="space-y-2">
              <div className="flex items-start gap-2">
                <div
                  className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-medium shrink-0"
                  style={{ backgroundColor: comment.userColor + "20", color: comment.userColor }}
                >
                  {comment.userName.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium">{comment.userName}</span>
                    <span className="text-[10px] text-muted-foreground">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-sm mt-1">{comment.text}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={() => resolveComment(comment.id)}
                >
                  <Check className="h-3.5 w-3.5 text-muted-foreground hover:text-green-500" />
                </Button>
              </div>

              {/* Replies */}
              {comment.replies.length > 0 && (
                <div className="ml-8 space-y-2">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex items-start gap-2">
                      <CornerDownRight className="h-3 w-3 text-muted-foreground mt-1 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <div
                            className="h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-medium shrink-0"
                            style={{ backgroundColor: reply.userColor + "20", color: reply.userColor }}
                          >
                            {reply.userName.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <span className="text-[11px] font-medium">{reply.userName}</span>
                          <span className="text-[10px] text-muted-foreground">{formatDate(reply.createdAt)}</span>
                        </div>
                        <p className="text-xs mt-0.5">{reply.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply input */}
              <div className="ml-8 flex items-center gap-2">
                <input
                  type="text"
                  value={replyText[comment.id] || ""}
                  onChange={(e) => setReplyText((prev) => ({ ...prev, [comment.id]: e.target.value }))}
                  onKeyDown={(e) => { if (e.key === "Enter") handleReply(comment.id) }}
                  placeholder="Reply..."
                  className="flex-1 text-xs bg-muted rounded-md px-2 py-1.5 outline-none focus:ring-1 focus:ring-primary"
                />
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleReply(comment.id)}>
                  <Send className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}

          {resolvedComments.length > 0 && (
            <div className="pt-4 border-t">
              <p className="text-xs font-medium text-muted-foreground mb-3">Resolved ({resolvedComments.length})</p>
              {resolvedComments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-2 opacity-50">
                  <div
                    className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-medium shrink-0"
                    style={{ backgroundColor: comment.userColor + "20", color: comment.userColor }}
                  >
                    {comment.userName.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium">{comment.userName}</span>
                      <Check className="h-3 w-3 text-green-500" />
                    </div>
                    <p className="text-sm mt-0.5 line-through">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
