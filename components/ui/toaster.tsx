"use client"

import { useState, useCallback } from "react"
import { create } from "zustand"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface Toast {
  id: string
  title: string
  message?: string
  type: "success" | "error" | "info"
}

interface ToastStore {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: Math.random().toString(36).substring(2, 9) }],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}))

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)
  const removeToast = useToastStore((s) => s.removeToast)

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={cn(
              "flex w-80 items-start gap-3 rounded-lg border p-4 shadow-lg",
              toast.type === "success" && "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950",
              toast.type === "error" && "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950",
              toast.type === "info" && "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950"
            )}
          >
            {toast.type === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
            {toast.type === "error" && <AlertCircle className="h-5 w-5 text-red-500" />}
            {toast.type === "info" && <Info className="h-5 w-5 text-blue-500" />}
            <div className="flex-1">
              <p className="text-sm font-medium">{toast.title}</p>
              {toast.message && <p className="text-xs text-muted-foreground mt-0.5">{toast.message}</p>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
