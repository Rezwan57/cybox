'use client'
import React, { useState, useEffect, useMemo } from 'react'
import {
  FaUserShield, 
  FaWifi, 
  FaLock, 
  FaShieldAlt, 
  FaCogs, 
} from 'react-icons/fa'
import { invoke } from '@tauri-apps/api/core'
import { useAuth, Service } from '@/Context/AuthContext'

// --- Components ---
const Switch = ({ checked, onChange }: { checked: boolean, onChange: (checked: boolean) => void }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none ${
      checked ? 'bg-primary' : 'bg-neutral-600'
    }`}
  >
    <span
      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);


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

const PasswordStrengthIndicator = ({ password }: { password: string }) => {
  const checks = [
    { label: "At least 12 characters", regex: /.{12,}/ },
    { label: "An uppercase letter", regex: /[A-Z]/ },
    { label: "A lowercase letter", regex: /[a-z]/ },
    { label: "A number", regex: /\d/ },
    { label: "A symbol", regex: /\W/ },
  ];

  return (
    <div className="mt-4 space-y-1">
      {checks.map((check, index) => (
        <div key={index} className="flex items-center text-sm">
          <span className={check.regex.test(password) ? "text-green-500" : "text-red-500"}>
            {check.regex.test(password) ? "✓" : "✗"}
          </span>
          <span className="ml-2 text-neutral-300">{check.label}</span>
        </div>
      ))}
    </div>
  );
};

const ChangePasswordModal = ({
  isOpen,
  onClose,
  username,
}: {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}) => {
  const { user } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isPasswordStrong = (password: string) => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSymbol = /\W/.test(password);
    return password.length >= 12 && hasUppercase && hasLowercase && hasDigit && hasSymbol;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (!isPasswordStrong(newPassword)) {
      setError("Password is not strong enough. Please meet all the requirements.");
      return;
    }

    try {
      const result = await invoke("change_password", {
        name: username,
        oldPassword,
        newPassword,
      });
      setSuccess(result as string);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      if (user) {
        invoke("complete_task", { taskId: 2, userId: user.id });
      }
    } catch (err) {
      setError(err as string);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-neutral-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Change Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Old Password"
              className="w-full p-2 rounded-md border border-neutral-700 bg-neutral-900 text-white"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="w-full p-2 rounded-md border border-neutral-700 bg-neutral-900 text-white"
            />
            <PasswordStrengthIndicator password={newPassword} />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm New Password"
              className="w-full p-2 rounded-md border border-neutral-700 bg-neutral-900 text-white"
            />
          </div>
          {error && <p className="text-red-500 mt-4">{error}</p>}
          {success && <p className="text-green-500 mt-4">{success}</p>}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-neutral-600 text-white px-4 py-2 rounded hover:bg-neutral-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary text-black px-4 py-2 rounded hover:bg-teal-500"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function SettingsApp() {
  const { user, purchasedServices } = useAuth()
  const [activeSection, setActiveSection] = useState<Section>('Security')
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true);
  const [serviceStatus, setServiceStatus] = useState<{[key: number]: boolean}>({});
  const [isChangePasswordModalOpen, setChangePasswordModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      invoke<Settings>('get_settings', { userId: user.id })
        .then(setSettings)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  // Initialize service statuses
  useEffect(() => {
    const initialStatuses: {[key: number]: boolean} = {};
    purchasedServices.forEach(service => {
      // In a real app, you would fetch this from the backend
      initialStatuses[service.id] = true; // Default to enabled
    });
    setServiceStatus(initialStatuses);
  }, [purchasedServices]);

  const handleSettingChange = (key: keyof Settings, value: any) => {
    if (settings) {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      invoke('update_settings', { settings: newSettings }).catch(console.error);
    }
  };

  const handleServiceStatusChange = (serviceId: number, isEnabled: boolean) => {
    setServiceStatus(prev => ({ ...prev, [serviceId]: isEnabled }));
    // Here you would invoke a backend call to persist the setting
    // invoke('set_service_status', { userId: user.id, serviceId, isEnabled }).catch(console.error);
    console.log(`Service ${serviceId} status changed to: ${isEnabled}`);
  };

  const securityServices = useMemo(() => {
      return purchasedServices.filter(s => s.category === 'Security' || s.category === 'Antivirus');
  }, [purchasedServices]);

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
                    <Switch checked={settings.two_fa} onChange={(val) => handleSettingChange('two_fa', val)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Biometric Authentication</span>
                    <Switch checked={settings.biometric_auth} onChange={(val) => handleSettingChange('biometric_auth', val)} />
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
                  <button
                    onClick={() => setChangePasswordModalOpen(true)}
                    className="bg-neutral-600/50 text-white px-4 py-2 rounded hover:bg-teal-500 w-full cursor-pointer"
                  >
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
                    <Switch checked={settings.vpn} onChange={(val) => handleSettingChange('vpn', val)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Tor Network</span>
                    <Switch checked={settings.tor_enabled} onChange={(val) => handleSettingChange('tor_enabled', val)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Port Scanning Detection</span>
                    <Switch checked={settings.port_scanning} onChange={(val) => handleSettingChange('port_scanning', val)} />
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
                    <Switch checked={settings.firewall} onChange={(val) => handleSettingChange('firewall', val)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">USB Device Protection</span>
                    <Switch checked={settings.usb_protection} onChange={(val) => handleSettingChange('usb_protection', val)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Email Phishing Filter</span>
                    <Switch checked={settings.email_filter} onChange={(val) => handleSettingChange('email_filter', val)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Kernel Protection</span>
                    <Switch checked={settings.kernel_protection} onChange={(val) => handleSettingChange('kernel_protection', val)} />
                  </div>
                </div>
              </div>

              <div className="bg-neutral-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-primary">Installed Security Apps</h3>
                {securityServices.length > 0 ? (
                    <ul className="space-y-2">
                        {securityServices.map(service => (
                            <li key={service.id} className="p-2 bg-neutral-700 rounded-md flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-white">{service.name}</p>
                                    <p className="text-xs text-gray-400">Developer: {service.developer}</p>
                                </div>
                                <Switch 
                                    checked={serviceStatus[service.id] || false} 
                                    onChange={(val) => handleServiceStatusChange(service.id, val)} 
                                />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400">No additional security apps installed.</p>
                )}
              </div>

              <div className="bg-neutral-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-primary">Advanced Security</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Sandbox Mode</span>
                    <Switch checked={settings.sandbox_mode} onChange={(val) => handleSettingChange('sandbox_mode', val)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Honeypot System</span>
                    <Switch checked={settings.honeypot} onChange={(val) => handleSettingChange('honeypot', val)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Memory Encryption</span>
                    <Switch checked={settings.memory_encryption} onChange={(val) => handleSettingChange('memory_encryption', val)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Anti-Forensics Mode</span>
                    <Switch checked={settings.anti_forensics} onChange={(val) => handleSettingChange('anti_forensics', val)} />
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
    {user && (
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setChangePasswordModalOpen(false)}
        username={user.name}
      />
    )}
    </div>
  )
}