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
            handlers::settings::update_settings
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri app");
}
