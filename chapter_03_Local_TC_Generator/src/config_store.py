import os
import json
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).parent
CONFIG_PATH = BASE_DIR / "config.json"

DEFAULTS = {
    "jira_url": "",
    "jira_email": "",
    "jira_api_token": "",
    "llm_provider": "ollama",
    "groq_api_key": "",
    "groq_model": "llama-3.1-8b-instant",
    "ollama_url": "http://localhost:11434",
    "ollama_model": "qwen3.5:2b",
}


def load_config() -> dict:
    """Load config from config.json, falling back to .env for first run."""
    load_dotenv(BASE_DIR.parent / ".env")

    if CONFIG_PATH.exists():
        with open(CONFIG_PATH, "r") as f:
            config = json.load(f)
    else:
        config = {}

    env_map = {
        "jira_url": "JIRA_URL",
        "jira_email": "JIRA_EMAIL",
        "jira_api_token": "JIRA_API_TOKEN",
        "groq_api_key": "GROQ_API_KEY",
        "llm_provider": "LLM_PROVIDER",
        "groq_model": "GROQ_MODEL",
        "ollama_url": "OLLAMA_URL",
        "ollama_model": "OLLAMA_MODEL",
    }
    for key, env_var in env_map.items():
        if not config.get(key):
            config[key] = os.getenv(env_var, DEFAULTS[key])

    return config


def save_config(config: dict) -> None:
    """Persist config dict to config.json."""
    with open(CONFIG_PATH, "w") as f:
        json.dump(config, f, indent=2)


def get_setting(key: str) -> str:
    return load_config().get(key, DEFAULTS.get(key, ""))


def set_setting(key: str, value: str) -> None:
    config = load_config()
    config[key] = value
    save_config(config)
