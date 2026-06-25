"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Workspace, Page, TeamMember, Database, Notification, Activity, Comment, FakeCursor, Block } from "@/types"
import {
  workspaces,
  pages as seedPages,
  teamMembers,
  projectsDatabase,
  tasksDatabase,
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
        { id: generateId(), type: "heading_1", content: "Q3 2026 Roadmap" },
        { id: generateId(), type: "paragraph", content: "Our strategic plan for the third quarter of 2026. This roadmap outlines key milestones, deliverables, and team objectives." },
        { id: generateId(), type: "divider", content: "" },
        { id: generateId(), type: "heading_2", content: "July 2026" },
        { id: generateId(), type: "toggle", content: "Launch Brand Refresh for Oak & Stone", children: [
          { id: generateId(), type: "numbered_list", content: "Finalize logo assets and brand guidelines" },
          { id: generateId(), type: "numbered_list", content: "Deploy updated website with new branding" },
          { id: generateId(), type: "numbered_list", content: "Launch social media campaign" },
        ]},
        { id: generateId(), type: "toggle", content: "Complete E-commerce Rebuild for Verde", children: [
          { id: generateId(), type: "numbered_list", content: "Finish checkout flow redesign" },
          { id: generateId(), type: "numbered_list", content: "Integrate payment gateway" },
          { id: generateId(), type: "numbered_list", content: "User acceptance testing" },
        ]},
        { id: generateId(), type: "heading_2", content: "August 2026" },
        { id: generateId(), type: "toggle", content: "Mobile App Beta — Pulse Fitness", children: [
          { id: generateId(), type: "numbered_list", content: "Complete core workout tracking features" },
          { id: generateId(), type: "numbered_list", content: "Beta testing with 50 users" },
          { id: generateId(), type: "numbered_list", content: "Performance optimization" },
        ]},
        { id: generateId(), type: "heading_2", content: "September 2026" },
        { id: generateId(), type: "toggle", content: "SaaS Dashboard Launch — Nova Tech", children: [
          { id: generateId(), type: "numbered_list", content: "Analytics dashboard v1.0" },
          { id: generateId(), type: "numbered_list", content: "Real-time data pipeline" },
          { id: generateId(), type: "numbered_list", content: "Customer onboarding flow" },
        ]},
        { id: generateId(), type: "callout", content: "Team Goal: Achieve 95% client satisfaction rating across all Q3 deliverables." },
      ] as Block[],
    }
  }
  if (page.id === "page-meeting-notes") {
    return {
      ...page,
      content: [
        { id: generateId(), type: "heading_1", content: "Meeting Notes" },
        { id: generateId(), type: "paragraph", content: "A central hub for all team meeting notes, standups, and client reviews." },
        { id: generateId(), type: "divider", content: "" },
        { id: generateId(), type: "heading_2", content: "Quick Links" },
        { id: generateId(), type: "bullet_list", content: "Weekly Standup — June 23" },
        { id: generateId(), type: "bullet_list", content: "Client Review — Oak & Stone" },
        { id: generateId(), type: "bullet_list", content: "Sprint Planning — Sprint 14" },
      ] as Block[],
    }
  }
  if (page.id === "page-team") {
    return {
      ...page,
      content: [
        { id: generateId(), type: "heading_1", content: "Team Directory" },
        { id: generateId(), type: "paragraph", content: "Meet the Lumina Studio team." },
        { id: generateId(), type: "divider", content: "" },
        { id: generateId(), type: "heading_2", content: "Leadership" },
        { id: generateId(), type: "bullet_list", content: "David Kim — Creative Director" },
        { id: generateId(), type: "bullet_list", content: "Sarah Chen — Design Lead" },
        { id: generateId(), type: "heading_2", content: "Engineering" },
        { id: generateId(), type: "bullet_list", content: "Marcus Webb — Senior Developer" },
        { id: generateId(), type: "bullet_list", content: "Elena Rossi — Frontend Engineer" },
        { id: generateId(), type: "heading_2", content: "Operations" },
        { id: generateId(), type: "bullet_list", content: "Aisha Patel — Project Manager" },
        { id: generateId(), type: "bullet_list", content: "James O'Connor — UX Researcher" },
      ] as Block[],
    }
  }
  if (page.id === "page-brand") {
    return {
      ...page,
      content: [
        { id: generateId(), type: "heading_1", content: "Brand Guidelines" },
        { id: generateId(), type: "paragraph", content: "The official brand guidelines for Lumina Studio. Use these standards to maintain consistency across all touchpoints." },
        { id: generateId(), type: "divider", content: "" },
        { id: generateId(), type: "heading_2", content: "Our Mission" },
        { id: generateId(), type: "quote", content: "We craft digital experiences that inspire, engage, and transform businesses." },
        { id: generateId(), type: "heading_2", content: "Sections" },
        { id: generateId(), type: "to_do", content: "Review Color Palette", checked: true },
        { id: generateId(), type: "to_do", content: "Update Typography guidelines", checked: false },
        { id: generateId(), type: "to_do", content: "Audit Logo Assets", checked: false },
      ] as Block[],
    }
  }
  if (page.id === "page-analytics") {
    return {
      ...page,
      content: [
        { id: generateId(), type: "heading_1", content: "Analytics Dashboard" },
        { id: generateId(), type: "paragraph", content: "Internal analytics and performance metrics for Lumina Studio projects." },
        { id: generateId(), type: "callout", content: "This page is private. Only team members can access these metrics." },
      ] as Block[],
    }
  }
  // Default empty content for other pages
  return {
    ...page,
    content: [
      { id: generateId(), type: "paragraph", content: "" },
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

  sidebarCollapsed: boolean
  sidebarWidth: number
  currentPageId: string | null
  commandPaletteOpen: boolean
  settingsOpen: boolean
  notificationsOpen: boolean
  activeViewId: Record<string, string>
  shareModalOpen: boolean
  shareModalPageId: string | null

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
  addPage: (page: Page) => void
  updatePage: (pageId: string, updates: Partial<Page>) => void
  updatePageContent: (pageId: string, content: Block[]) => void
  deletePage: (pageId: string) => void
  toggleFavorite: (pageId: string) => void
  reorderPages: (pages: Page[]) => void
  markNotificationRead: (notificationId: string) => void
  markAllNotificationsRead: () => void
  addComment: (comment: Comment) => void
  updateCursorPosition: (cursorId: string, x: number, y: number) => void
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      workspaces,
      currentWorkspace: workspaces[0],
      pages: pagesWithContent,
      teamMembers,
      databases: [projectsDatabase, tasksDatabase],
      notifications,
      activities,
      comments,
      fakeCursors,

      sidebarCollapsed: false,
      sidebarWidth: 240,
      currentPageId: null,
      commandPaletteOpen: false,
      settingsOpen: false,
      notificationsOpen: false,
      activeViewId: {
        "db-projects": "view-board",
        "db-tasks": "view-table",
      },
      shareModalOpen: false,
      shareModalPageId: null,

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

      updateCursorPosition: (cursorId, x, y) =>
        set((state) => ({
          fakeCursors: state.fakeCursors.map((c) =>
            c.id === cursorId ? { ...c, x, y } : c
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
