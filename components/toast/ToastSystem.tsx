"use client"

import { useWorkspaceStore } from "@/stores/useWorkspaceStore"
import { cn } from "@/lib/utils"
import { CheckCircle, XCircle, AlertCircle, X, Undo2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function ToastSystem() {
  const toasts = useWorkspaceStore((s) => s.toasts)
  const removeToast = useWorkspaceStore((s) => s.removeToast)

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg min-w-[300px] max-w-[400px]",
              toast.type === "success" && "bg-green-50 border-green-200 text-green-900 dark:bg-green-950 dark:border-green-800 dark:text-green-100",
              toast.type === "error" && "bg-red-50 border-red-200 text-red-900 dark:bg-red-950 dark:border-red-800 dark:text-red-100",
              toast.type === "info" && "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-100"
            )}
          >
            {toast.type === "success" && <CheckCircle className="h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />}
            {toast.type === "error" && <XCircle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />}
            {toast.type === "info" && <AlertCircle className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{toast.title}</p>
              {toast.message && <p className="text-xs opacity-80 mt-0.5">{toast.message}</p>}
            </div>
            {toast.undoAction && (
              <button
                onClick={() => { toast.undoAction?.(); removeToast(toast.id) }}
                className="flex items-center gap-1 text-xs font-medium hover:underline shrink-0"
              >
                <Undo2 className="h-3 w-3" />
                Undo
              </button>
            )}
            <button onClick={() => removeToast(toast.id)} className="shrink-0 opacity-60 hover:opacity-100">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
