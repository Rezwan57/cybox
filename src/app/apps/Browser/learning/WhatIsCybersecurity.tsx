'use client'

import React from 'react';

export default function WhatIsCybersecurity() {
  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-4">Learning Module: What is Cybersecurity?</h1>
      <p className="mb-4">This module introduces the fundamental concepts of cybersecurity, providing a foundation for understanding digital security.</p>

      <div className="mb-8 p-4 bg-neutral-800 rounded-lg">
        <h2 className="text-2xl font-semibold mb-3">Table of Contents</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><a href="#intro" className="text-teal-400 hover:underline">Introduction to Cybersecurity</a></li>
          <li><a href="#cia" className="text-teal-400 hover:underline">The CIA Triad</a></li>
          <li><a href="#threats" className="text-teal-400 hover:underline">Common Cyber Threats</a></li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 id="intro" className="text-2xl font-semibold mb-3 border-b border-neutral-700 pb-2 text-teal-400">Introduction to Cybersecurity</h2>
        <p className="text-neutral-400 mb-4">Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. These attacks are usually aimed at accessing, changing, or destroying sensitive information; extorting money from users; or interrupting normal business processes.</p>
      </div>

      <div className="mb-8">
        <h2 id="cia" className="text-2xl font-semibold mb-3 border-b border-neutral-700 pb-2 text-teal-400">The CIA Triad</h2>
        <p className="text-neutral-400 mb-4">The CIA Triad is a model designed to guide policies for information security within an organization.</p>
        <ul className="list-disc list-inside space-y-3">
          <li><strong>Confidentiality:</strong> Ensuring that data is accessible only to those authorized to have access.</li>
          <li><strong>Integrity:</strong> Maintaining the consistency, accuracy, and trustworthiness of data over its entire lifecycle.</li>
          <li><strong>Availability:</strong> Ensuring that data is available when needed.</li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 id="threats" className="text-2xl font-semibold mb-3 border-b border-neutral-700 pb-2 text-teal-400">Common Cyber Threats</h2>
        <ul className="list-disc list-inside space-y-3">
          <li><strong>Malware:</strong> Malicious software including spyware, ransomware, viruses, and worms.</li>
          <li><strong>Phishing:</strong> The practice of sending fraudulent emails that resemble emails from reputable sources to steal sensitive data.</li>
          <li><strong>Man-in-the-Middle (MitM) Attack:</strong> Attackers intercept communication between two parties to steal information.</li>
          <li><strong>Denial-of-Service (DoS) Attack:</strong> Flooding a system with traffic to make it unavailable to users.</li>
        </ul>
      </div>

      <p className="text-neutral-300 mt-8">Understanding these basics is the first step to becoming a cybersecurity professional.</p>
    </div>
  );
}
