export interface TeamMember {
  id: string
  name: string
  role: string
  email: string
  avatar: string
  status: "online" | "away" | "offline"
  initials: string
  color: string
}

export interface Workspace {
  id: string
  name: string
  icon: string
  members: number
  plan: string
}

export interface Page {
  id: string
  title: string
  icon: string | null
  cover: string | null
  parentId: string | null
  workspaceId: string
  isFavorite: boolean
  isPrivate: boolean
  lastEditedAt: string
  lastEditedBy: string
  createdAt: string
  type: "page" | "database"
  template?: string
  children?: Page[]
  content?: Block[]
}

export interface Block {
  id: string
  type: BlockType
  content: string
  checked?: boolean
  children?: Block[]
  collapsed?: boolean
}

export type BlockType =
  | "paragraph"
  | "heading_1"
  | "heading_2"
  | "heading_3"
  | "bullet_list"
  | "numbered_list"
  | "to_do"
  | "toggle"
  | "quote"
  | "callout"
  | "divider"
  | "code"
  | "image"

export interface Database {
  id: string
  title: string
  icon: string
  workspaceId: string
  parentId: string | null
  columns: DatabaseColumn[]
  views: DatabaseView[]
  items: DatabaseItem[]
}

export interface DatabaseColumn {
  id: string
  name: string
  type: ColumnType
  options?: SelectOption[]
}

export type ColumnType =
  | "title"
  | "select"
  | "multi_select"
  | "status"
  | "date"
  | "person"
  | "checkbox"
  | "number"
  | "relation"
  | "progress"
  | "text"

export interface SelectOption {
  id: string
  name: string
  color: string
}

export interface DatabaseView {
  id: string
  name: string
  type: "table" | "board" | "list" | "calendar" | "gallery"
  filters: Filter[]
  sorts: Sort[]
  groupBy?: string
  visibleColumns: string[]
}

export interface Filter {
  id: string
  columnId: string
  operator: "is" | "is_not" | "contains" | "does_not_contain" | "is_empty" | "is_not_empty" | "greater_than" | "less_than"
  value: string | string[] | number | boolean | null
}

export interface Sort {
  id: string
  columnId: string
  direction: "asc" | "desc"
}

export interface DatabaseItem {
  id: string
  databaseId: string
  values: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface Notification {
  id: string
  type: "mention" | "comment" | "edit" | "share" | "reminder"
  title: string
  message: string
  pageId: string
  read: boolean
  createdAt: string
  actorId: string
}

export interface Activity {
  id: string
  type: "edit" | "comment" | "create" | "delete"
  pageId: string
  pageTitle: string
  userId: string
  userName: string
  action: string
  createdAt: string
}

export interface FakeCursor {
  id: string
  name: string
  color: string
  x: number
  y: number
}

export interface Comment {
  id: string
  pageId: string
  blockId: string
  text: string
  userId: string
  userName: string
  userAvatar: string
  createdAt: string
  resolved: boolean
  replies: Comment[]
}
