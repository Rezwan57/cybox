use crate::{
    db,
    models::task::{UniversalTask, UserTask},
    utils::crypto,
};
use mysql::prelude::*;
use mysql::params;

/// Get all universal tasks from the database
#[tauri::command]
pub fn get_universal_tasks() -> Result<Vec<UniversalTask>, String> {
    let mut conn = db::get_db_connection().map_err(|e| e.to_string())?;
    let query = "SELECT id, title, description, learning_module, points, task_type, task_data, level FROM universal_tasks ORDER BY id ASC";

    let universal_tasks = conn
        .exec_map(
            query,
            (), // no params
            |(id, title, description, learning_module, points, task_type, task_data, level): (
                u64,
                String,
                String,
                Option<String>,
                i32,
                String,
                Option<String>,
                i32,
            )| UniversalTask {
                id,
                title,
                description,
                learning_module,
                points,
                task_type,
                task_data,
                level,
            },
        )
        .map_err(|e| e.to_string())?;

    Ok(universal_tasks)
}

/// Get tasks assigned to a specific user
#[tauri::command]
pub fn get_user_tasks(user_id: u64) -> Result<Vec<UserTask>, String> {
    let mut conn = db::get_db_connection().map_err(|e| e.to_string())?;
    let query = "SELECT id, user_id, universal_task_id, status, completed_at, created_at FROM user_tasks WHERE user_id = ?";

    let user_tasks = conn
        .exec_map(
            query,
            (user_id,),
            |(id, user_id, universal_task_id, status, completed_at, created_at): (u64, u64, u64, String, Option<chrono::NaiveDateTime>, chrono::NaiveDateTime)| UserTask {
                id,
                user_id,
                universal_task_id,
                status,
                completed_at,
                created_at,
            },
        )
        .map_err(|e| e.to_string())?;

    Ok(user_tasks)
}

/// Mark a task as complete for a user and award points
#[tauri::command]
pub fn complete_task(task_id: u64, user_id: u64) -> Result<String, String> {
    let mut conn = db::get_db_connection().map_err(|e| e.to_string())?;

    // Get points for the universal task
    let universal_task_points: Option<i32> = conn.exec_first(
        "SELECT points FROM universal_tasks WHERE id = :universal_task_id",
        params! { "universal_task_id" => task_id }
    ).map_err(|e| e.to_string())?;

    let points_to_award = universal_task_points.ok_or_else(|| "Universal task not found.".to_string())?;

    // Always try to insert or update the user_task to "Completed"
    let query = "INSERT INTO user_tasks (user_id, universal_task_id, status, completed_at) VALUES (:user_id, :universal_task_id, 'Completed', NOW()) ON DUPLICATE KEY UPDATE status = 'Completed', completed_at = NOW()";
    conn.exec_drop(query, mysql::params! {
        "user_id" => user_id,
        "universal_task_id" => task_id,
    }).map_err(|e| e.to_string())?;

    // Award points
    super::bank::award_points(user_id, points_to_award)?;

    Ok("Task completed and points awarded.".to_string())
}

#[tauri::command]
pub fn reset_user_task(user_id: u64, universal_task_id: u64) -> Result<String, String> {
    let mut conn = db::get_db_connection().map_err(|e| e.to_string())?;
    conn.exec_drop(
        "UPDATE user_tasks SET status = 'To Do', completed_at = NULL WHERE user_id = :user_id AND universal_task_id = :universal_task_id",
        params! {
            "user_id" => user_id,
            "universal_task_id" => universal_task_id,
        },
    )
    .map_err(|e| e.to_string())?;
    Ok("Task status reset to To Do.".to_string())
}



#[tauri::command]
pub fn verify_file_encryption(file_path: String, user_id: u64) -> Result<bool, String> {
    let mut conn = db::get_db_connection().map_err(|e| e.to_string())?;
    let query = "SELECT COUNT(*) FROM encrypted_files WHERE file_path = :file_path";
    let count: u64 = conn
        .exec_first(query, params! { "file_path" => file_path })
        .map_err(|e| e.to_string())?
        .unwrap_or(0);
    Ok(count > 0)
}

#[tauri::command]
pub fn verify_hidden_file(content: String) -> Result<bool, String> {
    Ok(content == "c_y_b_e_r_s_e_c_u_r_i_t_y")
}

#[tauri::command]
pub fn verify_email_classification(user_id: u64) -> Result<bool, String> {
    let mut conn = db::get_db_connection().map_err(|e| e.to_string())?;

    // Define the required classifications
    let required_classifications: std::collections::HashMap<u64, &str> = 
        [(1, "spam"), (3, "phishing")].iter().cloned().collect();

    // Get user's classifications
    let user_classifications: Vec<(u64, String)> = conn.exec_map(
        "SELECT universal_email_id, classification FROM user_emails WHERE user_id = ?",
        (user_id,),
        |(universal_email_id, classification): (u64, String)| (universal_email_id, classification),
    ).map_err(|e| e.to_string())?;

    let user_classifications_map: std::collections::HashMap<u64, String> = 
        user_classifications.into_iter().collect();

    for (universal_email_id, required_class) in required_classifications {
        match user_classifications_map.get(&universal_email_id) {
            Some(user_class) if user_class == required_class => continue,
            _ => return Ok(false), 
        }
    }

    Ok(true)
}

#[tauri::command]
pub fn verify_strong_password_task(user_id: u64) -> Result<bool, String> {
    let mut conn = db::get_db_connection().map_err(|e| e.to_string())?;

    let password_query = "SELECT password FROM users WHERE id = :user_id";
    let password_hash: Option<String> = conn.exec_first(password_query, params! { "user_id" => user_id })
        .map_err(|e| e.to_string())?;

    if let Some(hash) = password_hash {
        // We assume the default password is 'password'.
        // In a real app, this would be handled more robustly.
        let default_password_hash = crypto::hash_password("password");
        Ok(hash != default_password_hash)
    } else {
        Err("User not found".to_string())
    }
}