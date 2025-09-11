'use client'
import React, { useState, useEffect } from 'react'
import { FaFolder, FaFileAlt  } from 'react-icons/fa'
import { RiFolderLockFill } from "react-icons/ri";
import { useAuth } from '@/Context/AuthContext'
import { invoke } from '@tauri-apps/api/core'
import { useFileSystem } from '@/Context/FileSystemContext';
import { RxCross2 } from 'react-icons/rx'

const mockFiles: FileItem[] = [
  { name: 'Notes.txt', type: 'file', content: 'Meeting Notes 2025-08-29:\n- Discuss Q3 financial results\n- Plan for new product launch\n- Review marketing strategy', path: undefined } as FileItem,
  { name: 'Projects', type: 'folder', content: undefined, path: undefined } as FileItem,
  { name: 'code.txt', type: 'file', content: 'Fragment 2/2: 2nd key \nEndcoded in Base64: X3NfZV9jX3Vfcl9pX3RfeQ==', path: undefined } as FileItem,
  { name: 'Screenshots', type: 'folder', content: undefined, path: undefined } as FileItem,
  { name: 'sensitive_data.txt', type: 'file', path: '/home/user/sensitive_data.txt', content: '' } as FileItem,
]

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  path?: string;
  content?: string;
}

const FileContentPopup = ({ file, onClose, isEncrypted, user, setIsSensitiveFileEncrypted }: { file: FileItem, onClose: () => void, isEncrypted: boolean, user: any, setIsSensitiveFileEncrypted: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [password, setPassword] = useState('');
  const [decryptedContent, setDecryptedContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDecrypt = async () => {
    if (!file.path) return;
    try {
      const content: string = await invoke('decrypt_file_content', { filePath: file.path, password });
      setDecryptedContent(content);
      setError(null);
    } catch (err) {
      setError(err as string);
      setDecryptedContent(null);
    }
  };

  const isSensitiveFile = file.name === 'sensitive_data.txt';

  return (
    <div className="fixed inset-0 bg-neutral-900/80 flex items-center justify-center z-50">
      <div className="bg-neutral-800/50 backdrop-blur-2xl rounded-xl shadow-lg w-[90%] h-[90%] text-white overflow-hidden border-primary border-2">
        {/* Titlee*/}
        <div className="bg-neutral-900 px-4 py-2 flex items-center justify-between">
          <h2 className="text-md font-bold">{file.name}</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300"
          >
            <RxCross2 className="w-6 h-6" />
          </button>
        </div>

        {/* mainnn Area */}
        <div className="p-4">
          {isSensitiveFile && isEncrypted && !decryptedContent ? (
            <div className="flex flex-col items-center justify-center h-full">
              <RiFolderLockFill  className="text-red-500 text-6xl mb-4" />
              <h3 className="text-xl mb-4">This file is encrypted.</h3>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="bg-neutral-700 text-white px-4 py-2 rounded-md mb-4"
              />
              <button onClick={handleDecrypt} className="bg-primary px-4 py-2 rounded-md">Decrypt</button>
              {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
          ) : isSensitiveFile && !isEncrypted ? (
            <div className="flex flex-col items-center justify-center h-full">
              <FaFileAlt className="text-primary text-6xl mb-4" />
              <h3 className="text-xl mb-4">This file is not encrypted.</h3>
              {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
          ) : (
            file.type === 'file' ? (
              <pre className="px-5 py-3 rounded-md overflow-auto text-md mb-4 h-full select-text">
                {decryptedContent ?? file.content}
              </pre>
            ) : (
              <p className="mb-4 text-center">Folder is empty</p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

function FileManager() {
  const { user } = useAuth()
  const { refreshTrigger } = useFileSystem();
  const [currentDir, setCurrentDir] = useState('/home/user/Desktop')
  const [isSensitiveFileEncrypted, setIsSensitiveFileEncrypted] = useState(false)
  const [showPopup, setShowPopup] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  useEffect(() => {
    const checkEncryptionStatus = async () => {
      if (user) {
        try {
          const encrypted = await invoke('is_file_encrypted', { filePath: '/home/user/sensitive_data.txt', userId: user.id });
          setIsSensitiveFileEncrypted(encrypted as boolean);
        } catch (e) {
          console.error('Failed to check encryption status:', e);
        }
      }
    };
    checkEncryptionStatus();
  }, [user, showPopup, refreshTrigger]);

  const handleItemClick = (item: FileItem) => {
    setSelectedFile(item);
    setShowPopup(true);
  };

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
            onClick={() => handleItemClick(item)}
          >
            {item.type === 'folder' ? (
              <FaFolder className="text-primary text-6xl" />
            ) : (
              item.name === 'sensitive_data.txt' && isSensitiveFileEncrypted ? (
                <RiFolderLockFill  className="text-red-500 text-6xl" />
              ) : (
                <FaFileAlt className="text-primary text-6xl" />
              )
            )}
            <span className="mt-1 text-xs text-center break-all">
              {item.name}
            </span>
          </div>
        ))}
      </div>
      {showPopup && selectedFile && (
        <FileContentPopup file={selectedFile} onClose={() => setShowPopup(false)} isEncrypted={isSensitiveFileEncrypted} user={user} setIsSensitiveFileEncrypted={setIsSensitiveFileEncrypted} />
      )}
    </div>
  )
}

export default FileManager

