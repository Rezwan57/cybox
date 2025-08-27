use crate::db;
use crate::models::mail::Email;
use mysql::prelude::*;

#[tauri::command]
pub fn get_emails(user_id: i32) -> Result<Vec<Email>, String> {
    println!("Fetching emails for user: {}", user_id);
    let mut conn = db::get_db_connection().map_err(|e| e.to_string())?;
    
    let insert_query = r#"
        INSERT INTO user_emails (user_id, universal_email_id, is_read, classification)
        SELECT ?, ue.id, false, 'none'
        FROM universal_emails ue
        WHERE NOT EXISTS (
            SELECT 1
            FROM user_emails
            WHERE user_id = ? AND universal_email_id = ue.id
        )
    "#;
    conn.exec_drop(insert_query, (user_id, user_id)).map_err(|e| e.to_string())?;

    let query = r#"
        SELECT
            ue.id,
            ue.user_id,
            ue.universal_email_id,
            ue.is_read,
            ue.classification,
            ue.created_at,
            ue_universal.from_user,
            ue_universal.subject,
            ue_universal.body
        FROM user_emails ue
        JOIN universal_emails ue_universal ON ue.universal_email_id = ue_universal.id
        WHERE ue.user_id = ?
        ORDER BY ue.created_at DESC
    "#;

    let emails = conn
        .exec_map(
            query,
            (user_id,),
            |(id, user_id, universal_email_id, is_read, classification, created_at, from_user, subject, body): (
                i32,
                i32,
                i32,
                bool,
                String,
                chrono::NaiveDateTime,
                String,
                String,
                String,
            )| Email {
                id,
                user_id,
                universal_email_id,
                is_read,
                classification,
                created_at,
                from_user,
                subject,
                body,
            },
        )
        .map_err(|e| e.to_string())?;

    println!("Found {} emails for user: {}", emails.len(), user_id);
    Ok(emails)
}

#[tauri::command]
pub fn mark_email_as_read(email_id: i32) -> Result<(), String> {
    let mut conn = db::get_db_connection().map_err(|e| e.to_string())?;
    conn.exec_drop(
        "UPDATE user_emails SET is_read = true WHERE id = ?",
        (email_id,),
    )
    .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn delete_email(email_id: i32) -> Result<(), String> {
    let mut conn = db::get_db_connection().map_err(|e| e.to_string())?;
    conn.exec_drop("DELETE FROM user_emails WHERE id = ?", (email_id,))
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn classify_email(email_id: i32, classification: String) -> Result<(), String> {
    let mut conn = db::get_db_connection().map_err(|e| e.to_string())?;
    conn.exec_drop(
        "UPDATE user_emails SET classification = ? WHERE id = ?",
        (classification, email_id),
    )
    .map_err(|e| e.to_string())?;
    Ok(())
}

// #[tauri::command]
// pub fn send_email(from_user: String, to_user: String, subject: String, body: String) -> Result<(), String> {
//     let mut conn = db::get_db_connection().map_err(|e| e.to_string())?;
//     conn.exec_drop(
//         "INSERT INTO emails (from_user, to_user, subject, body, is_read, classification) VALUES (?, ?, ?, ?, false, 'none')",
//         (from_user, to_user, subject, body),
//     )
//     .map_err(|e| e.to_string())?;
//     Ok(())
// }

