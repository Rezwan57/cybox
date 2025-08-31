use crate::db::get_db_connection;
use crate::models::firewall::FirewallRule;
use mysql::prelude::Queryable;

#[tauri::command]
pub fn list_firewall_rules(user_id: u32) -> Result<Vec<FirewallRule>, String> {
    let mut conn = get_db_connection().map_err(|e| e.to_string())?;
    let rules = conn
        .query_map(
            format!("SELECT id, user_id, rule FROM firewall_rules WHERE user_id = {}", user_id),
            |(id, user_id, rule)| FirewallRule { id, user_id, rule },
        )
        .map_err(|e| e.to_string())?;
    Ok(rules)
}


#[tauri::command]
pub fn add_firewall_rule(user_id: u32, rule: String) -> Result<String, String> {
    let mut conn = get_db_connection().map_err(|e| e.to_string())?;
    conn.exec_drop(
        "INSERT INTO firewall_rules (user_id, rule) VALUES (?, ?)",
        (user_id, rule),
    )
    .map_err(|e| e.to_string())?;
    Ok("Rule added successfully".to_string())
}

#[tauri::command]
pub fn remove_firewall_rule(user_id: u32, rule: String) -> Result<String, String> {
    let mut conn = get_db_connection().map_err(|e| e.to_string())?;
    conn.exec_drop(
        "DELETE FROM firewall_rules WHERE user_id = ? AND rule = ?",
        (user_id, rule),
    )
    .map_err(|e| e.to_string())?;
    Ok("Rule removed successfully".to_string())
}
