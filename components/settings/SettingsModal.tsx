"use client"

import { useWorkspaceStore } from "@/stores/useWorkspaceStore"
import { useThemeStore } from "@/stores/useThemeStore"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  Palette,
  Layout,
  Bell,
  User,
  X,
  Monitor,
  Sun,
  Moon,
  Check,
} from "lucide-react"
import { useState } from "react"

type SettingsTab = "appearance" | "layout" | "notifications" | "account"

export function SettingsModal() {
  const toggleSettings = useWorkspaceStore((s) => s.toggleSettings)
  const [activeTab, setActiveTab] = useState<SettingsTab>("appearance")

  const tabs = [
    { id: "appearance" as SettingsTab, label: "Appearance", icon: <Palette className="h-4 w-4" /> },
    { id: "layout" as SettingsTab, label: "Layout", icon: <Layout className="h-4 w-4" /> },
    { id: "notifications" as SettingsTab, label: "Notifications", icon: <Bell className="h-4 w-4" /> },
    { id: "account" as SettingsTab, label: "Account", icon: <User className="h-4 w-4" /> },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="flex w-full max-w-2xl h-[600px] rounded-xl border bg-popover shadow-2xl overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 border-r bg-muted/50 p-3 space-y-1">
          <div className="flex items-center justify-between px-2 mb-4">
            <h2 className="text-sm font-semibold">Settings</h2>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={toggleSettings}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                activeTab === tab.id
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/50 text-muted-foreground"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "appearance" && <AppearanceSettings />}
          {activeTab === "layout" && <LayoutSettings />}
          {activeTab === "notifications" && <NotificationSettings />}
          {activeTab === "account" && <AccountSettings />}
        </div>
      </div>
    </div>
  )
}

function AppearanceSettings() {
  const theme = useThemeStore((s) => s.theme)
  const setTheme = useThemeStore((s) => s.setTheme)
  const fontSize = useThemeStore((s) => s.fontSize)
  const setFontSize = useThemeStore((s) => s.setFontSize)
  const reducedMotion = useThemeStore((s) => s.reducedMotion)
  const setReducedMotion = useThemeStore((s) => s.setReducedMotion)

  const themes = [
    { id: "light" as const, label: "Light", icon: <Sun className="h-4 w-4" /> },
    { id: "dark" as const, label: "Dark", icon: <Moon className="h-4 w-4" /> },
    { id: "system" as const, label: "System", icon: <Monitor className="h-4 w-4" /> },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Appearance</h3>
        <p className="text-sm text-muted-foreground">Customize how Base looks and feels.</p>
      </div>

      <Separator />

      <div className="space-y-3">
        <label className="text-sm font-medium">Theme</label>
        <div className="grid grid-cols-3 gap-3">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-lg border p-4 transition-all hover:border-primary",
                theme === t.id && "border-primary bg-primary/5 ring-1 ring-primary"
              )}
            >
              {t.icon}
              <span className="text-sm">{t.label}</span>
              {theme === t.id && <Check className="h-3 w-3 text-primary" />}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">Font size</label>
        <div className="flex gap-2">
          {(["small", "medium", "large"] as const).map((size) => (
            <button
              key={size}
              onClick={() => setFontSize(size)}
              className={cn(
                "flex-1 rounded-md border px-3 py-2 text-sm capitalize transition-colors",
                fontSize === size
                  ? "border-primary bg-primary/5 text-primary"
                  : "hover:bg-accent"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium">Reduced motion</label>
          <p className="text-xs text-muted-foreground">Minimize animations throughout the app</p>
        </div>
        <button
          onClick={() => setReducedMotion(!reducedMotion)}
          className={cn(
            "relative h-6 w-11 rounded-full transition-colors",
            reducedMotion ? "bg-primary" : "bg-muted"
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
              reducedMotion ? "translate-x-5" : "translate-x-0.5"
            )}
          />
        </button>
      </div>
    </div>
  )
}

function LayoutSettings() {
  const sidebarDensity = useThemeStore((s) => s.sidebarDensity)
  const setSidebarDensity = useThemeStore((s) => s.setSidebarDensity)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Layout</h3>
        <p className="text-sm text-muted-foreground">Customize the workspace layout.</p>
      </div>

      <Separator />

      <div className="space-y-3">
        <label className="text-sm font-medium">Sidebar density</label>
        <div className="flex gap-2">
          {(["default", "compact"] as const).map((density) => (
            <button
              key={density}
              onClick={() => setSidebarDensity(density)}
              className={cn(
                "flex-1 rounded-md border px-3 py-2 text-sm capitalize transition-colors",
                sidebarDensity === density
                  ? "border-primary bg-primary/5 text-primary"
                  : "hover:bg-accent"
              )}
            >
              {density}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function NotificationSettings() {
  const notifications = useWorkspaceStore((s) => s.notifications)
  const markAllNotificationsRead = useWorkspaceStore((s) => s.markAllNotificationsRead)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-1">Notifications</h3>
          <p className="text-sm text-muted-foreground">Manage your notifications.</p>
        </div>
        <Button variant="outline" size="sm" onClick={markAllNotificationsRead}>
          Mark all read
        </Button>
      </div>

      <Separator />

      <div className="space-y-2">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={cn(
              "flex items-start gap-3 rounded-lg border p-3",
              !notif.read && "bg-primary/5 border-primary/20"
            )}
          >
            <div className={cn(
              "mt-0.5 h-2 w-2 rounded-full",
              !notif.read ? "bg-primary" : "bg-muted"
            )} />
            <div className="flex-1">
              <p className="text-sm font-medium">{notif.title}</p>
              <p className="text-xs text-muted-foreground">{notif.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AccountSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Account</h3>
        <p className="text-sm text-muted-foreground">Manage your profile and workspace.</p>
      </div>

      <Separator />

      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-medium">
          YU
        </div>
        <div>
          <p className="text-sm font-medium">You</p>
          <p className="text-sm text-muted-foreground">you@lumina.studio</p>
          <p className="text-xs text-muted-foreground mt-1">Lumina Studio — Pro Plan</p>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">Display name</label>
        <input
          type="text"
          defaultValue="You"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">Email</label>
        <input
          type="email"
          defaultValue="you@lumina.studio"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
    </div>
  )
}
