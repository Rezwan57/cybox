'use client'

import React from 'react';

export default function CreateAStrongPassword() {
  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-4">Learning Module: Create a Strong Password</h1>
      <p className="mb-4">This module will guide you through the process of creating and managing strong, secure passwords to protect your online accounts.</p>

      <div className="mb-8 p-4 bg-neutral-800 rounded-lg">
        <h2 className="text-2xl font-semibold mb-3">Table of Contents</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><a href="#importance" className="text-teal-400 hover:underline">Importance of Strong Passwords</a></li>
          <li><a href="#characteristics" className="text-teal-400 hover:underline">Characteristics of a Strong Password</a></li>
          <li><a href="#tips" className="text-teal-400 hover:underline">Tips for Password Management</a></li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 id="importance" className="text-2xl font-semibold mb-3 border-b border-neutral-700 pb-2 text-teal-400">Importance of Strong Passwords</h2>
        <p className="text-neutral-400 mb-4">Passwords are the first line of defense against unauthorized access to your digital life. A weak password can be easily guessed or cracked by attackers, leading to compromised accounts, identity theft, and financial loss.</p>
      </div>

      <div className="mb-8">
        <h2 id="characteristics" className="text-2xl font-semibold mb-3 border-b border-neutral-700 pb-2 text-teal-400">Characteristics of a Strong Password</h2>
        <ul className="list-disc list-inside space-y-3">
          <li><strong>Length:</strong> Aim for at least 12-16 characters. Longer passwords are harder to crack.</li>
          <li><strong>Complexity:</strong> Use a mix of uppercase and lowercase letters, numbers, and special characters (e.g., !, @, #, $, %).</li>
          <li><strong>Uniqueness:</strong> Never reuse passwords across different accounts. If one account is compromised, others remain safe.</li>
          <li><strong>Unpredictability:</strong> Avoid using personal information (birthdays, names), common words, or sequential numbers/letters.</li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 id="tips" className="text-2xl font-semibold mb-3 border-b border-neutral-700 pb-2 text-teal-400">Tips for Password Management</h2>
        <ul className="list-disc list-inside space-y-3">
          <li><strong>Use a Password Manager:</strong> These tools securely store and generate complex passwords for you, requiring you to remember only one master password.</li>
          <li><strong>Enable Two-Factor Authentication (2FA):</strong> Adds an extra layer of security by requiring a second form of verification (e.g., a code from your phone) in addition to your password.</li>
          <li><strong>Regularly Update Passwords:</strong> Change your most important passwords periodically, especially if there's a security breach reported for a service you use.</li>
          <li><strong>Be Wary of Public Wi-Fi:</strong> Avoid logging into sensitive accounts on unsecured public Wi-Fi networks.</li>
        </ul>
      </div>

      <p className="text-neutral-300 mt-8">A strong password is your first and most important step towards digital security.</p>
    </div>
  );
}
