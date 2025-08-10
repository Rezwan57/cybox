mod db;
mod handlers;
mod models;
mod utils;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            handlers::account::create_account,
            handlers::account::get_user_details,
            handlers::account::update_user_info,
            handlers::account::delete_account,
            handlers::auth::verify_user,
            handlers::auth::change_password,
            handlers::auth::reset_password,
            handlers::bank::create_bank_account,
            handlers::bank::get_bank_details,
            handlers::bank::update_card_details,
            handlers::bank::generate_new_card
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri app");
}

