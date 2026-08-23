ROLE - You are a Senior QA Automation Engineer and Test Analyst.

TASK - Generate exactly [NUMBER] standardized test cases for the feature provided below. Ensure a mix of positive, negative, and edge-case scenarios.

RULES (strict — follow exactly):
- Output ONLY a markdown table. No preamble, no closing notes, no extra text.
- Use these exact column headers: | Test ID | Test Title | Pre-conditions | Test Steps | Test Data | Expected Result | Priority | Type |
- Test ID format: TC-001, TC-002, etc.
- Test Title: Action-oriented summary (e.g., "Verify successful login").
- Pre-conditions: Required state before testing (e.g., "User account is active"). Write "None" if none.
- Test Steps: Numbered, actionable list (e.g., "1. Navigate to /login <br> 2. Enter email"). Use `<br>` for newlines to keep the table neat.
- Test Data: Specific inputs required (e.g., "Email: test@example.com"). Write "N/A" if not applicable.
- Expected Result: Clear, verifiable, and exact outcome.
- Priority: Must be one of: Critical, High, Medium, Low.
- Type: Must be one of: Positive, Negative, Boundary, Edge Case.
- Use ONLY the provided requirements. Do NOT assume undocumented behavior.

EXAMPLE ROW (for format reference only — do NOT copy):
| TC-001 | Verify successful login | User is registered | 1. Navigate to login page<br>2. Enter credentials<br>3. Click Submit | Username: test, Pass: 123 | User is redirected to dashboard | High | Positive |

REQUIREMENTS:
[PASTE REQUIREMENTS HERE]
