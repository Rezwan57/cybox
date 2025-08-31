use crate::{db, handlers::task::complete_task};
use mysql::params;
use mysql::prelude::*;
use tauri::command;

#[command]
pub fn encrypt_file(file_path: String, password: String, user_id: u64) -> Result<String, String> {
    if file_path == "/home/user/sensitive_data.txt" && password == "TopSecret#9900" {
        let mut conn = db::get_db_connection().map_err(|e| e.to_string())?;
        conn.exec_drop(
            "INSERT IGNORE INTO encrypted_files (file_path, user_id) VALUES (:file_path, :user_id)",
            params! { "file_path" => &file_path, "user_id" => user_id },
        )
        .map_err(|e| e.to_string())?;

        // Mark Level 4 as complete
        complete_task(4, user_id)?;

        Ok("File encrypted successfully.".to_string())
    } else {
        Err("Invalid file path or password.".to_string())
    }
}

#[command]
pub fn is_file_encrypted(file_path: String, user_id: u64) -> Result<bool, String> {
    let mut conn = db::get_db_connection().map_err(|e| e.to_string())?;
    let query =
        "SELECT COUNT(*) FROM encrypted_files WHERE file_path = :file_path AND user_id = :user_id";
    let count: u64 = conn
        .exec_first(
            query,
            params! { "file_path" => &file_path, "user_id" => user_id },
        )
        .map_err(|e| e.to_string())?
        .unwrap_or(0);
    Ok(count > 0)
}

#[command]
pub fn delete_encrypted_file_entry(file_path: String, user_id: u64) -> Result<String, String> {
    let mut conn = db::get_db_connection().map_err(|e| e.to_string())?;
    conn.exec_drop(
        "DELETE FROM encrypted_files WHERE file_path = :file_path AND user_id = :user_id",
        params! { "file_path" => &file_path, "user_id" => user_id },
    )
    .map_err(|e| e.to_string())?;
    Ok("Encrypted file entry deleted successfully.".to_string())
}

#[command]
pub fn decrypt_file_content(file_path: String, password: String) -> Result<String, String> {
    if file_path == "/home/user/sensitive_data.txt" && password == "TopSecret#9900" {
        Ok("Hash Passwords:

261e672695a654895fed24313e5246de

81888ab915f5e5363bc4ee7220805c74

9594de8de31942437651eb4162554253

007587d6d21505c9f73c140a4518c580

59a84b33a4aa9e6953051510396308b1

27313a3e077d07b1eb97c745509313bf

80a871b60516a8724d628c129d91d618

5f4dcc3b5aa765d61d8327deb882cf99

850e217e5a9fe749cb9aea7e050bdb88"
            .to_string())
    } else {
        Err("Invalid password.".to_string())
    }
}
