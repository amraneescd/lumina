"use client"

import { useEffect, useRef } from "react"
import { useWorkspaceStore } from "@/stores/useWorkspaceStore"
import { motion } from "framer-motion"

export function FakeCursors() {
  const fakeCursors = useWorkspaceStore((s) => s.fakeCursors)
  const updateCursorPosition = useWorkspaceStore((s) => s.updateCursorPosition)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      fakeCursors.forEach((cursor) => {
        const newX = Math.max(100, Math.min(window.innerWidth - 100, cursor.x + (Math.random() - 0.5) * 200))
        const newY = Math.max(100, Math.min(window.innerHeight - 100, cursor.y + (Math.random() - 0.5) * 200))
        updateCursorPosition(cursor.id, newX, newY)
      })
    }, 8000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [fakeCursors, updateCursorPosition])

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {fakeCursors.map((cursor) => (
        <motion.div
          key={cursor.id}
          className="absolute"
          animate={{ x: cursor.x, y: cursor.y }}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))" }}
          >
            <path
              d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 01.35-.15h6.87c.44 0 .66-.53.35-.85L6.35 2.85a.5.5 0 00-.85.36z"
              fill={cursor.color}
              stroke="white"
              strokeWidth="1"
            />
          </svg>
          <span
            className="absolute left-4 top-4 rounded-md px-1.5 py-0.5 text-[10px] font-medium text-white whitespace-nowrap"
            style={{ backgroundColor: cursor.color }}
          >
            {cursor.name}
          </span>
        </motion.div>
      ))}
    </div>
  )
}
