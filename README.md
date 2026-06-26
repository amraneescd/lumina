# Base — Project Management System

A premium Notion-inspired workspace built by [Rebase](https://rebase.studio).

![Base Dashboard](https://base.lumina.studio/og-image.png)

## Features

- **Block-based rich text editor** with slash commands and markdown shortcuts
- **Full database system** with Table, Board, List, Calendar, and Gallery views
- **Real-time collaboration UI** (simulated cursors, presence indicators)
- **Command palette** (Cmd/Ctrl+K) for instant navigation
- **Dark mode** with system preference detection
- **Comments system** with threads, replies, and resolution
- **Notifications panel** with unread badges
- **Fully responsive design** — works on desktop, tablet, and mobile

## Tech Stack

- **Next.js 14** — App Router, React Server Components
- **TypeScript** — Strict mode, zero `any` types
- **Tailwind CSS** — Utility-first styling
- **shadcn/ui** — Accessible component primitives
- **Zustand** — Lightweight state management with persistence
- **Framer Motion** — Smooth animations and transitions
- **@dnd-kit** — Accessible drag and drop
- **TipTap** — ProseMirror-based rich text editor
- **date-fns** — Date formatting and manipulation

## Getting Started

```bash
# Clone the repository
git clone https://github.com/amraneescd/lumina.git
cd lumina

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## Demo Mode

This project runs in **demo mode** — no authentication required. All data is stored in localStorage and resets on page refresh (unless persisted).

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Open Command Palette |
| `Cmd/Ctrl + /` | Show Keyboard Shortcuts |
| `Cmd/Ctrl + Shift + L` | Toggle Theme |
| `Esc` | Close modals/panels |
| `/` | Open slash command menu |
| `↑ / ↓` | Navigate lists |
| `Enter` | Select item |

## Deployment

Optimized for **Vercel**. Push to `main` branch for auto-deploy:

```bash
vercel --prod
```

## Project Structure

```
base/
├── app/                    # Next.js App Router
│   ├── [pageId]/          # Dynamic page viewer
│   ├── database/[dbId]/   # Database viewer
│   └── page.tsx           # Dashboard / Home
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # AppLayout, TopBar
│   ├── sidebar/           # Sidebar, WorkspaceSwitcher
│   ├── command-palette/     # CommandPalette
│   ├── settings/          # SettingsModal
│   ├── collaboration/     # FakeCursors
│   ├── editor/            # BlockEditor, PageShell
│   ├── database/          # DatabaseView
│   ├── toast/             # ToastSystem
│   ├── comments/          # CommentsPanel
│   ├── notifications/     # NotificationsPanel
│   ├── help/              # HelpModal
│   └── activity/          # ActivityFeed
├── stores/                # Zustand stores
├── types/                 # TypeScript types
├── data/                  # Fake data / seed
└── lib/                   # Utilities
```

## License

Internal use for Rebase agency demo purposes.

---

Built with ❤️ by [Rebase](https://rebase.studio)
