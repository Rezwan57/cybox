use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct FirewallRule {
    pub id: i64,
    pub user_id: i64,
    pub rule: String,
}
