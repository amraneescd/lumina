"use client"

import { useState } from "react"
import { useWorkspaceStore } from "@/stores/useWorkspaceStore"
import { useThemeStore } from "@/stores/useThemeStore"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  Palette,
  Layout,
  Bell,
  User,
  Users,
  X,
  Monitor,
  Sun,
  Moon,
  Check,
  Copy,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Mail,
  Smartphone,
  MessageSquare,
} from "lucide-react"

type SettingsTab = "appearance" | "notifications" | "account" | "workspace"

export function SettingsModal() {
  const toggleSettings = useWorkspaceStore((s) => s.toggleSettings)
  const [activeTab, setActiveTab] = useState<SettingsTab>("appearance")

  const tabs = [
    { id: "appearance" as SettingsTab, label: "Appearance", icon: <Palette className="h-4 w-4" /> },
    { id: "notifications" as SettingsTab, label: "Notifications", icon: <Bell className="h-4 w-4" /> },
    { id: "account" as SettingsTab, label: "Account", icon: <User className="h-4 w-4" /> },
    { id: "workspace" as SettingsTab, label: "Workspace", icon: <Users className="h-4 w-4" /> },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" role="dialog" aria-modal="true" aria-label="Settings">
      <div className="flex w-full max-w-2xl h-[600px] rounded-xl border bg-popover shadow-2xl overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 border-r bg-muted/50 p-3 space-y-1 shrink-0">
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
        <ScrollArea className="flex-1">
          <div className="p-6">
            {activeTab === "appearance" && <AppearanceSettings />}
            {activeTab === "notifications" && <NotificationSettings />}
            {activeTab === "account" && <AccountSettings />}
            {activeTab === "workspace" && <WorkspaceSettings />}
          </div>
        </ScrollArea>
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
  const sidebarDensity = useThemeStore((s) => s.sidebarDensity)
  const setSidebarDensity = useThemeStore((s) => s.setSidebarDensity)
  const accentColor = useThemeStore((s) => s.accentColor)
  const setAccentColor = useThemeStore((s) => s.setAccentColor)

  const themes = [
    { id: "light" as const, label: "Light", icon: <Sun className="h-4 w-4" /> },
    { id: "dark" as const, label: "Dark", icon: <Moon className="h-4 w-4" /> },
    { id: "system" as const, label: "System", icon: <Monitor className="h-4 w-4" /> },
  ]

  const accentColors = [
    { id: "blue" as const, label: "Blue", color: "#2563eb" },
    { id: "purple" as const, label: "Purple", color: "#8b5cf6" },
    { id: "teal" as const, label: "Teal", color: "#14b8a6" },
    { id: "rose" as const, label: "Rose", color: "#f43f5e" },
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
        <label className="text-sm font-medium">Accent Color</label>
        <div className="grid grid-cols-4 gap-3">
          {accentColors.map((c) => (
            <button
              key={c.id}
              onClick={() => setAccentColor(c.id)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-lg border p-4 transition-all hover:border-primary",
                accentColor === c.id && "border-primary bg-primary/5 ring-1 ring-primary"
              )}
            >
              <div className="h-6 w-6 rounded-full" style={{ backgroundColor: c.color }} />
              <span className="text-sm">{c.label}</span>
              {accentColor === c.id && <Check className="h-3 w-3 text-primary" />}
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

function NotificationSettings() {
  const [emailNotif, setEmailNotif] = useState(true)
  const [pushNotif, setPushNotif] = useState(true)
  const [mentionsNotif, setMentionsNotif] = useState(true)
  const [commentsNotif, setCommentsNotif] = useState(true)
  const [deadlinesNotif, setDeadlinesNotif] = useState(true)

  const toggleItems = [
    { label: "Email notifications", desc: "Receive updates via email", icon: <Mail className="h-4 w-4" />, value: emailNotif, setValue: setEmailNotif },
    { label: "Push notifications", desc: "Browser push notifications", icon: <Smartphone className="h-4 w-4" />, value: pushNotif, setValue: setPushNotif },
    { label: "Mentions", desc: "When someone mentions you", icon: <MessageSquare className="h-4 w-4" />, value: mentionsNotif, setValue: setMentionsNotif },
    { label: "Comments", desc: "New comments on your pages", icon: <MessageSquare className="h-4 w-4" />, value: commentsNotif, setValue: setCommentsNotif },
    { label: "Deadlines", desc: "Upcoming project deadlines", icon: <Bell className="h-4 w-4" />, value: deadlinesNotif, setValue: setDeadlinesNotif },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Notifications</h3>
        <p className="text-sm text-muted-foreground">Choose what you want to be notified about.</p>
      </div>

      <Separator />

      <div className="space-y-4">
        {toggleItems.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                {item.icon}
              </div>
              <div>
                <label className="text-sm font-medium">{item.label}</label>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
            <button
              onClick={() => item.setValue(!item.value)}
              className={cn(
                "relative h-6 w-11 rounded-full transition-colors",
                item.value ? "bg-primary" : "bg-muted"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
                  item.value ? "translate-x-5" : "translate-x-0.5"
                )}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function AccountSettings() {
  const [name, setName] = useState("You")
  const [email, setEmail] = useState("you@lumina.studio")
  const [copied, setCopied] = useState(false)

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Account</h3>
        <p className="text-sm text-muted-foreground">Manage your profile and preferences.</p>
      </div>

      <Separator />

      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-medium">
          YU
        </div>
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-sm text-muted-foreground">{email}</p>
          <p className="text-xs text-muted-foreground mt-1">Lumina Studio — Pro Plan</p>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">Display name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        />
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">Email</label>
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          />
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleCopyEmail}>
            {copied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-4 w-4" />
          <h4 className="text-sm font-medium">Danger Zone</h4>
        </div>
        <Button variant="destructive" size="sm" className="gap-1.5" disabled>
          <Trash2 className="h-3.5 w-3.5" />
          Delete Account
        </Button>
        <p className="text-xs text-muted-foreground">This action cannot be undone.</p>
      </div>
    </div>
  )
}

function WorkspaceSettings() {
  const currentWorkspace = useWorkspaceStore((s) => s.currentWorkspace)
  const teamMembers = useWorkspaceStore((s) => s.teamMembers)
  const [copied, setCopied] = useState(false)
  const inviteLink = `https://base.lumina.studio/invite/${currentWorkspace.id}`

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Workspace</h3>
        <p className="text-sm text-muted-foreground">Manage your workspace settings and members.</p>
      </div>

      <Separator />

      <div className="space-y-3">
        <label className="text-sm font-medium">Workspace name</label>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{currentWorkspace.icon}</span>
          <input
            type="text"
            defaultValue={currentWorkspace.name}
            className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">Invite link</label>
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 rounded-md border bg-muted px-3 py-2 text-sm text-muted-foreground">
            {inviteLink}
          </div>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleCopyInvite}>
            {copied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <label className="text-sm font-medium">Members ({teamMembers.length})</label>
        <div className="space-y-2">
          {teamMembers.map((member) => (
            <div key={member.id} className="flex items-center gap-3 rounded-lg border p-3">
              <div
                className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium"
                style={{ backgroundColor: member.color + "20", color: member.color }}
              >
                {member.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.email}</p>
              </div>
              <span className={cn(
                "text-[10px] font-medium px-2 py-0.5 rounded-full",
                member.id === "user-you" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              )}>
                {member.id === "user-you" ? "Owner" : "Member"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
