'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  motion,
  useMotionValue,
  AnimatePresence,
  useDragControls,
} from 'framer-motion'
import { RxCross2 } from 'react-icons/rx'
import { FaRegWindowMinimize } from 'react-icons/fa'
import { TbArrowsMaximize, TbArrowsDiagonalMinimize2 } from 'react-icons/tb'

interface AppWindowProps {
  title: string
  isMinimized: boolean
  onClose: () => void
  onMinimize: () => void
  onMaximize: () => void
  children: React.ReactNode
}

type ResizeDirection =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'

export default function AppWindow({
  title,
  isMinimized,
  onClose,
  onMinimize,
  onMaximize,
  children,
}: AppWindowProps) {
  const [isMaximized, setIsMaximized] = useState(false)
  const [size, setSize] = useState({ width: 800, height: 600 })

  const windowRef = useRef<HTMLDivElement>(null)
  const resizingRef = useRef(false)
  const dragControls = useDragControls()

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  useEffect(() => {
    if (isMaximized) {
      x.set(0)
      y.set(0)
    }
  }, [isMaximized, x, y])

  const startResizing = (e: React.MouseEvent, direction: ResizeDirection) => {
    if (isMaximized) return
    e.preventDefault()
    e.stopPropagation()
    resizingRef.current = true

    const startX = e.clientX
    const startY = e.clientY
    const startWidth = size.width
    const startHeight = size.height
    const startWindowX = x.get()
    const startWindowY = y.get()

    const onMouseMove = (e: MouseEvent) => {
      if (!resizingRef.current) return

      const dx = e.clientX - startX
      const dy = e.clientY - startY

      let newWidth = size.width
      let newHeight = size.height

      if (direction.includes('right')) {
        newWidth = Math.max(800, startWidth + dx)
      }
      if (direction.includes('left')) {
        newWidth = Math.max(800, startWidth - dx)
        x.set(startWindowX + dx)
      }

      if (direction.includes('bottom')) {
        newHeight = Math.max(600, startHeight + dy)
      }
      if (direction.includes('top')) {
        newHeight = Math.max(600, startHeight - dy)
        y.set(startWindowY + dy)
      }

      setSize({ width: newWidth, height: newHeight })
    }

    const onMouseUp = () => {
      resizingRef.current = false
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  const handleMinimize = () => {
    onMinimize()
  }

  const toggleMaximize = () => {
    setIsMaximized(prev => !prev)
    onMaximize()
  }

  const windowVariants = {
    visible: {
      scaleX: 1,
      scaleY: 1,
      translateY: 0,
      filter: 'blur(0)',
      opacity: 1,
      transition: { duration: 0.25 },
    },
    hidden: {
      scaleX: 0.2,
      scaleY: 2.5,
      translateY: 1000,
      filter: 'blur(40px)',
      opacity: 0,
      transition: { duration: 0.25 },
    },
  }

  return (
    <AnimatePresence>
      {!isMinimized && (
        <motion.div
          ref={windowRef}
          drag={!isMaximized}
          dragControls={dragControls}
          dragListener={false}
          dragMomentum={false}
          variants={windowVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          style={{
            x,
            y,
            ...(isMaximized
              ? {
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  borderRadius: 0,
                }
              : {
                  width: size.width,
                  height: size.height,
                  top: `calc(50% - ${size.height / 2}px)`,
                  left: `calc(50% - ${size.width / 2}px)`,
                  borderRadius: '1rem',
                }),
            position: 'fixed',
            zIndex: 40,
            backgroundColor: 'rgba(15,15,15,0.6)',
            backdropFilter: 'blur(30px)',
            border: '3px solid var(--primary)',
            overflow: 'hidden',
            willChange: 'transform, width, height',
            WebkitUserSelect: 'none',
            userSelect: 'none',
          }}
        >
          {/* Title Bar */}
          <div
            className="grid grid-cols-3 items-center justify-between px-2 py-2 cursor-move w-full"
            onPointerDown={e => {
              if (!isMaximized) dragControls.start(e)
            }}
          >
            <span className="col-start-2 justify-self-center font-medium text-gray-100">
              {title}
            </span>
            <div className="col-start-3 justify-self-end flex items-center gap-3">
              <button
                onClick={handleMinimize}
                className="text-white mr-2 cursor-pointer"
              >
                <FaRegWindowMinimize size={15} />
              </button>
              <button
                onClick={toggleMaximize}
                className="text-white cursor-pointer"
              >
                {isMaximized ? (
                  <TbArrowsDiagonalMinimize2 size={18} />
                ) : (
                  <TbArrowsMaximize size={18} />
                )}
              </button>
              <button onClick={onClose} className="text-white cursor-pointer">
                <RxCross2 size={25} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-auto text-white h-[calc(100%-48px)]">
            {children}
          </div>

          {/* Resize Handles */}
          {!isMaximized && (
            <>
              {/* Corners */}
              <div
                onMouseDown={e => startResizing(e, 'top-left')}
                className="absolute -top-1 -left-1 w-4 h-4 cursor-nwse-resize z-50"
              />
              <div
                onMouseDown={e => startResizing(e, 'top-right')}
                className="absolute -top-1 -right-1 w-4 h-4 cursor-nesw-resize z-50"
              />
              <div
                onMouseDown={e => startResizing(e, 'bottom-left')}
                className="absolute -bottom-1 -left-1 w-4 h-4 cursor-nesw-resize z-50"
              />
              <div
                onMouseDown={e => startResizing(e, 'bottom-right')}
                className="absolute -bottom-1 -right-1 w-4 h-4 cursor-nwse-resize z-50"
              />
              {/* Edges */}
              <div
                onMouseDown={e => startResizing(e, 'top')}
                className="absolute -top-1 left-0 w-full h-2 cursor-ns-resize z-50"
              />
              <div
                onMouseDown={e => startResizing(e, 'bottom')}
                className="absolute -bottom-1 left-0 w-full h-2 cursor-ns-resize z-50"
              />
              <div
                onMouseDown={e => startResizing(e, 'left')}
                className="absolute top-0 -left-1 w-2 h-full cursor-ew-resize z-50"
              />
              <div
                onMouseDown={e => startResizing(e, 'right')}
                className="absolute top-0 -right-1 w-2 h-full cursor-ew-resize z-50"
              />
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
