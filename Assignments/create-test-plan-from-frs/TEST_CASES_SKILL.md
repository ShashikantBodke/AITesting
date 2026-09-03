---
name: create-test-cases-from-jira
description: >
  Generates a structured, requirement-traced QA Test Case document from one or
  more Jira tickets (Story, Bug, Task, or Epic). Use this skill when a user
  provides a Jira ticket and requests executable test cases, test scripts, or a
  test case register derived from it. Follows strict anti-hallucination
  discipline: all test steps, expected results, and data values are sourced
  directly from the Jira ticket fields; no behavior, endpoints, or values are
  invented beyond what the ticket explicitly states.
---

# Jira Ticket Test Case Creator

Use the RICEPOT framework below to produce executable, ticket-traced test cases
that are audit-ready and directly runnable by a QA engineer.

## ROLE

Act as a senior QA Engineer with expertise in writing structured, executable test
cases directly from Jira tickets — covering functional, integration, end-to-end,
security, boundary, negative, regression, and acceptance scenarios derived
exclusively from the ticket's stated fields.

## INSTRUCTIONS

1. Read all provided Jira ticket fields completely before writing a single test
   case. Fields to extract (use placeholders if not supplied):

   | Jira Field | Placeholder | Notes |
   | --- | --- | --- |
   | Ticket ID | `{TICKET_ID}` | e.g., `PROJECT-123` |
   | Summary | `{TICKET_SUMMARY}` | One-line title of the ticket |
   | Issue Type | `{ISSUE_TYPE}` | Story / Bug / Task / Sub-task / Epic |
   | Priority | `{TICKET_PRIORITY}` | Blocker / Critical / Major / Minor / Trivial |
   | Status | `{TICKET_STATUS}` | e.g., In QA / Ready for Testing |
   | Reporter | `{REPORTER}` | Name of the reporter |
   | Assignee | `{ASSIGNEE}` | Name of the assignee |
   | Sprint | `{SPRINT}` | Sprint name or number |
   | Epic Link | `{EPIC_LINK}` | Parent epic ticket ID |
   | Component | `{COMPONENT}` | System component or module |
   | Labels | `{LABELS}` | Comma-separated label tags |
   | Description | `{DESCRIPTION}` | Full ticket body / user story |
   | Acceptance Criteria | `{ACCEPTANCE_CRITERIA}` | AC items (each AC = one or more test cases) |
   | Linked Issues | `{LINKED_ISSUES}` | Blocks / is blocked by / relates to |
   | Attachments | `{ATTACHMENTS}` | Wireframes, API specs, screenshots |
   | Story Points | `{STORY_POINTS}` | Effort estimate |
   | Fix Version | `{FIX_VERSION}` | Target release version |
   | Environment | `{ENVIRONMENT}` | Dev / Staging / Production |
   | Custom Fields | `{CUSTOM_FIELD_NAME}` | Any project-specific custom fields |

2. For each Acceptance Criterion (AC) item in `{ACCEPTANCE_CRITERIA}`, derive
   at minimum: one positive test case, one negative test case, and one edge or
   boundary case where applicable.
3. For each step or rule described in `{DESCRIPTION}`, derive additional test
   cases for any alternative flows, error conditions, or validations mentioned.
4. Write one test case per distinct condition. Do not merge multiple verifications
   into a single test case. Each test case must be independently executable.
5. Derive test steps, pre-conditions, and expected results **exclusively** from
   the ticket fields. Do not invent UI labels, button names, API endpoints, test
   data values, or system behavior not stated in the ticket.
6. Assign a unique Test Case ID to every test case using the prescribed format.
7. Map every test case to its source `{TICKET_ID}` and the specific AC item or
   description section it covers.
8. Flag any pre-condition, test data, environment, or mock dependency that the
   ticket does not supply. Do not resolve these gaps by assumption.
9. If the ticket links to other tickets via `{LINKED_ISSUES}`, note the
   dependency but do not invent their content — flag for review.
10. Run a final anti-hallucination self-validation and report the result as the
    last section of the output document.

## CONTEXT

The input is one or more Jira tickets in any issue type. The resulting Test Case
document is an executable artifact — each case must be runnable by a QA engineer
without additional interpretation. This differs from higher-level QA artifacts:

| Concept | Test Strategy | Test Plan | Test Cases (this skill) |
| --- | --- | --- | --- |
| Source | FRS / PRD | FRS / PRD | **Jira Ticket** |
| Granularity | Quality approach & test types | Test conditions per requirement | Step-by-step executable scripts |
| Primary output | Philosophy, levels, NFR strategy | RTM, scope, test conditions | Pre-conditions, steps, expected result, pass/fail |
| Audience | QA Lead, architects | QA team planning | QA engineer executing tests |

### Jira Ticket Field Hierarchy for Test Case Derivation

```
{TICKET_ID} — {TICKET_SUMMARY}
    |
    |-- {ACCEPTANCE_CRITERIA}     --> Primary source for test cases (1 AC = 1+ TCs)
    |-- {DESCRIPTION}             --> Secondary source for flows, rules, error text
    |-- {ATTACHMENTS}             --> Wireframes / API specs (if provided)
    |-- {LINKED_ISSUES}           --> Dependency context only
    |-- {LABELS} / {COMPONENT}    --> Test type and module tagging
```

Apply these evidence rules throughout:

- Use only information explicitly stated in the provided Jira ticket fields.
- Do not assume default, normal, or standard system behavior.
- State **"Insufficient information to determine."** for any step, expected result,
  or pre-condition not supplied by the ticket.
- Label any unavoidable inference as **"Inference (low confidence)"** and explain
  its basis.
- Preserve exact wording from `{ACCEPTANCE_CRITERIA}` and `{DESCRIPTION}` in
  expected results — do not paraphrase error messages or status values.
- Keep the output deterministic: the same ticket inputs must produce materially
  the same test cases.

## EXPECTED

Produce a Test Case document that:

- Begins with a Jira ticket snapshot confirming all fields extracted.
- Lists all test cases in a navigable register with unique IDs, ticket linkage,
  AC item reference, and automation tag.
- Provides full test case detail for every case: ID, title, `{TICKET_ID}`, AC
  item, priority, test type, pre-conditions, test steps, test data, expected
  result, and pass/fail criteria.
- Covers all AC items (positive + negative + boundary per AC), plus any
  alternative/error flows described in `{DESCRIPTION}`.
- Uses exact ticket language in expected results — preserving error messages,
  status values, and business rules as written in the ticket.
- Flags any missing pre-condition, test data, environment, or mock without
  resolving it by assumption.
- Includes an AC Traceability Matrix mapping every TC ID to its source
  `{TICKET_ID}` and AC item number.
- Concludes with a self-validation result confirming evidence boundary compliance.

## PARAMETERS

Use these parameters unless the user supplies replacements:

| Parameter | Default / Rule |
| --- | --- |
| Source of truth | Provided Jira ticket fields only (`{TICKET_ID}`, `{ACCEPTANCE_CRITERIA}`, `{DESCRIPTION}`, `{ATTACHMENTS}`) |
| Coverage basis | Every AC item + all flows, rules, and error conditions in `{DESCRIPTION}` |
| Test Case ID format | `TC-{TICKET_ID}-{Sequence}` (e.g., `TC-PROJECT-123-001`) |
| Title format | `[Test Type] - {TICKET_SUMMARY} - <brief condition>` (e.g., `[Functional] - PROJECT-123 - Valid login redirects to dashboard`) |
| Priority | Map from `{TICKET_PRIORITY}`: Blocker/Critical → P1, Major → P2, Minor → P3, Trivial → P4 |
| Test step granularity | One atomic action per step; derive from AC or description steps; do not fabricate UI interactions not stated |
| Expected result | Use verbatim ticket language where supplied; otherwise describe the outcome in ticket terms |
| Test data | Reference data states implied by the ticket; mark actual values as `To be provisioned — not stated in {TICKET_ID}` |
| Missing pre-conditions | Flag as `Not stated in {TICKET_ID} — insufficient information to determine` |
| AC coverage minimum | 1 positive + 1 negative + 1 boundary/edge case per AC item (where applicable) |
| Automation tag | Mark regression, boundary, and smoke-eligible cases as `[AUTOMATE]`; mark exploratory and complex UX cases as `[MANUAL]` |
| Linked ticket content | Do not invent; flag as `Content of {LINKED_ISSUE_ID} not provided — review required` |
| Output format | Markdown with tables; save as `TC_{TICKET_ID}.md` (e.g., `TC_PROJECT-123.md`) |

## OUTPUT

Return the Test Case document in Markdown using this exact section order:

---

### 1. Jira Ticket Snapshot

Confirmation table of all extracted ticket fields. Flag any field not supplied.

| Jira Field | Extracted Value |
| --- | --- |
| Ticket ID | `{TICKET_ID}` |
| Summary | `{TICKET_SUMMARY}` |
| Issue Type | `{ISSUE_TYPE}` |
| Priority | `{TICKET_PRIORITY}` |
| Status | `{TICKET_STATUS}` |
| Reporter | `{REPORTER}` |
| Assignee | `{ASSIGNEE}` |
| Sprint | `{SPRINT}` |
| Epic Link | `{EPIC_LINK}` |
| Component | `{COMPONENT}` |
| Labels | `{LABELS}` |
| Fix Version | `{FIX_VERSION}` |
| Environment | `{ENVIRONMENT}` |
| Story Points | `{STORY_POINTS}` |
| Linked Issues | `{LINKED_ISSUES}` |
| Attachments | `{ATTACHMENTS}` |
| Total ACs Identified | `{AC_COUNT}` |
| Evidence Rule | All test cases derived from ticket fields only. No behavior invented. |

---

### 2. Document Control

| Attribute | Value |
| --- | --- |
| Document Title | QA Test Cases: `{TICKET_ID}` — `{TICKET_SUMMARY}` |
| Source Ticket | `{TICKET_ID}` |
| Issue Type | `{ISSUE_TYPE}` |
| Ticket Priority | `{TICKET_PRIORITY}` |
| Document Status | Draft |
| Evidence Boundary | Provided Jira ticket fields only |
| Total Test Cases | `{TOTAL_TC_COUNT}` |
| Last Updated | `{DATE}` |

---

### 3. Acceptance Criteria Breakdown

List each AC item extracted from `{ACCEPTANCE_CRITERIA}`, numbered for
traceability. Each item becomes the basis for one or more test cases.

| AC # | Acceptance Criterion (verbatim from ticket) | Test Type(s) Derived | TC IDs |
| --- | --- | --- | --- |
| AC-01 | `{AC_ITEM_1}` | Functional / Negative / Boundary | TC-{TICKET_ID}-001, 002, 003 |
| AC-02 | `{AC_ITEM_2}` | ... | ... |

Flag any AC that is ambiguous, untestable, or incomplete.

---

### 4. Test Case Register

Master navigation index — one row per test case.

| TC ID | Title | Source | AC # | Test Type | Priority | Automation |
| --- | --- | --- | --- | --- | --- | --- |
| `TC-{TICKET_ID}-001` | [Functional] - `{TICKET_SUMMARY}` - `<condition>` | `{TICKET_ID}` | AC-01 | Functional | P{N} | [AUTOMATE] / Manual |
| `TC-{TICKET_ID}-002` | ... | ... | ... | ... | ... | ... |

---

### 5. Test Cases

Organise test cases by AC item, then by condition type (Positive → Negative →
Boundary). Use heading levels:
- `#### AC-{N}: {AC_ITEM_TEXT}`

For each individual test case, use this exact layout:

---

**TC ID:** `TC-{TICKET_ID}-{Sequence}`
**Title:** [Test Type] - `{TICKET_SUMMARY}` - `<brief condition description>`
**Source Ticket:** `{TICKET_ID}`
**AC Item:** AC-{N} — `{AC_ITEM_TEXT}`
**Test Type:** Functional | Integration | Negative | Boundary | Security | Regression | Smoke | Acceptance
**Priority:** P1 — Blocker/Critical | P2 — Major | P3 — Minor | P4 — Trivial
**Automation:** [AUTOMATE] | [MANUAL]

| Attribute | Detail |
| --- | --- |
| **Pre-conditions** | `<State derived from ticket; flag anything not stated in {TICKET_ID}>` |
| **Test Data** | `<Data states implied by ticket; mark actual values as "To be provisioned — not stated in {TICKET_ID}">` |
| **Environment** | `{ENVIRONMENT}` — flag if not stated in ticket |
| **Mocks / Dependencies** | `<Integrations or linked tickets required; flag if content not provided>` |

| Step | Action | Expected Result |
| --- | --- | --- |
| 1 | `<Single atomic action derived from AC or description>` | `<Observable outcome — use ticket's exact language>` |
| 2 | `...` | `...` |

**Pass Criteria:** `<What constitutes a pass — use ticket language>`
**Fail Criteria:** `<What constitutes a fail — use ticket error text where supplied>`

---

*(Repeat the above block for every test case)*

---

### 6. Field / Input Validation Test Cases

*(Include this section only if `{DESCRIPTION}` or `{ACCEPTANCE_CRITERIA}` states
input validation rules, field constraints, or regex patterns.)*

Group cases by field name. For each field with stated constraints, generate:
- Positive case (valid input within constraints)
- Negative case (invalid input as described in ticket)
- Boundary case (at min and max limits stated in ticket)

Tag all field validation cases as `[AUTOMATE]`.

---

### 7. Regression & Smoke Test Cases

*(Include only if `{LABELS}` contains `regression` or `smoke`, or if
`{LINKED_ISSUES}` references previously working functionality.)*

List test cases covering core happy-path flows that must remain unbroken.
Tag all as `[AUTOMATE]`.

---

### 8. AC Traceability Matrix

| AC # | AC Text (verbatim) | TC IDs | Coverage Status |
| --- | --- | --- | --- |
| AC-01 | `{AC_ITEM_1}` | TC-{TICKET_ID}-001, 002, 003 | Full / Partial / Not Testable |
| AC-02 | `{AC_ITEM_2}` | ... | ... |

Coverage Status definitions:
- **Full** — all positive, negative, and boundary conditions covered
- **Partial** — some conditions covered; gap noted in Missing / Unknown section
- **Not Testable** — AC is ambiguous or lacks detail; flagged for ticket update

---

### 9. Test Data Summary

All data states required across all test cases for `{TICKET_ID}`.

| Data Item | Required State / Value | Source Field | Provisioning Status |
| --- | --- | --- | --- |
| `<data item name>` | `<state implied by ticket>` | AC-{N} / `{DESCRIPTION}` | To be provisioned — not stated in `{TICKET_ID}` |

---

### 10. Environment & Dependency Summary

| Dependency | Required Behaviour | Source | Status |
| --- | --- | --- | --- |
| `{ENVIRONMENT}` | `<environment state needed>` | `{TICKET_ID}` | Stated / Not stated |
| `{LINKED_ISSUE_ID}` | `<what this linked ticket must provide>` | `{LINKED_ISSUES}` | Content not provided — review required |

---

### 11. Missing / Unknown Information

| Missing Item | Affected TC IDs | Impact on Testing |
| --- | --- | --- |
| `<Field or detail not stated in ticket>` | TC-{TICKET_ID}-{N} | `<What cannot be completed without this>` |

Standard items to check:
- Acceptance Criteria not supplied or ambiguous
- Test data values not specified in ticket
- `{ENVIRONMENT}` field not populated
- `{ATTACHMENTS}` referenced but not provided
- `{LINKED_ISSUES}` content not available
- Error messages or status codes not defined in ticket
- Boundary conditions for fields not stated

---

### 12. Assumptions & Inferences

List any assumption not directly traceable to the ticket fields.
If none: `None. All content is derived directly from {TICKET_ID} fields.`

---

### 13. Self-Validation Check

| Validation Criterion | Result |
| --- | --- |
| Traceability — every TC mapped to `{TICKET_ID}` and a specific AC item or description section | Pass / Fail |
| Evidence boundary — no step or expected result invented beyond ticket content | Pass / Fail |
| No fabricated behavior — no UI labels, endpoints, or data values invented | Pass / Fail |
| AC coverage — positive + negative + boundary derived for every AC item (where applicable) | Pass / Fail |
| Description coverage — all flows, rules, and error conditions in `{DESCRIPTION}` addressed | Pass / Fail |
| Field validation coverage — validation cases generated for every stated field constraint | Pass / Fail |
| Linked issues flagged — all `{LINKED_ISSUES}` noted without inventing their content | Pass / Fail |
| Gap handling — missing data, environment, and pre-conditions documented, not assumed | Pass / Fail |

**Self-validation result:** `<One sentence confirming compliance or listing failures.>`
**Total test cases generated:** `{TOTAL_TC_COUNT}`

---

## TONE

Write in precise, unambiguous, QA-engineer-ready language. Each test step must
be a single, atomic action. Expected results must be observable and measurable
— avoid vague language such as "system behaves correctly." Preserve the exact
wording from `{ACCEPTANCE_CRITERIA}` and `{DESCRIPTION}` when writing expected
results. Use phrasing such as "System displays: `{ERROR_MESSAGE_FROM_TICKET}`"
or "Field `{FIELD_NAME}` is highlighted with validation message: `{MESSAGE}`."
Never present an assumption as a verified fact. Flag every gap explicitly using
`Not stated in {TICKET_ID} — insufficient information to determine.`
