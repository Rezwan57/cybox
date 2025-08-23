use crate::db;
use crate::models::service::Service;
use mysql::{prelude::*, params};
use tauri::command;
use chrono::NaiveDate;
use rust_decimal::Decimal;

#[command]
pub fn get_all_services() -> Result<Vec<Service>, String> {
    let mut conn = db::get_db_connection().map_err(|e| e.to_string())?;
    let query = "SELECT id, name, description, price, category, features, icon_path, version, developer, release_date, is_important FROM services";

    let services = conn
        .exec_map(
            query,
            (),
            |(
                id,
                name,
                description,
                price,
                category,
                features,
                icon_path,
                version,
                developer,
                release_date,
                is_important,
            ): (
                i32,
                String,
                Option<String>,
                Option<i32>,
                Option<String>,
                Option<String>,
                Option<String>,
                Option<String>,
                Option<String>,
                Option<NaiveDate>,
                Option<bool>,
            )| Service {
                id,
                name,
                description,
                price,
                category,
                features,
                icon_path,
                version,
                developer,
                release_date,
                is_important,
            },
        )
        .map_err(|e| e.to_string())?;

    Ok(services)
}

#[command]
pub fn get_user_services(user_id: i32) -> Result<Vec<i32>, String> {
    let mut conn = db::get_db_connection().map_err(|e| e.to_string())?;
    let query = "SELECT service_id FROM user_services WHERE user_id = ?";

    let service_ids = conn
        .exec_map(query, (user_id,), |(service_id,): (i32,)| service_id)
        .map_err(|e| e.to_string())?;

    Ok(service_ids)
}

#[command]
pub fn purchase_service(user_id: i32, service_id: i32, price: Decimal) -> Result<(), String> {
    let mut conn = db::get_db_connection().map_err(|e| e.to_string())?;
    let mut tx = conn.start_transaction(mysql::TxOpts::default()).map_err(|e| e.to_string())?;

    let balance: Option<Decimal> = tx.exec_first(
        "SELECT balance FROM bank_accounts WHERE user_id = :user_id FOR UPDATE",
        params! { "user_id" => user_id }
    ).map_err(|e| e.to_string())?;

    let balance = match balance {
        Some(b) => b,
        None => {
            tx.rollback().map_err(|e| e.to_string())?;
            return Err("Bank account not found".to_string());
        }
    };

    if balance < price {
        tx.rollback().map_err(|e| e.to_string())?;
        return Err("Not enough points".to_string());
    }

    if let Err(e) = tx.exec_drop(
        "UPDATE bank_accounts SET balance = balance - :price WHERE user_id = :user_id",
        params! { "price" => price, "user_id" => user_id }
    ) {
        tx.rollback().map_err(|e| e.to_string())?;
        return Err(e.to_string());
    }

    if let Err(e) = tx.exec_drop(
        "INSERT IGNORE INTO user_services (user_id, service_id) VALUES (:user_id, :service_id)",
        params! { "user_id" => user_id, "service_id" => service_id }
    ) {
        tx.rollback().map_err(|e| e.to_string())?;
        return Err(e.to_string());
    }

    tx.commit().map_err(|e| e.to_string())?;

    Ok(())
}