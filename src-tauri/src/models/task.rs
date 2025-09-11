use serde::{Deserialize, Serialize};
use chrono::NaiveDateTime;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UniversalTask {
    pub id: u64,
    pub title: String,
    pub description: String,
    pub learning_module: Option<String>,
    pub points: i32,
    pub task_type: String,
    pub task_data: Option<String>,
    pub level: i32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UserTask {
    pub id: u64,
    pub user_id: u64,
    pub universal_task_id: u64,
    pub status: String, // e.g., "To Do", "In Progress", "Completed"
    pub completed_at: Option<NaiveDateTime>,
    pub created_at: NaiveDateTime,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Task {
    pub id: u64,
    pub user_id: u64,
    pub description: String,
    pub completed: bool,
    pub created_at: NaiveDateTime,
}