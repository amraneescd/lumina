# Base — Notion-Style Project Management System

A premium, Notion-inspired project management and workspace system built for Rebase agency. This is a **live demo product** designed to showcase engineering and design capabilities.

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (customized)
- **State Management:** Zustand
- **Drag & Drop:** @dnd-kit/core + @dnd-kit/sortable
- **Rich Text Editor:** TipTap (block-based) — *Phase 2*
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Date Handling:** date-fns
- **Fake Data:** @faker-js/faker

## Features (Phase 1 — Complete)

### Foundation
- [x] Next.js 14 App Router with TypeScript strict mode
- [x] Tailwind CSS + shadcn/ui design system
- [x] Dark mode (Light/Dark/System) with next-themes — no flash on load
- [x] Zustand stores with localStorage persistence
- [x] Complete fake data layer (6 team members, 3 workspaces, 12 projects, 40+ tasks, 7 pages)

### Layout & Navigation
- [x] Collapsible left sidebar (240px default, 60px collapsed)
- [x] Workspace switcher with dropdown
- [x] Page tree with expand/collapse, nested pages
- [x] Favorites section
- [x] Private/Shared indicators on pages
- [x] New page button
- [x] User avatar with online status dot
- [x] Top bar with breadcrumbs, presence indicators, share button
- [x] Keyboard shortcut: Cmd/Ctrl+K for Command Palette

### Command Palette
- [x] Spotlight-style search (Cmd/Ctrl+K)
- [x] Search across pages, databases, actions
- [x] Keyboard navigation (Arrow keys, Enter, Escape)
- [x] Categorized results (Pages, Actions, Preferences)

### Settings & Preferences
- [x] Appearance: Light / Dark / System
- [x] Sidebar density: Default / Compact
- [x] Font size: Small / Medium / Large
- [x] Reduced motion toggle
- [x] Notifications panel with 5 realistic notifications
- [x] Account profile modal

### Collaboration UI (Simulated)
- [x] Fake user cursors (3 colored cursors moving randomly)
- [x] Presence indicators ("3 people viewing" with stacked avatars)
- [x] Toast notification system

### Dashboard / Home
- [x] Greeting with current date
- [x] Recent pages grid (6 cards with covers)
- [x] Quick actions (New page, New project, New task)
- [x] Activity feed sidebar
- [x] Skeleton loading states

### Pages
- [x] Page viewer with icon, cover, editable title, breadcrumbs
- [x] Page history meta ("Last edited 2 minutes ago by Sarah Chen")
- [x] Share button

### Database System (Structure Ready)
- [x] Projects database (12 items) with 5 views
- [x] Tasks database (40+ items) with 2 views
- [x] View switcher (Table, Board, List, Calendar, Gallery)
- [x] Search and filter toolbar
- [x] Full column type system (Title, Select, Multi-select, Status, Date, Person, Number, Relation)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
base/
├── app/                    # Next.js App Router
│   ├── [pageId]/          # Dynamic page viewer
│   ├── database/[dbId]/   # Database viewer
│   ├── layout.tsx         # Root layout with ThemeProvider
│   └── page.tsx           # Dashboard / Home
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # AppLayout, TopBar, ThemeProvider
│   ├── sidebar/           # Sidebar, WorkspaceSwitcher, PageTree
│   ├── command-palette/   # CommandPalette
│   ├── settings/          # SettingsModal
│   └── collaboration/     # FakeCursors
├── stores/                # Zustand stores
│   ├── useWorkspaceStore.ts
│   └── useThemeStore.ts
├── types/                 # TypeScript types
├── data/                  # Fake data / seed
├── lib/                   # Utilities
└── public/                # Static assets
```

## Phase 2 Roadmap

- [ ] Block-based rich text editor (TipTap)
- [ ] Slash command menu (`/`)
- [ ] Markdown shortcuts
- [ ] Drag-to-reorder blocks
- [ ] Full database views (Table, Board, List, Calendar, Gallery)
- [ ] Inline cell editing
- [ ] Filter bar with pills
- [ ] Multi-column sort
- [ ] Group by
- [ ] Comments system
- [ ] Page templates
- [ ] Drag-and-drop sidebar reordering
- [ ] Mobile responsive layout
- [ ] Virtual scrolling for large databases

## Design System

### Colors
- Background: `#ffffff` (light), `#0f0f0f` (dark)
- Surface: `#f7f7f7` (light), `#1a1a1a` (dark)
- Border: `#e5e5e5` (light), `#2a2a2a` (dark)
- Text Primary: `#171717` (light), `#f5f5f5` (dark)
- Text Secondary: `#737373` (light), `#a3a3a3` (dark)
- Accent: `#2563eb` (blue-600)

### Typography
- Font: Inter (Google Fonts)
- Page title: 40px, weight 700, tracking -0.02em
- Body: 16px, weight 400, line-height 1.6

### Spacing
- Border radius: 6px (buttons), 8px (cards), 12px (modals)
- Sidebar width: 240px
- Page padding: 96px left/right on desktop

## License

Internal use for Rebase agency demo purposes.
