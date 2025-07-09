'use client'
import React, { useState } from 'react'
import { FaFolder, FaFileAlt } from 'react-icons/fa'

const mockFiles = [
  { name: 'Notes.txt', type: 'file' },
  { name: 'Projects', type: 'folder' },
  { name: 'Passwords.doc', type: 'file' },
  { name: 'Screenshots', type: 'folder' },
]

function FileManager() {
  const [currentDir, setCurrentDir] = useState('C:/User/Desktop')

  return (
    <div className="w-full p-4 text-md">
      <div className="font-mono bg-neutral-800 text-white mb-2 p-1 rounded-md">
        📂 {currentDir}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {mockFiles.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-2 hover:bg-neutral-800 rounded cursor-pointer"
          >
            {item.type === 'folder' ? (
              <FaFolder className="text-primary text-6xl" />
            ) : (
              <FaFileAlt className="text-primary text-6xl" />
            )}
            <span className="mt-1 text-xs text-center break-all">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FileManager
