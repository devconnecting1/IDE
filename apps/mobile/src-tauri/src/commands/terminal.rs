use serde::{Deserialize, Serialize};
use std::process::Command;
use tauri::Window;

use crate::errors::AppError;

#[derive(Serialize, Deserialize)]
pub struct CommandResult {
    pub stdout: String,
    pub stderr: String,
    pub code: Option<i32>,
}

#[tauri::command]
pub fn execute_command(command: String, cwd: Option<String>) -> Result<CommandResult, AppError> {
    let mut cmd = if cfg!(target_os = "windows") {
        Command::new("cmd")
            .args(["/C", &command])
            .current_dir(cwd.unwrap_or_else(|| ".".to_string()))
    } else {
        Command::new("sh")
            .args(["-c", &command])
            .current_dir(cwd.unwrap_or_else(|| ".".to_string()))
    };

    let output = cmd.output()?;

    Ok(CommandResult {
        stdout: String::from_utf8_lossy(&output.stdout).to_string(),
        stderr: String::from_utf8_lossy(&output.stderr).to_string(),
        code: output.status.code(),
    })
}

#[tauri::command]
pub async fn execute_command_streaming(
    window: Window,
    command: String,
    cwd: Option<String>,
) -> Result<CommandResult, AppError> {
    use std::io::{BufRead, BufReader};
    use std::process::Stdio;

    let mut cmd = if cfg!(target_os = "windows") {
        let mut c = Command::new("cmd");
        c.args(["/C", &command]);
        c
    } else {
        let mut c = Command::new("sh");
        c.args(["-c", &command]);
        c
    };

    cmd.current_dir(cwd.unwrap_or_else(|| ".".to_string()));
    cmd.stdout(Stdio::piped());
    cmd.stderr(Stdio::piped());

    let mut child = cmd.spawn()?;

    let stdout = child.stdout.take().unwrap();
    let stderr = child.stderr.take().unwrap();

    let stdout_reader = BufReader::new(stdout);
    let stderr_reader = BufReader::new(stderr);

    let mut stdout_lines = String::new();
    let mut stderr_lines = String::new();

    for line in stdout_reader.lines() {
        let line = line?;
        stdout_lines.push_str(&line);
        stdout_lines.push('\n');
        let _ = window.emit("terminal:stdout", &line);
    }

    for line in stderr_reader.lines() {
        let line = line?;
        stderr_lines.push_str(&line);
        stderr_lines.push('\n');
        let _ = window.emit("terminal:stderr", &line);
    }

    let status = child.wait()?;

    Ok(CommandResult {
        stdout: stdout_lines,
        stderr: stderr_lines,
        code: status.code(),
    })
}
