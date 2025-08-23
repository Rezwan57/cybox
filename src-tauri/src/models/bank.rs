use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct BankAccount {
    pub id: u64,
    pub user_id: u64,
    pub balance: f64,
    pub account_number: String,
    pub card_number: String,
    pub cvc: String,
    pub expiry_date: String,
    pub created_at: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct CreateBankAccountRequest {
    pub user_id: u64,
}

#[derive(Debug, Deserialize)]
pub struct UpdateCardRequest {
    pub user_id: u64,
    pub generate_new_card: bool,
}