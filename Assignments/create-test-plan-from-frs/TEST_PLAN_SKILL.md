---
name: create-test-plan-from-jira
description: >
  Generates a structured, requirement-traced QA Test Plan document from one or
  more Jira tickets (Epic, Story, Bug, or Task). Use this skill when a user
  provides a Jira ticket and requests a test plan, test conditions, or a
  coverage approach document derived from it. Follows strict anti-hallucination
  discipline: all test conditions, scope items, and coverage decisions are
  sourced directly from the Jira ticket fields; no behavior, endpoints, tools,
  schedules, or owners are invented beyond what the ticket explicitly states.
---

# Jira Ticket Test Plan Creator

Use the RICEPOT framework below to produce a requirement-traced QA Test Plan
that is evidence-based, coverage-complete, and ready for QA Lead review.

## ROLE

Act as a senior QA Test Lead with experience in producing structured test plans
from agile delivery artifacts — covering functional, integration, security,
boundary, performance, regression, and acceptance coverage derived exclusively
from the stated fields of one or more Jira tickets.

## INSTRUCTIONS

1. Read all provided Jira ticket fields completely before writing any section
   of the Test Plan. Extract and record the following fields using placeholders
   for any field not supplied:

   | Jira Field | Placeholder | Notes |
   | --- | --- | --- |
   | Ticket ID | `{TICKET_ID}` | e.g., `PROJECT-123`; use comma-separated list for multi-ticket plans |
   | Summary | `{TICKET_SUMMARY}` | One-line title of the ticket |
   | Issue Type | `{ISSUE_TYPE}` | Epic / Story / Bug / Task / Sub-task |
   | Priority | `{TICKET_PRIORITY}` | Blocker / Critical / Major / Minor / Trivial |
   | Status | `{TICKET_STATUS}` | e.g., Ready for Testing / In QA |
   | Reporter | `{REPORTER}` | Name of the reporter |
   | Assignee | `{ASSIGNEE}` | Name of the assignee |
   | Sprint | `{SPRINT}` | Sprint name or number |
   | Epic Link | `{EPIC_LINK}` | Parent epic ticket ID |
   | Component | `{COMPONENT}` | System component or module being tested |
   | Labels | `{LABELS}` | Comma-separated label tags (e.g., regression, smoke) |
   | Description | `{DESCRIPTION}` | Full ticket body / user story / feature description |
   | Acceptance Criteria | `{ACCEPTANCE_CRITERIA}` | AC items — primary source for test conditions |
   | Linked Issues | `{LINKED_ISSUES}` | Blocks / is blocked by / relates to |
   | Attachments | `{ATTACHMENTS}` | Wireframes, API specs, design docs |
   | Story Points | `{STORY_POINTS}` | Effort estimate |
   | Fix Version | `{FIX_VERSION}` | Target release version |
   | Environment | `{ENVIRONMENT}` | Dev / Staging / Production |
   | Custom Fields | `{CUSTOM_FIELD_NAME}` | Any project-specific custom fields |

2. Derive the test scope from `{ACCEPTANCE_CRITERIA}` and `{DESCRIPTION}`.
   Every AC item and every stated flow, rule, or constraint is in scope.
3. Derive out-of-scope items from anything explicitly excluded in `{DESCRIPTION}`
   or `{ACCEPTANCE_CRITERIA}`. If nothing is excluded, state so.
4. Identify the test types required based on the nature of the ticket
   (`{ISSUE_TYPE}`, `{LABELS}`, `{COMPONENT}`, and content of `{DESCRIPTION}`).
   Do not add test types not justified by the ticket.
5. Write test conditions (not executable steps) — one condition per distinct
   verifiable behavior stated in the ticket. Map every condition to its source
   AC item or description section.
6. Document all integration dependencies, test data states, environment needs,
   and mock requirements implied by the ticket. Flag anything the ticket does
   not supply without resolving it by assumption.
7. If `{LINKED_ISSUES}` contains blocking or dependent tickets, note them as
   dependencies. Do not invent their content.
8. Use `{TICKET_PRIORITY}` to derive test priority. Do not assign priority not
   traceable to the ticket.
9. Flag any field not populated in the ticket as
   `Not stated in {TICKET_ID} — insufficient information to determine.`
10. Run a final anti-hallucination self-validation before writing the document
    and report the result as the last section.

## CONTEXT

The input is one or more Jira tickets. The resulting Test Plan is a planning
artifact that defines *what* will be tested and *how* coverage will be achieved
for the scope of the ticket(s). It is higher in abstraction than test cases:

| Concept | Test Plan (this skill) | Test Cases |
| --- | --- | --- |
| Source | Jira Ticket | Jira Ticket |
| Granularity | Test conditions per AC / requirement | Step-by-step executable scripts |
| Primary output | Scope, conditions, RTM, coverage approach | Pre-conditions, steps, expected result, pass/fail |
| Audience | QA Lead, Product Owner, Sprint planning | QA engineer executing tests |

### Jira Ticket Field Hierarchy for Test Plan Derivation

```
{TICKET_ID} — {TICKET_SUMMARY}
    |
    |-- {ACCEPTANCE_CRITERIA}     --> Primary source: in-scope features and test conditions
    |-- {DESCRIPTION}             --> Secondary source: flows, business rules, constraints, error behavior
    |-- {LINKED_ISSUES}           --> Dependency and risk identification
    |-- {ATTACHMENTS}             --> Supporting specs (if provided)
    |-- {LABELS} / {COMPONENT}    --> Test type selection and scope tagging
    |-- {ENVIRONMENT}             --> Environment and integration context
    |-- {TICKET_PRIORITY}         --> Test priority mapping
    |-- {FIX_VERSION}             --> Release scope boundary
```

Apply these evidence rules throughout:

- Use only information explicitly stated in the provided Jira ticket fields.
- Do not assume default, normal, or standard system behavior.
- State **"Insufficient information to determine."** wherever ticket content
  is absent.
- Label any unavoidable inference as **"Inference (low confidence)"** with an
  explanation.
- Preserve exact wording from `{ACCEPTANCE_CRITERIA}` and `{DESCRIPTION}` in
  test conditions — do not paraphrase error messages, status values, or
  business rules.
- Keep the output deterministic: the same ticket inputs must produce materially
  the same test plan.

## EXPECTED

Produce a Test Plan document that:

- Begins with a Jira ticket snapshot confirming all fields extracted.
- Defines the testing objective and evidence boundary.
- States clear scope (in / out / constraints) derived from the ticket.
- Identifies the required test types justified by the ticket content.
- Provides numbered test conditions per AC item and description flow,
  each mapped to its source.
- Includes a Traceability Matrix linking every test condition to its source
  AC item or description section.
- Documents environment, integration, and test data dependencies as stated
  by the ticket; flags everything else as not supplied.
- States entry and exit criteria using only ticket-sourced content.
- Lists risks derived from `{LINKED_ISSUES}`, `{TICKET_PRIORITY}`, and any
  blocking constraints in the ticket.
- Documents all gaps explicitly without resolving them by assumption.
- Concludes with a self-validation result.

## PARAMETERS

Use these parameters unless the user supplies replacements:

| Parameter | Default / Rule |
| --- | --- |
| Source of truth | Provided Jira ticket fields only (`{TICKET_ID}`, `{ACCEPTANCE_CRITERIA}`, `{DESCRIPTION}`, `{ATTACHMENTS}`) |
| Coverage basis | Every AC item + all flows, rules, error conditions, and constraints in `{DESCRIPTION}` |
| Test Condition ID format | `TCD-{TICKET_ID}-{Sequence}` (e.g., `TCD-PROJECT-123-001`) |
| Condition title format | `[Test Type] - <brief description of what is verified>` |
| Priority | Map from `{TICKET_PRIORITY}`: Blocker/Critical -> P1, Major -> P2, Minor -> P3, Trivial -> P4 |
| Test condition granularity | One verifiable behavior per condition; derive from AC items and description; do not fabricate UI interactions or endpoints not stated |
| Missing data | Record in Missing / Unknown Information section; do not resolve by assumption |
| Test types | Include only those justified by the ticket's issue type, labels, component, or content |
| Linked ticket content | Do not invent; flag as `Content of {LINKED_ISSUE_ID} not provided — review required` |
| Automation tag | Mark boundary, regression, and field validation conditions as `[AUTOMATE]` if `{LABELS}` or ticket content supports it |
| Output format | Markdown with tables; save as `TP_{TICKET_ID}.md` (e.g., `TP_PROJECT-123.md`) |

## OUTPUT

Return the Test Plan in Markdown using this exact section order:

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
| Evidence Rule | All plan content derived from ticket fields only. No behavior invented. |

---

### 2. Document Control

| Attribute | Value |
| --- | --- |
| Test Plan Title | QA Test Plan: `{TICKET_ID}` — `{TICKET_SUMMARY}` |
| Source Ticket(s) | `{TICKET_ID}` |
| Issue Type | `{ISSUE_TYPE}` |
| Fix Version | `{FIX_VERSION}` |
| Sprint | `{SPRINT}` |
| Ticket Priority | `{TICKET_PRIORITY}` |
| Test Plan Status | Draft |
| Evidence Boundary | Provided Jira ticket fields only |
| Total Test Conditions | `{TOTAL_TCD_COUNT}` |
| Last Updated | `{DATE}` |

---

### 3. Objective

State the testing objective in one paragraph. Derive it from `{TICKET_SUMMARY}`,
`{DESCRIPTION}`, and `{ACCEPTANCE_CRITERIA}`. Declare the evidence boundary:
all content is sourced from `{TICKET_ID}` fields only.

---

### 4. Scope

#### 4.1 In Scope

Derive from `{ACCEPTANCE_CRITERIA}` and `{DESCRIPTION}`.

| # | In-Scope Item | Source (AC # / Description) |
| --- | --- | --- |
| 1 | `<Behavior or feature stated in AC or description>` | AC-01 / `{DESCRIPTION}` |
| 2 | ... | ... |

#### 4.2 Out of Scope

Derive from explicit exclusions in `{DESCRIPTION}` or `{ACCEPTANCE_CRITERIA}`.
If no exclusions are stated: `No explicit exclusions stated in {TICKET_ID}.`

#### 4.3 Scope Constraints

Flag any AC item or description section that is ambiguous, incomplete, or
untestable as written. State what information is needed to make it testable.

---

### 5. Test Approach & Test Types

Justify every test type with a reference to the ticket field that mandates or
implies it.

| Test Type | Justification (ticket field / content) | Primary Coverage Areas |
| --- | --- | --- |
| Functional | `{ACCEPTANCE_CRITERIA}` states positive flows | AC-01 to AC-{N}: happy-path verification |
| Negative | `{DESCRIPTION}` / `{ACCEPTANCE_CRITERIA}` describes error conditions | Stated rejection / failure behaviors |
| Boundary | Field constraints stated in `{DESCRIPTION}` or `{ACCEPTANCE_CRITERIA}` | Min/max values, length limits |
| Integration | `{DESCRIPTION}` references external systems or APIs | Named system integrations |
| Security | `{LABELS}` contains `security` or ticket describes auth / access controls | Stated security rules |
| Regression | `{LABELS}` contains `regression` or linked issues reference existing flows | Core flows that must remain unbroken |
| Smoke | `{LABELS}` contains `smoke` or `{FIX_VERSION}` implies a release gate | Critical path verification |
| Performance | `{DESCRIPTION}` or `{ACCEPTANCE_CRITERIA}` states SLA or latency thresholds | Named SLA targets |
| Acceptance (UAT) | `{ISSUE_TYPE}` is Story/Epic and `{ACCEPTANCE_CRITERIA}` are business-facing | Full AC satisfaction |

*(Include only rows justified by the ticket. Remove unjustified rows.)*

---

### 6. Test Conditions

Organise conditions by AC item, then additional conditions from `{DESCRIPTION}`.
Use heading levels:
- `#### AC-{N}: {AC_ITEM_TEXT}`
- `#### Description Flow: {FLOW_NAME}`

For each condition, use this layout:

| TCD ID | Test Type | Test Condition | Source | Priority | Automation |
| --- | --- | --- | --- | --- | --- |
| `TCD-{TICKET_ID}-001` | Functional | `<Verifiable behavior derived from AC or description>` | AC-01 | P{N} | [AUTOMATE] / Manual |
| `TCD-{TICKET_ID}-002` | Negative | `<Error or rejection behavior stated in ticket>` | AC-01 / `{DESCRIPTION}` | P{N} | [AUTOMATE] / Manual |
| `TCD-{TICKET_ID}-003` | Boundary | `<Min/max or limit verification>` | `{DESCRIPTION}` | P{N} | [AUTOMATE] |

Rules for writing test conditions:
- One condition per distinct verifiable behavior.
- Use ticket language — do not paraphrase stated error messages or status values.
- Flag any condition where expected behavior is not stated:
  `Expected behavior not stated in {TICKET_ID} — insufficient information to determine.`

---

### 7. Traceability Matrix

| AC # / Source | Content (verbatim) | TCD IDs | Test Types | Coverage Status |
| --- | --- | --- | --- | --- |
| AC-01 | `{AC_ITEM_1}` | TCD-{TICKET_ID}-001, 002 | Functional / Negative | Full / Partial / Not Testable |
| AC-02 | `{AC_ITEM_2}` | TCD-{TICKET_ID}-003 | Boundary | Full |
| `{DESCRIPTION}` Flow | `<Stated flow or rule>` | TCD-{TICKET_ID}-004 | Integration | Partial |

Coverage Status:
- **Full** — all positive, negative, and boundary conditions covered
- **Partial** — gap noted; see Missing / Unknown Information section
- **Not Testable** — AC is ambiguous or lacks detail; flagged for ticket update

---

### 8. Test Environment & Dependencies

| Item | Detail | Source | Status |
| --- | --- | --- | --- |
| Environment | `{ENVIRONMENT}` | `{TICKET_ID}` | Stated / Not stated in ticket |
| Component under test | `{COMPONENT}` | `{TICKET_ID}` | Stated / Not stated in ticket |
| Linked / dependent ticket | `{LINKED_ISSUE_ID}` | `{LINKED_ISSUES}` | Content not provided — review required |
| External system / API | `<Named system from {DESCRIPTION}>` | `{DESCRIPTION}` | Mock / Live — not specified in ticket |
| Attachments / Specs | `{ATTACHMENTS}` | `{TICKET_ID}` | Provided / Not provided |

Flag any environment details not stated in the ticket as
`Not stated in {TICKET_ID} — insufficient information to determine.`

---

### 9. Test Data Requirements

List all data states implied by `{ACCEPTANCE_CRITERIA}` and `{DESCRIPTION}`.

| Data Item | Required State | Source Field | Provisioning Status |
| --- | --- | --- | --- |
| `<data item>` | `<state implied by ticket>` | AC-{N} / `{DESCRIPTION}` | To be provisioned — not stated in `{TICKET_ID}` |

Flag any test data values, user accounts, or seed data not defined in the ticket.

---

### 10. Entry Criteria

Derive only from ticket content. Flag anything not stated.

| Criterion | Source |
| --- | --- |
| Ticket status is `{TICKET_STATUS}` (Ready for Testing / In QA) | `{TICKET_ID}` — Status field |
| Fix version `{FIX_VERSION}` is deployed to `{ENVIRONMENT}` | `{TICKET_ID}` — Fix Version / Environment fields |
| `{LINKED_ISSUES}` blocking tickets are resolved | `{LINKED_ISSUES}` — flag if content not provided |
| Acceptance Criteria reviewed and approved | `{TICKET_ID}` — AC field |

Additional entry criteria (test environment setup, test data provisioning,
mock configuration) are not stated in `{TICKET_ID}` —
insufficient information to determine.

---

### 11. Exit Criteria

Derive only from ticket content. Flag anything not stated.

| Criterion | Source |
| --- | --- |
| All test conditions derived from `{ACCEPTANCE_CRITERIA}` pass | `{TICKET_ID}` — AC field |
| Zero open defects of priority matching `{TICKET_PRIORITY}` or higher | `{TICKET_ID}` — Priority field |
| Regression conditions (if applicable) pass | `{LABELS}` — regression tag |

Pass-rate threshold, defect severity definitions, sign-off approver, and
reporting workflow are not stated in `{TICKET_ID}` —
insufficient information to determine.

---

### 12. Deliverables

| Deliverable | Description |
| --- | --- |
| This QA Test Plan | Requirement-traced plan derived from `{TICKET_ID}` |
| Test Cases | Executable cases per TCD (to be authored post-plan approval) |
| Defect Reports | Defects raised during execution (tooling not stated in ticket) |
| Test Execution Evidence | Pass/fail results per TCD (format not stated in ticket) |
| Regression Results | If `{LABELS}` contains `regression` — results for tagged conditions |

---

### 13. Roles & Responsibilities

| Responsibility | Implied Owner | Source |
| --- | --- | --- |
| Test Plan authorship | QA Lead / `{ASSIGNEE}` | `{TICKET_ID}` — Assignee field |
| Ticket clarification / AC owner | `{REPORTER}` | `{TICKET_ID}` — Reporter field |
| Sprint delivery | `{ASSIGNEE}` | `{TICKET_ID}` — Assignee field |

Named QA team members beyond `{REPORTER}` and `{ASSIGNEE}` are not stated in
`{TICKET_ID}` — insufficient information to determine.

---

### 14. Risks & Dependencies

| Type | Item | Source | Planning Treatment |
| --- | --- | --- | --- |
| Dependency | `{LINKED_ISSUE_ID}` blocks this ticket | `{LINKED_ISSUES}` | Flag as a prerequisite; content not available |
| Priority risk | Ticket is `{TICKET_PRIORITY}` — high-severity defects may block release | `{TICKET_PRIORITY}` | Prioritise execution of P1/P2 conditions first |
| Scope risk | `{AC_COUNT}` AC items — ambiguous or incomplete ACs flagged in Section 4.3 | `{ACCEPTANCE_CRITERIA}` | Clarify with `{REPORTER}` before test execution |
| Environment risk | `{ENVIRONMENT}` not confirmed / not stated in ticket | `{ENVIRONMENT}` | Raise environment readiness as a blocker |
| Data risk | Test data values not specified in ticket | `{DESCRIPTION}` | Raise data provisioning as a dependency |

Unknown risk ranking, mitigation owners, and contingency plans are not stated
in `{TICKET_ID}` — insufficient information to determine.

---

### 15. Missing / Unknown Information

| Missing Item | Affected TCD IDs | Impact on Planning |
| --- | --- | --- |
| `<Field or detail not stated in ticket>` | TCD-{TICKET_ID}-{N} | `<What cannot be planned or executed without this>` |

Standard items to check:
- Acceptance Criteria not supplied or ambiguous
- `{ENVIRONMENT}` field not populated in ticket
- `{LINKED_ISSUES}` content not available
- Error messages or status codes not defined in ticket
- Boundary / field constraints not stated
- Test data values and provisioning approach not specified
- Entry / exit pass-rate thresholds not defined
- Sign-off approver and workflow not stated
- Performance SLA thresholds not stated (if applicable)

---

### 16. Assumptions & Inferences

List any assumption not directly traceable to the ticket fields.
If none: `None. All content is derived directly from {TICKET_ID} fields.`

---

### 17. Self-Validation Check

| Validation Criterion | Result |
| --- | --- |
| Traceability — every TCD mapped to `{TICKET_ID}` and a specific AC item or description section | Pass / Fail |
| Evidence boundary — no test condition or scope item invented beyond ticket content | Pass / Fail |
| No fabricated behavior — no UI labels, endpoints, tools, data values, or schedules invented | Pass / Fail |
| AC coverage — at least one test condition per AC item | Pass / Fail |
| Description coverage — all flows, rules, and error conditions in `{DESCRIPTION}` addressed | Pass / Fail |
| Dependency handling — all `{LINKED_ISSUES}` noted without inventing their content | Pass / Fail |
| Gap handling — missing data, environment, and criteria documented, not assumed | Pass / Fail |
| Scope constraint — ambiguous or incomplete ACs flagged in Section 4.3 | Pass / Fail |

**Self-validation result:** `<One sentence confirming compliance or listing failures.>`
**Total test conditions generated:** `{TOTAL_TCD_COUNT}`

---

## TONE

Write in precise, neutral, audit-ready QA language. Be concise and factual.
Prefer phrasing such as "The ticket states...", "Per `{TICKET_ID}` AC-{N}...",
or "`{DESCRIPTION}` specifies..." over unsupported assertions. Never present an
assumption or inference as a verified fact. Flag every gap explicitly using
`Not stated in {TICKET_ID} — insufficient information to determine.`
