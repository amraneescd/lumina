"use client"

import { useWorkspaceStore } from "@/stores/useWorkspaceStore"
import { Button } from "@/components/ui/button"
import { X, Keyboard, Command, Search, Settings, HelpCircle, Moon, Sun } from "lucide-react"

export function HelpModal() {
  const helpModalOpen = useWorkspaceStore((s) => s.helpModalOpen)
  const toggleHelpModal = useWorkspaceStore((s) => s.toggleHelpModal)

  if (!helpModalOpen) return null

  const shortcuts = [
    { keys: ["⌘", "K"], description: "Open Command Palette" },
    { keys: ["⌘", "/"], description: "Open Help" },
    { keys: ["⌘", "Shift", "L"], description: "Toggle Dark Mode" },
    { keys: ["Esc"], description: "Close modals / panels" },
    { keys: ["/"], description: "Open slash command menu" },
    { keys: ["↑", "↓"], description: "Navigate lists" },
    { keys: ["Enter"], description: "Select item" },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" role="dialog" aria-modal="true" aria-label="Keyboard shortcuts">
      <div className="w-full max-w-md rounded-xl border bg-popover shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Keyboard Shortcuts</h2>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleHelpModal}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4">
          <div className="space-y-2">
            {shortcuts.map((shortcut, idx) => (
              <div key={idx} className="flex items-center justify-between py-1.5">
                <span className="text-sm text-muted-foreground">{shortcut.description}</span>
                <div className="flex items-center gap-1">
                  {shortcut.keys.map((key, kidx) => (
                    <span key={kidx}>
                      <kbd className="inline-flex h-6 min-w-[24px] items-center justify-center rounded border bg-muted px-1.5 text-[11px] font-mono font-medium">
                        {key}
                      </kbd>
                      {kidx < shortcut.keys.length - 1 && <span className="mx-0.5 text-muted-foreground">+</span>}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
