CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_name VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    ip VARCHAR(255) NOT NULL,
    mac VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_settings (
    user_id INT PRIMARY KEY,
    two_fa BOOLEAN DEFAULT false,
    biometric_auth BOOLEAN DEFAULT true,
    session_timeout VARCHAR(255) DEFAULT '30',
    login_attempts VARCHAR(255) DEFAULT '3',
    firewall BOOLEAN DEFAULT true,
    vpn BOOLEAN DEFAULT false,
    usb_protection BOOLEAN DEFAULT true,
    email_filter BOOLEAN DEFAULT true,
    spoofed_mac VARCHAR(255) DEFAULT '00:1B:44:11:3A:B7',
    ip VARCHAR(255) DEFAULT '192.168.0.101',
    dns VARCHAR(255) DEFAULT '8.8.8.8',
    wifi VARCHAR(255) DEFAULT 'CyberNet_WPA2',
    proxy_server VARCHAR(255) DEFAULT '127.0.0.1:8080',
    tor_enabled BOOLEAN DEFAULT false,
    port_scanning BOOLEAN DEFAULT false,
    sandbox_mode BOOLEAN DEFAULT false,
    honeypot BOOLEAN DEFAULT true,
    anti_forensics BOOLEAN DEFAULT false,
    crypto_mining BOOLEAN DEFAULT false,
    kernel_protection BOOLEAN DEFAULT true,
    memory_encryption BOOLEAN DEFAULT false,
    network_monitoring BOOLEAN DEFAULT true,
    keylogger_detection BOOLEAN DEFAULT true,
    behavior_analysis BOOLEAN DEFAULT false,
    traffic_analysis BOOLEAN DEFAULT true,
    evidence_collection BOOLEAN DEFAULT false,
    memory_dumps BOOLEAN DEFAULT false,
    disk_imaging BOOLEAN DEFAULT false,
    encryption_key VARCHAR(255) DEFAULT 'AES-256-GCM',
    hash_algorithm VARCHAR(255) DEFAULT 'SHA-256',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE bank_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    balance DECIMAL(10, 2) NOT NULL DEFAULT 1000.00,
    account_number VARCHAR(255) NOT NULL,
    card_number VARCHAR(255) NOT NULL,
    cvc VARCHAR(255) NOT NULL,
    expiry_date VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- New table for universal tasks
CREATE TABLE universal_tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    learning_module TEXT,
    points INT NOT NULL,
    task_type VARCHAR(50) NOT NULL DEFAULT 'knowledge', -- 'knowledge' or 'action'
    task_data TEXT, -- JSON data for action-based tasks
    level INT NOT NULL DEFAULT 1
);

-- Modified tasks table to track user-specific progress on universal tasks
CREATE TABLE user_tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    universal_task_id INT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'To Do', -- e.g., 'To Do', 'In Progress', 'Completed'
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (universal_task_id) REFERENCES universal_tasks(id) ON DELETE CASCADE,
    UNIQUE (user_id, universal_task_id) -- Ensure a user can only have one entry per universal task
);

INSERT INTO universal_tasks (id, title, description, learning_module, points, task_type, task_data, level) VALUES
(1, 'Level 1: What is Cybersecurity?',
 'Understand the fundamental concepts of cybersecurity and why it is important in the digital world.',
 'Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. These cyberattacks are usually aimed at accessing, changing, or destroying sensitive information; extorting money from users; or interrupting normal business processes. A successful cybersecurity approach has multiple layers of protection spread across the computers, networks, programs, or data that one intends to keep safe.',
 50, 'knowledge', NULL, 1),

(2, 'Level 2: Create a Strong Password',
 'Go to the settings and create a new, strong password for your account. The password must be at least 12 characters long and contain a mix of uppercase and lowercase letters, numbers, and symbols.',
 NULL,
 100, 'action', NULL, 2),

(3, 'Level 3: Spotting Phishing Emails',
 'Go to the Email app and correctly classify the phishing and spam emails.',
 'Phishing is a type of social engineering attack often used to steal user data, including login credentials and credit card numbers. It occurs when an attacker, masquerading as a trusted entity, dupes a victim into opening an email, instant message, or text message. The recipient is then tricked into clicking a malicious link, which can lead to the installation of malware, the freezing of their system as part of a ransomware attack or the revealing of sensitive information. Look for red flags like generic greetings, urgent language, suspicious links, and poor grammar.',
 100, 'action', '{"required_classifications": [{"universal_email_id": 1, "classification": "phishing"}, {"universal_email_id": 3, "classification": "spam"}]}', 3),

(4, 'Level 4: Encrypt the Evidence', 'A sensitive file is located at "/home/user/sensitive_data.txt". Encrypt it with the password "TopSecret#9900" to protect it.', NULL, 200, 'action', '{"file_path": "/home/user/sensitive_data.txt", "password": "TopSecret#9900"}', 4),

(5, 'Level 5: The Multi-Hash Challenge', 'Your account is protected by a multi-hash authentication. You need to crack 5 MD5 hashes to get the passwords. Check your email from admin@cybox.app for the hashes.', NULL, 150, 'action', '{"passwords": ["User321", "adminIam230", "mod78mod", "Klein679", "Roco89080"]}', 5),

(6, 'Level 6: Find the Hidden Message',
 'A secret message is hidden in a file somewhere in the system. Find the file and submit its content.',
 NULL,
 250, 'action', '{"file_path": "/var/log/hidden_message.txt", "content": "c_y_b_e_r_s_e_c_u_r_i_t_y"}', 6)


CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price INT,
    category VARCHAR(255),
    features TEXT,
    icon_path VARCHAR(255),
    version VARCHAR(50),
    developer VARCHAR(255),
    release_date DATE,
    is_important TINYINT(1) DEFAULT 0
);

CREATE TABLE user_services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    service_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    UNIQUE (user_id, service_id)
);

INSERT INTO services (name, description, icon_path, category, version, developer, release_date, is_important, price, features) VALUES
('SecureNet VPN', 'Encrypt your internet connection and protect your privacy with military-grade security.', '/public/Icons/Bank.svg', 'Security', '2.5.0', 'SecureNet Solutions', '2024-01-20', 1, 0, '[]'),
('Guardian AV', 'Real-time protection against viruses, malware, and ransomware. Keep your system safe.', '/public/Icons/Task.svg', 'Security', '4.1.2', 'Guardian Security', '2024-02-10', 1, 0, '[]'),
('Fortress Firewall', 'Control network traffic and prevent unauthorized access to your system.', '/public/Icons/Setting.svg', 'Security', '1.8.0', 'Fortress Tech', '2024-03-01', 1, 0, '[]'),
('FreeVPN Pro', 'Enjoy unlimited, free VPN access! (Warning: May collect user data and display intrusive ads.)', '/public/Icons/Browser.svg', 'Utility', '1.0.5', 'Anonymous Devs', '2023-11-15', 0, 0, '[]'),
('System Defender', 'Optimizes your system by removing "threats" and boosting performance. (Warning: Known for false positives and system slowdowns.)', '/public/Icons/Console.svg', 'Utility', '3.0.0', 'RogueWare Inc.', '2023-10-01', 0, 0, '[]'),
('Data Miner', 'A powerful tool to analyze your system data for "insights". (Warning: This is spyware designed to exfiltrate personal information.)', '/public/Icons/Mail.svg', 'Malware', '1.0.0', 'ShadowCorp', '2023-09-20', 0, 0, '[]'),
('Privacy Shield', 'Blocks trackers and enhances your online anonymity. (Legitimate privacy tool)', '/public/Icons/CybStore.svg', 'Security', '1.1.0', 'PrivacyTools Inc.', '2024-04-05', 1, 0, '[]'),
('SecureBrowse', 'A secure web browser with built-in ad and tracker blocking.', '/public/Icons/FileManager.svg', 'Security', '1.0.0', 'SecureWeb Devs', '2024-03-15', 1, 0, '[]'),
('MD5 Cracker', 'A tool to crack MD5 hashes from a list of common passwords.', '/public/Icons/Console.svg', 'Utility', '1.0.0', 'Cybox Devs', '2025-01-01', 0, 100, '[]');

CREATE TABLE universal_emails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    from_user VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_emails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    universal_email_id INT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    classification VARCHAR(50) NOT NULL DEFAULT 'none', -- 'none', 'spam', 'phishing'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (universal_email_id) REFERENCES universal_emails(id) ON DELETE CASCADE,
    UNIQUE (user_id, universal_email_id)
);

INSERT INTO universal_emails (from_user, subject, body) VALUES
('admin@cyberbank.fake', 'Unusual login detected', 'We noticed a login from a new device. Click the link below to secure your account: <a href="cybox://bank/login?phishing=true" class="text-blue-400 underline">https://cyberbank.fake/secure</a>'),
('support@securevpn.fake', 'Your subscription has expired', 'Renew your VPN today to stay protected. <a href="cybox://settings/network" class="text-blue-400 underline">Renew Now</a>'),
('friend@trustme.fake', 'Check out this awesome game!', 'It’s a new hacking simulator. Totally legit ;) Download here: <a href="cybox://filemanager/download/malware.exe" class="text-blue-400 underline">malware.exe</a>'),
('admin@cybox.app', 'Level 4 Challenge Hashes', '<p>Hello,</p><p>Here are the hashes for the Level 4 challenge. One of these sets is the correct one. Good luck.</p><pre>261e672695a654895fed24313e5246de

c1572d06420ea7890535785dd4815fe6

9594de8de31942437651eb4162554253

2572057493948a74218569b549041897

59a84b33a4aa9e6953051510396308b1


d41d8cd98f00b204e9800998ecf8427e

098f6bcd4621d373cade4e832627b4f6

5f4dcc3b5aa765d61d8327deb882cf99</pre>')




CREATE TABLE encrypted_files (
    file_path VARCHAR(255) NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (file_path, user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE firewall_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
   rule TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


 UPDATE universal_tasks
 SET
     title = CASE id
        WHEN 4 THEN 'Level 4: Encrypt the Evidence'
        WHEN 5 THEN 'Level 5: The Multi-Hash Challenge'
    END,
    description = CASE id
         WHEN 4 THEN 'A sensitive file is located at ''/home/user/sensitive_data.txt''. Encrypt it with the password ''TopSecret#9900'' to protect 
      it.'
         WHEN 5 THEN 'Your account is protected by a multi-hash authentication. You need to crack 5 MD5 hashes to get the passwords. Check your 
      email from admin@cybox.app for the hashes.'
    END,
     points = CASE id
         WHEN 4 THEN 200
         WHEN 5 THEN 150
    END,
     task_data = CASE id
        WHEN 4 THEN '{\"file_path\": \"/home/user/sensitive_data.txt\", \"password\": \"TopSecret#9900\"}'
         WHEN 5 THEN '{\"passwords\": [\"User321\", \"adminIam230\", \"mod78mod\", \"Klein679\", \"Roco89080\"]}'
     END,
     level = CASE id
         WHEN 4 THEN 4
         WHEN 5 THEN 5
     END
WHERE id IN (4, 5);