use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

use crate::errors::AppError;

#[derive(Serialize, Deserialize)]
pub struct FileInfo {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
    pub size: u64,
    pub modified: String,
}

#[tauri::command]
pub fn read_file(path: String) -> Result<String, AppError> {
    Ok(fs::read_to_string(&path)?)
}

#[tauri::command]
pub fn write_file(path: String, content: String) -> Result<(), AppError> {
    // Ensure parent directory exists
    if let Some(parent) = PathBuf::from(&path).parent() {
        fs::create_dir_all(parent)?;
    }
    fs::write(&path, content)?;
    Ok(())
}

#[tauri::command]
pub fn list_directory(path: String) -> Result<Vec<FileInfo>, AppError> {
    let entries = fs::read_dir(&path)?;

    let mut files: Vec<FileInfo> = Vec::new();

    for entry in entries {
        let entry = entry?;
        let metadata = entry.metadata()?;
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

    // Sort: directories first, then by name
    files.sort_by(|a, b| {
        if a.is_dir != b.is_dir {
            b.is_dir.cmp(&a.is_dir)
        } else {
            a.name.to_lowercase().cmp(&b.name.to_lowercase())
        }
    });

    Ok(files)
}

#[tauri::command]
pub fn create_directory(path: String) -> Result<(), AppError> {
    Ok(fs::create_dir_all(&path)?)
}

#[tauri::command]
pub fn delete_file(path: String) -> Result<(), AppError> {
    let path_buf = PathBuf::from(&path);
    if path_buf.is_dir() {
        fs::remove_dir_all(&path)?;
    } else {
        fs::remove_file(&path)?;
    }
    Ok(())
}

#[tauri::command]
pub fn file_exists(path: String) -> Result<bool, AppError> {
    Ok(PathBuf::from(&path).exists())
}

#[tauri::command]
pub fn get_home_dir() -> Result<String, AppError> {
    dirs::home_dir()
        .map(|p| p.to_string_lossy().to_string())
        .ok_or_else(|| AppError::NotFound("home directory".to_string()))
}

#[tauri::command]
pub fn get_app_data_dir() -> Result<String, AppError> {
    dirs::data_dir()
        .map(|p| p.to_string_lossy().to_string())
        .ok_or_else(|| AppError::NotFound("app data directory".to_string()))
}
