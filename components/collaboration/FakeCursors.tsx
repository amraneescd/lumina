"use client"

import { useEffect, useState } from "react"
import { useWorkspaceStore } from "@/stores/useWorkspaceStore"
import { motion } from "framer-motion"

export function FakeCursors() {
  const fakeCursors = useWorkspaceStore((s) => s.fakeCursors)
  const updateCursorPosition = useWorkspaceStore((s) => s.updateCursorPosition)

  useEffect(() => {
    const interval = setInterval(() => {
      fakeCursors.forEach((cursor) => {
        const newX = Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1
        const newY = Math.random() * window.innerHeight * 0.7 + window.innerHeight * 0.15
        updateCursorPosition(cursor.id, newX, newY)
      })
    }, 10000 + Math.random() * 5000)

    return () => clearInterval(interval)
  }, [fakeCursors, updateCursorPosition])

  return (
    <>
      {fakeCursors.map((cursor) => (
        <motion.div
          key={cursor.id}
          initial={{ opacity: 0 }}
          animate={{ x: cursor.x, y: cursor.y, opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="pointer-events-none fixed z-50"
          style={{ left: 0, top: 0 }}
        >
          {/* Cursor SVG */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))" }}
          >
            <path
              d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.44 0 .66-.53.35-.85L6.35 2.85a.5.5 0 0 0-.85.36Z"
              fill={cursor.color}
              stroke="white"
              strokeWidth="1.5"
            />
          </svg>
          {/* Name label */}
          <div
            className="absolute left-4 top-4 px-2 py-0.5 rounded-md text-[10px] font-medium text-white whitespace-nowrap"
            style={{ backgroundColor: cursor.color }}
          >
            {cursor.name}
          </div>
        </motion.div>
      ))}
    </>
  )
}
