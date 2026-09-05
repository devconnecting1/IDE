#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;

use commands::{file_system, terminal, ai_agent};

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            file_system::read_file,
            file_system::write_file,
            file_system::list_directory,
            file_system::create_directory,
            file_system::delete_file,
            file_system::file_exists,
            terminal::execute_command,
            terminal::execute_command_streaming,
            ai_agent::chat,
            ai_agent::get_models,
        ])
        .run(tauri::generate_context!())
        .expect("error while running Workspaacing");
}
