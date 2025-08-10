use crate::db;
use crate::utils::crypto;
use mysql::{params, prelude::*};
use tauri::command;

#[command]
pub fn verify_user(name: String, password: String) -> Result<bool, String> {
    let mut conn = db::get_db_connection().map_err(|e| e.to_string())?;
    let hashed_password = crypto::hash_password(&password);
    
    let query = r"SELECT COUNT(*) FROM users WHERE name = :name AND password = :password";
    let count: u64 = conn.exec_first(query, params! {
        "name" => name,
        "password" => hashed_password,
    }).map_err(|e| e.to_string())?.unwrap_or(0);
    
    Ok(count > 0)
}

#[command]
pub fn change_password(name: String, old_password: String, new_password: String) -> Result<String, String> {
    let mut conn = db::get_db_connection().map_err(|e| e.to_string())?;
    
    // Verify old password
    if !verify_user(name.clone(), old_password)? {
        return Err("Invalid current password".to_string());
    }
    
    let new_hashed_password = crypto::hash_password(&new_password);
    
    conn.exec_drop(
        "UPDATE users SET password = :password WHERE name = :name",
        params! {
            "password" => new_hashed_password,
            "name" => name
        }
    ).map_err(|e| e.to_string())?;
    
    Ok("Password changed successfully".to_string())
}

#[command]
pub fn reset_password(name: String) -> Result<String, String> {
    let mut conn = db::get_db_connection().map_err(|e| e.to_string())?;
    
    // Generate new password
    let new_password = crate::utils::generators::generate_password(12);
    let new_hashed_password = crypto::hash_password(&new_password);
    
    let result: Vec<_> = conn.exec_iter(
        "UPDATE users SET password = :password WHERE name = :name",
        params! {
            "password" => new_hashed_password,
            "name" => name
        }
    ).map_err(|e| e.to_string())?.collect();

    let affected_rows = result.len() as u64;
    
    if affected_rows == 0 {
        return Err("User not found".to_string());
    }
    
    Ok(format!("Password reset successfully. New password: {}", new_password))
}