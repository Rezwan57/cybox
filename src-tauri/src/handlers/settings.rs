use crate::db;
use crate::models::settings::Settings;
use mysql::prelude::*;
use mysql::params;

#[tauri::command]
#[allow(dead_code)]
pub fn get_settings(user_id: i32) -> Result<Option<Settings>, String> {
    let mut conn = db::get_db_connection().map_err(|e| e.to_string())?;
    let query = r#"
        SELECT
            user_id, two_fa, biometric_auth, session_timeout, login_attempts, firewall, vpn,
            usb_protection, email_filter, spoofed_mac, ip, dns, wifi, proxy_server, tor_enabled,
            port_scanning, sandbox_mode, honeypot, anti_forensics, crypto_mining, kernel_protection,
            memory_encryption, network_monitoring, keylogger_detection, behavior_analysis,
            traffic_analysis, evidence_collection, memory_dumps, disk_imaging, encryption_key,
            hash_algorithm
        FROM user_settings WHERE user_id = ?
    "#;

    let result: Option<Settings> = conn.exec_first(query, (user_id,))
        .map_err(|e| e.to_string())?;

    Ok(result)
}

#[tauri::command]
#[allow(dead_code)]
pub fn update_settings(settings: Settings) -> Result<(), String> {
    let mut conn = db::get_db_connection().map_err(|e| e.to_string())?;
    let query = r#"
        UPDATE user_settings
        SET
            two_fa = :two_fa,
            biometric_auth = :biometric_auth,
            session_timeout = :session_timeout,
            login_attempts = :login_attempts,
            firewall = :firewall,
            vpn = :vpn,
            usb_protection = :usb_protection,
            email_filter = :email_filter,
            spoofed_mac = :spoofed_mac,
            ip = :ip,
            dns = :dns,
            wifi = :wifi,
            proxy_server = :proxy_server,
            tor_enabled = :tor_enabled,
            port_scanning = :port_scanning,
            sandbox_mode = :sandbox_mode,
            honeypot = :honeypot,
            anti_forensics = :anti_forensics,
            crypto_mining = :crypto_mining,
            kernel_protection = :kernel_protection,
            memory_encryption = :memory_encryption,
            network_monitoring = :network_monitoring,
            keylogger_detection = :keylogger_detection,
            behavior_analysis = :behavior_analysis,
            traffic_analysis = :traffic_analysis,
            evidence_collection = :evidence_collection,
            memory_dumps = :memory_dumps,
            disk_imaging = :disk_imaging,
            encryption_key = :encryption_key,
            hash_algorithm = :hash_algorithm
        WHERE user_id = :user_id
    "#;

    conn.exec_drop(
        query,
        params! {
            "two_fa" => settings.two_fa,
            "biometric_auth" => settings.biometric_auth,
            "session_timeout" => settings.session_timeout.clone(),
            "login_attempts" => settings.login_attempts.clone(),
            "firewall" => settings.firewall,
            "vpn" => settings.vpn,
            "usb_protection" => settings.usb_protection,
            "email_filter" => settings.email_filter,
            "spoofed_mac" => settings.spoofed_mac.clone(),
            "ip" => settings.ip.clone(),
            "dns" => settings.dns.clone(),
            "wifi" => settings.wifi.clone(),
            "proxy_server" => settings.proxy_server.clone(),
            "tor_enabled" => settings.tor_enabled,
            "port_scanning" => settings.port_scanning,
            "sandbox_mode" => settings.sandbox_mode,
            "honeypot" => settings.honeypot,
            "anti_forensics" => settings.anti_forensics,
            "crypto_mining" => settings.crypto_mining,
            "kernel_protection" => settings.kernel_protection,
            "memory_encryption" => settings.memory_encryption,
            "network_monitoring" => settings.network_monitoring,
            "keylogger_detection" => settings.keylogger_detection,
            "behavior_analysis" => settings.behavior_analysis,
            "traffic_analysis" => settings.traffic_analysis,
            "evidence_collection" => settings.evidence_collection,
            "memory_dumps" => settings.memory_dumps,
            "disk_imaging" => settings.disk_imaging,
            "encryption_key" => settings.encryption_key.clone(),
            "hash_algorithm" => settings.hash_algorithm.clone(),
            "user_id" => settings.user_id,
        },
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}