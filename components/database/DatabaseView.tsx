"use client"

import { useState, useMemo, useCallback, useRef, useEffect } from "react"
import { useWorkspaceStore } from "@/stores/useWorkspaceStore"
import { cn, formatDate, generateId } from "@/lib/utils"
import {
  Table,
  LayoutGrid,
  List,
  Calendar,
  GalleryThumbnails,
  Filter,
  Plus,
  Search,
  X,
  ChevronDown,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Trash2,
  GripVertical,
  MoreHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Database, DatabaseView, DatabaseItem, DatabaseColumn, ColumnType, SelectOption, Filter, Sort } from "@/types"

// ─── Inline Cell Editors ──────────────────────────────────────────

function TextCellEditor({ value, onSave, onCancel, autoFocus = false }: { value: string; onSave: (val: string) => void; onCancel: () => void; autoFocus?: boolean }) {
  const [text, setText] = useState(value || "")
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => { if (autoFocus && inputRef.current) { inputRef.current.focus(); inputRef.current.select() } }, [autoFocus])
  return (
    <input ref={inputRef} value={text} onChange={(e) => setText(e.target.value)} onBlur={() => onSave(text)}
      onKeyDown={(e) => { if (e.key === "Enter") onSave(text); if (e.key === "Escape") onCancel() }}
      className="w-full bg-transparent outline-none px-1 py-0.5 text-sm" />
  )
}

function SelectCellEditor({ value, options, onSave, onCancel }: { value: string | null; options?: SelectOption[]; onSave: (val: string | null) => void; onCancel: () => void }) {
  const [open, setOpen] = useState(true)
  const [query, setQuery] = useState("")
  const filtered = options?.filter((o) => o.name.toLowerCase().includes(query.toLowerCase())) || []
  if (!open) {
    const selected = options?.find((o) => o.id === value)
    return (
      <button onClick={() => setOpen(true)} className="rounded-md px-2 py-0.5 text-xs font-medium" style={{ backgroundColor: selected ? selected.color + "20" : "#e5e5e5", color: selected ? selected.color : "#737373" }}>
        {selected?.name || "Select..."}
      </button>
    )
  }
  return (
    <div className="absolute z-50 w-48 rounded-lg border bg-popover shadow-xl p-1">
      <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." className="w-full px-2 py-1 text-sm outline-none bg-transparent" onKeyDown={(e) => { if (e.key === "Escape") onCancel() }} />
      <div className="max-h-32 overflow-y-auto">
        {filtered.map((opt) => (
          <button key={opt.id} onClick={() => { onSave(opt.id); setOpen(false) }} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: opt.color }} />{opt.name}
          </button>
        ))}
      </div>
      <button onClick={() => { onSave(null); setOpen(false) }} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent"><X className="h-3 w-3" /> Clear</button>
    </div>
  )
}

function MultiSelectCellEditor({ value, options, onSave, onCancel }: { value: string[]; options?: SelectOption[]; onSave: (val: string[]) => void; onCancel: () => void }) {
  const [selected, setSelected] = useState<string[]>(value || [])
  const [open, setOpen] = useState(false)
  const toggleOption = (id: string) => { const newSelected = selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]; setSelected(newSelected); onSave(newSelected) }
  if (!open) {
    return (
      <div className="flex flex-wrap gap-1" onClick={() => setOpen(true)}>
        {selected.length === 0 && <span className="text-xs text-muted-foreground">Select...</span>}
        {selected.map((id) => { const opt = options?.find((o) => o.id === id); return (
          <span key={id} className="rounded-md px-1.5 py-0.5 text-[10px] font-medium" style={{ backgroundColor: opt ? opt.color + "20" : "#e5e5e5", color: opt ? opt.color : "#737373" }}>{opt?.name}</span>
        )})}
      </div>
    )
  }
  return (
    <div className="absolute z-50 w-48 rounded-lg border bg-popover shadow-xl p-1">
      {options?.map((opt) => (
        <button key={opt.id} onClick={() => toggleOption(opt.id)} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent">
          <span className={cn("h-4 w-4 rounded border-2 flex items-center justify-center", selected.includes(opt.id) ? "border-primary bg-primary" : "border-muted")}>{selected.includes(opt.id) && <span className="h-2 w-2 bg-white rounded-sm" />}</span>
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: opt.color }} />{opt.name}
        </button>
      ))}
    </div>
  )
}

function DateCellEditor({ value, onSave, onCancel }: { value: string | null; onSave: (val: string | null) => void; onCancel: () => void }) {
  const [date, setDate] = useState(value ? value.split("T")[0] : "")
  return (
    <div className="absolute z-50 rounded-lg border bg-popover shadow-xl p-2">
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full text-sm outline-none" autoFocus
        onKeyDown={(e) => { if (e.key === "Enter") onSave(date ? new Date(date).toISOString() : null); if (e.key === "Escape") onCancel() }} />
      <div className="flex gap-1 mt-2">
        <Button size="sm" className="h-7 text-xs" onClick={() => onSave(date ? new Date(date).toISOString() : null)}>Save</Button>
        <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  )
}

function PersonCellEditor({ value, teamMembers, onSave, onCancel }: { value: string | null; teamMembers: any[]; onSave: (val: string | null) => void; onCancel: () => void }) {
  const [open, setOpen] = useState(true)
  if (!open) {
    const person = teamMembers.find((m) => m.id === value)
    return (
      <button onClick={() => setOpen(true)} className="flex items-center gap-1.5">
        {person ? (
          <><div className="h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-medium" style={{ backgroundColor: person.color + "20", color: person.color }}>{person.initials}</div><span className="text-sm">{person.name}</span></>
        ) : (<span className="text-sm text-muted-foreground">Unassigned</span>)}
      </button>
    )
  }
  return (
    <div className="absolute z-50 w-56 rounded-lg border bg-popover shadow-xl p-1">
      {teamMembers.map((member) => (
        <button key={member.id} onClick={() => { onSave(member.id); setOpen(false) }} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent">
          <div className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-medium" style={{ backgroundColor: member.color + "20", color: member.color }}>{member.initials}</div>
          <div className="flex-1 text-left"><div className="text-sm">{member.name}</div><div className="text-xs text-muted-foreground">{member.role}</div></div>
        </button>
      ))}
      <button onClick={() => { onSave(null); setOpen(false) }} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent"><X className="h-3 w-3" /> Unassign</button>
    </div>
  )
}

function CheckboxCellEditor({ value, onSave }: { value: boolean; onSave: (val: boolean) => void }) {
  return <input type="checkbox" checked={value || false} onChange={(e) => onSave(e.target.checked)} className="h-4 w-4 rounded border-2 accent-primary cursor-pointer" />
}

function NumberCellEditor({ value, onSave, onCancel }: { value: number | null; onSave: (val: number | null) => void; onCancel: () => void }) {
  const [num, setNum] = useState(value?.toString() || "")
  return (
    <input type="number" value={num} onChange={(e) => setNum(e.target.value)} onBlur={() => onSave(num ? parseFloat(num) : null)}
      onKeyDown={(e) => { if (e.key === "Enter") onSave(num ? parseFloat(num) : null); if (e.key === "Escape") onCancel() }}
      className="w-full bg-transparent outline-none px-1 py-0.5 text-sm" autoFocus />
  )
}

function ProgressCellEditor({ value, onSave, onCancel }: { value: number | null; onSave: (val: number | null) => void; onCancel: () => void }) {
  const [open, setOpen] = useState(true)
  const progress = value || 0
  if (!open) {
    return (
      <div className="w-full" onClick={() => setOpen(true)}>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} /></div>
        <span className="text-xs text-muted-foreground">{progress}%</span>
      </div>
    )
  }
  const presets = [0, 25, 50, 75, 100]
  return (
    <div className="absolute z-50 w-40 rounded-lg border bg-popover shadow-xl p-2">
      <div className="space-y-1">
        {presets.map((p) => (
          <button key={p} onClick={() => { onSave(p); setOpen(false) }} className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-accent">
            <div className="h-2 w-16 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-primary" style={{ width: `${p}%` }} /></div>
            <span className="text-xs">{p}%</span>
          </button>
        ))}
      </div>
      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center col-span-full">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
            <GalleryThumbnails className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">No items found</p>
          <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters or add a new item.</p>
        </div>
      )}
    </div>
  )
}

// ─── Cell Renderer ────────────────────────────────────────────────

function CellRenderer({ column, value, teamMembers, databases, isEditing, onStartEdit, onSave, onCancel }: any) {
  if (isEditing) {
    switch (column.type) {
      case "title": return <TextCellEditor value={value as string} onSave={onSave} onCancel={onCancel} autoFocus />
      case "select": case "status": return <SelectCellEditor value={value as string | null} options={column.options} onSave={onSave} onCancel={onCancel} />
      case "multi_select": return <MultiSelectCellEditor value={value as string[]} options={column.options} onSave={onSave} onCancel={onCancel} />
      case "date": return <DateCellEditor value={value as string | null} onSave={onSave} onCancel={onCancel} />
      case "person": return <PersonCellEditor value={value as string | null} teamMembers={teamMembers} onSave={onSave} onCancel={onCancel} />
      case "checkbox": return <CheckboxCellEditor value={value as boolean} onSave={onSave} />
      case "number": return <NumberCellEditor value={value as number | null} onSave={onSave} onCancel={onCancel} />
      case "progress": return <ProgressCellEditor value={value as number | null} onSave={onSave} onCancel={onCancel} />
      case "relation": return <SelectCellEditor value={value as string | null} options={databases[0]?.items.map((i: any) => ({ id: i.id, name: i.values["col-title"] as string, color: "#3b82f6" }))} onSave={onSave} onCancel={onCancel} />
      default: return <span className="text-sm">{String(value || "")}</span>
    }
  }

  switch (column.type) {
    case "title": return <span className="text-sm font-medium">{String(value || "Untitled")}</span>
    case "select": case "status": {
      const opt = column.options?.find((o: any) => o.id === value)
      return opt ? (
        <span className="rounded-md px-2 py-0.5 text-xs font-medium" style={{ backgroundColor: opt.color + "20", color: opt.color }}>{opt.name}</span>
      ) : <span className="text-xs text-muted-foreground">—</span>
    }
    case "multi_select": {
      const ids = value as string[] || []
      if (ids.length === 0) return <span className="text-xs text-muted-foreground">—</span>
      return (
        <div className="flex flex-wrap gap-1">
          {ids.map((id: string) => { const opt = column.options?.find((o: any) => o.id === id); return (
            <span key={id} className="rounded-md px-1.5 py-0.5 text-[10px] font-medium" style={{ backgroundColor: opt ? opt.color + "20" : "#e5e5e5", color: opt ? opt.color : "#737373" }}>{opt?.name}</span>
          )})}
        </div>
      )
    }
    case "date": return value ? <span className="text-sm text-muted-foreground">{formatDate(value as string, "short")}</span> : <span className="text-xs text-muted-foreground">—</span>
    case "person": {
      const person = teamMembers.find((m: any) => m.id === value)
      return person ? (
        <div className="flex items-center gap-1.5">
          <div className="h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-medium" style={{ backgroundColor: person.color + "20", color: person.color }}>{person.initials}</div>
          <span className="text-sm">{person.name}</span>
        </div>
      ) : <span className="text-xs text-muted-foreground">Unassigned</span>
    }
    case "checkbox": return <input type="checkbox" checked={value as boolean} readOnly className="h-4 w-4 rounded border-2 accent-primary" />
    case "number": return <span className="text-sm">{value !== null && value !== undefined ? `$${Number(value).toLocaleString()}` : "—"}</span>
    case "progress": {
      const progress = value as number || 0
      return (
        <div className="w-full">
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} /></div>
          <span className="text-xs text-muted-foreground">{progress}%</span>
        </div>
      )
    }
    case "relation": {
      const relatedDb = databases.find((d: any) => d.items.some((i: any) => i.id === value))
      const relatedItem = relatedDb?.items.find((i: any) => i.id === value)
      return relatedItem ? (
        <span className="rounded-md px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">{relatedItem.values["col-title"] as string}</span>
      ) : <span className="text-xs text-muted-foreground">—</span>
    }
    default: return <span className="text-sm">{String(value || "")}</span>
  }
}

// ─── Table View ───────────────────────────────────────────────────

function TableView({ database, view, items, teamMembers, onUpdateItem, onDeleteItem, onAddItem }: any) {
  const [editingCell, setEditingCell] = useState<{ itemId: string; columnId: string } | null>(null)
  const visibleColumns = database.columns.filter((c: any) => view.visibleColumns.includes(c.id))

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="w-8 px-2 py-2"></th>
            {visibleColumns.map((col: any) => (
              <th key={col.id} className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">{col.name}</th>
            ))}
            <th className="w-8 px-2 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item: any) => (
            <tr key={item.id} className="border-b hover:bg-muted/50 transition-colors group">
              <td className="px-2 py-2"><div className="opacity-0 group-hover:opacity-100 transition-opacity"><GripVertical className="h-3.5 w-3.5 text-muted-foreground" /></div></td>
              {visibleColumns.map((col: any) => {
                const isEditing = editingCell?.itemId === item.id && editingCell?.columnId === col.id
                return (
                  <td key={col.id} className={cn("px-3 py-2 relative", isEditing && "ring-1 ring-primary rounded-sm")} onClick={() => setEditingCell({ itemId: item.id, columnId: col.id })}>
                    <CellRenderer column={col} value={item.values[col.id]} teamMembers={teamMembers} databases={[database]} isEditing={isEditing} onStartEdit={() => setEditingCell({ itemId: item.id, columnId: col.id })} onSave={(val: any) => { onUpdateItem(item.id, col.id, val); setEditingCell(null) }} onCancel={() => setEditingCell(null)} />
                  </td>
                )
              })}
              <td className="px-2 py-2">
                <button onClick={() => onDeleteItem(item.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={onAddItem} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:bg-muted/50 transition-colors"><Plus className="h-4 w-4" />New</button>
    </div>
  )
}

// ─── Board View ───────────────────────────────────────────────────

function BoardView({ database, view, items, teamMembers, onUpdateItem, onDeleteItem, onAddItem }: any) {
  const groupColumn = database.columns.find((c: any) => c.id === view.groupBy)
  const groupOptions = groupColumn?.options || []

  const groupedItems = useMemo(() => {
    const groups: Record<string, any[]> = {}
    groupOptions.forEach((opt: any) => { groups[opt.id] = [] })
    groups["__none"] = []
    items.forEach((item: any) => {
      const val = item.values[view.groupBy || ""]
      const groupId = val as string || "__none"
      if (!groups[groupId]) groups[groupId] = []
      groups[groupId].push(item)
    })
    return groups
  }, [items, view.groupBy, groupOptions])

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    e.dataTransfer.setData("text/plain", itemId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDrop = (e: React.DragEvent, groupId: string) => {
    e.preventDefault()
    const itemId = e.dataTransfer.getData("text/plain")
    if (itemId && view.groupBy) { onUpdateItem(itemId, view.groupBy, groupId === "__none" ? null : groupId) }
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {[...groupOptions, { id: "__none", name: "None", color: "#9ca3af" }].map((opt: any) => {
        const groupItems = groupedItems[opt.id] || []
        return (
          <div key={opt.id} className="w-72 shrink-0" onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, opt.id)}>
            <div className="flex items-center gap-2 mb-3 px-1">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: opt.color }} />
              <span className="text-sm font-medium">{opt.name}</span>
              <span className="text-xs text-muted-foreground">{groupItems.length}</span>
            </div>
            <div className="space-y-2">
              {groupItems.map((item: any) => {
                const title = item.values["col-title"] as string
                const dueDate = item.values["col-due"] as string
                const leadId = item.values["col-lead"] || item.values["col-assignee"] as string
                const lead = teamMembers.find((m: any) => m.id === leadId)
                const progress = item.values["col-progress"] as number
                return (
                  <div key={item.id} draggable onDragStart={(e) => handleDragStart(e, item.id)} className="rounded-lg border bg-card p-3 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing">
                    <p className="text-sm font-medium mb-2">{title}</p>
                    {progress !== undefined && <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden mb-2"><div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} /></div>}
                    <div className="flex items-center justify-between">
                      {dueDate && <span className="text-xs text-muted-foreground">{formatDate(dueDate, "short")}</span>}
                      {lead && <div className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-medium" style={{ backgroundColor: lead.color + "20", color: lead.color }}>{lead.initials}</div>}
                    </div>
                  </div>
                )
              })}
              <button onClick={() => onAddItem(opt.id === "__none" ? undefined : opt.id)} className="flex w-full items-center gap-2 rounded-lg border border-dashed p-2 text-sm text-muted-foreground hover:bg-accent/50 transition-colors"><Plus className="h-3.5 w-3.5" />New</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── List View ────────────────────────────────────────────────────

function ListView({ database, view, items, teamMembers, onUpdateItem, onDeleteItem, onAddItem }: any) {
  const groupColumn = database.columns.find((c: any) => c.id === view.groupBy)
  const groupOptions = groupColumn?.options || []

  const groupedItems = useMemo(() => {
    if (!view.groupBy) return { all: items }
    const groups: Record<string, any[]> = {}
    groupOptions.forEach((opt: any) => { groups[opt.id] = [] })
    groups["__none"] = []
    items.forEach((item: any) => {
      const val = item.values[view.groupBy || ""]
      const groupId = val as string || "__none"
      if (!groups[groupId]) groups[groupId] = []
      groups[groupId].push(item)
    })
    return groups
  }, [items, view.groupBy, groupOptions])

  const groupsToRender = view.groupBy ? groupedItems : { all: items }

  return (
    <div className="space-y-6">
      {Object.entries(groupsToRender).map(([groupId, groupItems]: [string, any]) => {
        const groupOpt = groupOptions.find((o: any) => o.id === groupId)
        const groupName = groupOpt?.name || (groupId === "__none" ? "None" : "All")
        const groupColor = groupOpt?.color || "#9ca3af"
        return (
          <div key={groupId}>
            {view.groupBy && (
              <div className="flex items-center gap-2 mb-3">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: groupColor }} />
                <h3 className="text-sm font-semibold">{groupName}</h3>
                <span className="text-xs text-muted-foreground">{groupItems.length}</span>
              </div>
            )}
            <div className="space-y-1">
              {groupItems.map((item: any) => {
                const title = item.values["col-title"] as string
                const statusId = item.values["col-status"] as string
                const statusOpt = database.columns.find((c: any) => c.id === "col-status")?.options?.find((o: any) => o.id === statusId)
                const dueDate = item.values["col-due"] as string
                const leadId = item.values["col-lead"] || item.values["col-assignee"] as string
                const lead = teamMembers.find((m: any) => m.id === leadId)
                return (
                  <div key={item.id} className="flex items-center gap-3 rounded-md border p-3 hover:bg-muted/50 transition-colors group">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {statusOpt && <span className="rounded-md px-1.5 py-0.5 text-[10px] font-medium" style={{ backgroundColor: statusOpt.color + "20", color: statusOpt.color }}>{statusOpt.name}</span>}
                        {dueDate && <span className="text-xs text-muted-foreground">{formatDate(dueDate, "short")}</span>}
                      </div>
                    </div>
                    {lead && <div className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-medium" style={{ backgroundColor: lead.color + "20", color: lead.color }}>{lead.initials}</div>}
                    <button onClick={() => onDeleteItem(item.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
      <button onClick={() => onAddItem()} className="flex w-full items-center gap-2 rounded-md border border-dashed p-3 text-sm text-muted-foreground hover:bg-accent/50 transition-colors"><Plus className="h-4 w-4" />New item</button>
    </div>
  )
}

// ─── Calendar View ────────────────────────────────────────────────

function CalendarView({ database, view, items, teamMembers, onUpdateItem, onDeleteItem, onAddItem }: any) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startDayOfWeek = firstDay.getDay()
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const prevDays = Array.from({ length: startDayOfWeek }, (_, i) => i)

  const itemsByDate = useMemo(() => {
    const map: Record<string, any[]> = {}
    items.forEach((item: any) => {
      const dueDate = item.values["col-due"] as string
      if (dueDate) { const date = new Date(dueDate).getDate(); if (!map[date]) map[date] = []; map[date].push(item) }
    })
    return map
  }, [items])

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{monthNames[month]} {year}</h2>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>Prev</Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>Today</Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>Next</Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">{day}</div>
        ))}
        {prevDays.map((i) => <div key={`prev-${i}`} className="min-h-[100px] p-1" />)}
        {days.map((day) => {
          const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year
          const dayItems = itemsByDate[day] || []
          return (
            <div key={day} className={cn("min-h-[100px] rounded-md border p-1 transition-colors hover:bg-muted/30", isToday && "ring-1 ring-primary bg-primary/5")} onClick={() => { const dateStr = new Date(year, month, day).toISOString(); onAddItem(dateStr) }}>
              <div className={cn("text-xs font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full", isToday && "bg-primary text-primary-foreground")}>{day}</div>
              <div className="space-y-1">
                {dayItems.map((item: any) => {
                  const title = item.values["col-title"] as string
                  const statusId = item.values["col-status"] as string
                  const statusOpt = database.columns.find((c: any) => c.id === "col-status")?.options?.find((o: any) => o.id === statusId)
                  return (
                    <div key={item.id} className="rounded px-1.5 py-0.5 text-[10px] truncate cursor-pointer hover:opacity-80" style={{ backgroundColor: statusOpt ? statusOpt.color + "20" : "#e5e5e5", color: statusOpt ? statusOpt.color : "#737373" }}>{title}</div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">No items found</p>
          <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters or add a new item.</p>
        </div>
      )}
    </div>
  )
}

// ─── Gallery View ─────────────────────────────────────────────────

function GalleryView({ database, view, items, teamMembers, onUpdateItem, onDeleteItem, onAddItem }: any) {
  const gradients = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item: any, idx: number) => {
        const title = item.values["col-title"] as string
        const statusId = item.values["col-status"] as string
        const statusOpt = database.columns.find((c: any) => c.id === "col-status")?.options?.find((o: any) => o.id === statusId)
        const clientId = item.values["col-client"] as string
        const clientOpt = database.columns.find((c: any) => c.id === "col-client")?.options?.find((o: any) => o.id === clientId)
        const dueDate = item.values["col-due"] as string
        const leadId = item.values["col-lead"] || item.values["col-assignee"] as string
        const lead = teamMembers.find((m: any) => m.id === leadId)
        const progress = item.values["col-progress"] as number
        return (
          <div key={item.id} className="rounded-lg border bg-card overflow-hidden hover:shadow-md transition-shadow group relative">
            <div className="h-24" style={{ background: gradients[idx % gradients.length] }} />
            <div className="p-3">
              {statusOpt && <span className="inline-block rounded-md px-1.5 py-0.5 text-[10px] font-medium mb-2" style={{ backgroundColor: statusOpt.color + "20", color: statusOpt.color }}>{statusOpt.name}</span>}
              <h3 className="text-sm font-medium mb-2">{title}</h3>
              <div className="space-y-1.5">
                {clientOpt && <div className="flex items-center gap-1.5"><span className="text-xs text-muted-foreground">Client:</span><span className="text-xs font-medium" style={{ color: clientOpt.color }}>{clientOpt.name}</span></div>}
                {dueDate && <div className="flex items-center gap-1.5"><span className="text-xs text-muted-foreground">Due:</span><span className="text-xs">{formatDate(dueDate, "short")}</span></div>}
                {progress !== undefined && <div className="flex items-center gap-1.5"><span className="text-xs text-muted-foreground">Progress:</span><div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} /></div><span className="text-xs">{progress}%</span></div>}
                {lead && <div className="flex items-center gap-1.5"><span className="text-xs text-muted-foreground">Lead:</span><div className="h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-medium" style={{ backgroundColor: lead.color + "20", color: lead.color }}>{lead.initials}</div><span className="text-xs">{lead.name}</span></div>}
              </div>
            </div>
            <button onClick={() => onDeleteItem(item.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white rounded-full p-1"><Trash2 className="h-3 w-3" /></button>
          </div>
        )
      })}
      <button onClick={onAddItem} className="flex flex-col items-center justify-center rounded-lg border border-dashed p-6 text-sm text-muted-foreground hover:bg-accent/50 transition-colors min-h-[200px]"><Plus className="h-8 w-8 mb-2" />New item</button>
    </div>
  )
}

// ─── Filter Bar ───────────────────────────────────────────────────

function FilterBar({ database, filters, onAddFilter, onRemoveFilter }: any) {
  const [showAdd, setShowAdd] = useState(false)
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {filters.map((filter: any) => {
        const col = database.columns.find((c: any) => c.id === filter.columnId)
        let valueText = String(filter.value || "")
        if (col?.type === "select" || col?.type === "status") { const opt = col.options?.find((o: any) => o.id === filter.value); valueText = opt?.name || String(filter.value) }
        return (
          <div key={filter.id} className="flex items-center gap-1 rounded-md border bg-accent/30 px-2 py-1 text-xs">
            <span className="font-medium">{col?.name}</span>
            <span className="text-muted-foreground">{filter.operator.replace(/_/g, " ")}</span>
            <span>{valueText}</span>
            <button onClick={() => onRemoveFilter(filter.id)} className="ml-1 text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /></button>
          </div>
        )
      })}
      {showAdd ? (
        <div className="flex items-center gap-1">
          <select className="text-xs rounded-md border bg-background px-2 py-1 outline-none" autoFocus
            onChange={(e) => { const colId = e.target.value; if (!colId) return; const col = database.columns.find((c: any) => c.id === colId); onAddFilter({ id: generateId(), columnId: colId, operator: "is", value: col?.type === "select" || col?.type === "status" ? col.options?.[0]?.id : "" }); setShowAdd(false) }}>
            <option value="">Select column...</option>
            {database.columns.filter((c: any) => c.type !== "title").map((col: any) => <option key={col.id} value={col.id}>{col.name}</option>)}
          </select>
          <button onClick={() => setShowAdd(false)}><X className="h-3 w-3 text-muted-foreground" /></button>
        </div>
      ) : (
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-1 rounded-md border px-2 py-1 text-xs text-muted-foreground hover:bg-accent/50 transition-colors"><Filter className="h-3 w-3" />Filter</button>
      )}
    </div>
  )
}

// ─── Main Database View Component ─────────────────────────────────

export function DatabaseView({ databaseId }: { databaseId: string }) {
  const databases = useWorkspaceStore((s) => s.databases)
  const teamMembers = useWorkspaceStore((s) => s.teamMembers)
  const activeViewId = useWorkspaceStore((s) => s.activeViewId)
  const setActiveView = useWorkspaceStore((s) => s.setActiveView)
  const updateDatabaseItem = useWorkspaceStore((s) => s.updateDatabaseItem)
  const deleteDatabaseItem = useWorkspaceStore((s) => s.deleteDatabaseItem)
  const addDatabaseItem = useWorkspaceStore((s) => s.addDatabaseItem)
  const addToast = useWorkspaceStore((s) => s.addToast)
  const [searchQuery, setSearchQuery] = useState("")
  const [localFilters, setLocalFilters] = useState<Filter[]>([])
  const [localSorts, setLocalSorts] = useState<Sort[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [databaseId])

  const database = databases.find((d) => d.id === databaseId)
  const currentViewId = activeViewId[databaseId] || database?.views[0]?.id
  const currentView = database?.views.find((v) => v.id === currentViewId)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-24 shimmer rounded-md" />
          <div className="h-8 w-24 shimmer rounded-md" />
          <div className="h-8 w-24 shimmer rounded-md" />
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-9 w-64 shimmer rounded-md" />
          <div className="h-9 w-24 shimmer rounded-md" />
          <div className="h-9 w-20 shimmer rounded-md" />
        </div>
        <div className="space-y-2">
          <div className="h-10 w-full shimmer rounded-md" />
          <div className="h-10 w-full shimmer rounded-md" />
          <div className="h-10 w-full shimmer rounded-md" />
          <div className="h-10 w-full shimmer rounded-md" />
          <div className="h-10 w-full shimmer rounded-md" />
        </div>
      </div>
    )
  }

  if (!database || !currentView) return <div className="text-muted-foreground">Database not found</div>

  const allFilters = [...(currentView.filters || []), ...localFilters]
  const allSorts = [...(currentView.sorts || []), ...localSorts]

  const filteredItems = useMemo(() => {
    let items = [...database.items]
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      items = items.filter((item) => { const title = String(item.values["col-title"] || "").toLowerCase(); return title.includes(q) })
    }
    allFilters.forEach((filter) => {
      const col = database.columns.find((c) => c.id === filter.columnId)
      if (!col) return
      items = items.filter((item) => {
        const val = item.values[filter.columnId]
        switch (filter.operator) {
          case "is": return val === filter.value
          case "is_not": return val !== filter.value
          case "contains": return String(val).toLowerCase().includes(String(filter.value).toLowerCase())
          case "does_not_contain": return !String(val).toLowerCase().includes(String(filter.value).toLowerCase())
          case "is_empty": return val === null || val === undefined || val === ""
          case "is_not_empty": return val !== null && val !== undefined && val !== ""
          case "greater_than": return Number(val) > Number(filter.value)
          case "less_than": return Number(val) < Number(filter.value)
          default: return true
        }
      })
    })
    allSorts.forEach((sort) => {
      const col = database.columns.find((c) => c.id === sort.columnId)
      if (!col) return
      items.sort((a, b) => {
        const aVal = a.values[sort.columnId]
        const bVal = b.values[sort.columnId]
        if (aVal === null || aVal === undefined) return sort.direction === "asc" ? 1 : -1
        if (bVal === null || bVal === undefined) return sort.direction === "asc" ? -1 : 1
        if (col.type === "number" || col.type === "progress") return sort.direction === "asc" ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal)
        if (col.type === "date") return sort.direction === "asc" ? new Date(aVal as string).getTime() - new Date(bVal as string).getTime() : new Date(bVal as string).getTime() - new Date(aVal as string).getTime()
        return sort.direction === "asc" ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal))
      })
    })
    return items
  }, [database.items, searchQuery, allFilters, allSorts])

  const handleUpdateItem = useCallback((itemId: string, columnId: string, value: unknown) => {
    updateDatabaseItem(databaseId, itemId, columnId, value)
    addToast({ type: "success", title: "Value updated" })
  }, [databaseId, updateDatabaseItem, addToast])

  const handleDeleteItem = useCallback((itemId: string) => {
    deleteDatabaseItem(databaseId, itemId)
    addToast({ type: "info", title: "Item deleted", message: "The item has been removed from the database.", undoAction: () => {
      // In a real app, we'd restore the item here
      addToast({ type: "success", title: "Undo not implemented in demo" })
    }})
  }, [databaseId, deleteDatabaseItem, addToast])

  const handleAddItem = useCallback((groupValue?: string) => {
    const newItem = {
      id: generateId(),
      databaseId,
      values: {
        "col-title": "New item",
        ...(groupValue ? { [database.columns.find((c) => c.type === "status")?.id || "col-status"]: groupValue } : {}),
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    addDatabaseItem(databaseId, newItem)
    addToast({ type: "success", title: "New item added" })
  }, [databaseId, database, addDatabaseItem, addToast])
  const handleAddFilter = useCallback((filter: Filter) => { setLocalFilters((prev) => [...prev, filter]) }, [])
  const handleRemoveFilter = useCallback((filterId: string) => { setLocalFilters((prev) => prev.filter((f) => f.id !== filterId)) }, [])

  const viewIcons: Record<string, React.ReactNode> = {
    table: <Table className="h-4 w-4" />,
    board: <LayoutGrid className="h-4 w-4" />,
    list: <List className="h-4 w-4" />,
    calendar: <Calendar className="h-4 w-4" />,
    gallery: <GalleryThumbnails className="h-4 w-4" />,
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1 overflow-x-auto">
          {database.views.map((view) => (
            <button key={view.id} onClick={() => setActiveView(database.id, view.id)} className={cn("flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors whitespace-nowrap", currentViewId === view.id ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent/50 text-muted-foreground")}>
              {viewIcons[view.type]}{view.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-md border bg-background pl-9 pr-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <FilterBar database={database} filters={allFilters} onAddFilter={handleAddFilter} onRemoveFilter={handleRemoveFilter} />
          <Button size="sm" className="gap-1.5" onClick={() => handleAddItem()} title="Add new item"><Plus className="h-3.5 w-3.5" />New</Button>
        </div>
      </div>
      <div className="mt-4">
        {currentView.type === "table" && <div className="overflow-x-auto -mx-2 px-2"><TableView database={database} view={currentView} items={filteredItems} teamMembers={teamMembers} onUpdateItem={handleUpdateItem} onDeleteItem={handleDeleteItem} onAddItem={handleAddItem} />}
        {currentView.type === "board" && <BoardView database={database} view={currentView} items={filteredItems} teamMembers={teamMembers} onUpdateItem={handleUpdateItem} onDeleteItem={handleDeleteItem} onAddItem={handleAddItem} />}
        {currentView.type === "list" && <ListView database={database} view={currentView} items={filteredItems} teamMembers={teamMembers} onUpdateItem={handleUpdateItem} onDeleteItem={handleDeleteItem} onAddItem={handleAddItem} />}
        {currentView.type === "calendar" && <CalendarView database={database} view={currentView} items={filteredItems} teamMembers={teamMembers} onUpdateItem={handleUpdateItem} onDeleteItem={handleDeleteItem} onAddItem={handleAddItem} />}
        {currentView.type === "gallery" && <GalleryView database={database} view={currentView} items={filteredItems} teamMembers={teamMembers} onUpdateItem={handleUpdateItem} onDeleteItem={handleDeleteItem} onAddItem={handleAddItem} />}
      </div>
    </div>
  )
}
