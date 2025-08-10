use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    pub id: u64,
    pub device_name: String,
    pub name: String,
    pub ip: String,
    pub mac: String,
    pub created_at: Option<String>,
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