use serde::{Serialize, Deserialize};


#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Settings {
    pub user_id: i32,
    pub two_fa: bool,
    pub biometric_auth: bool,
    pub session_timeout: Option<String>,
    pub login_attempts: Option<String>,
    pub firewall: bool,
    pub vpn: bool,
    pub usb_protection: bool,
    pub email_filter: bool,
    pub spoofed_mac: Option<String>,
    pub ip: Option<String>,
    pub dns: Option<String>,
    pub wifi: Option<String>,
    pub proxy_server: Option<String>,
    pub tor_enabled: bool,
    pub port_scanning: bool,
    pub sandbox_mode: bool,
    pub honeypot: bool,
    pub anti_forensics: bool,
    pub crypto_mining: bool,
    pub kernel_protection: bool,
    pub memory_encryption: bool,
    pub network_monitoring: bool,
    pub keylogger_detection: bool,
    pub behavior_analysis: bool,
    pub traffic_analysis: bool,
    pub evidence_collection: bool,
    pub memory_dumps: bool,
    pub disk_imaging: bool,
    pub encryption_key: Option<String>,
    pub hash_algorithm: Option<String>,
}

// Manual implementation using tuple extraction due to struct size
impl mysql::prelude::FromRow for Settings {
    fn from_row(row: mysql::Row) -> Self {
        let user_id = row.get::<i32, _>(0).unwrap();
        let two_fa = row.get::<bool, _>(1).unwrap();
        let biometric_auth = row.get::<bool, _>(2).unwrap();
        let session_timeout = row.get::<Option<String>, _>(3).unwrap();
        let login_attempts = row.get::<Option<String>, _>(4).unwrap();
        let firewall = row.get::<bool, _>(5).unwrap();
        let vpn = row.get::<bool, _>(6).unwrap();
        let usb_protection = row.get::<bool, _>(7).unwrap();
        let email_filter = row.get::<bool, _>(8).unwrap();
        let spoofed_mac = row.get::<Option<String>, _>(9).unwrap();
        let ip = row.get::<Option<String>, _>(10).unwrap();
        let dns = row.get::<Option<String>, _>(11).unwrap();
        let wifi = row.get::<Option<String>, _>(12).unwrap();
        let proxy_server = row.get::<Option<String>, _>(13).unwrap();
        let tor_enabled = row.get::<bool, _>(14).unwrap();
        let port_scanning = row.get::<bool, _>(15).unwrap();
        let sandbox_mode = row.get::<bool, _>(16).unwrap();
        let honeypot = row.get::<bool, _>(17).unwrap();
        let anti_forensics = row.get::<bool, _>(18).unwrap();
        let crypto_mining = row.get::<bool, _>(19).unwrap();
        let kernel_protection = row.get::<bool, _>(20).unwrap();
        let memory_encryption = row.get::<bool, _>(21).unwrap();
        let network_monitoring = row.get::<bool, _>(22).unwrap();
        let keylogger_detection = row.get::<bool, _>(23).unwrap();
        let behavior_analysis = row.get::<bool, _>(24).unwrap();
        let traffic_analysis = row.get::<bool, _>(25).unwrap();
        let evidence_collection = row.get::<bool, _>(26).unwrap();
        let memory_dumps = row.get::<bool, _>(27).unwrap();
        let disk_imaging = row.get::<bool, _>(28).unwrap();
        let encryption_key = row.get::<Option<String>, _>(29).unwrap();
        let hash_algorithm = row.get::<Option<String>, _>(30).unwrap();

        Settings {
            user_id,
            two_fa,
            biometric_auth,
            session_timeout,
            login_attempts,
            firewall,
            vpn,
            usb_protection,
            email_filter,
            spoofed_mac,
            ip,
            dns,
            wifi,
            proxy_server,
            tor_enabled,
            port_scanning,
            sandbox_mode,
            honeypot,
            anti_forensics,
            crypto_mining,
            kernel_protection,
            memory_encryption,
            network_monitoring,
            keylogger_detection,
            behavior_analysis,
            traffic_analysis,
            evidence_collection,
            memory_dumps,
            disk_imaging,
            encryption_key,
            hash_algorithm,
        }
    }

    fn from_row_opt(row: mysql::Row) -> Result<Self, mysql::FromRowError> {
        Ok(Self::from_row(row))
    }
}