import requests
from groq import Groq
from .config_store import get_config

def generate_test_cases(prompt: str) -> str:
    """
    Orchestrates calling the selected LLM provider.
    Automatically falls back to Groq if Ollama fails.
    """
    provider = get_config("LLM_PROVIDER", "Ollama").strip().lower()
    
    if provider == "groq":
        return _call_groq(prompt)
    else:
        # Default to Ollama, fallback to Groq if it fails
        try:
            return _call_ollama(prompt)
        except Exception as e:
            print(f"Ollama local instance unavailable or failed: {e}. Falling back to Groq...")
            return _call_groq(prompt)

def _call_ollama(prompt: str) -> str:
    """
    Calls the local Ollama API.
    """
    ollama_url = get_config("OLLAMA_URL", "http://localhost:11434").rstrip("/")
    model = get_config("OLLAMA_MODEL", "qwen3.5:2b")
    
    url = f"{ollama_url}/api/generate"
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False
    }
    
    # Fast timeout for Ollama since it should be local
    response = requests.post(url, json=payload, timeout=10)
    
    if response.status_code == 200:
        return response.json().get("response", "")
    else:
        response.raise_for_status()

def _call_groq(prompt: str) -> str:
    """
    Calls the hosted Groq API as a fallback or explicit choice.
    """
    api_key = get_config("GROQ_API_KEY")
    if not api_key:
        raise ValueError("Groq API key is missing. Please configure it in Settings to use the fallback.")
        
    client = Groq(api_key=api_key)
    
    # Using a configurable model supported by Groq
    model_name = get_config("GROQ_MODEL", "llama-3.1-8b-instant")
    completion = client.chat.completions.create(
        model=model_name,
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.2,
        max_tokens=2048,
        top_p=1,
        stream=False,
    )
    
    return completion.choices[0].message.content
