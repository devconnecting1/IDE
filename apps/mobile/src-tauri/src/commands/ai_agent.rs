use serde::{Deserialize, Serialize};
use reqwest::Client;

use crate::errors::AppError;

#[derive(Serialize, Deserialize)]
pub struct ChatMessage {
    pub role: String,
    pub content: String,
}

#[derive(Serialize, Deserialize)]
pub struct ChatRequest {
    pub model: String,
    pub messages: Vec<ChatMessage>,
    pub api_key: String,
    pub base_url: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct ChatResponse {
    pub content: String,
    pub model: String,
    pub usage: Option<Usage>,
}

#[derive(Serialize, Deserialize)]
pub struct Usage {
    pub prompt_tokens: u32,
    pub completion_tokens: u32,
    pub total_tokens: u32,
}

#[derive(Serialize, Deserialize)]
pub struct ModelInfo {
    pub id: String,
    pub name: String,
    pub provider: String,
    pub context_window: u32,
}

#[tauri::command]
pub async fn chat(request: ChatRequest) -> Result<ChatResponse, AppError> {
    let client = Client::new();
    let base_url = request.base_url.unwrap_or_else(|| "https://api.openai.com/v1".to_string());

    let response = client
        .post(format!("{}/chat/completions", base_url))
        .header("Authorization", format!("Bearer {}", request.api_key))
        .header("Content-Type", "application/json")
        .json(&serde_json::json!({
            "model": request.model,
            "messages": request.messages,
        }))
        .send()
        .await?;

    let body: serde_json::Value = response.json().await?;

    let content = body["choices"][0]["message"]["content"]
        .as_str()
        .unwrap_or("No response")
        .to_string();

    let model = body["model"].as_str().unwrap_or(&request.model).to_string();

    let usage = body.get("usage").map(|u| Usage {
        prompt_tokens: u["prompt_tokens"].as_u64().unwrap_or(0) as u32,
        completion_tokens: u["completion_tokens"].as_u64().unwrap_or(0) as u32,
        total_tokens: u["total_tokens"].as_u64().unwrap_or(0) as u32,
    });

    Ok(ChatResponse {
        content,
        model,
        usage,
    })
}

#[tauri::command]
pub async fn get_models(api_key: String, base_url: Option<String>) -> Result<Vec<ModelInfo>, AppError> {
    let client = Client::new();
    let base_url = base_url.unwrap_or_else(|| "https://api.openai.com/v1".to_string());

    let response = client
        .get(format!("{}/models", base_url))
        .header("Authorization", format!("Bearer {}", api_key))
        .send()
        .await?;

    let body: serde_json::Value = response.json().await?;

    let models = body["data"]
        .as_array()
        .unwrap_or(&vec![])
        .iter()
        .filter_map(|m| {
            let id = m["id"].as_str()?.to_string();
            Some(ModelInfo {
                name: id.clone(),
                id,
                provider: "unknown".to_string(),
                context_window: 0,
            })
        })
        .collect();

    Ok(models)
}
