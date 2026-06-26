"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Workspace, Page, TeamMember, Database, Notification, Activity, Comment, FakeCursor, Block, Toast, Reply } from "@/types"
import {
  workspaces,
  pages as seedPages,
  teamMembers,
  projectsDatabase,
  tasksDatabase,
  meetingNotesDatabase,
  notifications,
  activities,
  comments,
  fakeCursors,
} from "@/data/seed"
import { generateId } from "@/lib/utils"

// Add initial block content to seed pages
const pagesWithContent: Page[] = seedPages.map((page) => {
  if (page.id === "page-roadmap") {
    return {
      ...page,
      content: [
        { id: generateId(), type: "heading_1", content: "Q3 2026 Roadmap", commentIds: [] },
        { id: generateId(), type: "paragraph", content: "Our strategic plan for the third quarter of 2026. This roadmap outlines key milestones, deliverables, and team objectives.", commentIds: [] },
        { id: generateId(), type: "divider", content: "", commentIds: [] },
        { id: generateId(), type: "heading_2", content: "July 2026", commentIds: [] },
        { id: generateId(), type: "toggle", content: "Launch Brand Refresh for Oak & Stone", collapsed: false, children: [
          { id: generateId(), type: "numbered_list", content: "Finalize logo assets and brand guidelines", commentIds: [] },
          { id: generateId(), type: "numbered_list", content: "Deploy updated website with new branding", commentIds: [] },
          { id: generateId(), type: "numbered_list", content: "Launch social media campaign", commentIds: [] },
        ], commentIds: [] },
        { id: generateId(), type: "toggle", content: "Complete E-commerce Rebuild for Verde", collapsed: false, children: [
          { id: generateId(), type: "numbered_list", content: "Finish checkout flow redesign", commentIds: [] },
          { id: generateId(), type: "numbered_list", content: "Integrate payment gateway", commentIds: [] },
          { id: generateId(), type: "numbered_list", content: "User acceptance testing", commentIds: [] },
        ], commentIds: [] },
        { id: generateId(), type: "heading_2", content: "August 2026", commentIds: [] },
        { id: generateId(), type: "toggle", content: "Mobile App Beta — Pulse Fitness", collapsed: false, children: [
          { id: generateId(), type: "numbered_list", content: "Complete core workout tracking features", commentIds: [] },
          { id: generateId(), type: "numbered_list", content: "Beta testing with 50 users", commentIds: [] },
          { id: generateId(), type: "numbered_list", content: "Performance optimization", commentIds: [] },
        ], commentIds: [] },
        { id: generateId(), type: "heading_2", content: "September 2026", commentIds: [] },
        { id: generateId(), type: "toggle", content: "SaaS Dashboard Launch — Nova Tech", collapsed: false, children: [
          { id: generateId(), type: "numbered_list", content: "Analytics dashboard v1.0", commentIds: [] },
          { id: generateId(), type: "numbered_list", content: "Real-time data pipeline", commentIds: [] },
          { id: generateId(), type: "numbered_list", content: "Customer onboarding flow", commentIds: [] },
        ], commentIds: [] },
        { id: generateId(), type: "callout", content: "Goal: Ship 3 major client projects and onboard 2 new retainer clients", commentIds: [] },
      ] as Block[],
    }
  }
  if (page.id === "page-meeting-notes") {
    return {
      ...page,
      content: [
        { id: generateId(), type: "heading_1", content: "Meeting Notes", commentIds: [] },
        { id: generateId(), type: "paragraph", content: "A central hub for all team meeting notes, standups, and client reviews.", commentIds: [] },
        { id: generateId(), type: "divider", content: "", commentIds: [] },
        { id: generateId(), type: "heading_2", content: "Quick Links", commentIds: [] },
        { id: generateId(), type: "bullet_list", content: "Weekly Standup — June 23", commentIds: [] },
        { id: generateId(), type: "bullet_list", content: "Client Review — Oak & Stone", commentIds: [] },
        { id: generateId(), type: "bullet_list", content: "Sprint Planning — Sprint 14", commentIds: [] },
        { id: generateId(), type: "paragraph", content: "", commentIds: [] },
        { id: generateId(), type: "heading_2", content: "Recent Notes", commentIds: [] },
        { id: generateId(), type: "to_do", content: "Review action items from last standup", checked: true, commentIds: [] },
        { id: generateId(), type: "to_do", content: "Prepare client presentation materials", checked: false, commentIds: [] },
        { id: generateId(), type: "to_do", content: "Update sprint backlog", checked: true, commentIds: [] },
      ] as Block[],
    }
  }
  if (page.id === "page-team") {
    return {
      ...page,
      content: [
        { id: generateId(), type: "heading_1", content: "Team Directory", commentIds: [] },
        { id: generateId(), type: "paragraph", content: "Meet the Lumina Studio team. We are a group of passionate designers, developers, and strategists dedicated to crafting exceptional digital experiences.", commentIds: [] },
        { id: generateId(), type: "divider", content: "", commentIds: [] },
        { id: generateId(), type: "heading_2", content: "Leadership", commentIds: [] },
        { id: generateId(), type: "bullet_list", content: "David Kim — Creative Director", commentIds: [] },
        { id: generateId(), type: "bullet_list", content: "Sarah Chen — Design Lead", commentIds: [] },
        { id: generateId(), type: "heading_2", content: "Engineering", commentIds: [] },
        { id: generateId(), type: "bullet_list", content: "Marcus Webb — Senior Developer", commentIds: [] },
        { id: generateId(), type: "bullet_list", content: "Elena Rossi — Frontend Engineer", commentIds: [] },
        { id: generateId(), type: "heading_2", content: "Operations", commentIds: [] },
        { id: generateId(), type: "bullet_list", content: "Aisha Patel — Project Manager", commentIds: [] },
        { id: generateId(), type: "bullet_list", content: "James O'Connor — UX Researcher", commentIds: [] },
        { id: generateId(), type: "paragraph", content: "", commentIds: [] },
        { id: generateId(), type: "callout", content: "Want to join the team? Check out our open positions at careers.lumina.studio", commentIds: [] },
      ] as Block[],
    }
  }
  if (page.id === "page-brand") {
    return {
      ...page,
      content: [
        { id: generateId(), type: "heading_1", content: "Brand Guidelines", commentIds: [] },
        { id: generateId(), type: "paragraph", content: "The official brand guidelines for Lumina Studio. Use these standards to maintain consistency across all touchpoints.", commentIds: [] },
        { id: generateId(), type: "divider", content: "", commentIds: [] },
        { id: generateId(), type: "heading_2", content: "Our Mission", commentIds: [] },
        { id: generateId(), type: "quote", content: "We craft digital experiences that inspire, engage, and transform businesses.", commentIds: [] },
        { id: generateId(), type: "heading_2", content: "Sections", commentIds: [] },
        { id: generateId(), type: "to_do", content: "Review Color Palette", checked: true, commentIds: [] },
        { id: generateId(), type: "to_do", content: "Update Typography guidelines", checked: false, commentIds: [] },
        { id: generateId(), type: "to_do", content: "Audit Logo Assets", checked: false, commentIds: [] },
        { id: generateId(), type: "paragraph", content: "", commentIds: [] },
        { id: generateId(), type: "heading_2", content: "Brand Voice", commentIds: [] },
        { id: generateId(), type: "paragraph", content: "Our brand voice is confident yet approachable. We speak with clarity and purpose, avoiding jargon while maintaining professionalism. Every piece of communication should feel like it comes from a trusted advisor.", commentIds: [] },
      ] as Block[],
    }
  }
  if (page.id === "page-analytics") {
    return {
      ...page,
      content: [
        { id: generateId(), type: "heading_1", content: "Analytics Dashboard", commentIds: [] },
        { id: generateId(), type: "paragraph", content: "Internal analytics and performance metrics for Lumina Studio projects.", commentIds: [] },
        { id: generateId(), type: "callout", content: "This page is private. Only team members can access these metrics.", commentIds: [] },
        { id: generateId(), type: "paragraph", content: "", commentIds: [] },
        { id: generateId(), type: "heading_2", content: "Key Metrics", commentIds: [] },
        { id: generateId(), type: "bullet_list", content: "Active Projects: 12", commentIds: [] },
        { id: generateId(), type: "bullet_list", content: "Team Velocity: 42 points/sprint", commentIds: [] },
        { id: generateId(), type: "bullet_list", content: "Client Satisfaction: 96%", commentIds: [] },
        { id: generateId(), type: "bullet_list", content: "Revenue YTD: $1.2M", commentIds: [] },
      ] as Block[],
    }
  }
  if (page.id === "page-sprint-planning") {
    return {
      ...page,
      content: [
        { id: generateId(), type: "heading_1", content: "Sprint Planning", commentIds: [] },
        { id: generateId(), type: "paragraph", content: "Sprint 14 planning session. Focus on completing the E-commerce Rebuild and starting the Brand Refresh finalization.", commentIds: [] },
        { id: generateId(), type: "divider", content: "", commentIds: [] },
        { id: generateId(), type: "heading_2", content: "Sprint Goals", commentIds: [] },
        { id: generateId(), type: "to_do", content: "Complete checkout flow redesign", checked: false, commentIds: [] },
        { id: generateId(), type: "to_do", content: "Finalize brand color palette", checked: true, commentIds: [] },
        { id: generateId(), type: "to_do", content: "API integration testing", checked: false, commentIds: [] },
        { id: generateId(), type: "to_do", content: "Mobile responsive audit", checked: false, commentIds: [] },
        { id: generateId(), type: "paragraph", content: "", commentIds: [] },
        { id: generateId(), type: "heading_2", content: "Discussion Points", commentIds: [] },
        { id: generateId(), type: "bullet_list", content: "Review blockers from Sprint 13", commentIds: [] },
        { id: generateId(), type: "bullet_list", content: "Capacity planning for Q3", commentIds: [] },
        { id: generateId(), type: "bullet_list", content: "New client onboarding timeline", commentIds: [] },
      ] as Block[],
    }
  }
  if (page.id === "page-client-onboarding") {
    return {
      ...page,
      content: [
        { id: generateId(), type: "heading_1", content: "Client Onboarding", commentIds: [] },
        { id: generateId(), type: "paragraph", content: "Standard onboarding process for new clients joining Lumina Studio.", commentIds: [] },
        { id: generateId(), type: "divider", content: "", commentIds: [] },
        { id: generateId(), type: "heading_2", content: "Process", commentIds: [] },
        { id: generateId(), type: "numbered_list", content: "Initial discovery call and requirements gathering", commentIds: [] },
        { id: generateId(), type: "numbered_list", content: "Project scope definition and timeline", commentIds: [] },
        { id: generateId(), type: "numbered_list", content: "Contract signing and deposit", commentIds: [] },
        { id: generateId(), type: "numbered_list", content: "Team assignment and kickoff meeting", commentIds: [] },
        { id: generateId(), type: "numbered_list", content: "Weekly check-ins and milestone reviews", commentIds: [] },
      ] as Block[],
    }
  }
  if (page.id === "page-brand-colors") {
    return {
      ...page,
      content: [
        { id: generateId(), type: "heading_1", content: "Color Palette", commentIds: [] },
        { id: generateId(), type: "paragraph", content: "Our brand colors are carefully selected to convey trust, creativity, and professionalism.", commentIds: [] },
        { id: generateId(), type: "divider", content: "", commentIds: [] },
        { id: generateId(), type: "heading_2", content: "Primary Colors", commentIds: [] },
        { id: generateId(), type: "paragraph", content: "#2563EB — Primary Blue", commentIds: [] },
        { id: generateId(), type: "paragraph", content: "#1E40AF — Dark Blue", commentIds: [] },
        { id: generateId(), type: "paragraph", content: "#DBEAFE — Light Blue", commentIds: [] },
        { id: generateId(), type: "heading_2", content: "Secondary Colors", commentIds: [] },
        { id: generateId(), type: "paragraph", content: "#22C55E — Success Green", commentIds: [] },
        { id: generateId(), type: "paragraph", content: "#F59E0B — Warning Amber", commentIds: [] },
        { id: generateId(), type: "paragraph", content: "#EF4444 — Error Red", commentIds: [] },
      ] as Block[],
    }
  }
  if (page.id === "page-brand-typography") {
    return {
      ...page,
      content: [
        { id: generateId(), type: "heading_1", content: "Typography", commentIds: [] },
        { id: generateId(), type: "paragraph", content: "Our typography system uses Inter as the primary typeface for all digital products.", commentIds: [] },
        { id: generateId(), type: "divider", content: "", commentIds: [] },
        { id: generateId(), type: "heading_2", content: "Font Stack", commentIds: [] },
        { id: generateId(), type: "code", content: "font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;", commentIds: [] },
        { id: generateId(), type: "heading_2", content: "Scale", commentIds: [] },
        { id: generateId(), type: "paragraph", content: "H1: 40px / 700 weight / -0.02em tracking", commentIds: [] },
        { id: generateId(), type: "paragraph", content: "H2: 32px / 600 weight / -0.015em tracking", commentIds: [] },
        { id: generateId(), type: "paragraph", content: "H3: 24px / 600 weight / -0.01em tracking", commentIds: [] },
        { id: generateId(), type: "paragraph", content: "Body: 16px / 400 weight / 1.6 line-height", commentIds: [] },
        { id: generateId(), type: "paragraph", content: "Small: 14px / 400 weight / 1.5 line-height", commentIds: [] },
      ] as Block[],
    }
  }
  if (page.id === "page-brand-logos") {
    return {
      ...page,
      content: [
        { id: generateId(), type: "heading_1", content: "Logo Assets", commentIds: [] },
        { id: generateId(), type: "paragraph", content: "Downloadable logo assets for use in presentations, websites, and marketing materials.", commentIds: [] },
        { id: generateId(), type: "divider", content: "", commentIds: [] },
        { id: generateId(), type: "heading_2", content: "Available Formats", commentIds: [] },
        { id: generateId(), type: "bullet_list", content: "SVG — Scalable vector format", commentIds: [] },
        { id: generateId(), type: "bullet_list", content: "PNG — Transparent background, various sizes", commentIds: [] },
        { id: generateId(), type: "bullet_list", content: "PDF — Print-ready vector format", commentIds: [] },
        { id: generateId(), type: "paragraph", content: "", commentIds: [] },
        { id: generateId(), type: "callout", content: "Always use the official logo files. Do not recreate or modify the logo.", commentIds: [] },
      ] as Block[],
    }
  }
  // Default empty content for other pages
  return {
    ...page,
    content: [
      { id: generateId(), type: "paragraph", content: "", commentIds: [] },
    ] as Block[],
  }
})

interface WorkspaceState {
  workspaces: Workspace[]
  currentWorkspace: Workspace
  pages: Page[]
  teamMembers: TeamMember[]
  databases: Database[]
  notifications: Notification[]
  activities: Activity[]
  comments: Comment[]
  fakeCursors: FakeCursor[]
  toasts: Toast[]
  helpModalOpen: boolean
  commentsPanelOpen: boolean
  selectedText: string | null
  selectedBlockId: string | null

  sidebarCollapsed: boolean
  sidebarWidth: number
  currentPageId: string | null
  commandPaletteOpen: boolean
  settingsOpen: boolean
  notificationsOpen: boolean
  activeViewId: Record<string, string>
  shareModalOpen: boolean
  shareModalPageId: string | null
  activityPanelOpen: boolean

  setCurrentWorkspace: (workspace: Workspace) => void
  toggleSidebar: () => void
  setSidebarWidth: (width: number) => void
  setCurrentPageId: (pageId: string | null) => void
  toggleCommandPalette: () => void
  setCommandPaletteOpen: (open: boolean) => void
  toggleSettings: () => void
  toggleNotifications: () => void
  setActiveView: (databaseId: string, viewId: string) => void
  toggleShareModal: (pageId?: string) => void
  toggleActivityPanel: () => void
  toggleHelpModal: () => void
  toggleCommentsPanel: () => void
  addPage: (page: Page) => void
  updatePage: (pageId: string, updates: Partial<Page>) => void
  updatePageContent: (pageId: string, content: Block[]) => void
  deletePage: (pageId: string) => void
  toggleFavorite: (pageId: string) => void
  reorderPages: (pages: Page[]) => void
  markNotificationRead: (notificationId: string) => void
  markAllNotificationsRead: () => void
  addComment: (comment: Comment) => void
  resolveComment: (commentId: string) => void
  addReply: (commentId: string, reply: Reply) => void
  updateCursorPosition: (cursorId: string, x: number, y: number) => void
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (toastId: string) => void
  setSelectedText: (text: string | null, blockId: string | null) => void
  updateDatabaseItem: (databaseId: string, itemId: string, columnId: string, value: unknown) => void
  deleteDatabaseItem: (databaseId: string, itemId: string) => void
  addDatabaseItem: (databaseId: string, item: DatabaseItem) => void
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      workspaces,
      currentWorkspace: workspaces[0],
      pages: pagesWithContent,
      teamMembers,
      databases: [projectsDatabase, tasksDatabase, meetingNotesDatabase],
      notifications,
      activities,
      comments,
      fakeCursors,
      toasts: [],
      helpModalOpen: false,
      commentsPanelOpen: false,
      selectedText: null,
      selectedBlockId: null,

      sidebarCollapsed: false,
      sidebarWidth: 240,
      currentPageId: null,
      commandPaletteOpen: false,
      settingsOpen: false,
      notificationsOpen: false,
      activeViewId: {
        "db-projects": "view-board",
        "db-tasks": "view-table",
        "db-meetings": "view-list",
      },
      shareModalOpen: false,
      shareModalPageId: null,
      activityPanelOpen: true,

      setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),

      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setSidebarWidth: (width) =>
        set({ sidebarWidth: Math.max(200, Math.min(400, width)) }),

      setCurrentPageId: (pageId) => set({ currentPageId: pageId }),

      toggleCommandPalette: () =>
        set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),

      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

      toggleSettings: () =>
        set((state) => ({ settingsOpen: !state.settingsOpen })),

      toggleNotifications: () =>
        set((state) => ({ notificationsOpen: !state.notificationsOpen })),

      setActiveView: (databaseId, viewId) =>
        set((state) => ({
          activeViewId: { ...state.activeViewId, [databaseId]: viewId },
        })),

      toggleShareModal: (pageId) =>
        set((state) => ({
          shareModalOpen: !state.shareModalOpen,
          shareModalPageId: pageId || state.shareModalPageId,
        })),

      toggleActivityPanel: () =>
        set((state) => ({ activityPanelOpen: !state.activityPanelOpen })),

      toggleHelpModal: () =>
        set((state) => ({ helpModalOpen: !state.helpModalOpen })),

      toggleCommentsPanel: () =>
        set((state) => ({ commentsPanelOpen: !state.commentsPanelOpen })),

      addPage: (page) =>
        set((state) => ({ pages: [...state.pages, page] })),

      updatePage: (pageId, updates) =>
        set((state) => ({
          pages: state.pages.map((p) =>
            p.id === pageId ? { ...p, ...updates } : p
          ),
        })),

      updatePageContent: (pageId, content) =>
        set((state) => ({
          pages: state.pages.map((p) =>
            p.id === pageId ? { ...p, content, lastEditedAt: new Date().toISOString(), lastEditedBy: "You" } : p
          ),
        })),

      deletePage: (pageId) =>
        set((state) => ({
          pages: state.pages.filter((p) => p.id !== pageId),
        })),

      toggleFavorite: (pageId) =>
        set((state) => ({
          pages: state.pages.map((p) =>
            p.id === pageId ? { ...p, isFavorite: !p.isFavorite } : p
          ),
        })),

      reorderPages: (pages) => set({ pages }),

      markNotificationRead: (notificationId) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n
          ),
        })),

      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      addComment: (comment) =>
        set((state) => ({
          comments: [...state.comments, comment],
        })),

      resolveComment: (commentId) =>
        set((state) => ({
          comments: state.comments.map((c) =>
            c.id === commentId ? { ...c, resolved: true } : c
          ),
        })),

      addReply: (commentId, reply) =>
        set((state) => ({
          comments: state.comments.map((c) =>
            c.id === commentId ? { ...c, replies: [...c.replies, reply] } : c
          ),
        })),

      updateCursorPosition: (cursorId, x, y) =>
        set((state) => ({
          fakeCursors: state.fakeCursors.map((c) =>
            c.id === cursorId ? { ...c, x, y } : c
          ),
        })),

      addToast: (toast) => {
        const id = generateId()
        set((state) => ({
          toasts: [...state.toasts, { ...toast, id }],
        }))
        setTimeout(() => {
          get().removeToast(id)
        }, toast.duration || 4000)
        return id
      },

      removeToast: (toastId) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== toastId),
        })),

      setSelectedText: (text, blockId) =>
        set({ selectedText: text, selectedBlockId: blockId }),

      updateDatabaseItem: (databaseId, itemId, columnId, value) =>
        set((state) => ({
          databases: state.databases.map((db) =>
            db.id === databaseId
              ? {
                  ...db,
                  items: db.items.map((item) =>
                    item.id === itemId
                      ? { ...item, values: { ...item.values, [columnId]: value }, updatedAt: new Date().toISOString() }
                      : item
                  ),
                }
              : db
          ),
        })),

      deleteDatabaseItem: (databaseId, itemId) =>
        set((state) => ({
          databases: state.databases.map((db) =>
            db.id === databaseId
              ? { ...db, items: db.items.filter((item) => item.id !== itemId) }
              : db
          ),
        })),

      addDatabaseItem: (databaseId, item) =>
        set((state) => ({
          databases: state.databases.map((db) =>
            db.id === databaseId
              ? { ...db, items: [...db.items, item] }
              : db
          ),
        })),
    }),
    {
      name: "base-workspace-storage",
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        sidebarWidth: state.sidebarWidth,
        activeViewId: state.activeViewId,
      }),
    }
  )
)
