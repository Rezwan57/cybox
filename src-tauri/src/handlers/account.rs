use crate::db;
use crate::models::user::{UserDetails, CreateUserRequest, UpdateUserRequest};
use crate::utils::{generators, crypto};
use mysql::prelude::*;
use tauri::command;
use mysql::params;


#[command]
pub fn create_account(request: CreateUserRequest) -> Result<String, String> {
    let mut conn = db::get_db_connection().map_err(|e| e.to_string())?;
    let mut tx = conn.start_transaction(mysql::TxOpts::default()).map_err(|e| e.to_string())?;

    let hashed_password = crypto::hash_password(&request.password);
    let ip_address = generators::generate_ip_address();
    let mac_address = generators::generate_mac_address();

    let transaction_result: Result<(), mysql::Error> = (|| {
        tx.exec_drop(
            r"INSERT INTO users (device_name, name, password, ip, mac)
              VALUES (:device_name, :name, :password, :ip, :mac)",
            params! {
                "device_name" => &request.device_name,
                "name" => &request.name,
                "password" => &hashed_password,
                "ip" => &ip_address,
                "mac" => &mac_address
            }
        )?;

        let user_id = tx.last_insert_id().ok_or_else(|| mysql::Error::DriverError(mysql::DriverError::CouldNotConnect(None)))?;

        tx.exec_drop(
            r"INSERT INTO user_settings (user_id) VALUES (?)",
            (user_id,)
        )?;

        let account_number = generators::generate_account_number();
        let card_number = generators::generate_card_number();
        let cvc = generators::generate_cvc();
        let expiry_date = generators::generate_expiry_date();

        tx.exec_drop(
            r"INSERT INTO bank_accounts (user_id, account_number, card_number, cvc, expiry_date)
              VALUES (:user_id, :account_number, :card_number, :cvc, :expiry_date)",
            params! {
                "user_id" => user_id,
                "account_number" => &account_number,
                "card_number" => &card_number,
                "cvc" => &cvc,
                "expiry_date" => &expiry_date
            }
        )?;

        // Populate user_emails with universal emails
        let universal_email_ids: Vec<i32> = tx.exec_map(
            "SELECT id FROM universal_emails",
            (),
            |id: i32| id,
        )?;

        for universal_email_id in universal_email_ids {
            tx.exec_drop(
                r"INSERT INTO user_emails (user_id, universal_email_id, is_read, classification)
                  VALUES (:user_id, :universal_email_id, false, 'none')",
                params! {
                    "user_id" => user_id,
                    "universal_email_id" => universal_email_id,
                }
            )?;
        }

        Ok(())
    })();

    match transaction_result {
        Ok(_) => {
            tx.commit().map_err(|e| e.to_string())?;
            Ok("Account and bank account created successfully.".to_string())
        }
        Err(e) => {
            tx.rollback().map_err(|e| e.to_string())?;
            Err(e.to_string())
        }
    }
}

#[command]
pub fn get_user_details(name: String) -> Result<Option<UserDetails>, String> {
    let mut conn = db::get_db_connection().map_err(|e| e.to_string())?;
    
    let query = r"
        SELECT u.id, u.device_name, u.name, u.ip, u.mac,
               b.id as bank_id, b.balance, b.account_number, b.card_number, b.cvc, b.expiry_date
        FROM users u
        LEFT JOIN bank_accounts b ON u.id = b.user_id
        WHERE u.name = :name
    ";
    
    let result: Option<(u64, String, String, String, String, Option<u64>, Option<f64>, Option<String>, Option<String>, Option<String>, Option<String>)> = 
        conn.exec_first(query, params! { "name" => name })
        .map_err(|e| e.to_string())?;

    match result {
        Some((id, device_name, name, ip, mac, bank_id, balance, acc_num, card_num, cvc, exp)) => {
            let bank_account = if let (Some(bank_id), Some(balance), Some(acc_num), Some(card_num), Some(cvc), Some(exp)) = 
                (bank_id, balance, acc_num, card_num, cvc, exp) {
                Some(crate::models::bank::BankAccount {
                    id: bank_id,
                    user_id: id,
                    balance,
                    account_number: acc_num,
                    card_number: card_num,
                    cvc,
                    expiry_date: exp,
                    created_at: None,
                })
            } else {
                None
            };

            Ok(Some(UserDetails {
                id,
                device_name,
                name,
                ip,
                mac,
                bank_account,
            }))
        }
        None => Ok(None)
    }
}

#[command]
pub fn update_user_info(user_id: u64, request: UpdateUserRequest) -> Result<String, String> {
    let mut conn = db::get_db_connection().map_err(|e| e.to_string())?;
    
    let mut updates = Vec::new();
    let mut params_vec = Vec::new();
    
    if let Some(device_name) = &request.device_name {
        updates.push("device_name = ?");
        params_vec.push(device_name.clone());
    }
    
    if let Some(ip) = &request.ip {
        updates.push("ip = ?");
        params_vec.push(ip.clone());
    }
    
    if let Some(mac) = &request.mac {
        updates.push("mac = ?");
        params_vec.push(mac.clone());
    }
    
    if updates.is_empty() {
        return Err("No fields to update".to_string());
    }
    
    params_vec.push(user_id.to_string());
    let query = format!("UPDATE users SET {} WHERE id = ?", updates.join(", "));
    
    conn.exec_drop(&query, params_vec).map_err(|e| e.to_string())?;
    
    Ok("User information updated successfully".to_string())
}

#[command]
pub fn delete_account(user_id: u64) -> Result<String, String> {
    let mut conn = db::get_db_connection().map_err(|e| e.to_string())?;
    
    let mut tx = conn.start_transaction(mysql::TxOpts::default())
        .map_err(|e| e.to_string())?;
    
    tx.exec_drop(
        "DELETE FROM bank_accounts WHERE user_id = :user_id",
        params! { "user_id" => user_id }
    ).map_err(|e| e.to_string())?;
    
    tx.exec_drop(
        "DELETE FROM users WHERE id = :user_id",
        params! { "user_id" => user_id }
    ).map_err(|e| e.to_string())?;
    let affected_rows = tx.affected_rows();
    
    if affected_rows == 0 {
        tx.rollback().map_err(|e| e.to_string())?;
        return Err("User not found".to_string());
    }
    
    tx.commit().map_err(|e| e.to_string())?;
    Ok("Account deleted successfully".to_string())
}
