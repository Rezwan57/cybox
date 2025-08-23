use serde::{Deserialize, Serialize};
use chrono::NaiveDateTime;

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    pub id: u64,
    pub device_name: String,
    pub name: String,
    pub ip: String,
    pub mac: String,
    pub created_at: NaiveDateTime,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UserDetails {
    pub id: u64,
    pub device_name: String,
    pub name: String,
    pub ip: String,
    pub mac: String,
    pub bank_account: Option<super::bank::BankAccount>,
}

#[derive(Debug, Deserialize)]
pub struct CreateUserRequest {
    pub device_name: String,
    pub name: String,
    pub password: String,
}

#[derive(Debug, Deserialize)]
pub struct UpdateUserRequest {
    pub device_name: Option<String>,
    pub ip: Option<String>,
    pub mac: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LoginResponse {
    pub user: User,
    pub token: String,
}

#[allow(dead_code)]
impl User {
    // Method to create a new User instance
    pub fn new(id: u64, device_name: String, name: String, ip: String, mac: String, created_at: NaiveDateTime) -> Self {
        User {
            id,
            device_name,
            name,
            ip,
            mac,
            created_at,
        }
    }
}

impl From<mysql::Row> for User {
    fn from(row: mysql::Row) -> Self {
        User {
            id: row.get("id").unwrap_or_default(),
            device_name: row.get("device_name").unwrap_or_default(),
            name: row.get("name").unwrap_or_default(),
            ip: row.get("ip").unwrap_or_default(),
            mac: row.get("mac").unwrap_or_default(),
            created_at: row.get::<NaiveDateTime, _>("created_at").unwrap(),
        }
    }
}