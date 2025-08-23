use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Email {
    pub id: i32,
    pub user_id: i32,
    pub universal_email_id: i32,
    pub is_read: bool,
    pub classification: String,
    pub created_at: chrono::NaiveDateTime,
    pub from_user: String,
    pub subject: String,
    pub body: String,
}
