'use client'
import React, { useState, useRef } from 'react';
import { FaInbox, FaPaperPlane, FaTrash, FaEnvelope, FaEnvelopeOpenText, FaExclamationTriangle, FaLink, FaBan } from 'react-icons/fa';

type Email = {
  id: number;
  from: string;
  to?: string;
  subject: string;
  body: string;
  isRead: boolean;
  classification: 'none' | 'spam' | 'phishing';
};

const sampleEmails: Email[] = [
  {
    id: 1,
    from: 'admin@cyberbank.fake',
    subject: 'Unusual login detected',
    body: 'We noticed a login from a new device. Click the link below to secure your account: <a href="cybox://bank/login?phishing=true" class="text-blue-400 underline">https://cyberbank.fake/secure</a>',
    isRead: false,
    classification: 'none',
  },
  {
    id: 2,
    from: 'support@securevpn.fake',
    subject: 'Your subscription has expired',
    body: 'Renew your VPN today to stay protected. <a href="cybox://settings/network" class="text-blue-400 underline">Renew Now</a>',
    isRead: false,
    classification: 'none',
  },
  {
    id: 3,
    from: 'friend@trustme.fake',
    subject: 'Check out this awesome game!',
    body: 'It’s a new hacking simulator. Totally legit ;) Download here: <a href="cybox://filemanager/download/malware.exe" class="text-blue-400 underline">malware.exe</a>',
    isRead: false,
    classification: 'none',
  },
];

export default function EmailApp() {
  const [emails, setEmails] = useState<Email[]>(sampleEmails);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [activeTab, setActiveTab] = useState('inbox');
  const [isComposing, setIsComposing] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const openEmail = (id: number) => {
    const updated = emails.map((email) =>
      email.id === id ? { ...email, isRead: true } : email
    );
    setEmails(updated);
    setSelectedEmail(updated.find((e) => e.id === id) || null);
  };

  const deleteEmail = (id: number) => {
    setEmails(emails.filter(email => email.id !== id));
    if (selectedEmail && selectedEmail.id === id) {
      setSelectedEmail(null);
    }
  };

  const classifyEmail = (id: number, classification: 'spam' | 'phishing') => {
    const updatedEmails = emails.map(email =>
      email.id === id ? { ...email, classification } : email
    );
    setEmails(updatedEmails);
    if (selectedEmail && selectedEmail.id === id) {
      setSelectedEmail({ ...selectedEmail, classification });
    }
  };

  const handleSendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const to = (form.elements.namedItem('to') as HTMLInputElement).value;
    const subject = (form.elements.namedItem('subject') as HTMLInputElement).value;
    const body = (form.elements.namedItem('body') as HTMLTextAreaElement).value;

    const newEmail: Email = {
      id: Date.now(),
      from: 'you@cybox.dev',
      to,
      subject,
      body,
      isRead: true,
      classification: 'none',
    };

    setEmails([newEmail, ...emails]);
    setIsComposing(false);
    setActiveTab('sent');
  };

  const addLink = () => {
    const url = prompt("Enter the URL");
    if (url && bodyRef.current) {
      const link = `<a href="${url}" class="text-blue-400 underline">${url}</a>`;
      bodyRef.current.value += link;
    }
  };

  if (isComposing) {
    return (
      <div className="w-full h-full flex flex-col text-white p-6">
        <form onSubmit={handleSendEmail}>
          <h2 className="text-2xl font-bold mb-4">New Email</h2>
          <div className="mb-4">
            <label htmlFor="to" className="block text-sm font-medium text-neutral-400 mb-1">To</label>
            <input type="email" name="to" id="to" className="w-full bg-neutral-800 rounded-md py-2 px-4 text-white" required />
          </div>
          <div className="mb-4">
            <label htmlFor="subject" className="block text-sm font-medium text-neutral-400 mb-1">Subject</label>
            <input type="text" name="subject" id="subject" className="w-full bg-neutral-800 rounded-md py-2 px-4 text-white" required />
          </div>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="body" className="block text-sm font-medium text-neutral-400">Body</label>
              <button type="button" onClick={addLink} className="text-blue-400 hover:text-blue-500"><FaLink /></button>
            </div>
            <textarea ref={bodyRef} name="body" id="body" rows={10} className="w-full bg-neutral-800 rounded-md py-2 px-4 text-white" required></textarea>
          </div>
          <div className="flex justify-end gap-4">
            <button type="button" onClick={() => setIsComposing(false)} className="text-neutral-400 hover:text-white">Cancel</button>
            <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">Send</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full flex h-full text-white">
      {/* Sidebar */}
      <div className="w-16 bg-neutral-800/50 px-6 py-3 rounded-xl m-2 flex flex-col items-center gap-4">
        <button onClick={() => setIsComposing(true)} className="w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center">
          <FaPaperPlane />
        </button>
        <nav className="flex-1 flex flex-col items-center gap-2">
          <button onClick={() => setActiveTab('inbox')} className={`w-10 h-10 rounded-full flex items-center justify-center hover:bg-neutral-700 transition-colors ${activeTab === 'inbox' ? 'bg-neutral-700' : ''}`}>
            <FaInbox />
          </button>
          <button onClick={() => setActiveTab('sent')} className={`w-10 h-10 rounded-full flex items-center justify-center hover:bg-neutral-700 transition-colors ${activeTab === 'sent' ? 'bg-neutral-700' : ''}`}>
            <FaPaperPlane />
          </button>
          <button onClick={() => setActiveTab('trash')} className={`w-10 h-10 rounded-full flex items-center justify-center hover:bg-neutral-700 transition-colors ${activeTab === 'trash' ? 'bg-neutral-700' : ''}`}>
            <FaTrash />
          </button>
        </nav>
      </div>

      {/* Email List */}
      <div className="w-1/3 border-r border-neutral-700 overflow-y-auto">
        <div className="p-4 font-bold text-xl border-b border-neutral-700">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</div>
        {emails.filter(email => activeTab === 'inbox' ? !email.to : email.to).map((email) => (
          <div
            key={email.id}
            onClick={() => openEmail(email.id)}
            className={`cursor-pointer px-4 py-3 border-b border-neutral-700 hover:bg-neutral-800 ${
              selectedEmail?.id === email.id ? 'bg-neutral-800' : ''
            } ${
              email.isRead ? 'text-neutral-400' : 'font-semibold text-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {email.isRead ? (
                  <FaEnvelopeOpenText className="text-neutral-500" />
                ) : (
                  <FaEnvelope className="text-blue-500" />
                )}
                <div>
                  <p className="text-sm">{email.from}</p>
                  <p className="text-xs text-neutral-500">{email.subject}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Email View */}
      <div className="flex-1 p-6 overflow-y-auto">
        {selectedEmail ? (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{selectedEmail.subject}</h2>
              <div className="flex items-center gap-2">
                <button onClick={() => classifyEmail(selectedEmail.id, 'spam')} className="p-2 hover:bg-neutral-700 rounded-full" title="Mark as Spam">
                  <FaBan />
                </button>
                <button onClick={() => classifyEmail(selectedEmail.id, 'phishing')} className="p-2 hover:bg-neutral-700 rounded-full" title="Mark as Phishing">
                  <FaExclamationTriangle />
                </button>
                <button onClick={() => deleteEmail(selectedEmail.id)} className="p-2 hover:bg-neutral-700 rounded-full" title="Delete">
                  <FaTrash />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-neutral-700">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold text-xl">
                {selectedEmail.from.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-white">{selectedEmail.from}</p>
                <p className="text-sm text-neutral-400">To: you@cybox.dev</p>
              </div>
            </div>
            <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: selectedEmail.body }}></div>
            {selectedEmail.classification === 'phishing' && (
              <div className="mt-6 p-4 bg-yellow-900/30 text-yellow-400 rounded-lg flex items-center gap-3">
                <FaExclamationTriangle />
                <p>This email has been marked as a potential phishing attempt.</p>
              </div>
            )}
            {selectedEmail.classification === 'spam' && (
              <div className="mt-6 p-4 bg-red-900/30 text-red-400 rounded-lg flex items-center gap-3">
                <FaBan />
                <p>This email has been marked as spam.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-neutral-500">Select an email to read</p>
          </div>
        )}
      </div>
    </div>
  );
}



