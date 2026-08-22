import requests
from requests.auth import HTTPBasicAuth
from .config_store import get_config

def fetch_ticket(issue_key: str) -> dict:
    """
    Fetches the details of a Jira ticket.
    Uses API v2 to retrieve descriptions as text rather than ADF.
    """
    jira_url = get_config("JIRA_URL").rstrip("/")
    email = get_config("JIRA_EMAIL")
    api_token = get_config("JIRA_API_TOKEN")

    if not jira_url or not email or not api_token:
        raise ValueError("Jira credentials are not fully configured. Please update in Settings.")

    # Using API v2 for easier plain-text/markdown descriptions
    url = f"{jira_url}/rest/api/2/issue/{issue_key}"
    
    headers = {
        "Accept": "application/json"
    }
    
    auth = HTTPBasicAuth(email, api_token)

    response = requests.get(url, headers=headers, auth=auth)
    
    if response.status_code == 200:
        data = response.json()
        fields = data.get("fields", {})
        
        # Try to find a custom field that might represent Acceptance Criteria
        # This varies heavily by Jira instance, so we fall back to dumping it if we can't find it.
        # Commonly customfield_10004 or similar, but without knowing, we pass raw_fields.
        
        return {
            "key": data.get("key"),
            "summary": fields.get("summary", ""),
            "description": fields.get("description", ""),
            "raw_fields": fields
        }
    elif response.status_code == 404:
        raise ValueError(f"Issue {issue_key} not found or you don't have permission to view it.")
    elif response.status_code == 401:
        raise ValueError("Authentication failed. Check your Jira Email and API Token.")
    else:
        response.raise_for_status()

def test_jira_connection() -> dict:
    """
    Tests the Jira connection and credentials by fetching the current user profile.
    """
    jira_url = get_config("JIRA_URL").rstrip("/")
    email = get_config("JIRA_EMAIL")
    api_token = get_config("JIRA_API_TOKEN")

    if not jira_url or not email or not api_token:
        return {"success": False, "message": "Jira credentials are not fully configured."}

    url = f"{jira_url}/rest/api/2/myself"
    headers = {"Accept": "application/json"}
    auth = HTTPBasicAuth(email, api_token)

    try:
        response = requests.get(url, headers=headers, auth=auth, timeout=10)
        if response.status_code == 200:
            data = response.json()
            return {"success": True, "message": f"Successfully connected as {data.get('displayName', email)}!"}
        elif response.status_code == 401:
            return {"success": False, "message": "Authentication failed. Check your Email and API Token."}
        elif response.status_code == 403:
            return {"success": False, "message": "Permission denied. You may not have access."}
        else:
            return {"success": False, "message": f"Connection failed with status code: {response.status_code}. Response: {response.text}"}
    except requests.exceptions.RequestException as e:
        return {"success": False, "message": f"Failed to connect to Jira URL: {str(e)}"}
