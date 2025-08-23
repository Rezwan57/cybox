'use client'
import React, { useState, useEffect } from 'react'
import { 
  FaUserShield, 
  FaWifi, 
  FaLock, 
  FaShieldAlt, 
  FaCogs, 
} from 'react-icons/fa'
import { invoke } from '@tauri-apps/api/core'
import { useAuth } from '@/Context/AuthContext'

// --- TypeScript Interfaces ---
interface Settings {
  user_id: number;
  two_fa: boolean;
  biometric_auth: boolean;
  session_timeout: string;
  login_attempts: string;
  firewall: boolean;
  vpn: boolean;
  usb_protection: boolean;
  email_filter: boolean;
  spoofed_mac: string;
  ip: string;
  dns: string;
  wifi: string;
  proxy_server: string;
  tor_enabled: boolean;
  port_scanning: boolean;
  sandbox_mode: boolean;
  honeypot: boolean;
  anti_forensics: boolean;
  crypto_mining: boolean;
  kernel_protection: boolean;
  memory_encryption: boolean;
  network_monitoring: boolean;
  keylogger_detection: boolean;
  behavior_analysis: boolean;
  traffic_analysis: boolean;
  evidence_collection: boolean;
  memory_dumps: boolean;
  disk_imaging: boolean;
  encryption_key: string;
  hash_algorithm: string;
}

const sections = ['System', 'Account', 'Network', 'Security'] as const
type Section = (typeof sections)[number]

export default function SettingsApp() {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState<Section>('System')
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      invoke<Settings>('get_settings', { userId: user.id })
        .then(setSettings)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleSettingChange = (key: keyof Settings, value: any) => {
    if (settings) {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      invoke('update_settings', { settings: newSettings }).catch(console.error);
    }
  };

  if (loading) {
    return <div>Loading...</div>
  }

  if (!settings) {
    return <div>Error: Settings not found</div>
  }

  return (
    <div className="flex w-full h-full overflow-hidden text-white">
      {/* Sidebar */}
      <aside className=" w-56 bg-neutral-800/30 p-3 m-2 rounded-xl space-y-2">
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold text-primary">Settings</h1>
        </div>
        {sections.map((sec) => (
          <button
            key={sec}
            onClick={() => setActiveSection(sec)}
            className={`w-full text-left px-3 py-2 rounded-md hover:bg-teal-900 hover:text-black transition-colors ${
              activeSection === sec ? 'bg-primary text-black font-bold' : 'text-gray-300'
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
              <FaCogs className="text-primary" /> System Overview
            </h2>
            <div className="flex flex-col gap-2 mb-2">
              <div className="bg-neutral-800/50 p-4 rounded-lg">
                <p className="text-primary font-semibold">OS Information</p>
                <p className="text-white">CyberOS v2.1.337</p>
                <p className="text-white">Kernel: Linux 6.2.0-cyber</p>
                <p className="text-white">Architecture: x86_64</p>
              </div>
              <div className="bg-neutral-800/50 p-4 rounded-lg">
                <p className="text-primary font-semibold">Device Status</p>
                <p className="text-white">Device ID: CYB-2331-ALPHA</p>
                <p className="text-white">Security Level: <span className="text-primary">MAXIMUM</span></p>
                <p className="text-white">Last Patch: 6 days ago</p>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'Account' && (
          <div>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <FaUserShield className="text-primary" /> Account Security
            </h2>
            <div className="space-y-2">
              <div className="bg-neutral-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-primary">Authentication</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Two-Factor Authentication</span>
                    <input
                      type="checkbox"
                      checked={settings.two_fa}
                      onChange={(e) => handleSettingChange('two_fa', e.target.checked)}
                      className="scale-125 accent-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Biometric Authentication</span>
                    <input
                      type="checkbox"
                      checked={settings.biometric_auth}
                      onChange={(e) => handleSettingChange('biometric_auth', e.target.checked)}
                      className="scale-125 accent-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Session Timeout (minutes)</span>
                    <select
                      value={settings.session_timeout}
                      onChange={(e) => handleSettingChange('session_timeout', e.target.value)}
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
                      value={settings.login_attempts}
                      onChange={(e) => handleSettingChange('login_attempts', e.target.value)}
                      className="bg-neutral-700 text-white px-2 py-1 rounded w-16"
                      min="1"
                      max="10"
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-neutral-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-primary">Actions</h3>
                <div className="space-y-2">
                  <button className="bg-neutral-600/50 text-white px-4 py-2 rounded hover:bg-teal-500 w-full cursor-pointer">
                    Change Master Password
                  </button>
                  <button className="bg-neutral-600/50 text-primary px-4 py-2 rounded hover:bg-teal-700 w-full cursor-pointer">
                    Generate Emergency Codes
                  </button>
                  <button className="text-teal-300 underline hover:text-primary">
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
              <FaWifi className="text-primary" /> Network & Internet
            </h2>
            <div className="flex flex-col gap-2">
              <div className="bg-neutral-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-primary">Connection Settings</h3>
                <div className="space-y-3">
                  <label className="block">
                    <span className="text-white mb-1 block">Connected Wi-Fi</span>
                    <select
                      value={settings.wifi}
                      onChange={(e) => handleSettingChange('wifi', e.target.value)}
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
                      value={settings.ip}
                      onChange={(e) => handleSettingChange('ip', e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-700 text-white rounded"
                    />
                  </label>

                  <label className="block">
                    <span className="text-white mb-1 block">DNS Server</span>
                    <input
                      value={settings.dns}
                      onChange={(e) => handleSettingChange('dns', e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-700 text-white rounded"
                    />
                  </label>

                  <label className="block">
                    <span className="text-white mb-1 block">Proxy Server</span>
                    <input
                      value={settings.proxy_server}
                      onChange={(e) => handleSettingChange('proxy_server', e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-700 text-white rounded"
                    />
                  </label>
                </div>
              </div>

              <div className="bg-neutral-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-primary">Security Features</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Enable VPN</span>
                    <input
                      type="checkbox"
                      checked={settings.vpn}
                      onChange={(e) => handleSettingChange('vpn', e.target.checked)}
                      className="scale-125 accent-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Tor Network</span>
                    <input
                      type="checkbox"
                      checked={settings.tor_enabled}
                      onChange={(e) => handleSettingChange('tor_enabled', e.target.checked)}
                      className="scale-125 accent-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Port Scanning Detection</span>
                    <input
                      type="checkbox"
                      checked={settings.port_scanning}
                      onChange={(e) => handleSettingChange('port_scanning', e.target.checked)}
                      className="scale-125 accent-primary"
                    />
                  </div>
                  <label className="block">
                    <span className="text-white mb-1 block">Spoofed MAC Address</span>
                    <input
                      value={settings.spoofed_mac}
                      onChange={(e) => handleSettingChange('spoofed_mac', e.target.value)}
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
              <FaShieldAlt className="text-primary" /> Security & Protection
            </h2>
            <div className="flex flex-col gap-2">
              <div className="bg-neutral-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-primary">Core Protection</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Firewall Protection</span>
                    <input
                      type="checkbox"
                      checked={settings.firewall}
                      onChange={(e) => handleSettingChange('firewall', e.target.checked)}
                      className="scale-125 accent-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">USB Device Protection</span>
                    <input
                      type="checkbox"
                      checked={settings.usb_protection}
                      onChange={(e) => handleSettingChange('usb_protection', e.target.checked)}
                      className="scale-125 accent-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Email Phishing Filter</span>
                    <input
                      type="checkbox"
                      checked={settings.email_filter}
                      onChange={(e) => handleSettingChange('email_filter', e.target.checked)}
                      className="scale-125 accent-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Kernel Protection</span>
                    <input
                      type="checkbox"
                      checked={settings.kernel_protection}
                      onChange={(e) => handleSettingChange('kernel_protection', e.target.checked)}
                      className="scale-125 accent-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-neutral-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-primary">Advanced Security</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Sandbox Mode</span>
                    <input
                      type="checkbox"
                      checked={settings.sandbox_mode}
                      onChange={(e) => handleSettingChange('sandbox_mode', e.target.checked)}
                      className="scale-125 accent-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Honeypot System</span>
                    <input
                      type="checkbox"
                      checked={settings.honeypot}
                      onChange={(e) => handleSettingChange('honeypot', e.target.checked)}
                      className="scale-125 accent-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Memory Encryption</span>
                    <input
                      type="checkbox"
                      checked={settings.memory_encryption}
                      onChange={(e) => handleSettingChange('memory_encryption', e.target.checked)}
                      className="scale-125 accent-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Anti-Forensics Mode</span>
                    <input
                      type="checkbox"
                      checked={settings.anti_forensics}
                      onChange={(e) => handleSettingChange('anti_forensics', e.target.checked)}
                      className="scale-125 accent-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-2 bg-neutral-800/50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-primary">Encryption Settings</h3>
              <div className="grid grid-cols-1 gap-4">
                <label className="block">
                  <span className="text-white mb-1 block">Encryption Algorithm</span>
                  <select
                    value={settings.encryption_key}
                    onChange={(e) => handleSettingChange('encryption_key', e.target.value)}
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
                    value={settings.hash_algorithm}
                    onChange={(e) => handleSettingChange('hash_algorithm', e.target.value)}
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
      </main>
    </div>
  )
}