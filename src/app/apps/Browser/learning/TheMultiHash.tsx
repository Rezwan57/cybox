'use client'

import React from 'react';

export default function TheMultiHash() {
  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-4">Learning Module: The Multi-Hash</h1>
      <p className="mb-4">This module explores the concept of multi-hashing, a technique that involves applying multiple hashing algorithms sequentially or in combination to enhance data integrity and security.</p>

      <div className="mb-8 p-4 bg-neutral-800 rounded-lg">
        <h2 className="text-2xl font-semibold mb-3">Table of Contents</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><a href="#what-is-hashing" className="text-teal-400 hover:underline">What is Hashing?</a></li>
          <li><a href="#why-multi-hash" className="text-teal-400 hover:underline">Why Multi-Hash?</a></li>
          <li><a href="#how-it-works" className="text-teal-400 hover:underline">How Multi-Hashing Works</a></li>
          <li><a href="#game-context" className="text-teal-400 hover:underline">Multi-Hashing in Cybox</a></li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 id="what-is-hashing" className="text-2xl font-semibold mb-3 border-b border-neutral-700 pb-2 text-teal-400">What is Hashing?</h2>
        <p className="text-neutral-400 mb-4">Hashing is the process of transforming any given key or string of characters into another value. This is typically a shorter, fixed-length value or key that represents the original string. Hashing is used for data integrity verification, password storage, and more. Common hashing algorithms include MD5, SHA-1, SHA-256, and SHA-3.</p>
      </div>

      <div className="mb-8">
        <h2 id="why-multi-hash" className="text-2xl font-semibold mb-3 border-b border-neutral-700 pb-2 text-teal-400">Why Multi-Hash?</h2>
        <p className="text-neutral-400 mb-4">While single hashing algorithms are robust, some older ones have known vulnerabilities (e.g., collision attacks for MD5 and SHA-1). Multi-hashing enhances security by making it significantly harder for attackers to reverse-engineer or create collisions. Even if one algorithm is compromised, the others maintain the integrity of the hash.</p>
      </div>

      <div className="mb-8">
        <h2 id="how-it-works" className="text-2xl font-semibold mb-3 border-b border-neutral-700 pb-2 text-teal-400">How Multi-Hashing Works</h2>
        <p className="text-neutral-400 mb-4">Multi-hashing can be implemented in several ways:</p>
        <ul className="list-disc list-inside space-y-3">
          <li><strong>Sequential Hashing (Hashing the Hash):</strong> The output of one hash function becomes the input for the next. For example, <code>SHA256(MD5(data))</code>.</li>
          <li><strong>Concatenated Hashing:</strong> The outputs of multiple hash functions are combined (concatenated) to form a single, longer hash. For example, <code>MD5(data) + SHA256(data)</code>.</li>
          <li><strong>Parallel Hashing:</strong> Multiple hash functions are applied to the same data simultaneously, and their results are used independently or combined later.</li>
        </ul>
        <p className="text-neutral-400 mt-4">The choice of method depends on the specific security requirements and performance considerations.</p>
      </div>

      <div className="mb-8">
        <h2 id="game-context" className="text-2xl font-semibold mb-3 border-b border-neutral-700 pb-2 text-teal-400">Multi-Hashing in Cybox</h2>
        <p className="text-neutral-400 mb-4">In Cybox, multi-hashing is used in certain challenges to represent advanced data protection mechanisms. You might encounter scenarios where you need to:</p>
        <ul className="list-disc list-inside space-y-3">
          <li>Calculate a multi-hash of a given piece of data to verify its authenticity.</li>
          <li>Break a multi-hashed value, requiring you to understand the sequence or combination of algorithms used.</li>
          <li>Generate a multi-hash for a file or password to secure it within the game's simulated environment.</li>
        </ul>
        <p className="text-neutral-400 mt-4">Mastering multi-hashing concepts will be crucial for solving complex puzzles and progressing through higher levels in Cybox.</p>
      </div>

      <p className="text-neutral-300 mt-8">Multi-hashing adds a significant layer of complexity and security, making it a valuable technique in modern cybersecurity.</p>
    </div>
  );
}
