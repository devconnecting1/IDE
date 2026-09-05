#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod errors;

use commands::{file_system, terminal, ai_agent};
use errors::AppError;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            // Handle single instance - focus existing window
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.set_focus();
            }
        }))
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            file_system::read_file,
            file_system::write_file,
            file_system::list_directory,
            file_system::create_directory,
            file_system::delete_file,
            file_system::file_exists,
            file_system::get_home_dir,
            file_system::get_app_data_dir,
            terminal::execute_command,
            terminal::execute_command_streaming,
            ai_agent::chat,
            ai_agent::get_models,
        ])
        .run(tauri::generate_context!())
        .expect("error while running Workspaacing");
}
