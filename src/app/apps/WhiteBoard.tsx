'use client'
import React, { JSX, useState, useContext } from 'react';
import { AppContext } from '@/Context/AppWrapper';
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
  FaFireAlt,
  FaGamepad,
  FaUserLock,
  FaStar
} from 'react-icons/fa';

interface Lesson {
  id: number;
  title: string;
  description: string;
  icon: JSX.Element;
  difficulty: string;
  duration: string;
  practiceApps: string[];
  content: {
    theory: string;
    examples: string[];
    tips: string[];
  };
  points: number;
}

const WhiteBoard: React.FC = () => {
  const { points, setPoints } = useContext(AppContext);
  const [activeLesson, setActiveLesson] = useState<number | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [badges, setBadges] = useState<string[]>([]);

  const lessons: Lesson[] = [
    {
      id: 1,
      title: "Password Security Fundamentals",
      description: "Learn to create strong passwords and secure authentication for gaming accounts",
      icon: <FaLock className="w-6 h-6" />,
      difficulty: "Beginner",
      duration: "15 min",
      practiceApps: ["Settings", "Bank", "GameHub"],
      content: {
        theory: "Strong passwords are critical for protecting gaming accounts from unauthorized access. Use at least 12 characters with a mix of uppercase, lowercase, numbers, and special characters. Avoid using gaming-related terms like 'gamer123'.",
        examples: [
          "Weak: gamer123",
          "Strong: X9#mP2@kL7$zW4",
          "Best: Passphrase like 'EpicQuest!2025@LevelUp'"
        ],
        tips: [
          "Use a password manager for unique passwords across games",
          "Enable two-factor authentication on gaming platforms",
          "Never reuse passwords across gaming and other accounts",
          "Avoid sharing passwords in gaming chats or forums"
        ]
      },
      points: 100
    },
    {
      id: 2,
      title: "Email Security & Phishing",
      description: "Protect against phishing scams targeting gamers",
      icon: <FaEnvelope className="w-6 h-6" />,
      difficulty: "Intermediate",
      duration: "20 min",
      practiceApps: ["Email", "GameHub"],
      content: {
        theory: "Phishing emails targeting gamers often promise free in-game items or account upgrades. These scams aim to steal credentials or install malware. Always verify the sender and avoid clicking suspicious links.",
        examples: [
          "Suspicious: 'Claim your free 1000 V-Bucks now!'",
          "Red flags: Poor grammar, generic greetings, fake game URLs",
          "Legitimate: Official game support emails from verified domains"
        ],
        tips: [
          "Check email sender domains against official game websites",
          "Hover over links to verify URLs before clicking",
          "Use game platform apps for official communications",
          "Report phishing attempts to game support teams"
        ]
      },
      points: 150
    },
    {
      id: 3,
      title: "Command Line Security",
      description: "Secure terminal usage for game server administration",
      icon: <FaTerminal className="w-6 h-6" />,
      difficulty: "Advanced",
      duration: "25 min",
      practiceApps: ["CMD", "GameServer"],
      content: {
        theory: "Game server admins use command line interfaces for powerful control, but they must follow security best practices to prevent exploits. Secure scripting and log monitoring are key.",
        examples: [
          "Dangerous: sudo rm -rf /",
          "Safe: Use specific paths like /game/server/config",
          "Best practice: Regular audits of server logs for anomalies"
        ],
        tips: [
          "Verify all commands before running on game servers",
          "Use least privilege for server admin accounts",
          "Monitor server logs for suspicious activity",
          "Secure SSH access with strong keys and 2FA"
        ]
      },
      points: 200
    },
    {
      id: 4,
      title: "Financial Security",
      description: "Protect in-game purchases and financial transactions",
      icon: <FaCreditCard className="w-6 h-6" />,
      difficulty: "Intermediate",
      duration: "18 min",
      practiceApps: ["Bank", "GameHub"],
      content: {
        theory: "Gamers often make in-game purchases, making financial security crucial. Protect payment methods, use secure connections, and monitor for fraudulent transactions.",
        examples: [
          "Secure: Official game store with 2FA-enabled payment",
          "Risky: Entering card details on public Wi-Fi",
          "Fraud indicator: Unauthorized in-game purchase alerts"
        ],
        tips: [
          "Set up transaction alerts for all game purchases",
          "Use official game stores or trusted platforms",
          "Never save payment info in game browsers",
          "Check bank statements for unauthorized game charges"
        ]
      },
      points: 150
    },
    {
      id: 5,
      title: "System Configuration Security",
      description: "Secure gaming PC and console settings",
      icon: <FaCog className="w-6 h-6" />,
      difficulty: "Advanced",
      duration: "30 min",
      practiceApps: ["Settings", "GameHub"],
      content: {
        theory: "Gaming systems need secure configurations to prevent exploits. This includes firewall settings, system updates, and disabling unnecessary services to protect your gaming experience.",
        examples: [
          "Secure: Firewall enabled with game ports open",
          "Risky: Outdated OS with disabled antivirus",
          "Best practice: Regular gaming system security audits"
        ],
        tips: [
          "Keep gaming systems updated with latest patches",
          "Configure firewalls to allow only trusted game traffic",
          "Disable unused services on gaming PCs/consoles",
          "Use reputable antivirus tailored for gaming"
        ]
      },
      points: 200
    },
    {
      id: 6,
      title: "Network Security Fundamentals",
      description: "Secure gaming network connections and Wi-Fi",
      icon: <FaWifi className="w-6 h-6" />,
      difficulty: "Intermediate",
      duration: "22 min",
      practiceApps: ["Settings", "Network"],
      content: {
        theory: "Online gaming requires secure network connections to prevent lag exploits and data theft. Use VPNs, secure Wi-Fi, and monitor network traffic for a safe gaming experience.",
        examples: [
          "Secure: WPA3 Wi-Fi with VPN for online gaming",
          "Risky: Open Wi-Fi at gaming cafes",
          "Best practice: Monitor network for DDoS attacks"
        ],
        tips: [
          "Use a VPN for online multiplayer games",
          "Enable WPA3 or WPA2 on gaming routers",
          "Update router firmware regularly",
          "Monitor network for unusual gaming traffic"
        ]
      },
      points: 150
    },
    {
      id: 7,
      title: "Social Engineering Awareness",
      description: "Defend against scams in gaming communities",
      icon: <FaUserShield className="w-6 h-6" />,
      difficulty: "Beginner",
      duration: "16 min",
      practiceApps: ["Email", "GameHub"],
      content: {
        theory: "Social engineering in gaming exploits trust to steal accounts or items. Scammers may pose as friends or offer fake trades. Stay vigilant in gaming communities.",
        examples: [
          "Scam: 'Trade your rare skin for my exclusive item!'",
          "Trick: 'I’m from game support, share your login'",
          "In-game: Fake giveaways in chat or forums"
        ],
        tips: [
          "Verify identities through official game channels",
          "Be cautious of unsolicited trade offers",
          "Never share account details in game chats",
          "Report scams to game moderators immediately"
        ]
      },
      points: 100
    },
    {
      id: 8,
      title: "Malware Detection & Prevention",
      description: "Protect gaming systems from malware and cheats",
      icon: <FaBug className="w-6 h-6" />,
      difficulty: "Advanced",
      duration: "28 min",
      practiceApps: ["Settings", "CMD", "GameHub"],
      content: {
        theory: "Malware targeting gamers can include keyloggers, ransomware, or cheat software with hidden payloads. Protect your system with antivirus and safe download practices.",
        examples: [
          "Keylogger: Hidden in free cheat software",
          "Ransomware: Locks game files with payment demand",
          "Spyware: Tracks in-game purchases and credentials"
        ],
        tips: [
          "Use trusted antivirus with gaming mode",
          "Avoid downloading unofficial game mods",
          "Scan systems regularly for gaming malware",
          "Backup game saves to secure storage"
        ]
      },
      points: 200
    },
    {
      id: 9,
      title: "Game Account Security",
      description: "Secure your gaming profiles and progress",
      icon: <FaUserLock className="w-6 h-6" />,
      difficulty: "Beginner",
      duration: "15 min",
      practiceApps: ["GameHub"],
      content: {
        theory: "Gaming accounts hold valuable progress and items. Secure them with strong passwords, 2FA, and account recovery options to prevent account theft.",
        examples: [
          "Secure: Unique password with 2FA enabled",
          "Risky: Same password as email account",
          "Best practice: Link account to verified email/phone"
        ],
        tips: [
          "Enable 2FA on all gaming platforms",
          "Use unique email addresses for gaming accounts",
          "Set up account recovery with secure details",
          "Monitor account activity for suspicious logins"
        ]
      },
      points: 100
    },
    {
      id: 10,
      title: "In-Game Scam Protection",
      description: "Avoid scams and fraud in online games",
      icon: <FaGamepad className="w-6 h-6" />,
      difficulty: "Intermediate",
      duration: "20 min",
      practiceApps: ["GameHub"],
      content: {
        theory: "In-game scams trick players into giving away items, currency, or account access. Common scams include fake trades, phishing links, and impersonation of game staff.",
        examples: [
          "Scam: 'Double your coins by visiting this site!'",
          "Fake trade: Offering rare items that don’t exist",
          "Impersonation: Posing as game moderators in chat"
        ],
        tips: [
          "Only trade through official game systems",
          "Avoid external links promising in-game rewards",
          "Verify staff identities via official channels",
          "Report suspicious players to game support"
        ]
      },
      points: 150
    },
    {
      id: 11,
      title: "SQL Injection (SQLi)",
      description: "Understand and prevent SQL injection attacks",
      icon: <FaDatabase className="w-6 h-6" />,
      difficulty: "Advanced",
      duration: "30 min",
      practiceApps: ["CMD", "Bank"],
      content: {
        theory: "SQL injection is a code injection technique that might destroy your database. SQL injection is one of the most common web hacking techniques. It is the placement of malicious code in SQL statements, via web page input.",
        examples: [
          "Malicious Input: ' OR '1'='1",
          "Go to the Bank app and try to login with the above malicious input in the username field. This will bypass the authentication.",
          "Go to the CMD app and try to use sqlmap to automate the process of detecting and exploiting SQL injection flaws."
        ],
        tips: [
          "Use parameterized queries or prepared statements.",
          "Use an ORM (Object-Relational Mapping) tool.",
          "Validate and sanitize user input.",
          "Implement the principle of least privilege."
        ]
      },
      points: 250
    },
    {
      id: 12,
      title: "Cross-Site Scripting (XSS)",
      description: "Learn to prevent cross-site scripting attacks",
      icon: <FaCode className="w-6 h-6" />,
      difficulty: "Intermediate",
      duration: "25 min",
      practiceApps: ["Browser", "Email"],
      content: {
        theory: "Cross-Site Scripting (XSS) is a type of security vulnerability that can be found in some web applications. XSS attacks enable attackers to inject client-side scripts into web pages viewed by other users. A cross-site scripting vulnerability may be used by attackers to bypass access controls such as the same-origin policy.",
        examples: [
          "Malicious Script: <script>alert('XSS')</script>",
          "Go to the Browser app and inject the malicious script in the search bar. This will execute the script.",
          "Go to the Email app and send a phishing email with a malicious link containing the XSS payload."
        ],
        tips: [
          "Use a web application firewall (WAF).",
          "Use a content security policy (CSP).",
          "Validate and sanitize user input.",
          "Encode user output."
        ]
      },
      points: 200
    }
  ];

  const apps = [
    { name: "CMD", icon: <FaTerminal className="w-5 h-5" />, color: "bg-gray-800" },
    { name: "Email", icon: <FaEnvelope className="w-5 h-5" />, color: "bg-blue-600" },
    { name: "Bank", icon: <FaCreditCard className="w-5 h-5" />, color: "bg-green-600" },
    { name: "Settings", icon: <FaCog className="w-5 h-5" />, color: "bg-purple-600" },
    { name: "Network", icon: <FaNetworkWired className="w-5 h-5" />, color: "bg-indigo-600" },
    { name: "Firewall", icon: <FaFireAlt className="w-5 h-5" />, color: "bg-red-600" },
    { name: "GameHub", icon: <FaGamepad className="w-5 h-5" />, color: "bg-teal-600" }
  ];

  const markLessonComplete = (lessonId: number) => {
    if (!completedLessons.has(lessonId)) {
      const lesson = lessons.find(l => l.id === lessonId);
      if (lesson) {
        setPoints((prev: number) => prev + lesson.points);
        setCompletedLessons(prev => new Set([...prev, lessonId]));
        
        // Award badges based on milestones
        const completedCount = completedLessons.size + 1;
        if (completedCount === 3) setBadges(prev => [...prev, "Beginner Defender"]);
        if (completedCount === 6) setBadges(prev => [...prev, "Intermediate Guardian"]);
        if (completedCount === 10) setBadges(prev => [...prev, "Master Protector"]);
        if (lessons.filter(l => l.difficulty === "Beginner").every(l => completedLessons.has(l.id) || l.id === lessonId)) {
          setBadges(prev => [...prev, "Beginner Master"]);
        }
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400 bg-green-900/30';
      case 'Intermediate': return 'text-yellow-400 bg-yellow-900/30';
      case 'Advanced': return 'text-red-400 bg-red-900/30';
      default: return 'text-gray-400 bg-gray-900/30';
    }
  };

  if (activeLesson !== null) {
    const lesson = lessons.find(l => l.id === activeLesson);
    if (!lesson) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 p-4 animate-fade-in">
          <div className="max-w-4xl mx-auto">
            <div className="bg-neutral-800/50 rounded-lg shadow-lg p-6 backdrop-blur-sm">
              <h1 className="text-2xl font-bold text-white">Lesson Not Found</h1>
              <button
                onClick={() => setActiveLesson(null)}
                className="mt-4 px-4 py-2 text-indigo-400 hover:bg-indigo-900/30 rounded-lg transition-colors duration-300"
              >
                ← Back to Lessons
              </button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 p-4 animate-fade-in">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-neutral-800/50 rounded-lg shadow-lg p-6 mb-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-900/30 rounded-lg">
                  {lesson.icon}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{lesson.title}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-300">
                    <span className={`px-2 py-1 rounded-full ${getDifficultyColor(lesson.difficulty)}`}>
                      {lesson.difficulty}
                    </span>
                    <span>⏱️ {lesson.duration}</span>
                    <span>🎮 {lesson.points} Points</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveLesson(null)}
                className="px-4 py-2 text-indigo-400 hover:bg-indigo-900/30 rounded-lg transition-colors duration-300"
              >
                ← Back to Lessons
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Theory Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-neutral-800/50 rounded-lg shadow-lg p-6 backdrop-blur-sm">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <FaBook className="w-5 h-5 mr-2 text-indigo-400" />
                  Theory
                </h2>
                <p className="text-gray-300 leading-relaxed">{lesson.content.theory}</p>
              </div>

              <div className="bg-neutral-800/50 rounded-lg shadow-lg p-6 backdrop-blur-sm">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <FaCode className="w-5 h-5 mr-2 text-green-400" />
                  Examples
                </h2>
                <div className="space-y-3">
                  {lesson.content.examples.map((example, index) => (
                    <div key={index} className="p-3 bg-neutral-900/30 rounded-lg">
                      <code className="text-sm text-gray-300">{example}</code>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-neutral-800/50 rounded-lg shadow-lg p-6 backdrop-blur-sm">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <FaKey className="w-5 h-5 mr-2 text-yellow-400" />
                  Key Tips
                </h2>
                <div className="space-y-3">
                  {lesson.content.tips.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <FaCheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-300">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Practice Section */}
            <div className="space-y-6">
              <div className="bg-neutral-800/50 rounded-lg shadow-lg p-6 backdrop-blur-sm">
                <h2 className="text-xl font-semibold text-white mb-4">🎮 Practice Apps</h2>
                <div className="space-y-3">
                  {lesson.practiceApps.map((appName, index) => {
                    const app = apps.find(a => a.name === appName);
                    return (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-neutral-900/30 rounded-lg hover:bg-indigo-900/30 transition-colors duration-300 cursor-pointer">
                        <div className={`p-2 ${app?.color} rounded-lg text-white`}>
                          {app?.icon}
                        </div>
                        <div>
                          <p className="font-medium text-white">{app?.name}</p>
                          <p className="text-sm text-gray-300">Apply lesson concepts</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-neutral-800/50 rounded-lg shadow-lg p-6 backdrop-blur-sm">
                <h2 className="text-xl font-semibold text-white mb-4">📊 Progress</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Lesson Progress</span>
                    <span className="text-indigo-400 font-medium">In Progress</span>
                  </div>
                  <button
                    onClick={() => markLessonComplete(lesson.id)}
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-300 flex items-center justify-center space-x-2"
                  >
                    <FaCheckCircle className="w-5 h-5" />
                    <span>Mark as Complete (+{lesson.points} Points)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-neutral-800/50 rounded-xl shadow-lg backdrop-blur-sm">
              <FaShieldAlt className="w-8 h-8 text-indigo-400" />
            </div>
            <h1 className="text-4xl font-bold text-white">WhiteBoard: Cyber Quest</h1>
          </div>
          <p className="text-xl text-gray-300">Level up your cybersecurity skills in a gamified adventure!</p>
          <p className="text-gray-400 mt-2">Protect your gaming world with real-world security skills</p>
        </div>

        {/* Gamification Dashboard */}
        <div className="bg-neutral-800/50 rounded-lg shadow-lg p-6 mb-8 backdrop-blur-sm">
          <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
            <FaTrophy className="w-6 h-6 mr-2 text-yellow-400" />
            Your Progress
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3">
              <FaBook className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-white">{lessons.length}</p>
                <p className="text-gray-300">Total Lessons</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FaCheckCircle className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-white">{completedLessons.size}</p>
                <p className="text-gray-300">Completed</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FaExclamationTriangle className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold text-white">{lessons.length - completedLessons.size}</p>
                <p className="text-gray-300">Remaining</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FaStar className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-2xl font-bold text-white">{points}</p>
                <p className="text-gray-300">Points Earned</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-300 mb-2">Completion Progress</p>
            <div className="w-full bg-neutral-900/30 rounded-full h-4">
              <div
                className="bg-indigo-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${(completedLessons.size / lessons.length) * 100}%` }}
              ></div>
            </div>
          </div>
          {badges.length > 0 && (
            <div className="mt-4">
              <p className="text-gray-300 mb-2">Badges Earned</p>
              <div className="flex flex-wrap gap-2">
                {badges.map((badge, index) => (
                  <span key={index} className="px-3 py-1 bg-yellow-900/30 text-yellow-400 rounded-full text-sm flex items-center">
                    <FaTrophy className="w-4 h-4 mr-1" />
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Available Apps */}
        <div className="bg-neutral-800/50 rounded-lg shadow-lg p-6 mb-8 backdrop-blur-sm">
          <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
            <FaRocket className="w-6 h-6 mr-2 text-indigo-400" />
            Connected Practice Apps
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {apps.map((app, index) => (
              <div key={index} className="flex flex-col items-center space-y-2 p-4 bg-neutral-900/30 rounded-lg hover:bg-indigo-900/30 transition-colors duration-300 cursor-pointer">
                <div className={`p-3 ${app.color} rounded-lg text-white transform hover:scale-105 transition-transform`}>
                  {app.icon}
                </div>
                <div className="text-center">
                  <p className="font-medium text-white text-sm">{app.name}</p>
                  <p className="text-xs text-gray-300">Practice App</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="bg-neutral-800/50 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 backdrop-blur-sm">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-indigo-900/30 rounded-lg">
                    {lesson.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{lesson.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(lesson.difficulty)}`}>
                        {lesson.difficulty}
                      </span>
                      <span className="text-sm text-gray-300">⏱️ {lesson.duration}</span>
                      <span className="text-sm text-gray-300">🎮 {lesson.points} Points</span>
                    </div>
                  </div>
                  {completedLessons.has(lesson.id) && (
                    <FaCheckCircle className="w-6 h-6 text-green-400" />
                  )}
                </div>
                
                <p className="text-gray-300 mb-4">{lesson.description}</p>
                
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-300 mb-2">Practice Apps:</p>
                  <div className="flex flex-wrap gap-2">
                    {lesson.practiceApps.map((appName, index) => {
                      const app = apps.find(a => a.name === appName);
                      return (
                        <span key={index} className="inline-flex items-center space-x-1 bg-neutral-900/30 px-3 py-2 rounded-full text-xs text-gray-300">
                          <span className="text-sm">{app?.icon}</span>
                          <span>{app?.name}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
                
                <button
                  onClick={() => setActiveLesson(lesson.id)}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-300 flex items-center justify-center space-x-2 transform hover:scale-105"
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