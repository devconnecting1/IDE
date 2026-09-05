use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Serialize, Deserialize)]
pub struct FileInfo {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
    pub size: u64,
    pub modified: String,
}

#[tauri::command]
pub fn read_file(path: String) -> Result<String, String> {
    fs::read_to_string(&path).map_err(|e| format!("Failed to read file: {}", e))
}

#[tauri::command]
pub fn write_file(path: String, content: String) -> Result<(), String> {
    fs::write(&path, content).map_err(|e| format!("Failed to write file: {}", e))
}

#[tauri::command]
pub fn list_directory(path: String) -> Result<Vec<FileInfo>, String> {
    let entries = fs::read_dir(&path).map_err(|e| format!("Failed to read directory: {}", e))?;

    let mut files: Vec<FileInfo> = Vec::new();

    for entry in entries {
        let entry = entry.map_err(|e| format!("Failed to read entry: {}", e))?;
        let metadata = entry.metadata().map_err(|e| format!("Failed to read metadata: {}", e))?;

        let path_buf = entry.path();
        let name = entry.file_name().to_string_lossy().to_string();

        files.push(FileInfo {
            name,
            path: path_buf.to_string_lossy().to_string(),
            is_dir: metadata.is_dir(),
            size: metadata.len(),
            modified: chrono::DateTime::from(metadata.modified().unwrap_or(std::time::SystemTime::now()))
                .format("%Y-%m-%d %H:%M:%S")
                .to_string(),
        });
    }

    Ok(files)
}

#[tauri::command]
pub fn create_directory(path: String) -> Result<(), String> {
    fs::create_dir_all(&path).map_err(|e| format!("Failed to create directory: {}", e))
}

#[tauri::command]
pub fn delete_file(path: String) -> Result<(), String> {
    let path_buf = PathBuf::from(&path);
    if path_buf.is_dir() {
        fs::remove_dir_all(&path).map_err(|e| format!("Failed to delete directory: {}", e))
    } else {
        fs::remove_file(&path).map_err(|e| format!("Failed to delete file: {}", e))
    }
}

#[tauri::command]
pub fn file_exists(path: String) -> Result<bool, String> {
    Ok(PathBuf::from(&path).exists())
}
