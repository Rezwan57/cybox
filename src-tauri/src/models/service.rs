use serde::{Deserialize, Serialize};
use chrono::NaiveDate;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Service {
    pub id: i32,
    pub name: String,
    pub description: Option<String>,
    pub price: Option<i32>,
    pub category: Option<String>,
    pub features: Option<String>,
    pub icon_path: Option<String>,
    pub version: Option<String>,
    pub developer: Option<String>,
    pub release_date: Option<NaiveDate>,
    pub is_important: Option<bool>,
}
