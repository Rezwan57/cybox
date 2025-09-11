use crate::db;
use crate::models::bank::{BankAccount, CreateBankAccountRequest, UpdateCardRequest, Transaction};
use crate::utils::generators;
use mysql::{params, prelude::*};
use tauri::command;

#[command]
pub fn get_transactions(user_id: u64) -> Result<Vec<Transaction>, String> {
    let mut conn = db::get_db_connection().map_err(|e| e.to_string())?;
    let query = "SELECT id, user_id, description, amount, created_at FROM bank_transactions WHERE user_id = :user_id ORDER BY created_at DESC";
    
    let transactions = conn.exec_map(
        query,
        params! { "user_id" => user_id },
        |(id, user_id, description, amount, created_at): (u64, u64, String, String, chrono::NaiveDateTime)| {
            Transaction {
                id,
                user_id,
                description,
                amount: amount.parse::<f64>().unwrap_or(0.0),
                created_at: created_at.format("%Y-%m-%d %H:%M:%S").to_string(),
            }
        },
    ).map_err(|e| e.to_string())?;

    Ok(transactions)
}

#[command]
pub fn award_points(user_id: u64, amount: i32, description: String) -> Result<(), String> {
    let mut conn = db::get_db_connection().map_err(|e| e.to_string())?;
    let mut tx = conn.start_transaction(mysql::TxOpts::default()).map_err(|e| e.to_string())?;

    tx.exec_drop(
        "UPDATE bank_accounts SET balance = balance + :amount WHERE user_id = :user_id",
        params! { "amount" => amount, "user_id" => user_id },
    ).map_err(|e| e.to_string())?;

    tx.exec_drop(
        "INSERT INTO bank_transactions (user_id, description, amount) VALUES (:user_id, :description, :amount)",
        params! { "user_id" => user_id, "description" => description, "amount" => amount },
    ).map_err(|e| e.to_string())?;

    tx.commit().map_err(|e| e.to_string())?;

    Ok(())
}

#[command]
pub fn create_bank_account(request: CreateBankAccountRequest) -> Result<String, String> {
    let mut conn = db::get_db_connection().map_err(|e| e.to_string())?;

    // Generate bank account details
    let account_number = generators::generate_account_number();
    let card_number = generators::generate_card_number();
    let cvc = generators::generate_cvc();
    let expiry_date = generators::generate_expiry_date();

    conn.exec_drop(
        r"INSERT INTO bank_accounts (user_id, account_number, card_number, cvc, expiry_date)
          VALUES (:user_id, :account_number, :card_number, :cvc, :expiry_date)",
        params! {
            "user_id" => request.user_id,
            "account_number" => &account_number,
            "card_number" => &card_number,
            "cvc" => &cvc,
            "expiry_date" => &expiry_date
        }
    ).map_err(|e| e.to_string())?;

    Ok("Bank account created successfully".to_string())
}

#[command]
pub fn get_bank_details(user_id: u64) -> Result<Option<BankAccount>, String> {
    let mut conn = db::get_db_connection().map_err(|e| e.to_string())?;
    
    let query = r"SELECT id, user_id, balance, account_number, card_number, cvc, expiry_date 
                  FROM bank_accounts WHERE user_id = :user_id";
    
    let result: Option<(u64, u64, f64, String, String, String, String)> = 
        conn.exec_first(query, params! { "user_id" => user_id })
        .map_err(|e| e.to_string())?;

    match result {
        Some((id, user_id, balance, account_number, card_number, cvc, expiry_date)) => {
            Ok(Some(BankAccount {
                id,
                user_id,
                balance,
                account_number,
                card_number,
                cvc,
                expiry_date,
                created_at: None,
            }))
        }
        None => Ok(None)
    }
}

#[command]
pub fn update_card_details(request: UpdateCardRequest) -> Result<String, String> {
    let mut conn = db::get_db_connection().map_err(|e| e.to_string())?;
    
    if request.generate_new_card {
        let new_card_number = generators::generate_card_number();
        let new_cvc = generators::generate_cvc();
        let new_expiry_date = generators::generate_expiry_date();
        
        conn.exec_drop(
            r"UPDATE bank_accounts 
              SET card_number = :card_number, cvc = :cvc, expiry_date = :expiry_date 
              WHERE user_id = :user_id",
            params! {
                "card_number" => &new_card_number,
                "cvc" => &new_cvc,
                "expiry_date" => &new_expiry_date,
                "user_id" => request.user_id
            }
        ).map_err(|e| e.to_string())?;
        
        Ok("New card details generated successfully".to_string())
    } else {
        Err("No update operation specified".to_string())
    }
}

#[command]
pub fn generate_new_card(user_id: u64) -> Result<String, String> {
    update_card_details(UpdateCardRequest {
        user_id,
        generate_new_card: true,
    })
}