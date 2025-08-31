'use client'

import React from 'react';

export default function SpottingEmails() {
  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-4">Learning Module: Spotting Phishing Emails</h1>
      <p className="mb-4">Learn to identify and avoid phishing attempts, a common cyber threat.</p>

      <div className="mb-8 p-4 bg-neutral-800 rounded-lg">
        <h2 className="text-2xl font-semibold mb-3">Table of Contents</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><a href="#what-is-phishing" className="text-teal-400 hover:underline">What is Phishing?</a></li>
          <li><a href="#phishing-vs-spam" className="text-teal-400 hover:underline">Phishing vs. Spam</a></li>
          <li><a href="#red-flags" className="text-teal-400 hover:underline">Common Red Flags</a></li>
          <li><a href="#what-to-do" className="text-teal-400 hover:underline">What to Do</a></li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 id="what-is-phishing" className="text-2xl font-semibold mb-3 border-b border-neutral-700 pb-2 text-teal-400">What is Phishing?</h2>
        <p className="text-neutral-400 mb-4">Phishing is a social engineering attack where attackers impersonate trusted entities to trick you into revealing sensitive information like login credentials or credit card numbers.</p>
      </div>

      <div className="mb-8">
        <h2 id="phishing-vs-spam" className="text-2xl font-semibold mb-3 border-b border-neutral-700 pb-2 text-teal-400">Phishing vs. Spam</h2>
        <p className="text-neutral-400 mb-4">While both are unsolicited emails, their intent differs:</p>
        <ul className="list-disc list-inside space-y-3">
          <li><strong>Phishing:</strong> Malicious intent to steal data or gain unauthorized access. Often highly targeted and deceptive.</li>
          <li><strong>Spam:</strong> Unsolicited commercial messages, usually harmless but annoying. Focuses on advertising or promotions.</li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 id="red-flags" className="text-2xl font-semibold mb-3 border-b border-neutral-700 pb-2 text-teal-400">Common Red Flags in Phishing Emails</h2>
        <ul className="list-disc list-inside space-y-3">
          <li><strong>Suspicious Sender:</strong> Mismatched or slightly off email addresses.</li>
          <li><strong>Generic Greetings:</strong> "Dear Customer" instead of your name.</li>
          <li><strong>Urgency/Threats:</strong> Demands immediate action or warns of negative consequences.</li>
          <li><strong>Poor Grammar/Spelling:</strong> Indicates unprofessionalism, a common phishing trait.</li>
          <li><strong>Suspicious Links:</strong> Hover to check URL; don't click if it looks wrong.</li>
          <li><strong>Unexpected Attachments:</strong> Be wary of unsolicited files, especially executables.</li>
          <li><strong>Requests for Personal Info:</strong> Legitimate companies rarely ask for sensitive data via email.</li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 id="what-to-do" className="text-2xl font-semibold mb-3 border-b border-neutral-700 pb-2 text-teal-400">What to Do if You Suspect Phishing</h2>
        <ul className="list-disc list-inside space-y-3">
          <li><strong>Do NOT Click/Open:</strong> Avoid links or attachments.</li>
          <li><strong>Verify Sender:</strong> Contact the organization directly using official channels.</li>
          <li><strong>Report It:</strong> Use your email provider's phishing report feature.</li>
          <li><strong>Delete:</strong> Remove the email from your inbox.</li>
        </ul>
      </div>

      <p className="text-neutral-300 mt-8">Vigilance and knowing these red flags protect you from scams.</p>
    </div>
  );
}