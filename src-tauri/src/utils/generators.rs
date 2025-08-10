use rand::Rng;
use chrono::{Datelike, Local};

// Helper function to generate random password
pub fn generate_password(length: usize) -> String {
    const CHARS: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let mut rng = rand::thread_rng();
    (0..length)
        .map(|_| {
            let idx = rng.gen_range(0..CHARS.len());
            CHARS[idx] as char
        })
        .collect()
}

// Helper function to generate random IP address
pub fn generate_ip_address() -> String {
    let mut rng = rand::thread_rng();
    format!(
        "{}.{}.{}.{}",
        rng.gen_range(1..255),
        rng.gen_range(0..255),
        rng.gen_range(0..255),
        rng.gen_range(1..255)
    )
}

// Helper function to generate random MAC address
pub fn generate_mac_address() -> String {
    let mut rng = rand::thread_rng();
    format!(
        "{:02X}:{:02X}:{:02X}:{:02X}:{:02X}:{:02X}",
        rng.gen_range(0..256),
        rng.gen_range(0..256),
        rng.gen_range(0..256),
        rng.gen_range(0..256),
        rng.gen_range(0..256),
        rng.gen_range(0..256)
    )
}

// Helper function to generate account number
pub fn generate_account_number() -> String {
    let mut rng = rand::thread_rng();
    let number: u64 = rng.gen_range(1000000000..9999999999);
    number.to_string()
}

// Helper function to generate card number starting with 0057
pub fn generate_card_number() -> String {
    let mut rng = rand::thread_rng();
    let remaining_digits: u64 = rng.gen_range(100000000000..999999999999);
    format!("0057{}", remaining_digits)
}

// Helper function to generate CVC
pub fn generate_cvc() -> String {
    let mut rng = rand::thread_rng();
    let cvc: u16 = rng.gen_range(100..999);
    cvc.to_string()
}

// Helper function to generate expiry date (2 years from today)
pub fn generate_expiry_date() -> String {
    let now = Local::now();
    let future_year = now.year() + 2;
    let month = now.month();
    format!("{:02}/{}", month, future_year % 100)
}