use crate::db;
use crate::models::user::{UserDetails, CreateUserRequest, UpdateUserRequest};
use crate::utils::{generators, crypto};
use mysql::{params, prelude::*};
use tauri::command;


#[command]
pub fn create_account(request: CreateUserRequest) -> Result<String, String> {
    let mut conn = db::get_db_connection().map_err(|e| e.to_string())?;
    let mut tx = conn.start_transaction(mysql::TxOpts::default()).map_err(|e| e.to_string())?;

    let hashed_password = crypto::hash_password(&request.password);
    let ip_address = generators::generate_ip_address();
    let mac_address = generators::generate_mac_address();

    // The transaction logic is wrapped in a closure.
    // If any operation within the closure returns an error, the closure will exit early,
    // and we can roll back the transaction.
    let transaction_result: Result<(), mysql::Error> = (|| {
        // Step 1: Insert user data
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

        // Step 2: Get the ID of the new user
        let user_id = tx.last_insert_id().ok_or_else(|| mysql::Error::DriverError(mysql::DriverError::CouldNotConnect(None)))?;

        // Step 3: Generate bank account details
        let account_number = generators::generate_account_number();
        let card_number = generators::generate_card_number();
        let cvc = generators::generate_cvc();
        let expiry_date = generators::generate_expiry_date();

        // Step 4: Insert the new bank account
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

        Ok(())
    })();

    // Based on the transaction result, commit or roll back
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
               b.id as bank_id, b.account_number, b.card_number, b.cvc, b.expiry_date
        FROM users u
        LEFT JOIN bank_accounts b ON u.id = b.user_id
        WHERE u.name = :name
    ";
    
    let result: Option<(u64, String, String, String, String, Option<u64>, Option<String>, Option<String>, Option<String>, Option<String>)> = 
        conn.exec_first(query, params! { "name" => name })
        .map_err(|e| e.to_string())?;

    match result {
        Some((id, device_name, name, ip, mac, bank_id, acc_num, card_num, cvc, exp)) => {
            let bank_account = if let (Some(bank_id), Some(acc_num), Some(card_num), Some(cvc), Some(exp)) = 
                (bank_id, acc_num, card_num, cvc, exp) {
                Some(crate::models::bank::BankAccount {
                    id: bank_id,
                    user_id: id,
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
    
    // Start transaction
    let mut tx = conn.start_transaction(mysql::TxOpts::default())
        .map_err(|e| e.to_string())?;
    
    // Delete bank accounts first (foreign key constraint)
    tx.exec_drop(
        "DELETE FROM bank_accounts WHERE user_id = :user_id",
        params! { "user_id" => user_id }
    ).map_err(|e| e.to_string())?;
    
    // Delete user
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