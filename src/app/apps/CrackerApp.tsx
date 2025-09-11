'use client';

import React, { useState } from 'react';
import CryptoJS from 'crypto-js';

const commonPasswords = [
  'User321',
  'adminIam230',
  'mod78mod',
  'Klein679',
  'Roco89080',
];

export default function CrackerApp() {
  const [hash, setHash] = useState('');
  const [result, setResult] = useState('');
  const [isCracking, setIsCracking] = useState(false);
  const [showHashes, setShowHashes] = useState(false);

  const handleCrack = () => {
    if (!hash) {
      setResult('Please enter a hash to crack.');
      return;
    }

    setIsCracking(true);
    setResult('');

    setTimeout(() => {
      for (const password of commonPasswords) {
        const calculatedHash = CryptoJS.MD5(password).toString();
        if (calculatedHash === hash) {
          setResult(`Password found: ${password}`);
          setIsCracking(false);
          return;
        }
      }

      setResult('Password not found in the common password list.');
      setIsCracking(false);
    }, 1000); 
  };

  return (
    <div className="w-full h-full flex flex-col text-white p-6">
      <h2 className="text-2xl font-bold mb-4">MD5 Cracker</h2>
      <p className="text-neutral-400 mb-4">This tool attempts to find the password for a given MD5 hash from a list of common passwords.</p>
      <div className="mb-4">
        <label htmlFor="hash-input" className="block text-sm font-medium text-neutral-400 mb-1">MD5 Hash to Crack</label>
        <input 
          type="text" 
          id="hash-input"
          value={hash}
          onChange={(e) => setHash(e.target.value)}
          className="w-full bg-neutral-800 rounded-md py-2 px-4 text-white"
          placeholder="Enter MD5 hash"
        />
      </div>
      <button 
        onClick={handleCrack}
        disabled={isCracking}
        className="bg-teal-400 py-2 px-4 rounded-lg text-black hover:bg-blue-700 transition-colors disabled:bg-neutral-600"
      >
        {isCracking ? 'Cracking...' : 'Crack Hash'}
      </button>
      {result && (
        <div className="mt-4 p-4 bg-neutral-800 rounded-lg">
          <p className='select-text'>{result}</p>
        </div>
      )}
    </div>
  );
}