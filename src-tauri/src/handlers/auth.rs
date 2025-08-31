use crate::{db, handlers::task::complete_task};
use crate::models::user::User;
use crate::utils::crypto;
use mysql::{params, prelude::*};
use tauri::command;
use regex::Regex;

fn is_password_strong(password: &str) -> bool {
    let has_uppercase = Regex::new(r"[A-Z]").unwrap().is_match(password);
    let has_lowercase = Regex::new(r"[a-z]").unwrap().is_match(password);
    let has_digit = Regex::new(r"\d").unwrap().is_match(password);
    let has_symbol = Regex::new(r"\W").unwrap().is_match(password); 

    password.len() >= 12 && has_uppercase && has_lowercase && has_digit && has_symbol
}

#[command]
pub fn login(name: String, password: String) -> Result<User, String> {
    let mut conn = db::get_db_connection().map_err(|e| e.to_string())?;
    let hashed_password = crypto::hash_password(&password);

    let query = "SELECT id, device_name, name, ip, mac, created_at FROM users WHERE name = :name AND password = :password";
    
    let row: Option<mysql::Row> = conn.exec_first(query, params! {
        "name" => &name,
        "password" => &hashed_password,
    }).map_err(|e| e.to_string())?;

    row.map(|r| {
        // Explicitly define the tuple type to fix the type inference error
        User::from(r)
    }).ok_or_else(|| "Invalid username or password".to_string())
}

#[command]
pub fn verify_user(name: String, password: String) -> Result<bool, String> {
    let mut conn = db::get_db_connection().map_err(|e| e.to_string())?;
    let hashed_password = crypto::hash_password(&password);

    let query = r"SELECT COUNT(*) FROM users WHERE name = :name AND password = :password";
    let count: u64 = conn
        .exec_first(
            query,
            params! {
                "name" => name,
                "password" => hashed_password,
            },
        )
        .map_err(|e| e.to_string())?
        .unwrap_or(0);

    Ok(count > 0)
}

#[command]
pub fn change_password(
    name: String,
    old_password: String,
    new_password: String,
) -> Result<String, String> {
    let mut conn = db::get_db_connection().map_err(|e| e.to_string())?;

    // Verify old password
    if !verify_user(name.clone(), old_password)? {
        return Err("Invalid current password".to_string());
    }

    // Check new password strength
    if !is_password_strong(&new_password) {
        return Err("New password is not strong enough. It must be at least 12 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol.".to_string());
    }

    let new_hashed_password = crypto::hash_password(&new_password);

    conn.exec_drop(
        "UPDATE users SET password = :password WHERE name = :name",
        params! {
            "password" => new_hashed_password,
            "name" => name
        },
    )
    .map_err(|e| e.to_string())?;

    Ok("Password changed successfully".to_string())
}

#[command]
pub fn reset_password(name: String) -> Result<String, String> {
    let mut conn = db::get_db_connection().map_err(|e| e.to_string())?;

    // Generate new password
    let new_password = crate::utils::generators::generate_password(12);
    let new_hashed_password = crypto::hash_password(&new_password);

    let result: Vec<_> = conn
        .exec_iter(
            "UPDATE users SET password = :password WHERE name = :name",
            params! {
                "password" => new_hashed_password,
                "name" => name.clone()
            },
        )
        .map_err(|e| e.to_string())?
        .collect();

    let affected_rows = result.len() as u64;

    if affected_rows == 0 {
        return Err("User not found".to_string());
    }

    // Get the user ID from the database
    let user_id: u64 = conn.exec_first(
        "SELECT id FROM users WHERE name = :name",
        params! { "name" => &name }
    ).map_err(|e| e.to_string())?.ok_or_else(|| "User not found.".to_string())?;

    // Mark Level 2 as complete
    complete_task(2, user_id)?;

    Ok(format!(
        "Password reset successfully. New password: {}",
        new_password
    ))
}
