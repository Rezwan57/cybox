'use client'
import React, { useState, useRef, useEffect } from 'react';
import { FaInbox, FaPaperPlane, FaTrash, FaEnvelope, FaEnvelopeOpenText, FaExclamationTriangle, FaLink, FaBan } from 'react-icons/fa';
import { invoke } from '@tauri-apps/api/core';
import { useAuth } from '../../Context/AuthContext';

type Email = {
  id: number;
  user_id: number;
  universal_email_id: number;
  is_read: boolean;
  classification: string;
  created_at: string;
  from_user: string;
  subject: string;
  body: string;
};

export default function EmailApp() {
    const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [activeTab, setActiveTab] = useState('inbox');
  const [isComposing, setIsComposing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    console.log('EmailApp component mounted');
    if (user) {
      console.log('User is available:', user);
      fetchEmails();
    } else {
      console.log('User is not available yet');
    }
  }, [user]);

  const fetchEmails = async () => {
    if (!user) return;
    console.log('Fetching emails for user:', user.name);
    setLoading(true);
    setError(null);
    try {
      const fetchedEmails: Email[] = await invoke('get_emails', { userId: user.id });
      console.log('Fetched emails:', fetchedEmails);
      
      setEmails(fetchedEmails);

    } catch (error) {
      console.error('Failed to fetch emails:', error);
      setError('Failed to fetch emails. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

    const openEmail = async (id: number, fromTab: string) => {
    let emailToOpen: Email | undefined;
    emailToOpen = emails.find(email => email.id === id);

    if (emailToOpen && !emailToOpen.is_read) {
      try {
        await invoke('mark_email_as_read', { emailId: id });
        const updateEmails = (prevEmails: Email[]) => prevEmails.map(e => e.id === id ? { ...e, is_read: true } : e);
        setEmails(updateEmails);
      } catch (error) {
        console.error('Failed to mark email as read:', error);
      }
    }
    setSelectedEmail(emailToOpen || null);
  };

  const deleteEmail = async (id: number) => {
    try {
      await invoke('delete_email', { emailId: id });
      setEmails(prevEmails => prevEmails.filter(e => e.id !== id));
      if (selectedEmail && selectedEmail.id === id) {
        setSelectedEmail(null);
      }
    } catch (error) {
      console.error('Failed to delete email:', error);
    }
  };

  const classifyEmail = async (id: number, classification: 'spam' | 'phishing') => {
    try {
      const newClassification = await invoke('classify_email', { emailId: id, classification });
      const updateClassification = (prevEmails: Email[]) => prevEmails.map(e => e.id === id ? { ...e, classification: newClassification as string } : e);
      setEmails(updateClassification);

      if (selectedEmail && selectedEmail.id === id) {
        setSelectedEmail({ ...selectedEmail, classification: newClassification as string });
      }
    } catch (error) {
      console.error('Failed to classify email:', error);
    }
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
        <form>
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
            <button type="submit" className="bg-teal-400 text-white py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors">Send</button>
          </div>
        </form>
      </div>
    );
  }

  const emailsToDisplay = emails;

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
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-neutral-500">Loading emails...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-500">{error}</p>
          </div>
        ) : emailsToDisplay.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-neutral-500">No emails found.</p>
          </div>
        ) : (
          emailsToDisplay.map((email) => (
            <div
              key={email.id}
              onClick={() => openEmail(email.id, activeTab)}
              className={`cursor-pointer px-4 py-3 border-b border-neutral-700 hover:bg-neutral-800 ${
                selectedEmail?.id === email.id ? 'bg-neutral-800' : ''
              } ${
                email.is_read ? 'text-neutral-400' : 'font-semibold text-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {email.is_read ? (
                    <FaEnvelopeOpenText className="text-neutral-500" />
                  ) : (
                    <FaEnvelope className="text-blue-500" />
                  )}
                  <div>
                    <p className="text-sm">{email.from_user}</p>
                    <p className="text-xs text-neutral-500">{email.subject}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Email View */}
      <div className="flex-1 p-6 overflow-y-auto">
        {selectedEmail ? (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{selectedEmail.subject}</h2>
              <div className="flex items-center gap-2">
                <button onClick={() => classifyEmail(selectedEmail.id, 'spam')} className={`p-2 hover:bg-neutral-700 rounded-full ${selectedEmail.classification === 'spam' ? 'bg-red-200/20 text-red-500' : ''}`} title="Mark as Spam">
                  <FaBan />
                </button>
                <button onClick={() => classifyEmail(selectedEmail.id, 'phishing')} className={`p-2 hover:bg-neutral-700 rounded-full ${selectedEmail.classification === 'phishing' ? 'bg-yellow-200/20 text-yellow-500' : ''}`} title="Mark as Phishing">
                  <FaExclamationTriangle />
                </button>
                <button onClick={() => deleteEmail(selectedEmail.id)} className="p-2 hover:bg-neutral-700 rounded-full" title="Delete">
                  <FaTrash />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-neutral-700">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold text-xl">
                {selectedEmail.from_user.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-white">{selectedEmail.from_user}</p>
                <p className="text-sm text-neutral-400">To: {user?.name}</p>
              </div>
            </div>
            <div className="prose prose-invert max-w-none  select-text" dangerouslySetInnerHTML={{ __html: selectedEmail.body }}></div>
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