'use client'
import React, { useState } from 'react'
import { 
  FaUserShield, 
  FaWifi, 
  FaLock, 
  FaShieldAlt, 
  FaCogs, 
  FaEye,
  FaDatabase,
  FaTerminal,
  FaBug,
  FaNetworkWired,
  FaExclamationTriangle,
  FaUserSecret,
  FaKey,
  FaSkull
} from 'react-icons/fa'

const sections = ['System', 'Account', 'Network', 'Security', 'Monitoring', 'Forensics', 'Advanced'] as const
type Section = (typeof sections)[number]

export default function SettingsApp() {
  const [activeSection, setActiveSection] = useState<Section>('System')
  
  // Account Security
  const [twoFA, setTwoFA] = useState(false)
  const [biometricAuth, setBiometricAuth] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState('30')
  const [loginAttempts, setLoginAttempts] = useState('3')
  
  // Network & Security
  const [firewall, setFirewall] = useState(true)
  const [vpn, setVPN] = useState(false)
  const [usbProtection, setUsbProtection] = useState(true)
  const [emailFilter, setEmailFilter] = useState(true)
  const [spoofedMac, setSpoofedMac] = useState('00:1B:44:11:3A:B7')
  const [ip, setIP] = useState('192.168.0.101')
  const [dns, setDNS] = useState('8.8.8.8')
  const [wifi, setWifi] = useState('CyberNet_WPA2')
  const [proxyServer, setProxyServer] = useState('127.0.0.1:8080')
  const [torEnabled, setTorEnabled] = useState(false)
  const [portScanning, setPortScanning] = useState(false)
  
  // Advanced Security
  const [sandboxMode, setSandboxMode] = useState(false)
  const [honeypot, setHoneypot] = useState(true)
  const [antiForensics, setAntiForensics] = useState(false)
  const [cryptoMining, setCryptoMining] = useState(false)
  const [kernelProtection, setKernelProtection] = useState(true)
  const [memoryEncryption, setMemoryEncryption] = useState(false)
  
  // Monitoring
  const [networkMonitoring, setNetworkMonitoring] = useState(true)
  const [keyloggerDetection, setKeyloggerDetection] = useState(true)
  const [behaviorAnalysis, setBehaviorAnalysis] = useState(false)
  const [trafficAnalysis, setTrafficAnalysis] = useState(true)
  
  // Forensics
  const [evidenceCollection, setEvidenceCollection] = useState(false)
  const [memoryDumps, setMemoryDumps] = useState(false)
  const [diskImaging, setDiskImaging] = useState(false)
  
  const [encryptionKey, setEncryptionKey] = useState('AES-256-GCM')
  const [hashAlgorithm, setHashAlgorithm] = useState('SHA-256')

  return (
    <div className="flex w-full h-full overflow-hidden text-white">
      {/* Sidebar */}
      <aside className=" w-56 bg-neutral-800/30 p-3 m-2 rounded-xl space-y-2">
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold text-green-400">Settings</h1>
        </div>
        {sections.map((sec) => (
          <button
            key={sec}
            onClick={() => setActiveSection(sec)}
            className={`w-full text-left px-3 py-2 rounded-md hover:bg-green-900 hover:text-black transition-colors ${
              activeSection === sec ? 'bg-green-400 text-black font-bold' : 'text-gray-300'
            }`}
          >
            {sec}
          </button>
        ))}
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-6 overflow-y-auto">
        {activeSection === 'System' && (
          <div>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <FaCogs className="text-green-400" /> System Overview
            </h2>
            <div className="flex flex-col gap-2 mb-2">
              <div className="bg-neutral-800/50 p-4 rounded-lg">
                <p className="text-green-400 font-semibold">OS Information</p>
                <p className="text-white">CyberOS v2.1.337</p>
                <p className="text-white">Kernel: Linux 6.2.0-cyber</p>
                <p className="text-white">Architecture: x86_64</p>
              </div>
              <div className="bg-neutral-800/50 p-4 rounded-lg">
                <p className="text-green-400 font-semibold">Device Status</p>
                <p className="text-white">Device ID: CYB-2331-ALPHA</p>
                <p className="text-white">Security Level: <span className="text-green-400">MAXIMUM</span></p>
                <p className="text-white">Last Patch: 6 days ago</p>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'Account' && (
          <div>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <FaUserShield className="text-green-400" /> Account Security
            </h2>
            <div className="space-y-2">
              <div className="bg-neutral-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-green-400">Authentication</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Two-Factor Authentication</span>
                    <input
                      type="checkbox"
                      checked={twoFA}
                      onChange={() => setTwoFA(!twoFA)}
                      className="scale-125 accent-green-400"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Biometric Authentication</span>
                    <input
                      type="checkbox"
                      checked={biometricAuth}
                      onChange={() => setBiometricAuth(!biometricAuth)}
                      className="scale-125 accent-green-400"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Session Timeout (minutes)</span>
                    <select
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(e.target.value)}
                      className="bg-neutral-700 text-white px-2 py-1 rounded"
                    >
                      <option value="15">15</option>
                      <option value="30">30</option>
                      <option value="60">60</option>
                      <option value="120">120</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Max Login Attempts</span>
                    <input
                      type="number"
                      value={loginAttempts}
                      onChange={(e) => setLoginAttempts(e.target.value)}
                      className="bg-neutral-700 text-white px-2 py-1 rounded w-16"
                      min="1"
                      max="10"
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-neutral-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-green-400">Actions</h3>
                <div className="space-y-2">
                  <button className="bg-neutral-600/50 text-white px-4 py-2 rounded hover:bg-green-500 w-full cursor-pointer">
                    Change Master Password
                  </button>
                  <button className="bg-neutral-600/50 text-green-400 px-4 py-2 rounded hover:bg-green-700 w-full cursor-pointer">
                    Generate Emergency Codes
                  </button>
                  <button className="text-green-300 underline hover:text-green-400">
                    View Login History & Failed Attempts
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'Network' && (
          <div>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <FaWifi className="text-green-400" /> Network & Internet
            </h2>
            <div className="flex flex-col gap-2">
              <div className="bg-neutral-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-green-400">Connection Settings</h3>
                <div className="space-y-3">
                  <label className="block">
                    <span className="text-white mb-1 block">Connected Wi-Fi</span>
                    <select
                      value={wifi}
                      onChange={(e) => setWifi(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-700 text-white rounded"
                    >
                      <option>CyberNet_WPA2</option>
                      <option>FreePublicWiFi</option>
                      <option>School_Lab_VPN</option>
                      <option>HackNet_X</option>
                      <option>DarkWeb_Gateway</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-white mb-1 block">IP Address</span>
                    <input
                      value={ip}
                      onChange={(e) => setIP(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-700 text-white rounded"
                    />
                  </label>

                  <label className="block">
                    <span className="text-white mb-1 block">DNS Server</span>
                    <input
                      value={dns}
                      onChange={(e) => setDNS(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-700 text-white rounded"
                    />
                  </label>

                  <label className="block">
                    <span className="text-white mb-1 block">Proxy Server</span>
                    <input
                      value={proxyServer}
                      onChange={(e) => setProxyServer(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-700 text-white rounded"
                    />
                  </label>
                </div>
              </div>

              <div className="bg-neutral-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-green-400">Security Features</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Enable VPN</span>
                    <input
                      type="checkbox"
                      checked={vpn}
                      onChange={() => setVPN(!vpn)}
                      className="scale-125 accent-green-400"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Tor Network</span>
                    <input
                      type="checkbox"
                      checked={torEnabled}
                      onChange={() => setTorEnabled(!torEnabled)}
                      className="scale-125 accent-green-400"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Port Scanning Detection</span>
                    <input
                      type="checkbox"
                      checked={portScanning}
                      onChange={() => setPortScanning(!portScanning)}
                      className="scale-125 accent-green-400"
                    />
                  </div>
                  <label className="block">
                    <span className="text-white mb-1 block">Spoofed MAC Address</span>
                    <input
                      value={spoofedMac}
                      onChange={(e) => setSpoofedMac(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-700 text-white rounded"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'Security' && (
          <div>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <FaShieldAlt className="text-green-400" /> Security & Protection
            </h2>
            <div className="flex flex-col gap-2">
              <div className="bg-neutral-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-green-400">Core Protection</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Firewall Protection</span>
                    <input
                      type="checkbox"
                      checked={firewall}
                      onChange={() => setFirewall(!firewall)}
                      className="scale-125 accent-green-400"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">USB Device Protection</span>
                    <input
                      type="checkbox"
                      checked={usbProtection}
                      onChange={() => setUsbProtection(!usbProtection)}
                      className="scale-125 accent-green-400"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Email Phishing Filter</span>
                    <input
                      type="checkbox"
                      checked={emailFilter}
                      onChange={() => setEmailFilter(!emailFilter)}
                      className="scale-125 accent-green-400"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Kernel Protection</span>
                    <input
                      type="checkbox"
                      checked={kernelProtection}
                      onChange={() => setKernelProtection(!kernelProtection)}
                      className="scale-125 accent-green-400"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-neutral-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-green-400">Advanced Security</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Sandbox Mode</span>
                    <input
                      type="checkbox"
                      checked={sandboxMode}
                      onChange={() => setSandboxMode(!sandboxMode)}
                      className="scale-125 accent-green-400"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Honeypot System</span>
                    <input
                      type="checkbox"
                      checked={honeypot}
                      onChange={() => setHoneypot(!honeypot)}
                      className="scale-125 accent-green-400"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Memory Encryption</span>
                    <input
                      type="checkbox"
                      checked={memoryEncryption}
                      onChange={() => setMemoryEncryption(!memoryEncryption)}
                      className="scale-125 accent-green-400"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Anti-Forensics Mode</span>
                    <input
                      type="checkbox"
                      checked={antiForensics}
                      onChange={() => setAntiForensics(!antiForensics)}
                      className="scale-125 accent-green-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-2 bg-neutral-800/50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-green-400">Encryption Settings</h3>
              <div className="grid grid-cols-1 gap-4">
                <label className="block">
                  <span className="text-white mb-1 block">Encryption Algorithm</span>
                  <select
                    value={encryptionKey}
                    onChange={(e) => setEncryptionKey(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-700 text-white rounded"
                  >
                    <option>AES-256-GCM</option>
                    <option>AES-128-CBC</option>
                    <option>ChaCha20-Poly1305</option>
                    <option>Blowfish</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-white mb-1 block">Hash Algorithm</span>
                  <select
                    value={hashAlgorithm}
                    onChange={(e) => setHashAlgorithm(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-700 text-white rounded"
                  >
                    <option>SHA-256</option>
                    <option>SHA-3</option>
                    <option>Blake2b</option>
                    <option>MD5</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'Monitoring' && (
          <div>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <FaEye className="text-green-400" /> System Monitoring
            </h2>
            <div className="grid grid-cols-1 gap-2">
              <div className="bg-neutral-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-green-400">Real-time Monitoring</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Network Traffic Analysis</span>
                    <input
                      type="checkbox"
                      checked={trafficAnalysis}
                      onChange={() => setTrafficAnalysis(!trafficAnalysis)}
                      className="scale-125 accent-green-400"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Keylogger Detection</span>
                    <input
                      type="checkbox"
                      checked={keyloggerDetection}
                      onChange={() => setKeyloggerDetection(!keyloggerDetection)}
                      className="scale-125 accent-green-400"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Behavioral Analysis</span>
                    <input
                      type="checkbox"
                      checked={behaviorAnalysis}
                      onChange={() => setBehaviorAnalysis(!behaviorAnalysis)}
                      className="scale-125 accent-green-400"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Network Monitoring</span>
                    <input
                      type="checkbox"
                      checked={networkMonitoring}
                      onChange={() => setNetworkMonitoring(!networkMonitoring)}
                      className="scale-125 accent-green-400"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-neutral-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-green-400">Threat Detection</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white">Malware Threats:</span>
                    <span className="text-green-400">0 detected</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white">Suspicious Network Activity:</span>
                    <span className="text-yellow-400">2 flagged</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white">Failed Login Attempts:</span>
                    <span className="text-red-400">7 blocked</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white">Port Scan Attempts:</span>
                    <span className="text-red-400">3 blocked</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-2 bg-neutral-800/50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-green-400">Quick Actions</h3>
              <div className="grid grid-cols-3 gap-2">
                <button className="bg-neutral-600/50 text-white px-3 py-2 rounded hover:bg-blue-700">
                  View Live Logs
                </button>
                <button className="bg-neutral-600/50 text-white px-3 py-2 rounded hover:bg-yellow-700">
                  Generate Report
                </button>
                <button className="bg-neutral-600/50 text-white px-3 py-2 rounded hover:bg-red-700">
                  Emergency Lock
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'Forensics' && (
          <div>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <FaDatabase className="text-green-400" /> Digital Forensics
            </h2>
            <div className="grid grid-cols-1 gap-2">
              <div className="bg-neutral-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-green-400">Evidence Collection</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Auto Evidence Collection</span>
                    <input
                      type="checkbox"
                      checked={evidenceCollection}
                      onChange={() => setEvidenceCollection(!evidenceCollection)}
                      className="scale-125 accent-green-400"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Memory Dumps</span>
                    <input
                      type="checkbox"
                      checked={memoryDumps}
                      onChange={() => setMemoryDumps(!memoryDumps)}
                      className="scale-125 accent-green-400"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Disk Imaging</span>
                    <input
                      type="checkbox"
                      checked={diskImaging}
                      onChange={() => setDiskImaging(!diskImaging)}
                      className="scale-125 accent-green-400"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-neutral-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-green-400">Forensic Tools</h3>
                <div className="space-y-2">
                  <button className="w-full bg-neutral-600/50 text-white px-3 py-2 rounded hover:bg-purple-700">
                    Network Packet Analysis
                  </button>
                  <button className="w-full bg-neutral-600/50 text-white px-3 py-2 rounded hover:bg-purple-700">
                    File System Analysis
                  </button>
                  <button className="w-full bg-neutral-600/50 text-white px-3 py-2 rounded hover:bg-purple-700">
                    Registry Analysis
                  </button>
                  <button className="w-full bg-neutral-600/50 text-white px-3 py-2 rounded hover:bg-purple-700">
                    Timeline Reconstruction
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'Advanced' && (
          <div>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <FaLock className="text-green-400" /> Advanced Settings
            </h2>
            <div className="bg-neutral-800/50 p-4 rounded-lg mb-2">
              <h3 className="text-lg font-semibold mb-3 text-red-400 flex items-center gap-2">
                <FaExclamationTriangle /> Dangerous Operations
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white">Crypto Mining Detection</span>
                  <input
                    type="checkbox"
                    checked={cryptoMining}
                    onChange={() => setCryptoMining(!cryptoMining)}
                    className="scale-125 accent-red-400"
                  />
                </div>
                <button className="w-full bg-neutral-600/50 text-white px-3 py-2 rounded hover:bg-red-700">
                  Run Fake Ransomware Simulator
                </button>
                <button className="w-full bg-neutral-600/50 text-white px-3 py-2 rounded hover:bg-red-700">
                  Launch Penetration Test
                </button>
              </div>
            </div>

            <div className="bg-neutral-800/50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-green-400">System Commands</h3>
              <ul className="text-white text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <FaTerminal className="text-green-400" />
                  Run Background Surveillance Scripts
                </li>
                <li className="flex items-center gap-2">
                  <FaNetworkWired className="text-blue-400" />
                  Block Unknown Incoming Ports
                </li>
                <li className="flex items-center gap-2">
                  <FaUserSecret className="text-purple-400" />
                  Custom DNS Routing Rules
                </li>
                <li className="flex items-center gap-2">
                  <FaKey className="text-yellow-400" />
                  Generate Cryptographic Keys
                </li>
                <li className="flex items-center gap-2">
                  <FaBug className="text-red-400" />
                  Enable Debug Mode
                </li>
                <li className="flex items-center gap-2">
                  <FaSkull className="text-red-500" />
                  Activate Steganography Tools
                </li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}