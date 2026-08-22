import streamlit as st
import re
from pathlib import Path
from src.jira_client import fetch_ticket
from src.llm_client import generate_test_cases

# Page config
st.set_page_config(page_title="RICE-POT QA App", page_icon="🤖")

st.title("RICE-POT: Jira Test Case Generator")

# Sidebar toggle for LLM Provider
with st.sidebar:
    st.subheader("Quick Settings")
    from src.config_store import get_config, update_config
    
    current_provider = get_config("LLM_PROVIDER", "Ollama").capitalize()
    if current_provider not in ["Ollama", "Groq"]:
        current_provider = "Ollama"
        
    new_provider = st.radio(
        "Active LLM Provider", 
        ["Ollama", "Groq"],
        index=["Ollama", "Groq"].index(current_provider)
    )
    
    if new_provider != current_provider:
        update_config("LLM_PROVIDER", new_provider)
        st.rerun()

# Initialize chat history
if "messages" not in st.session_state:
    st.session_state.messages = []

# Display chat messages from history on app rerun
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# Accept user input
if prompt := st.chat_input("E.g., create test cases for QA-102"):
    # Add user message to chat history
    st.session_state.messages.append({"role": "user", "content": prompt})
    # Display user message in chat message container
    with st.chat_message("user"):
        st.markdown(prompt)

    # Process the request
    with st.chat_message("assistant"):
        message_placeholder = st.empty()
        
        # 1. Parse Jira key using a simple regex (e.g., ABC-123)
        jira_keys = re.findall(r'[A-Z]+-[0-9]+', prompt)
        
        if not jira_keys:
            response = "I couldn't find a Jira ticket key in your message. Please include a key like `QA-102`."
            message_placeholder.markdown(response)
        else:
            issue_key = jira_keys[0]
            
            try:
                # 2. Fetch ticket details
                message_placeholder.markdown(f"Fetching details for {issue_key} from Jira...")
                ticket = fetch_ticket(issue_key)
                
                # 3. Load prompt template
                template_path = Path(__file__).resolve().parent.parent / "template" / "testcase_creator.md"
                if not template_path.exists():
                    raise FileNotFoundError(f"Template not found at {template_path}")
                
                with open(template_path, "r") as f:
                    template_content = f.read()
                
                # 4. Generate the prompt with merged context
                requirements = f"Title: {ticket['summary']}\n\nDescription: {ticket['description']}"
                
                final_prompt = template_content.replace("[NUMBER]", "3 to 5").replace("[PASTE REQUIREMENTS HERE]", requirements)
                
                message_placeholder.markdown(f"Generating test cases for {issue_key}...")
                
                # 5. Call LLM
                response = generate_test_cases(final_prompt)
                
                message_placeholder.markdown(response)
                
            except Exception as e:
                response = f"**Error:** {str(e)}"
                message_placeholder.markdown(response)
        
        # Add assistant response to chat history
        st.session_state.messages.append({"role": "assistant", "content": response})
