'use client'

import React from 'react';

export default function ConsoleTechniquesPage() {
  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-4">Learning Module: Console Techniques</h1>
      <p className="mb-4">This module will teach you how to use various commands in the Console app. Mastering these is key to progressing through the levels.</p>

      <div className="mb-8 p-4 bg-neutral-800 rounded-lg">
        <h2 className="text-2xl font-semibold mb-3">Table of Contents</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><a href="#crypto" className="text-teal-400 hover:underline">Cryptography</a></li>
          <li><a href="#net-analysis" className="text-teal-400 hover:underline">Network Analysis & Reconnaissance</a></li>
          <li><a href="#sys-config" className="text-teal-400 hover:underline">System & Configuration</a></li>
        </ul>
      </div>

      {/* Cryptography Section */}
      <div className="mb-8">
        <h2 id="crypto" className="text-2xl font-semibold mb-3 border-b border-neutral-700 pb-2 text-teal-400">Cryptography</h2>
        <p className="text-neutral-400 mb-4">Commands related to encryption, decryption, and hashing.</p>

        <h3 className="text-xl font-semibold mb-2">'encrypt' Command</h3>
        <p className="mb-4">The Console app provides an 'encrypt' command to simulate file encryption. This is crucial for protecting sensitive data.</p>
        <h4 className="font-semibold mb-2">Command Syntax:</h4>
        <pre className="bg-neutral-800 p-3 rounded-md mb-4 text-sm">
          encrypt &lt;file_path&gt; --password &lt;password&gt;
        </pre>
        <ul className="list-disc list-inside mb-4">
          <li><code>&lt;file_path&gt;</code>: The full path to the file you want to encrypt.</li>
          <li><code>--password &lt;password&gt;</code>: The password to use for encryption. This is a required flag.</li>
        </ul>
        <h4 className="font-semibold mb-2">Example for Level 5:</h4>
        <p className="mb-4">For Level 5, you need to encrypt the file located at <code>/home/user/sensitive_data.txt</code> using the password <code>secret123</code>.</p>
        <pre className="bg-neutral-800 p-3 rounded-md mb-4 text-sm">
          encrypt /home/user/sensitive_data.txt --password secret123
        </pre>

        <h3 className="text-xl font-semibold mb-2 mt-6">'hash' Command</h3>
        <p className="mb-4">The Console app provides a 'hash' command to generate SHA256 hashes of text. This is useful for verifying data integrity.</p>
        <h4 className="font-semibold mb-2">Command Syntax:</h4>
        <pre className="bg-neutral-800 p-3 rounded-md mb-4 text-sm">
          hash &lt;text&gt;
        </pre>
        <ul className="list-disc list-inside mb-4">
          <li><code>&lt;text&gt;</code>: The string you want to hash.</li>
        </ul>
        <h4 className="font-semibold mb-2">Example:</h4>
        <pre className="bg-neutral-800 p-3 rounded-md mb-4 text-sm">
          hash mysecretpassword
        </pre>
      </div>

      {/* Network Analysis & Reconnaissance Section */}
      <div className="mb-8">
        <h2 id="net-analysis" className="text-2xl font-semibold mb-3 border-b border-neutral-700 pb-2 text-teal-400">Network Analysis & Reconnaissance</h2>
        <p className="text-neutral-400 mb-4">Commands for scanning networks, identifying hosts, and gathering information.</p>

        <h3 className="text-xl font-semibold mb-2">'nmap' Command</h3>
        <p className="mb-4">The 'nmap' command simulates port scanning on a given host, helping to identify open ports and services.</p>
        <h4 className="font-semibold mb-2">Command Syntax:</h4>
        <pre className="bg-neutral-800 p-3 rounded-md mb-4 text-sm">
          nmap &lt;host&gt;
        </pre>
        <ul className="list-disc list-inside mb-4">
          <li><code>&lt;host&gt;</code>: The target IP address or hostname.</li>
        </ul>
        <h4 className="font-semibold mb-2">Example:</h4>
        <pre className="bg-neutral-800 p-3 rounded-md mb-4 text-sm">
          nmap 192.168.1.1
        </pre>

        <h3 className="text-xl font-semibold mb-2 mt-6">'ping' Command</h3>
        <p className="mb-4">The 'ping' command simulates sending ICMP echo requests to a host to test network connectivity and measure response time.</p>
        <h4 className="font-semibold mb-2">Command Syntax:</h4>
        <pre className="bg-neutral-800 p-3 rounded-md mb-4 text-sm">
          ping &lt;host&gt;
        </pre>
        <ul className="list-disc list-inside mb-4">
          <li><code>&lt;host&gt;</code>: The target IP address or hostname.</li>
        </ul>
        <h4 className="font-semibold mb-2">Example:</h4>
        <pre className="bg-neutral-800 p-3 rounded-md mb-4 text-sm">
          ping google.com
        </pre>

        <h3 className="text-xl font-semibold mb-2 mt-6">'traceroute' Command</h3>
        <p className="mb-4">The 'traceroute' command simulates tracing the network path to a destination, showing the hops (routers) along the way.</p>
        <h4 className="font-semibold mb-2">Command Syntax:</h4>
        <pre className="bg-neutral-800 p-3 rounded-md mb-4 text-sm">
          traceroute &lt;host&gt;
        </pre>
        <ul className="list-disc list-inside mb-4">
          <li><code>&lt;host&gt;</code>: The target IP address or hostname.</li>
        </ul>
        <h4 className="font-semibold mb-2">Example:</h4>
        <pre className="bg-neutral-800 p-3 rounded-md mb-4 text-sm">
          traceroute example.com
        </pre>

        <h3 className="text-xl font-semibold mb-2 mt-6">'netstat' Command</h3>
        <p className="mb-4">The 'netstat' command displays active network connections and listening ports on the system.</p>
        <h4 className="font-semibold mb-2">Command Syntax:</h4>
        <pre className="bg-neutral-800 p-3 rounded-md mb-4 text-sm">
          netstat
        </pre>
        <ul className="list-disc list-inside mb-4">
          <li>(No arguments)</li>
        </ul>
        <h4 className="font-semibold mb-2">Example:</h4>
        <pre className="bg-neutral-800 p-3 rounded-md mb-4 text-sm">
          netstat
        </pre>

        <h3 className="text-xl font-semibold mb-2 mt-6">'nslookup' Command</h3>
        <p className="mb-4">The 'nslookup' command simulates querying DNS servers to obtain domain name or IP address mapping.</p>
        <h4 className="font-semibold mb-2">Command Syntax:</h4>
        <pre className="bg-neutral-800 p-3 rounded-md mb-4 text-sm">
          nslookup &lt;domain&gt;
        </pre>
        <ul className="list-disc list-inside mb-4">
          <li><code>&lt;domain&gt;</code>: The domain name to look up.</li>
        </ul>
        <h4 className="font-semibold mb-2">Example:</h4>
        <pre className="bg-neutral-800 p-3 rounded-md mb-4 text-sm">
          nslookup cybox.com
        </pre>

        <h3 className="text-xl font-semibold mb-2 mt-6">'whois' Command</h3>
        <p className="mb-4">The 'whois' command simulates performing a WHOIS lookup to retrieve registration information for a domain name.</p>
        <h4 className="font-semibold mb-2">Command Syntax:</h4>
        <pre className="bg-neutral-800 p-3 rounded-md mb-4 text-sm">
          whois &lt;domain&gt;
        </pre>
        <ul className="list-disc list-inside mb-4">
          <li><code>&lt;domain&gt;</code>: The domain name to query.</li>
        </ul>
        <h4 className="font-semibold mb-2">Example:</h4>
        <pre className="bg-neutral-800 p-3 rounded-md mb-4 text-sm">
          whois example.org
        </pre>
      </div>

      {/* System & Configuration Section */}
      <div className="mb-8">
        <h2 id="sys-config" className="text-2xl font-semibold mb-3 border-b border-neutral-700 pb-2 text-teal-400">System & Configuration</h2>
        <p className="text-neutral-400 mb-4">Commands for managing system settings and network configuration.</p>

        <h3 className="text-xl font-semibold mb-2">'firewall' Command</h3>
        <p className="mb-4">The 'firewall' command allows you to manage simulated firewall rules, including listing, adding, and removing rules.</p>
        <h4 className="font-semibold mb-2">Command Syntax:</h4>
        <pre className="bg-neutral-800 p-3 rounded-md mb-4 text-sm">
          firewall list
          firewall add &lt;rule&gt;
          firewall remove &lt;rule&gt;
        </pre>
        <ul className="list-disc list-inside mb-4">
          <li><code>&lt;rule&gt;</code>: The firewall rule to add or remove (e.g., "block 80/tcp").</li>
        </ul>
        <h4 className="font-semibold mb-2">Example:</h4>
        <pre className="bg-neutral-800 p-3 rounded-md mb-4 text-sm">
          firewall list
          firewall add "allow 22/tcp"
          firewall remove "allow 22/tcp"
        </pre>

        <h3 className="text-xl font-semibold mb-2 mt-6">'ipconfig' Command</h3>
        <p className="mb-4">The 'ipconfig' command displays network configuration details, such as IP address, subnet mask, and default gateway.</p>
        <h4 className="font-semibold mb-2">Command Syntax:</h4>
        <pre className="bg-neutral-800 p-3 rounded-md mb-4 text-sm">
          ipconfig
        </pre>
        <ul className="list-disc list-inside mb-4">
          <li>(No arguments)</li>
        </ul>
        <h4 className="font-semibold mb-2">Example:</h4>
        <pre className="bg-neutral-800 p-3 rounded-md mb-4 text-sm">
          ipconfig
        </pre>
      </div>

      <p className="text-neutral-300 mt-8">Remember, in a real-world scenario, these commands are fundamental tools for cybersecurity professionals. Practice them to enhance your skills!</p>
    </div>
  );
}
