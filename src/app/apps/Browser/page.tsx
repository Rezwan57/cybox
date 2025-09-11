'use client'
import React, { useState } from 'react';
import { FaHome, FaArrowLeft, FaArrowRight, FaRedo, FaLock } from 'react-icons/fa';
import WhatIsCybersecurity from './learning/WhatIsCybersecurity';
import ConsoleTechniquesPage from './learning/ConsoleTechniquesPage';
import CreateAStrongPassword from './learning/CreateAStrongPassword';
import SpottingEmails from './learning/SpottingEmails';
import TheMultiHash from './learning/TheMultiHash';

const HomePage = ({ setUrl }: { setUrl: (url: string) => void }) => (
  <div className="p-8 text-white">
    <h1 className="text-4xl font-bold mb-10 text-center">Cyber Browser</h1>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <button onClick={() => setUrl('cybox://learn/cybersecurity')} className="bg-neutral-700 p-4 rounded-lg hover:text-neutral-900 hover:bg-teal-400 transition-colors col-span-full">
        <p className="font-bold">Learn: What is Cybersecurity?</p>
        <p className="text-sm ">Understand the basics of digital security.</p>
      </button>
      <button onClick={() => setUrl('cybox://learn/strong-password')} className="bg-neutral-700 p-4 rounded-lg hover:text-neutral-900 hover:bg-teal-400 transition-colors col-span-full">
        <p className="font-bold">Learn: Create a Strong Password</p>
        <p className="text-sm ">Learn to protect your accounts with strong passwords.</p>
      </button>
      <button onClick={() => setUrl('cybox://learn/spotting-emails')} className="bg-neutral-700 p-4 rounded-lg hover:text-neutral-900 hover:bg-teal-400 transition-colors col-span-full">
        <p className="font-bold">Learn: Spotting Phishing Emails</p>
        <p className="text-sm ">Identify and avoid malicious emails.</p>
      </button>
      <button onClick={() => setUrl('cybox://learn/console')} className="bg-neutral-700 p-4 rounded-lg hover:text-neutral-900 hover:bg-teal-400 transition-colors col-span-full">
        <p className="font-bold">Learn: Console Techniques</p>
        <p className="text-sm ">Master file encryption using the Console.</p>
      </button>
      <button onClick={() => setUrl('cybox://learn/multi-hash')} className="bg-neutral-700 p-4 rounded-lg hover:text-neutral-900 hover:bg-teal-400 transition-colors col-span-full">
        <p className="font-bold">Learn: The Multi-Hash</p>
        <p className="text-sm ">Explore advanced hashing techniques.</p>
      </button>
    </div>
  </div>
);


const PageRenderer = ({ url }: { url: string }) => {
  if (url === 'cybox://learn/cybersecurity') {
    return <WhatIsCybersecurity />;
  }
  if (url === 'cybox://learn/strong-password') {
    return <CreateAStrongPassword />;
  }
  if (url === 'cybox://learn/spotting-emails') {
    return <SpottingEmails />;
  }
  if (url === 'cybox://learn/console') {
    return <ConsoleTechniquesPage />;
  }
  if (url === 'cybox://learn/multi-hash') {
    return <TheMultiHash />;
  }
  if (url.startsWith('cybox://')) {
    const page = url.replace('cybox://', '');
    return <div className="p-8 text-white"><h1 className="text-2xl">This is the {page} app.</h1></div>;
  }

  if (url.startsWith('<script>')) {
    return (
      <div className="p-8 text-white">
        <h1 className="text-2xl text-red-500">XSS Attack Simulated!</h1>
        <p>In a real attack, this script could have stolen your cookies or other sensitive information.</p>
        <div className="mt-4 p-4 bg-neutral-800 rounded-lg">
          <code className="text-white">{url}</code>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl">Welcome to the Cyber Browser</h1>
      <p>This is a simulated browser environment.</p>
    </div>
  );
};

export default function BrowserApp() {
  const [url, setUrl] = useState('cybox://home');
  const [history, setHistory] = useState(['cybox://home']);
  const [historyIndex, setHistoryIndex] = useState(0);

  const navigate = (newUrl: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setUrl(newUrl);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setUrl(history[historyIndex - 1]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setUrl(history[historyIndex + 1]);
    }
  };

  const reload = () => {
    const currentUrl = url;
    setUrl('');
    setTimeout(() => setUrl(currentUrl), 100);
  };

  const handleUrlSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newUrl = (e.currentTarget.elements.namedItem('urlInput') as HTMLInputElement).value;
    navigate(newUrl);
  };

  return (
    <div className="w-full h-full flex flex-col  text-white">
      {/* Browser Controls */}
      <div className="flex items-center p-2 ">
        <div className="flex items-center gap-2">
          <button onClick={goBack} className="p-2 rounded-full hover:bg-neutral-700"><FaArrowLeft /></button>
          <button onClick={goForward} className="p-2 rounded-full hover:bg-neutral-700"><FaArrowRight /></button>
          <button onClick={reload} className="p-2 rounded-full hover:bg-neutral-700"><FaRedo /></button>
          <button onClick={() => navigate('cybox://cybox.cbx/learning/console-app')} className="p-2 rounded-full hover:bg-neutral-700"><FaHome /></button>
        </div>
        <div className="flex-1 mx-2">
          <form onSubmit={handleUrlSubmit} key={url}>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" />
              <input
                type="text"
                name="urlInput"
                defaultValue={url}
                className="w-full bg-neutral-700 rounded-full py-2 pl-10 pr-4 text-white"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Browser Content */}
      <div className="flex-1 overflow-y-auto select-text">
        {url === 'cybox://home' ? <HomePage setUrl={navigate} /> : <PageRenderer url={url} />}
      </div>
    </div>
  );
}
