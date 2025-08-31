'use client'

import React, { useState } from 'react';
import WhatIsCybersecurity from './Browser/learning/WhatIsCybersecurity';
import CreateAStrongPassword from './Browser/learning/CreateAStrongPassword';
import SpottingEmails from './Browser/learning/SpottingEmails';
import TheMultiHash from './Browser/learning/TheMultiHash';
import ConsoleTechniquesPage from './Browser/learning/ConsoleTechniquesPage';

export default function Browser() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const renderModule = () => {
    switch (selectedModule) {
      case 'WhatIsCybersecurity':
        return <WhatIsCybersecurity />;
      case 'CreateAStrongPassword':
        return <CreateAStrongPassword />;
      case 'SpottingEmails':
        return <SpottingEmails />;
      case 'TheMultiHash':
        return <TheMultiHash />;
      case 'ConsoleTechniquesPage':
        return <ConsoleTechniquesPage />;
      default:
        return (
          <div className="p-8 text-white">
            <h1 className="text-3xl font-bold mb-4">Welcome to the Learning Hub!</h1>
            <p className="text-neutral-400">Select a module from the sidebar to start learning.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-full bg-neutral-900">
      <div className="w-1/4 bg-neutral-800 p-4 border-r border-neutral-700">
        <h2 className="text-2xl font-bold mb-4 text-white">Learning Modules</h2>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => setSelectedModule('WhatIsCybersecurity')}
              className="text-teal-400 hover:underline text-left w-full p-2 rounded-md hover:bg-neutral-700"
            >
              What is Cybersecurity?
            </button>
          </li>
          <li>
            <button
              onClick={() => setSelectedModule('CreateAStrongPassword')}
              className="text-teal-400 hover:underline text-left w-full p-2 rounded-md hover:bg-neutral-700"
            >
              Create a Strong Password
            </button>
          </li>
          <li>
            <button
              onClick={() => setSelectedModule('SpottingEmails')}
              className="text-teal-400 hover:underline text-left w-full p-2 rounded-md hover:bg-neutral-700"
            >
              Spotting Phishing Emails
            </button>
          </li>
          <li>
            <button
              onClick={() => setSelectedModule('TheMultiHash')}
              className="text-teal-400 hover:underline text-left w-full p-2 rounded-md hover:bg-neutral-700"
            >
              The Multi-Hash
            </button>
          </li>
          <li>
            <button
              onClick={() => setSelectedModule('ConsoleTechniquesPage')}
              className="text-teal-400 hover:underline text-left w-full p-2 rounded-md hover:bg-neutral-700"
            >
              Console Techniques
            </button>
          </li>
        </ul>
      </div>
      <div className="flex-1 overflow-y-auto">
        {renderModule()}
      </div>
    </div>
  );
}
