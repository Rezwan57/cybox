mod db;
mod handlers;
mod models;
mod utils;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            // Task Commands
            handlers::task::get_universal_tasks,
            handlers::task::get_user_tasks,
            handlers::task::complete_task,
            
            
            handlers::task::verify_file_encryption,
            handlers::task::verify_hidden_file,
            handlers::task::verify_email_classification,
            handlers::task::verify_strong_password_task,
            handlers::task::reset_user_task,
            // Bank Commands
            handlers::bank::award_points,
            // Existing Commands
            handlers::auth::login,
            handlers::account::create_account,
            handlers::account::get_user_details,
            handlers::account::update_user_info,
            handlers::account::delete_account,
            handlers::auth::verify_user,
            handlers::auth::change_password,
            handlers::auth::reset_password,
            handlers::bank::create_bank_account,
            handlers::bank::get_bank_details,
            handlers::bank::get_transactions,
            handlers::bank::update_card_details,
            handlers::bank::generate_new_card,
            // Service Commands
            handlers::service::get_all_services,
            handlers::service::get_user_services,
            handlers::service::purchase_service,
            handlers::mail::get_emails,
            handlers::mail::mark_email_as_read,
            handlers::mail::delete_email,
            handlers::mail::classify_email,
            handlers::settings::get_settings,
            handlers::settings::update_settings,
            handlers::fs::encrypt_file,
            handlers::fs::is_file_encrypted,
            handlers::fs::decrypt_file_content,

            // Firewall Commands
            handlers::firewall::list_firewall_rules,
            handlers::firewall::add_firewall_rule,
            handlers::firewall::remove_firewall_rule
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri app");
}
