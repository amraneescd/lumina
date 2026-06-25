import { faker } from "@faker-js/faker"
import type {
  TeamMember,
  Workspace,
  Page,
  Database,
  DatabaseColumn,
  DatabaseView,
  DatabaseItem,
  Notification,
  Activity,
  Comment,
  SelectOption,
} from "@/types"
import { generateId, getInitials, getRandomColor } from "@/lib/utils"

// ─── Team Members ─────────────────────────────────────────────────
export const teamMembers: TeamMember[] = [
  {
    id: "user-sarah",
    name: "Sarah Chen",
    role: "Design Lead",
    email: "sarah.chen@lumina.studio",
    avatar: "",
    status: "online",
    initials: "SC",
    color: "#3b82f6",
  },
  {
    id: "user-marcus",
    name: "Marcus Webb",
    role: "Senior Developer",
    email: "marcus.webb@lumina.studio",
    avatar: "",
    status: "online",
    initials: "MW",
    color: "#22c55e",
  },
  {
    id: "user-aisha",
    name: "Aisha Patel",
    role: "Project Manager",
    email: "aisha.patel@lumina.studio",
    avatar: "",
    status: "away",
    initials: "AP",
    color: "#f59e0b",
  },
  {
    id: "user-james",
    name: "James O'Connor",
    role: "UX Researcher",
    email: "james.oconnor@lumina.studio",
    avatar: "",
    status: "offline",
    initials: "JO",
    color: "#8b5cf6",
  },
  {
    id: "user-elena",
    name: "Elena Rossi",
    role: "Frontend Engineer",
    email: "elena.rossi@lumina.studio",
    avatar: "",
    status: "online",
    initials: "ER",
    color: "#ec4899",
  },
  {
    id: "user-david",
    name: "David Kim",
    role: "Creative Director",
    email: "david.kim@lumina.studio",
    avatar: "",
    status: "online",
    initials: "DK",
    color: "#06b6d4",
  },
]

// ─── Workspaces ─────────────────────────────────────────────────────
export const workspaces: Workspace[] = [
  {
    id: "ws-lumina",
    name: "Lumina Studio",
    icon: "✨",
    members: 6,
    plan: "Pro",
  },
  {
    id: "ws-acme",
    name: "Acme Corp",
    icon: "🏢",
    members: 12,
    plan: "Enterprise",
  },
  {
    id: "ws-personal",
    name: "Personal",
    icon: "🏠",
    members: 1,
    plan: "Free",
  },
]

// ─── Status Options ─────────────────────────────────────────────────
const projectStatusOptions: SelectOption[] = [
  { id: "st-not-started", name: "Not Started", color: "#9ca3af" },
  { id: "st-in-progress", name: "In Progress", color: "#3b82f6" },
  { id: "st-in-review", name: "In Review", color: "#f59e0b" },
  { id: "st-completed", name: "Completed", color: "#22c55e" },
  { id: "st-on-hold", name: "On Hold", color: "#ef4444" },
]

const priorityOptions: SelectOption[] = [
  { id: "pr-low", name: "Low", color: "#9ca3af" },
  { id: "pr-medium", name: "Medium", color: "#3b82f6" },
  { id: "pr-high", name: "High", color: "#f59e0b" },
  { id: "pr-urgent", name: "Urgent", color: "#ef4444" },
]

const clientOptions: SelectOption[] = [
  { id: "cl-oak", name: "Oak & Stone", color: "#8b5cf6" },
  { id: "cl-verde", name: "Verde Market", color: "#22c55e" },
  { id: "cl-pulse", name: "Pulse Fitness", color: "#f43f5e" },
  { id: "cl-nova", name: "Nova Tech", color: "#0ea5e9" },
  { id: "cl-artisan", name: "Artisan Coffee", color: "#f59e0b" },
]

const taskStatusOptions: SelectOption[] = [
  { id: "ts-todo", name: "To Do", color: "#9ca3af" },
  { id: "ts-in-progress", name: "In Progress", color: "#3b82f6" },
  { id: "ts-review", name: "Review", color: "#f59e0b" },
  { id: "ts-done", name: "Done", color: "#22c55e" },
]

const tagOptions: SelectOption[] = [
  { id: "tag-design", name: "Design", color: "#8b5cf6" },
  { id: "tag-dev", name: "Dev", color: "#0ea5e9" },
  { id: "tag-research", name: "Research", color: "#f59e0b" },
  { id: "tag-content", name: "Content", color: "#22c55e" },
  { id: "tag-qa", name: "QA", color: "#ef4444" },
]

// ─── Projects Database ──────────────────────────────────────────────
export const projectsDatabase: Database = {
  id: "db-projects",
  title: "Projects",
  icon: "📋",
  workspaceId: "ws-lumina",
  parentId: null,
  columns: [
    { id: "col-title", name: "Title", type: "title" },
    { id: "col-status", name: "Status", type: "status", options: projectStatusOptions },
    { id: "col-priority", name: "Priority", type: "select", options: priorityOptions },
    { id: "col-client", name: "Client", type: "select", options: clientOptions },
    { id: "col-budget", name: "Budget", type: "number" },
    { id: "col-start", name: "Start Date", type: "date" },
    { id: "col-due", name: "Due Date", type: "date" },
    { id: "col-lead", name: "Lead", type: "person" },
    { id: "col-progress", name: "Progress", type: "number" },
  ],
  views: [
    {
      id: "view-board",
      name: "Board",
      type: "board",
      filters: [],
      sorts: [],
      groupBy: "col-status",
      visibleColumns: ["col-title", "col-status", "col-client", "col-due", "col-lead", "col-budget"],
    },
    {
      id: "view-table",
      name: "Table",
      type: "table",
      filters: [],
      sorts: [{ id: "sort-due", columnId: "col-due", direction: "asc" }],
      visibleColumns: ["col-title", "col-status", "col-priority", "col-client", "col-budget", "col-due", "col-lead", "col-progress"],
    },
    {
      id: "view-list",
      name: "List",
      type: "list",
      filters: [],
      sorts: [],
      groupBy: "col-status",
      visibleColumns: ["col-title", "col-status", "col-due", "col-lead"],
    },
    {
      id: "view-calendar",
      name: "Calendar",
      type: "calendar",
      filters: [],
      sorts: [],
      visibleColumns: ["col-title", "col-status", "col-due"],
    },
    {
      id: "view-gallery",
      name: "Gallery",
      type: "gallery",
      filters: [],
      sorts: [],
      visibleColumns: ["col-title", "col-status", "col-client", "col-cover"],
    },
  ],
  items: [],
}

const projectTitles = [
  "Brand Refresh — Oak & Stone",
  "E-commerce Rebuild — Verde",
  "Mobile App — Pulse Fitness",
  "SaaS Dashboard — Nova Tech",
  "Packaging Design — Artisan Coffee",
  "Website Redesign — Oak & Stone",
  "Marketing Campaign — Verde",
  "App Store Optimization — Pulse",
  "API Integration — Nova Tech",
  "Social Media Kit — Artisan",
  "Annual Report — Oak & Stone",
  "Loyalty Program — Verde",
]

// Generate 12 project items
for (let i = 0; i < 12; i++) {
  const status = projectStatusOptions[Math.floor(Math.random() * projectStatusOptions.length)]
  const priority = priorityOptions[Math.floor(Math.random() * priorityOptions.length)]
  const client = clientOptions[Math.floor(Math.random() * clientOptions.length)]
  const lead = teamMembers[Math.floor(Math.random() * teamMembers.length)]
  const progress = status.name === "Completed" ? 100 : status.name === "Not Started" ? 0 : Math.floor(Math.random() * 90) + 10
  const budget = Math.floor(Math.random() * 70000) + 15000
  const startDate = faker.date.between({ from: "2026-01-01", to: "2026-06-01" })
  const dueDate = faker.date.between({ from: startDate, to: "2026-12-31" })

  projectsDatabase.items.push({
    id: `proj-${i}`,
    databaseId: "db-projects",
    values: {
      "col-title": projectTitles[i],
      "col-status": status.id,
      "col-priority": priority.id,
      "col-client": client.id,
      "col-budget": budget,
      "col-start": startDate.toISOString(),
      "col-due": dueDate.toISOString(),
      "col-lead": lead.id,
      "col-progress": progress,
    },
    createdAt: startDate.toISOString(),
    updatedAt: faker.date.recent({ days: 30 }).toISOString(),
  })
}

// ─── Tasks Database ─────────────────────────────────────────────────
export const tasksDatabase: Database = {
  id: "db-tasks",
  title: "Tasks",
  icon: "✅",
  workspaceId: "ws-lumina",
  parentId: null,
  columns: [
    { id: "col-title", name: "Title", type: "title" },
    { id: "col-status", name: "Status", type: "status", options: taskStatusOptions },
    { id: "col-assignee", name: "Assignee", type: "person" },
    { id: "col-due", name: "Due Date", type: "date" },
    { id: "col-project", name: "Project", type: "relation" },
    { id: "col-tags", name: "Tags", type: "multi_select", options: tagOptions },
  ],
  views: [
    {
      id: "view-table",
      name: "Table",
      type: "table",
      filters: [{ id: "filter-status", columnId: "col-status", operator: "is_not", value: "ts-done" }],
      sorts: [{ id: "sort-due", columnId: "col-due", direction: "asc" }],
      visibleColumns: ["col-title", "col-status", "col-assignee", "col-due", "col-project", "col-tags"],
    },
    {
      id: "view-board",
      name: "Board",
      type: "board",
      filters: [],
      sorts: [],
      groupBy: "col-status",
      visibleColumns: ["col-title", "col-status", "col-assignee", "col-due", "col-tags"],
    },
  ],
  items: [],
}

const taskTitles = [
  "Design system audit",
  "Homepage wireframes",
  "API integration",
  "User testing round 1",
  "Competitive analysis",
  "Content strategy doc",
  "Mobile responsiveness review",
  "Performance optimization",
  "Accessibility audit",
  "Brand guidelines update",
  "Client presentation deck",
  "Sprint retrospective notes",
  "User journey mapping",
  "Database schema design",
  "CI/CD pipeline setup",
  "SEO keyword research",
  "Social media templates",
  "Email campaign design",
  "Analytics dashboard",
  "Payment gateway integration",
  "Push notification system",
  "Dark mode implementation",
  "Onboarding flow redesign",
  "Error handling review",
  "Load testing report",
  "Security audit",
  "Documentation update",
  "Team training session",
  "Vendor evaluation",
  "Budget review",
  "Stakeholder interview",
  "Competitor benchmarking",
  "Feature prioritization",
  "Technical debt assessment",
  "Code review guidelines",
  "Design token library",
  "Component library update",
  "Cross-browser testing",
  "Mobile app beta launch",
  "Customer feedback analysis",
]

for (let i = 0; i < 40; i++) {
  const status = taskStatusOptions[Math.floor(Math.random() * taskStatusOptions.length)]
  const assignee = teamMembers[Math.floor(Math.random() * teamMembers.length)]
  const project = projectsDatabase.items[Math.floor(Math.random() * projectsDatabase.items.length)]
  const numTags = Math.floor(Math.random() * 3) + 1
  const tags = Array.from({ length: numTags }, () => tagOptions[Math.floor(Math.random() * tagOptions.length)].id)
  const dueDate = faker.date.between({ from: "2026-06-01", to: "2026-09-30" })

  tasksDatabase.items.push({
    id: `task-${i}`,
    databaseId: "db-tasks",
    values: {
      "col-title": taskTitles[i % taskTitles.length],
      "col-status": status.id,
      "col-assignee": assignee.id,
      "col-due": dueDate.toISOString(),
      "col-project": project.id,
      "col-tags": tags,
    },
    createdAt: faker.date.past({ years: 1 }).toISOString(),
    updatedAt: faker.date.recent({ days: 14 }).toISOString(),
  })
}

// ─── Pages ──────────────────────────────────────────────────────────
export const pages: Page[] = [
  {
    id: "page-projects",
    title: "Projects",
    icon: "📋",
    cover: null,
    parentId: null,
    workspaceId: "ws-lumina",
    isFavorite: true,
    isPrivate: false,
    lastEditedAt: faker.date.recent({ days: 2 }).toISOString(),
    lastEditedBy: "Sarah Chen",
    createdAt: "2026-01-15T00:00:00Z",
    type: "database",
  },
  {
    id: "page-tasks",
    title: "Tasks",
    icon: "✅",
    cover: null,
    parentId: null,
    workspaceId: "ws-lumina",
    isFavorite: true,
    isPrivate: false,
    lastEditedAt: faker.date.recent({ days: 1 }).toISOString(),
    lastEditedBy: "Aisha Patel",
    createdAt: "2026-01-15T00:00:00Z",
    type: "database",
  },
  {
    id: "page-roadmap",
    title: "Roadmap Q3 2026",
    icon: "🗓️",
    cover: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    parentId: null,
    workspaceId: "ws-lumina",
    isFavorite: false,
    isPrivate: false,
    lastEditedAt: faker.date.recent({ days: 3 }).toISOString(),
    lastEditedBy: "David Kim",
    createdAt: "2026-03-01T00:00:00Z",
    type: "page",
  },
  {
    id: "page-meeting-notes",
    title: "Meeting Notes",
    icon: "📝",
    cover: null,
    parentId: null,
    workspaceId: "ws-lumina",
    isFavorite: false,
    isPrivate: false,
    lastEditedAt: faker.date.recent({ days: 1 }).toISOString(),
    lastEditedBy: "Aisha Patel",
    createdAt: "2026-01-20T00:00:00Z",
    type: "page",
    children: [
      {
        id: "page-standup",
        title: "Weekly Standup — June 23",
        icon: "📅",
        cover: null,
        parentId: "page-meeting-notes",
        workspaceId: "ws-lumina",
        isFavorite: false,
        isPrivate: false,
        lastEditedAt: faker.date.recent({ days: 2 }).toISOString(),
        lastEditedBy: "Aisha Patel",
        createdAt: "2026-06-23T00:00:00Z",
        type: "page",
      },
      {
        id: "page-client-review",
        title: "Client Review — Oak & Stone",
        icon: "👔",
        cover: null,
        parentId: "page-meeting-notes",
        workspaceId: "ws-lumina",
        isFavorite: false,
        isPrivate: false,
        lastEditedAt: faker.date.recent({ days: 5 }).toISOString(),
        lastEditedBy: "Sarah Chen",
        createdAt: "2026-06-20T00:00:00Z",
        type: "page",
      },
      {
        id: "page-sprint-planning",
        title: "Sprint Planning — Sprint 14",
        icon: "🏃",
        cover: null,
        parentId: "page-meeting-notes",
        workspaceId: "ws-lumina",
        isFavorite: false,
        isPrivate: false,
        lastEditedAt: faker.date.recent({ days: 7 }).toISOString(),
        lastEditedBy: "Marcus Webb",
        createdAt: "2026-06-18T00:00:00Z",
        type: "page",
      },
    ],
  },
  {
    id: "page-team",
    title: "Team Directory",
    icon: "👥",
    cover: null,
    parentId: null,
    workspaceId: "ws-lumina",
    isFavorite: false,
    isPrivate: false,
    lastEditedAt: faker.date.recent({ days: 10 }).toISOString(),
    lastEditedBy: "David Kim",
    createdAt: "2026-01-10T00:00:00Z",
    type: "page",
  },
  {
    id: "page-brand",
    title: "Brand Guidelines",
    icon: "💡",
    cover: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    parentId: null,
    workspaceId: "ws-lumina",
    isFavorite: false,
    isPrivate: false,
    lastEditedAt: faker.date.recent({ days: 4 }).toISOString(),
    lastEditedBy: "Sarah Chen",
    createdAt: "2026-02-01T00:00:00Z",
    type: "page",
    children: [
      {
        id: "page-colors",
        title: "Color Palette",
        icon: "🎨",
        cover: null,
        parentId: "page-brand",
        workspaceId: "ws-lumina",
        isFavorite: false,
        isPrivate: false,
        lastEditedAt: faker.date.recent({ days: 4 }).toISOString(),
        lastEditedBy: "Sarah Chen",
        createdAt: "2026-02-01T00:00:00Z",
        type: "page",
      },
      {
        id: "page-typography",
        title: "Typography",
        icon: "🔤",
        cover: null,
        parentId: "page-brand",
        workspaceId: "ws-lumina",
        isFavorite: false,
        isPrivate: false,
        lastEditedAt: faker.date.recent({ days: 6 }).toISOString(),
        lastEditedBy: "Sarah Chen",
        createdAt: "2026-02-01T00:00:00Z",
        type: "page",
      },
      {
        id: "page-logos",
        title: "Logo Assets",
        icon: "🏷️",
        cover: null,
        parentId: "page-brand",
        workspaceId: "ws-lumina",
        isFavorite: false,
        isPrivate: false,
        lastEditedAt: faker.date.recent({ days: 8 }).toISOString(),
        lastEditedBy: "David Kim",
        createdAt: "2026-02-01T00:00:00Z",
        type: "page",
      },
    ],
  },
  {
    id: "page-analytics",
    title: "Analytics Dashboard",
    icon: "📊",
    cover: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    parentId: null,
    workspaceId: "ws-lumina",
    isFavorite: false,
    isPrivate: true,
    lastEditedAt: faker.date.recent({ days: 1 }).toISOString(),
    lastEditedBy: "Elena Rossi",
    createdAt: "2026-03-15T00:00:00Z",
    type: "page",
  },
]

// ─── Notifications ──────────────────────────────────────────────────
export const notifications: Notification[] = [
  {
    id: "notif-1",
    type: "mention",
    title: "Mentioned you",
    message: "Sarah Chen mentioned you in 'Brand Refresh — Oak & Stone'",
    pageId: "page-projects",
    read: false,
    createdAt: faker.date.recent({ days: 1 }).toISOString(),
    actorId: "user-sarah",
  },
  {
    id: "notif-2",
    type: "comment",
    title: "New comment",
    message: "Marcus Webb commented on 'API integration' task",
    pageId: "page-tasks",
    read: false,
    createdAt: faker.date.recent({ days: 2 }).toISOString(),
    actorId: "user-marcus",
  },
  {
    id: "notif-3",
    type: "edit",
    title: "Page updated",
    message: "Aisha Patel updated 'Roadmap Q3 2026'",
    pageId: "page-roadmap",
    read: true,
    createdAt: faker.date.recent({ days: 3 }).toISOString(),
    actorId: "user-aisha",
  },
  {
    id: "notif-4",
    type: "share",
    title: "Shared with you",
    message: "David Kim shared 'Brand Guidelines' with the team",
    pageId: "page-brand",
    read: true,
    createdAt: faker.date.recent({ days: 5 }).toISOString(),
    actorId: "user-david",
  },
  {
    id: "notif-5",
    type: "reminder",
    title: "Due soon",
    message: "'Homepage wireframes' is due tomorrow",
    pageId: "page-tasks",
    read: false,
    createdAt: faker.date.recent({ days: 1 }).toISOString(),
    actorId: "user-aisha",
  },
]

// ─── Activity Feed ─────────────────────────────────────────────────
export const activities: Activity[] = [
  {
    id: "act-1",
    type: "edit",
    pageId: "page-projects",
    pageTitle: "Projects",
    userId: "user-sarah",
    userName: "Sarah Chen",
    action: "updated project status",
    createdAt: faker.date.recent({ days: 1 }).toISOString(),
  },
  {
    id: "act-2",
    type: "create",
    pageId: "page-tasks",
    pageTitle: "Tasks",
    userId: "user-aisha",
    userName: "Aisha Patel",
    action: "added 3 new tasks",
    createdAt: faker.date.recent({ days: 2 }).toISOString(),
  },
  {
    id: "act-3",
    type: "comment",
    pageId: "page-roadmap",
    pageTitle: "Roadmap Q3 2026",
    userId: "user-david",
    userName: "David Kim",
    action: "commented on milestone",
    createdAt: faker.date.recent({ days: 3 }).toISOString(),
  },
  {
    id: "act-4",
    type: "edit",
    pageId: "page-brand",
    pageTitle: "Brand Guidelines",
    userId: "user-sarah",
    userName: "Sarah Chen",
    action: "updated color palette",
    createdAt: faker.date.recent({ days: 4 }).toISOString(),
  },
  {
    id: "act-5",
    type: "create",
    pageId: "page-meeting-notes",
    pageTitle: "Meeting Notes",
    userId: "user-james",
    userName: "James O'Connor",
    action: "created new meeting note",
    createdAt: faker.date.recent({ days: 5 }).toISOString(),
  },
  {
    id: "act-6",
    type: "edit",
    pageId: "page-analytics",
    pageTitle: "Analytics Dashboard",
    userId: "user-elena",
    userName: "Elena Rossi",
    action: "updated metrics",
    createdAt: faker.date.recent({ days: 1 }).toISOString(),
  },
]

// ─── Comments ───────────────────────────────────────────────────────
export const comments: Comment[] = [
  {
    id: "comment-1",
    pageId: "page-roadmap",
    blockId: "block-1",
    text: "Should we move the mobile app launch to August? The current timeline feels tight.",
    userId: "user-marcus",
    userName: "Marcus Webb",
    userAvatar: "",
    createdAt: faker.date.recent({ days: 2 }).toISOString(),
    resolved: false,
    replies: [
      {
        id: "reply-1",
        pageId: "page-roadmap",
        blockId: "block-1",
        text: "Agreed. Let's discuss in tomorrow's standup.",
        userId: "user-aisha",
        userName: "Aisha Patel",
        userAvatar: "",
        createdAt: faker.date.recent({ days: 1 }).toISOString(),
        resolved: false,
        replies: [],
      },
    ],
  },
]

// ─── Fake Cursors ───────────────────────────────────────────────────
export const fakeCursors = [
  { id: "cursor-sarah", name: "Sarah", color: "#3b82f6", x: 200, y: 300 },
  { id: "cursor-marcus", name: "Marcus", color: "#22c55e", x: 500, y: 150 },
  { id: "cursor-david", name: "David", color: "#06b6d4", x: 350, y: 450 },
]
