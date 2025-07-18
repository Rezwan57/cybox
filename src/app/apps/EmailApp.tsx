'use client'
import React, { useState } from 'react'
import { FaEnvelope, FaEnvelopeOpenText } from 'react-icons/fa'

type Email = {
  id: number
  from: string
  subject: string
  body: string
  isRead: boolean
}

const sampleEmails: Email[] = [
  {
    id: 1,
    from: 'admin@cyberbank.fake',
    subject: 'Unusual login detected',
    body: 'We noticed a login from a new device. Click the link below to secure your account.',
    isRead: false,
  },
  {
    id: 2,
    from: 'support@securevpn.fake',
    subject: 'Your subscription has expired',
    body: 'Renew your VPN today to stay protected.',
    isRead: false,
  },
  {
    id: 3,
    from: 'friend@trustme.fake',
    subject: 'Check out this awesome game!',
    body: 'It’s a new hacking simulator. Totally legit ;) Download here.',
    isRead: false,
  },
]

export default function EmailApp() {
  const [emails, setEmails] = useState(sampleEmails)
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)

  const openEmail = (id: number) => {
    const updated = emails.map((email) =>
      email.id === id ? { ...email, isRead: true } : email
    )
    setEmails(updated)
    setSelectedEmail(updated.find((e) => e.id === id) || null)
  }

  return (
    <div className="w-full flex h-full">
      {/* Sidebar / Email List */}
      <div className="w-1/3 border-r border-green-400 overflow-y-auto">
        <div className="p-2 font-bold text-center text-neutral-950 bg-green-400">Inbox</div>
        {emails.map((email) => (
          <div
            key={email.id}
            onClick={() => openEmail(email.id)}
            className={`cursor-pointer px-3 py-2 border-b border-green-400 hover:bg-neutral-800 ${
              email.isRead ? 'text-gray-500' : 'font-semibold'
            }`}
          >
            <div className="flex items-center gap-4">
              {email.isRead ? (
                <FaEnvelopeOpenText className="text-neutral-200" />
              ) : (
                <FaEnvelope className="text-green-500" />
              )}
              <div className="flex flex-col">
                <span className="text-sm text-neutral-600 bold">{email.from}</span>
                <span className="text-xs text-neutral-600">{email.subject}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Email View */}
      <div className="flex-1 p-4 overflow-y-auto">
        {selectedEmail ? (
          <>
            <h2 className="text-lg font-bold mb-2">{selectedEmail.subject}</h2>
            <p className="text-sm text-gray-600 mb-1">
              From: <span className="text-green-400">{selectedEmail.from}</span>
            </p>
            <hr className="mb-2" />
            <p className="text-base">{selectedEmail.body}</p>
          </>
        ) : (
          <p className="text-gray-500">Select an email to read</p>
        )}
      </div>
    </div>
  )
}
