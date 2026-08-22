import os
from dotenv import load_dotenv, set_key
from pathlib import Path

# Path to the .env file in the chapter_03_Local_TC_Generator root directory
ENV_FILE_PATH = Path(__file__).resolve().parent.parent / ".env"

def load_config():
    """Loads the configuration from the .env file."""
    if ENV_FILE_PATH.exists():
        load_dotenv(dotenv_path=ENV_FILE_PATH, override=True)

def get_config(key: str, default: str = "") -> str:
    """Retrieves a configuration value from the environment."""
    return os.getenv(key, default)

def update_config(key: str, value: str):
    """Updates a configuration value in the .env file and environment."""
    # Ensure the .env file exists
    if not ENV_FILE_PATH.exists():
        ENV_FILE_PATH.touch()
        
    set_key(str(ENV_FILE_PATH), key, value)
    os.environ[key] = value

# Initialize by loading existing config
load_config()
