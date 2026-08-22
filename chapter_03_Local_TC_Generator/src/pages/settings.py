import streamlit as st
from src.config_store import get_config, update_config

st.set_page_config(page_title="Settings - RICE-POT", page_icon="⚙️")

st.title("Settings")

with st.form("settings_form"):
    st.subheader("Jira Configuration")
    jira_url = st.text_input("Jira URL", value=get_config("JIRA_URL"))
    jira_email = st.text_input("Jira Email", value=get_config("JIRA_EMAIL"))
    jira_api_token = st.text_input("Jira API Token", value=get_config("JIRA_API_TOKEN"), type="password")

    if st.form_submit_button("Test Jira Connection"):
        # We need to temporarily save the current inputs to test them
        update_config("JIRA_URL", jira_url)
        update_config("JIRA_EMAIL", jira_email)
        update_config("JIRA_API_TOKEN", jira_api_token)
        
        from src.jira_client import test_jira_connection
        result = test_jira_connection()
        if result["success"]:
            st.success(result["message"])
        else:
            st.error(result["message"])

    st.subheader("LLM Provider")
    provider_options = ["Ollama", "Groq"]
    current_provider = get_config("LLM_PROVIDER", "Ollama").capitalize()
    
    # Ensure current_provider matches options safely
    if current_provider not in provider_options:
        current_provider = "Ollama"
        
    llm_provider = st.radio(
        "Select LLM Provider", 
        options=provider_options, 
        index=provider_options.index(current_provider)
    )

    st.subheader("Ollama Configuration (Local)")
    ollama_url = st.text_input("Ollama URL", value=get_config("OLLAMA_URL", "http://localhost:11434"))
    ollama_model = st.text_input("Ollama Model", value=get_config("OLLAMA_MODEL", "qwen3.5:2b"))

    st.subheader("Groq Configuration (Fallback)")
    groq_api_key = st.text_input("Groq API Key", value=get_config("GROQ_API_KEY"), type="password")
    groq_model = st.text_input("Groq Model", value=get_config("GROQ_MODEL", "llama-3.1-8b-instant"))

    submitted = st.form_submit_button("Save Settings")

    if submitted:
        update_config("JIRA_URL", jira_url)
        update_config("JIRA_EMAIL", jira_email)
        update_config("JIRA_API_TOKEN", jira_api_token)
        
        update_config("LLM_PROVIDER", llm_provider)
        
        update_config("OLLAMA_URL", ollama_url)
        update_config("OLLAMA_MODEL", ollama_model)
        
        update_config("GROQ_API_KEY", groq_api_key)
        update_config("GROQ_MODEL", groq_model)
        
        st.success("Settings saved successfully!")
