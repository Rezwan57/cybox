'use client'
import React, { useState } from 'react';
import { 
  FaBook, 
  FaShieldAlt, 
  FaTerminal, 
  FaEnvelope, 
  FaCreditCard, 
  FaCog,
  FaPlay,
  FaCheckCircle,
  FaLock,
  FaExclamationTriangle,
  FaEye,
  FaEyeSlash,
  FaUserShield,
  FaPhoneAlt,
  FaBug,
  FaWifi,
  FaServer,
  FaKey,
  FaFingerprint,
  FaGlobe,
  FaDatabase,
  FaChartLine,
  FaTrophy,
  FaGraduationCap,
  FaRocket,
  FaCode,
  FaNetworkWired,
  FaFireAlt
} from 'react-icons/fa';

const WhiteBoard = () => {
  const [activeLesson, setActiveLesson] = useState<string | number | null>(null);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [showPassword, setShowPassword] = useState(false);

  const lessons = [
    {
      id: 1,
      title: "Password Security Fundamentals",
      description: "Learn to create strong passwords and use secure authentication",
      icon: <FaLock className="w-6 h-6" />,
      difficulty: "Beginner",
      duration: "15 min",
      practiceApps: ["Settings", "Bank"],
      content: {
        theory: "Strong passwords are your first line of defense. A secure password should be at least 12 characters long, include uppercase and lowercase letters, numbers, and special characters. Never reuse passwords across multiple accounts.",
        examples: [
          "Weak: password123",
          "Strong: M7$kL9#nP2@wX5",
          "Better: Use a passphrase like 'Coffee!Morning@2024#Secure'"
        ],
        tips: [
          "Use a password manager to generate and store unique passwords",
          "Enable two-factor authentication whenever possible",
          "Change default passwords immediately",
          "Never share passwords via email or text"
        ]
      }
    },
    {
      id: 2,
      title: "Email Security & Phishing",
      description: "Identify and prevent email-based attacks",
      icon: <FaEnvelope className="w-6 h-6" />,
      difficulty: "Intermediate",
      duration: "20 min",
      practiceApps: ["Email"],
      content: {
        theory: "Phishing emails are fraudulent messages designed to steal credentials or install malware. They often impersonate trusted organizations and create urgency to bypass critical thinking.",
        examples: [
          "Suspicious: 'Your account will be closed in 24 hours - click here!'",
          "Red flags: Poor grammar, generic greetings, suspicious links",
          "Legitimate: Official communications from known contacts with proper formatting"
        ],
        tips: [
          "Verify sender identity through separate communication channels",
          "Check URLs by hovering before clicking",
          "Look for HTTPS and correct domain spelling",
          "Report suspicious emails to your IT department"
        ]
      }
    },
    {
      id: 3,
      title: "Command Line Security",
      description: "Safe practices for terminal and command line usage",
      icon: <FaTerminal className="w-6 h-6" />,
      difficulty: "Advanced",
      duration: "25 min",
      practiceApps: ["CMD"],
      content: {
        theory: "Command line interfaces provide powerful system access but require careful security practices. Understanding privilege escalation, secure scripting, and log monitoring is essential.",
        examples: [
          "Dangerous: sudo rm -rf /",
          "Safe: Use specific paths and verify commands",
          "Best practice: Regular security audits and log monitoring"
        ],
        tips: [
          "Always verify commands before execution",
          "Use principle of least privilege",
          "Monitor system logs for suspicious activity",
          "Keep command history secure and clean"
        ]
      }
    },
    {
      id: 4,
      title: "Financial Security",
      description: "Protect your financial information and transactions",
      icon: <FaCreditCard className="w-6 h-6" />,
      difficulty: "Intermediate",
      duration: "18 min",
      practiceApps: ["Bank"],
      content: {
        theory: "Financial cybersecurity involves protecting banking credentials, monitoring transactions, and recognizing financial fraud. Always use secure connections and official banking apps.",
        examples: [
          "Secure: Official bank app with biometric authentication",
          "Risky: Banking on public Wi-Fi without VPN",
          "Fraud indicator: Unexpected transaction notifications"
        ],
        tips: [
          "Enable account alerts for all transactions",
          "Use official banking apps only",
          "Never save banking credentials in browsers",
          "Monitor statements regularly for unauthorized charges"
        ]
      }
    },
    {
      id: 5,
      title: "System Configuration Security",
      description: "Secure system settings and configurations",
      icon: <FaCog className="w-6 h-6" />,
      difficulty: "Advanced",
      duration: "30 min",
      practiceApps: ["Settings"],
      content: {
        theory: "Proper system configuration is crucial for security. This includes firewall settings, update management, user permissions, and security software configuration.",
        examples: [
          "Secure: Automatic updates enabled with firewall active",
          "Risky: Disabled antivirus with outdated system",
          "Best practice: Regular security configuration reviews"
        ],
        tips: [
          "Enable automatic security updates",
          "Configure firewall rules appropriately",
          "Disable unnecessary services and ports",
          "Regular security configuration audits"
        ]
      }
    },
    {
      id: 6,
      title: "Network Security Fundamentals",
      description: "Secure network connections and Wi-Fi protection",
      icon: <FaWifi className="w-6 h-6" />,
      difficulty: "Intermediate",
      duration: "22 min",
      practiceApps: ["Settings"],
      content: {
        theory: "Network security involves protecting data in transit, securing wireless connections, and understanding network protocols. VPNs, firewalls, and encryption are essential tools.",
        examples: [
          "Secure: WPA3 encryption with VPN on public networks",
          "Risky: Open Wi-Fi networks without protection",
          "Best practice: Regular network security audits"
        ],
        tips: [
          "Always use VPN on public networks",
          "Enable WPA3 encryption on home networks",
          "Regularly update router firmware",
          "Monitor network traffic for anomalies"
        ]
      }
    },
    {
      id: 7,
      title: "Social Engineering Awareness",
      description: "Recognize and defend against social engineering attacks",
      icon: <FaUserShield className="w-6 h-6" />,
      difficulty: "Beginner",
      duration: "16 min",
      practiceApps: ["Email"],
      content: {
        theory: "Social engineering exploits human psychology to gain unauthorized access. Attackers manipulate trust, fear, and urgency to bypass security controls.",
        examples: [
          "Phone scam: 'This is your bank, verify your account immediately'",
          "Email trick: 'CEO urgent request for wire transfer'",
          "In-person: Tailgating into secure areas"
        ],
        tips: [
          "Verify identity through official channels",
          "Be skeptical of urgent requests",
          "Never provide sensitive info over phone/email",
          "Report suspicious social engineering attempts"
        ]
      }
    },
    {
      id: 8,
      title: "Malware Detection & Prevention",
      description: "Identify, prevent, and respond to malware threats",
      icon: <FaBug className="w-6 h-6" />,
      difficulty: "Advanced",
      duration: "28 min",
      practiceApps: ["Settings", "CMD"],
      content: {
        theory: "Malware includes viruses, trojans, ransomware, and spyware. Understanding detection methods, prevention strategies, and response procedures is critical.",
        examples: [
          "Ransomware: Files encrypted with payment demand",
          "Trojan: Legitimate-looking software with hidden malicious code",
          "Spyware: Silent monitoring of user activities"
        ],
        tips: [
          "Keep antivirus software updated",
          "Enable real-time protection",
          "Avoid suspicious downloads and emails",
          "Regular system scans and backups"
        ]
      }
    }
  ];

  const apps = [
    { name: "CMD", icon: <FaTerminal className="w-5 h-5" />, color: "bg-gray-800" },
    { name: "Email", icon: <FaEnvelope className="w-5 h-5" />, color: "bg-blue-600" },
    { name: "Bank", icon: <FaCreditCard className="w-5 h-5" />, color: "bg-green-600" },
    { name: "Settings", icon: <FaCog className="w-5 h-5" />, color: "bg-purple-600" },
    { name: "Network", icon: <FaNetworkWired className="w-5 h-5" />, color: "bg-neutral-400/30" },
    { name: "Firewall", icon: <FaFireAlt className="w-5 h-5" />, color: "bg-red-600" }
  ];

  function markLessonComplete(lessonId: number) {
    setCompletedLessons(prev => new Set([...prev, lessonId]));
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-white bg-gray-100';
    }
  };

  if (activeLesson !== null) {
    const lesson = lessons.find(l => l.id === activeLesson);
    if (!lesson) {
      return (
        <div className="min-h-screen p-4">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-lg shadow-lg p-6">
              <h1 className="text-2xl font-bold text-white">Lesson Not Found</h1>
              <button
                onClick={() => setActiveLesson(null)}
                className="mt-4 px-4 py-2 text-indigo-600 hover:bg-neutral-400/30rounded-lg transition-colors"
              >
                ← Back to Lessons
              </button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen p-4">
        <div className="w-full mx-auto">
          {/* Header */}
          <div className="rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className=" rounded-lg">
                  {lesson.icon}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{lesson.title}</h1>
                  <div className="flex items-center space-x-4 text-sm text-white">
                    <span className={`px-2 py-1 rounded-full ${getDifficultyColor(lesson.difficulty)}`}>
                      {lesson.difficulty}
                    </span>
                    <span>⏱️ {lesson.duration}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveLesson(null)}
                className="px-4 py-2 text-indigo-600 hover:bg-neutral-400/30rounded-lg transition-colors"
              >
                ← Back to Lessons
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Theory Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-neutral-600/50 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <FaBook className="w-5 h-5 mr-2 text-indigo-600" />
                  Theory
                </h2>
                <p className="text-white leading-relaxed">{lesson.content.theory}</p>
              </div>

              <div className="bg-neutral-600/50 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <FaCode className="w-5 h-5 mr-2 text-green-600" />
                  Examples
                </h2>
                <div className="space-y-3">
                  {lesson.content.examples.map((example, index) => (
                    <div key={index} className="p-3 bg-neutral-600/60 rounded-lg">
                      <code className="text-sm text-white">{example}</code>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-neutral-600/50 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <FaKey className="w-5 h-5 mr-2 text-yellow-600" />
                  Key Tips
                </h2>
                <div className="space-y-3">
                  {lesson.content.tips.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <FaCheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-white">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Practice Section */}
            <div className="space-y-6">
              <div className="bg-neutral-600/50 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">🚀 Practice Apps</h2>
                <div className="space-y-3">
                  {lesson.practiceApps.map((appName, index) => {
                    const app = apps.find(a => a.name === appName);
                    return (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-neutral-600/60 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className={`p-2 ${app?.color} rounded-lg text-white`}>
                          {app?.icon}
                        </div>
                        <div>
                          <p className="font-medium text-white">{app?.name}</p>
                          <p className="text-sm text-white">Apply lesson concepts</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-neutral-600/50 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">📊 Progress</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Lesson Progress</span>
                    <span className="text-indigo-600 font-medium">In Progress</span>
                  </div>
                  <button
                    onClick={() => markLessonComplete(lesson.id)}
                    className="w-full bg-neutral-400/30 text-white py-3 px-4 rounded-lg hover-bg-neutral-400/30 transition-colors flex items-center justify-center space-x-2"
                    >
                    <FaCheckCircle className="w-5 h-5" />
                    <span>Mark as Complete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>.

      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-neutral-600/50 rounded-xl shadow-lg">
              <FaShieldAlt className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-4xl font-bold text-white">WhiteBoard</h1>
          </div>
          <p className="text-xl text-white">Interactive Cybersecurity Learning Platform</p>
          <p className="text-white mt-2">Learn cybersecurity concepts and apply them in real-world scenarios</p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-neutral-600/50 rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3">
              <FaBook className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-white">{lessons.length}</p>
                <p className="text-white">Total Lessons</p>
              </div>
            </div>
          </div>
          <div className="bg-neutral-600/50 rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3">
              <FaCheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-white">{completedLessons.size}</p>
                <p className="text-white">Completed</p>
              </div>
            </div>
          </div>
          <div className="bg-neutral-600/50 rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3">
              <FaExclamationTriangle className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-white">{lessons.length - completedLessons.size}</p>
                <p className="text-white">Remaining</p>
              </div>
            </div>
          </div>
          <div className="bg-neutral-600/50 rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3">
              <FaShieldAlt className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-white">{Math.round((completedLessons.size / lessons.length) * 100)}%</p>
                <p className="text-white">Progress</p>
              </div>
            </div>
          </div>
        </div>

        {/* Available Apps */}
        <div className="bg-neutral-600/50 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
            <FaRocket className="w-6 h-6 mr-2 text-indigo-600" />
            Connected Practice Apps
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {apps.map((app, index) => (
              <div key={index} className="flex flex-col items-center space-y-2 p-4 bg-neutral-600/60 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <div className={`p-3 ${app.color} rounded-lg text-white`}>
                  {app.icon}
                </div>
                <div className="text-center">
                  <p className="font-medium text-white text-sm">{app.name}</p>
                  <p className="text-xs text-white">Practice App</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="bg-neutral-600/50 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-neutral-400/30 rounded-lg">
                    {lesson.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{lesson.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(lesson.difficulty)}`}>
                        {lesson.difficulty}
                      </span>
                      <span className="text-sm text-white">⏱️ {lesson.duration}</span>
                    </div>
                  </div>
                  {completedLessons.has(lesson.id) && (
                    <FaCheckCircle className="w-6 h-6 text-green-500" />
                  )}
                </div>
                
                <p className="text-white mb-4">{lesson.description}</p>
                
                <div className="mb-4">
                  <p className="text-sm font-medium text-white mb-2">Practice Apps:</p>
                  <div className="flex flex-wrap gap-2">
                    {lesson.practiceApps.map((appName, index) => {
                      const app = apps.find(a => a.name === appName);
                      return (
                        <span key={index} className="inline-flex items-center space-x-1 bg-neutral-900 px-3 py-2 rounded-full text-xs">
                          <span className='text-sm'>{app?.icon}</span>
                          <span>{app?.name}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
                
                <button
                  onClick={() => setActiveLesson(lesson.id)} 
                  className="w-full bg-neutral-400/30 text-white py-3 px-4 rounded-lg hover:bg-neutral-400/30 transition-colors flex items-center justify-center space-x-2"
                >
                  <FaPlay className="w-4 h-4" />
                  <span>Start Lesson</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhiteBoard;


