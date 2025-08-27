'use client'
import React, { useState, useContext } from 'react'
import Image from 'next/image'
import { AppContext } from '@/Context/AppWrapper'


interface DockProps {
  onAppClick?: (app: string) => void
  openApps: string[]
}

import { icons } from '@/data/icons';

const Dock: React.FC<DockProps> = ({ onAppClick, openApps }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isClicked, setIsClicked] = useState<number | null>(null)
  const appContext = useContext(AppContext)

  const handleClick = (index: number) => {
    setIsClicked(index)
    setTimeout(() => setIsClicked(null), 150)
  }

  const purchasedServices = appContext?.purchasedServices || []
  const purchasedServiceNames = purchasedServices.map(s => s.name)

  const visibleIcons = icons.filter(icon => {
    return icon.required || purchasedServiceNames.includes(icon.name)
  })

  return (
    <nav className="fixed bottom-2 left-1/2 -translate-x-1/2 z-50 flex gap-4 bg-black/20 backdrop-blur-md p-3 pb-1 rounded-[20px] shadow-2xl transform-gpu border-2 border-teal-400">
      {visibleIcons.map((Icon, index) => {
        const isOpen = openApps.includes(Icon.name)
        const isClickedHere = isClicked === index

        let scale = 'scale-100 translate-y-0 px-0 duration-200'
        if (hoveredIndex === index) {
          scale = 'scale-[1.3] -translate-y-5 px-2 duration-100'
        } else if (hoveredIndex === index - 1 || hoveredIndex === index + 1) {
          scale = 'scale-[1.2] -translate-y-3 px-1 duration-200'
        } else if (hoveredIndex === index - 2 || hoveredIndex === index + 2) {
          scale = 'scale-[1.1] -translate-y-1 px-1 duration-300'
        }

        if (isClickedHere) {
          scale = 'scale-[1.0] translate-y-0 px-0 duration-150'
        }

        return (
          <div key={index} className="relative flex flex-col items-center">
            <button
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => {
                onAppClick?.(Icon.name)
                handleClick(index)
              }}
              className={`flex flex-col items-center gap-1 relative transform-gpu will-change-transform transition-all ease-in-out cursor-pointer ${scale}`}
            >
              <Image
                src={Icon.icon}
                alt={Icon.name}
                width={55}
                height={55}
                className="rounded-[12px] border-2 border-teal-400"
                priority
              />

              {/* Dot indicator for open apps */}
              {isOpen && (
                <div className="w-[6px] h-[6px] rounded-full shadow-2xl shadow-black bg-white" />
              )}
              {!isOpen && <div className="mt-2 " />}
            </button>
            {hoveredIndex === index && (
              <div className="absolute -top-14  bg-black/80 text-white text-xs px-2 py-1 rounded-md">
                {Icon.name}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}

export default Dock

