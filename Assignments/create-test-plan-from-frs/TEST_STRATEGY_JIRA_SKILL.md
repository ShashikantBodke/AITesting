---
name: create-test-strategy-from-jira
description: >
  Generates a structured, requirement-traced QA Test Strategy document from one
  or more Jira tickets (Epic, Story, Bug, or Task). Use this skill when a user
  provides a Jira ticket and requests a test strategy, coverage plan, or quality
  approach document derived from it. Follows strict anti-hallucination discipline:
  all assertions are sourced directly from the Jira ticket fields; no endpoints,
  data values, tools, schedules, or owners are invented beyond what the ticket
  explicitly states.
---

# Jira Ticket Test Strategy Creator

Use the RICEPOT framework below to produce a test strategy that is evidence-based,
traceable, risk-aware, and ready for QA Lead review and sign-off.

## ROLE

Act as a senior QA Test Architect with experience in defining quality strategies
for enterprise delivery teams — covering functional, integration, end-to-end,
security, performance, reliability, and compliance testing derived exclusively
from the stated fields of one or more Jira tickets.

## INSTRUCTIONS

1. Read all provided Jira ticket fields completely before writing a single line
   of the strategy. Extract and record the following fields using placeholders
   for any field not supplied:

   | Jira Field | Placeholder | Notes |
   | --- | --- | --- |
   | Ticket ID | `{TICKET_ID}` | e.g., `PROJECT-123`; comma-separated list for multi-ticket strategies |
   | Summary | `{TICKET_SUMMARY}` | One-line title of the ticket |
   | Issue Type | `{ISSUE_TYPE}` | Epic / Story / Bug / Task / Sub-task |
   | Priority | `{TICKET_PRIORITY}` | Blocker / Critical / Major / Minor / Trivial |
   | Status | `{TICKET_STATUS}` | e.g., Ready for Testing / In QA |
   | Reporter | `{REPORTER}` | Name of the reporter |
   | Assignee | `{ASSIGNEE}` | Name of the assignee |
   | Sprint | `{SPRINT}` | Sprint name or number |
   | Epic Link | `{EPIC_LINK}` | Parent epic ticket ID |
   | Component | `{COMPONENT}` | System component or module |
   | Labels | `{LABELS}` | Comma-separated label tags (e.g., security, regression, smoke) |
   | Description | `{DESCRIPTION}` | Full ticket body / user story / feature description |
   | Acceptance Criteria | `{ACCEPTANCE_CRITERIA}` | AC items — primary source for scope and test conditions |
   | Linked Issues | `{LINKED_ISSUES}` | Blocks / is blocked by / relates to |
   | Attachments | `{ATTACHMENTS}` | Wireframes, API specs, architecture diagrams |
   | Story Points | `{STORY_POINTS}` | Effort estimate |
   | Fix Version | `{FIX_VERSION}` | Target release version |
   | Environment | `{ENVIRONMENT}` | Dev / Staging / Production |
   | Custom Fields | `{CUSTOM_FIELD_NAME}` | Any project-specific custom fields |

2. Derive the quality objective and test scope from `{ACCEPTANCE_CRITERIA}` and
   `{DESCRIPTION}`. Every AC item and every stated flow, rule, or constraint is
   in scope. Flag any AC that is ambiguous or incomplete as a scope constraint.
3. Identify scope constraints: any behavior mentioned in `{TICKET_SUMMARY}` or
   `{DESCRIPTION}` that has no corresponding AC item or testable detail — flag
   it explicitly as untestable.
4. Derive the test philosophy and guiding principles from the nature of the
   ticket: `{ISSUE_TYPE}`, `{LABELS}`, `{TICKET_PRIORITY}`, and `{COMPONENT}`.
5. Determine required test types from what the ticket explicitly mandates or
   logically implies. Do not invent test types.
6. Write numbered test conditions (TCD-ID format) for every AC item and every
   flow, rule, or constraint in `{DESCRIPTION}` — covering happy path,
   alternative, negative, boundary, and integration scenarios.
7. Build a Traceability Matrix linking every test condition to its source AC
   item or description section in `{TICKET_ID}`.
8. Derive the test level execution sequence from the ticket's complexity, linked
   issues, and component type. Do not impose a sequence not justified by the ticket.
9. Document all integration dependencies, test data states, entry/exit criteria,
   and risks using only ticket-stated content. Flag everything else as unknown.
10. Run a final anti-hallucination self-validation before writing the document
    and report the result as the last section.

## CONTEXT

The input is one or more Jira tickets. The resulting Test Strategy is a planning
artifact that establishes *how* testing will be approached for the scope of the
ticket(s) — not a set of detailed executable test cases.

A Test Strategy differs from a Test Plan and Test Cases in scope and abstraction:

| Concept | Test Strategy (this skill) | Test Plan | Test Cases |
| --- | --- | --- | --- |
| Source | **Jira Ticket** | Jira Ticket | Jira Ticket |
| Granularity | Quality approach, philosophy, types, levels | Test conditions per AC / requirement | Step-by-step executable scripts |
| Primary output | Philosophy, execution sequence, risk posture, coverage model | Scope, conditions, RTM | Pre-conditions, steps, expected result, pass/fail |
| Audience | QA Lead, architects, product owners, test governance | QA Lead, Product Owner, sprint planning | QA engineer executing tests |

### Jira Ticket Field Hierarchy for Strategy Derivation

```
{TICKET_ID} — {TICKET_SUMMARY}
    |
    |-- {ACCEPTANCE_CRITERIA}     --> Primary source: scope, test conditions, coverage decisions
    |-- {DESCRIPTION}             --> Secondary source: architecture, flows, constraints, NFRs
    |-- {LINKED_ISSUES}           --> Risk and dependency identification
    |-- {LABELS}                  --> Test type selection (security, regression, smoke, performance)
    |-- {COMPONENT}               --> Module / system area scoping
    |-- {TICKET_PRIORITY}         --> Risk prioritisation and test depth
    |-- {ENVIRONMENT}             --> Environment strategy and integration context
    |-- {FIX_VERSION}             --> Release boundary and regression scope
    |-- {ATTACHMENTS}             --> Supporting specs (if provided)
```

Apply these evidence rules throughout:

- Use only information explicitly stated in the provided Jira ticket fields.
- Do not assume default, normal, or standard system behavior.
- State **"Insufficient information to determine."** wherever ticket content is absent.
- Label any unavoidable inference as **"Inference (low confidence)"** and explain its basis.
- Preserve exact wording from `{ACCEPTANCE_CRITERIA}` and `{DESCRIPTION}` in
  test conditions — do not paraphrase error messages, status values, SLA thresholds,
  or business rules.
- Keep the output deterministic: the same ticket inputs must produce materially
  the same strategy.

## EXPECTED

Produce a Test Strategy document that:

- Begins with a Jira ticket snapshot confirming all fields extracted.
- Declares the quality objective and evidence boundary.
- Defines scope (in / out / constraints) derived from `{ACCEPTANCE_CRITERIA}`
  and `{DESCRIPTION}`.
- States a clear test philosophy and guiding principles justified by the ticket.
- Maps every required test type to its justification in the ticket.
- Defines a test level execution sequence appropriate to the ticket's scope.
- Provides numbered test conditions per AC item and description flow, each
  mapped to its ticket source.
- Includes a field/input validation strategy if the ticket states field constraints.
- Includes an NFR / SLA strategy if the ticket states performance or reliability targets.
- Provides a full Traceability Matrix.
- Covers access roles and personas if stated in the ticket.
- Documents integration and environment dependencies with mock/live requirements.
- Identifies test data states required, without inventing values or tooling.
- States entry and exit criteria using only ticket-sourced content.
- Lists deliverables, roles, risks, dependencies, and a Missing / Unknown table.
- Concludes with a self-validation result.

## PARAMETERS

Use these parameters unless the user supplies replacements:

| Parameter | Default / Rule |
| --- | --- |
| Source of truth | Provided Jira ticket fields only (`{TICKET_ID}`, `{ACCEPTANCE_CRITERIA}`, `{DESCRIPTION}`, `{ATTACHMENTS}`) |
| Coverage basis | Every AC item + all flows, rules, constraints, NFRs, and security controls in `{DESCRIPTION}` |
| Strategy granularity | Test conditions per AC / behavior; do not fabricate executable steps, data values, or expected results |
| Condition ID format | `TCD-{TICKET_ID}-{Sequence}` (e.g., `TCD-PROJECT-123-001`; `TCD-PROJECT-123-AF01` for alternative/failure) |
| Condition title format | `[Test Type] - <brief description of verifiable behavior>` |
| Traceability | Cite `{TICKET_ID}` and AC item number or description section for every test condition |
| Priority | Map from `{TICKET_PRIORITY}`: Blocker/Critical -> P1, Major -> P2, Minor -> P3, Trivial -> P4 |
| Missing data | Record in Missing / Unknown Information section; do not resolve by assumption |
| Test types | Include only those justified by `{ISSUE_TYPE}`, `{LABELS}`, `{COMPONENT}`, or ticket content |
| Scope constraints | Flag AC items or description sections that are ambiguous or untestable |
| Roles / personas | Include only roles explicitly stated in the ticket; flag if absent |
| Linked ticket content | Do not invent; flag as `Content of {LINKED_ISSUE_ID} not provided — review required` |
| Output format | Markdown with tables; save as `TS_{TICKET_ID}.md` (e.g., `TS_PROJECT-123.md`) |

## OUTPUT

Return the Test Strategy in Markdown using this exact section order:

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
| Evidence Rule | All strategy content derived from ticket fields only. No behavior invented. |

---

### 2. Document Control

| Attribute | Value |
| --- | --- |
| Strategy Title | QA Test Strategy: `{TICKET_ID}` — `{TICKET_SUMMARY}` |
| Source Ticket(s) | `{TICKET_ID}` |
| Issue Type | `{ISSUE_TYPE}` |
| Fix Version | `{FIX_VERSION}` |
| Sprint | `{SPRINT}` |
| Ticket Priority | `{TICKET_PRIORITY}` |
| Strategy Status | Draft |
| Evidence Boundary | Provided Jira ticket fields only |
| Total Test Conditions | `{TOTAL_TCD_COUNT}` |
| Last Updated | `{DATE}` |

---

### 3. Objective

State the quality objective in one paragraph. Derive from `{TICKET_SUMMARY}`,
`{DESCRIPTION}`, and `{ACCEPTANCE_CRITERIA}`. Declare the evidence boundary:
all content is sourced from `{TICKET_ID}` fields only; nothing is invented.

---

### 4. Scope

#### 4.1 In Scope

Derive from `{ACCEPTANCE_CRITERIA}` and `{DESCRIPTION}`.

| # | In-Scope Behavior / Feature | Source (AC # / Description) |
| --- | --- | --- |
| 1 | `<Behavior or feature stated in AC or description>` | AC-01 / `{DESCRIPTION}` |
| 2 | ... | ... |

#### 4.2 Out of Scope

Derive from explicit exclusions stated in `{DESCRIPTION}` or `{ACCEPTANCE_CRITERIA}`.
If none stated: `No explicit exclusions stated in {TICKET_ID}.`

#### 4.3 Scope Constraints

Flag any AC item or `{DESCRIPTION}` section that is ambiguous, incomplete, or
untestable as written. State what information is needed to make it testable.
If `{LINKED_ISSUES}` references a feature with content not provided, flag it here.

---

### 5. Test Philosophy & Guiding Principles

Derive principles from the ticket's priority, issue type, labels, and content.
Include only principles justified by the ticket.

1. **Ticket-Derived Coverage:** Every test condition is traced to a specific AC
   item or `{DESCRIPTION}` section of `{TICKET_ID}`. No condition is invented.
2. **Risk-Based Depth:** `{TICKET_PRIORITY}` is `{TICKET_PRIORITY}` — highest-priority
   and security-relevant AC items receive the deepest coverage first.
3. **Shift-Left Quality:** Strategy is authored before test case writing to
   establish shared understanding of scope and approach.
4. **Evidence over Assumption:** Where the ticket does not supply information
   (endpoints, data, schedules), the gap is documented rather than assumed.
5. **Automation-First:** AC items and conditions tagged with `{LABELS}` containing
   `regression`, `smoke`, or boundary constraints are candidates for automation.
   *(Include only if `{LABELS}` or ticket content supports automation.)*

---

### 6. Test Approach & Test Types

Justify every test type with a reference to the ticket field or content that
mandates or implies it. Remove any row not justified by the ticket.

| Test Type | Justification (ticket field / content) | Primary Coverage Areas |
| --- | --- | --- |
| Functional | `{ACCEPTANCE_CRITERIA}` states positive flows | AC-01 to AC-{N}: happy-path verification |
| Negative | `{DESCRIPTION}` / AC describes error or rejection conditions | Stated failure behaviors and error messages |
| Boundary | Field or value constraints stated in `{DESCRIPTION}` or AC | Min/max values, length limits, threshold rules |
| Integration | `{DESCRIPTION}` references external systems or dependent services | Named system integrations from ticket |
| Security | `{LABELS}` contains `security`, or ticket describes auth / access controls | Stated security rules and access restrictions |
| Regression | `{LABELS}` contains `regression`, or `{LINKED_ISSUES}` references existing flows | Core flows that must remain unbroken |
| Smoke | `{LABELS}` contains `smoke`, or `{FIX_VERSION}` implies a release gate | Critical path verification at deployment |
| Performance / SLA | `{DESCRIPTION}` or AC states latency, throughput, or SLA thresholds | Named SLA targets from ticket |
| Acceptance (UAT) | `{ISSUE_TYPE}` is Story or Epic; AC are business-facing | Full AC satisfaction from `{REPORTER}` perspective |

---

### 7. Test Levels & Execution Sequence

Derive the execution sequence from the ticket's scope, linked dependencies,
and component type.

```
Level 1 — Field / Input Validation
          (if {DESCRIPTION} or AC states field constraints)
    |
Level 2 — Component / Integration Testing
          (if {DESCRIPTION} names external systems or {LINKED_ISSUES} exist)
    |
Level 3 — Functional / AC-Based Testing
          (AC-01 through AC-{N}: happy path + negative + boundary)
    |
Level 4 — Security Testing
          (if {LABELS} contains 'security' or ticket describes access controls)
    |
Level 5 — Performance / SLA Testing
          (if {DESCRIPTION} or AC states latency or throughput targets)
    |
Level 6 — Regression / Smoke Gate
          (if {LABELS} contains 'regression' or 'smoke', or {FIX_VERSION} set)
```

Flag any level not applicable to `{TICKET_ID}` and remove it from the sequence.

---

### 8. Test Conditions by AC Item

Organise conditions by AC item, then by additional flows from `{DESCRIPTION}`.
Use heading levels:
- `#### AC-{N}: {AC_ITEM_TEXT}`
- `#### Description Flow: {FLOW_NAME}`

For each section, use this table:

| TCD ID | Test Type | Test Condition | Source | Priority | Automation |
| --- | --- | --- | --- | --- | --- |
| `TCD-{TICKET_ID}-001` | Functional | `<Verifiable behavior from AC or description — use ticket language>` | AC-01 | P{N} | [AUTOMATE] / Manual |
| `TCD-{TICKET_ID}-AF01` | Negative | `<Error or rejection behavior stated in ticket>` | AC-01 / `{DESCRIPTION}` | P{N} | [AUTOMATE] / Manual |
| `TCD-{TICKET_ID}-BV01` | Boundary | `<Min/max or threshold verification>` | `{DESCRIPTION}` | P{N} | [AUTOMATE] |

Rules:
- One condition per distinct verifiable behavior.
- Use ticket language — do not paraphrase stated error messages or status values.
- Flag any condition where expected behavior is absent from the ticket:
  `Expected behavior not stated in {TICKET_ID} — insufficient information to determine.`

---

### 9. Field / Input Validation Strategy

*(Include this section only if `{DESCRIPTION}` or `{ACCEPTANCE_CRITERIA}` states
field constraints, input validation rules, regex patterns, or length limits.)*

| Field Name | Data Type | Required | Constraint | Validation Rule / RegEx | Failure Input (from ticket) | BVA Strategy |
| --- | --- | --- | --- | --- | --- | --- |
| `<field from ticket>` | `<type>` | Yes / No | `<stated constraint>` | `<regex or rule from ticket>` | `<failure input stated in ticket>` | BVA: min-1 fail, min pass, max pass, max+1 fail |

Derive BVA boundaries from constraints stated in the ticket only. Do not invent
constraints not present in `{TICKET_ID}`.

---

### 10. NFR / SLA Strategy

*(Include this section only if `{DESCRIPTION}` or `{ACCEPTANCE_CRITERIA}` states
performance, reliability, latency, or throughput targets.)*

For each stated SLA or performance target:

| SLA / NFR Target | Test Condition | Source (ticket field) |
| --- | --- | --- |
| `<stated SLA figure from ticket>` | `<verification approach>` | `{DESCRIPTION}` / AC-{N} |

Workload profile, test tooling, and acceptance authority are not stated in
`{TICKET_ID}` — insufficient information to determine.

---

### 11. Traceability Matrix

| AC # / Source | Content (verbatim from ticket) | TCD IDs | Test Types | Coverage Status |
| --- | --- | --- | --- | --- |
| AC-01 | `{AC_ITEM_1}` | TCD-{TICKET_ID}-001, AF01 | Functional / Negative | Full / Partial / Not Testable |
| AC-02 | `{AC_ITEM_2}` | TCD-{TICKET_ID}-002 | Boundary | Full |
| `{DESCRIPTION}` Flow | `<Stated flow or rule>` | TCD-{TICKET_ID}-003 | Integration | Partial |

Coverage Status:
- **Full** — all positive, negative, and boundary conditions covered
- **Partial** — gap noted; see Missing / Unknown Information section
- **Not Testable** — AC is ambiguous or lacks detail; flagged for ticket update

---

### 12. Roles & Personas — Test Coverage

*(Include this section only if `{DESCRIPTION}` or `{ACCEPTANCE_CRITERIA}` names
user roles, personas, or access levels.)*

| Role / Persona | Source | Test Coverage Areas |
| --- | --- | --- |
| `<role stated in ticket>` | AC-{N} / `{DESCRIPTION}` | `<behaviors accessible to this role per ticket>` |

If no roles are defined in `{TICKET_ID}`:
`No user roles or personas are defined in {TICKET_ID} — insufficient information to determine.`

---

### 13. Test Environment & Integration Dependencies

| Item | Detail | Source | Status |
| --- | --- | --- | --- |
| Environment | `{ENVIRONMENT}` | `{TICKET_ID}` | Stated / Not stated in ticket |
| Component under test | `{COMPONENT}` | `{TICKET_ID}` | Stated / Not stated in ticket |
| Linked / dependent ticket | `{LINKED_ISSUE_ID}` | `{LINKED_ISSUES}` | Content not provided — review required |
| External system / API | `<Named system from {DESCRIPTION}>` | `{DESCRIPTION}` | Mock / Live — not specified in ticket |
| Attachments / Specs | `{ATTACHMENTS}` | `{TICKET_ID}` | Provided / Not provided |

Topology, API endpoints, authentication credentials, mock contracts, and
availability windows are not stated in `{TICKET_ID}` —
insufficient information to determine.

---

### 14. Test Data Requirements

List all data states implied by `{ACCEPTANCE_CRITERIA}` and `{DESCRIPTION}`.

- `<data item>` — required state: `<state from ticket>` (source: AC-{N} / `{DESCRIPTION}`)
- Mark all actual values, provisioning scripts, and reset mechanisms as:
  `To be provisioned — not stated in {TICKET_ID}.`

---

### 15. Entry Criteria

| Criterion | Source |
| --- | --- |
| Ticket status is `{TICKET_STATUS}` (Ready for Testing / In QA) | `{TICKET_ID}` — Status field |
| Fix version `{FIX_VERSION}` deployed to `{ENVIRONMENT}` | `{TICKET_ID}` — Fix Version / Environment fields |
| `{LINKED_ISSUES}` blocking tickets are resolved | `{LINKED_ISSUES}` — flag if content not provided |
| All `{AC_COUNT}` AC items reviewed and approved | `{TICKET_ID}` — AC field |

Additional entry criteria (environment readiness, test data provisioning,
mock configuration) are not stated in `{TICKET_ID}` —
insufficient information to determine.

---

### 16. Exit Criteria

| Criterion | Source |
| --- | --- |
| All test conditions derived from `{ACCEPTANCE_CRITERIA}` pass | `{TICKET_ID}` — AC field |
| Zero open defects at priority `{TICKET_PRIORITY}` or higher | `{TICKET_ID}` — Priority field |
| Regression conditions pass (if `{LABELS}` contains `regression`) | `{LABELS}` |
| Security test completed (if `{LABELS}` contains `security`) | `{LABELS}` |

Pass-rate threshold, defect severity definitions, reporting workflow, and
sign-off approver are not stated in `{TICKET_ID}` —
insufficient information to determine.

---

### 17. Deliverables

| Deliverable | Description |
| --- | --- |
| This QA Test Strategy | Ticket-traced strategy derived from `{TICKET_ID}` |
| QA Test Plan | Detailed test conditions per AC (to be authored from this strategy) |
| Test Cases | Executable cases per condition (to be authored post-plan approval) |
| Defect Reports | Defects raised during execution (tooling not stated in ticket) |
| Test Execution Evidence | Pass/fail results per TCD (format not stated in ticket) |
| Regression Results | If `{LABELS}` contains `regression` — results for tagged conditions |

---

### 18. Roles & Responsibilities

| Responsibility | Implied Owner | Source |
| --- | --- | --- |
| Strategy authorship | QA Lead / `{ASSIGNEE}` | `{TICKET_ID}` — Assignee field |
| AC clarification and ownership | `{REPORTER}` | `{TICKET_ID}` — Reporter field |
| Sprint delivery | `{ASSIGNEE}` | `{TICKET_ID}` — Assignee field |

Named QA team members beyond `{REPORTER}` and `{ASSIGNEE}`, responsibility
assignments, and approval authority are not stated in `{TICKET_ID}` —
insufficient information to determine.

---

### 19. Risks, Dependencies & Mitigations

| Type | Item | Source | Planning Treatment |
| --- | --- | --- | --- |
| Dependency | `{LINKED_ISSUE_ID}` blocks `{TICKET_ID}` | `{LINKED_ISSUES}` | Flag as prerequisite; content not available |
| Priority risk | Ticket is `{TICKET_PRIORITY}` — defects may block `{FIX_VERSION}` release | `{TICKET_PRIORITY}` / `{FIX_VERSION}` | Execute P1/P2 conditions first |
| Scope risk | `{AC_COUNT}` AC items — ambiguous ACs flagged in Section 4.3 | `{ACCEPTANCE_CRITERIA}` | Clarify with `{REPORTER}` before test execution |
| Environment risk | `{ENVIRONMENT}` not confirmed or not stated in ticket | `{ENVIRONMENT}` | Raise environment readiness as a blocker |
| Data risk | Test data values not specified in ticket | `{DESCRIPTION}` | Raise data provisioning as a dependency |
| Integration risk | `{LINKED_ISSUES}` or named systems in `{DESCRIPTION}` — content not fully stated | `{DESCRIPTION}` / `{LINKED_ISSUES}` | Flag for integration spec before execution |

Risk rankings, mitigation owners, and contingency plans are not stated in
`{TICKET_ID}` — insufficient information to determine.

---

### 20. Missing / Unknown Information

| Missing Item | Affected TCD IDs | Impact on Strategy |
| --- | --- | --- |
| `<Field or detail not stated in ticket>` | TCD-{TICKET_ID}-{N} | `<What cannot be planned or executed without this>` |

Standard items to check:
- `{ACCEPTANCE_CRITERIA}` not supplied or ambiguous
- `{ENVIRONMENT}` field not populated in ticket
- `{LINKED_ISSUES}` content not available
- Error messages or status codes not defined in ticket
- Field / input constraints not stated (if applicable)
- Test data values and provisioning approach not specified
- NFR / SLA thresholds not stated (if applicable)
- Entry / exit pass-rate thresholds not defined
- Sign-off approver and workflow not stated
- Security test tooling and evidence format not stated (if applicable)
- Manager-approval process not described (if applicable)

---

### 21. Assumptions & Inferences

List any assumption not directly traceable to the ticket fields.
If none: `None. All content is derived directly from {TICKET_ID} fields.`

---

### 22. Self-Validation Check

| Validation Criterion | Result |
| --- | --- |
| Traceability — every TCD mapped to `{TICKET_ID}` and a specific AC item or description section | Pass / Fail |
| Evidence boundary — no strategy item invented beyond ticket content | Pass / Fail |
| No fabricated behavior — no tools, endpoints, data values, schedules, or owners invented | Pass / Fail |
| Scope consistency — in/out-of-scope matches `{ACCEPTANCE_CRITERIA}` and `{DESCRIPTION}` | Pass / Fail |
| AC coverage — at least one condition per AC item | Pass / Fail |
| Scope constraint — ambiguous or incomplete ACs flagged in Section 4.3 | Pass / Fail |
| Dependency handling — all `{LINKED_ISSUES}` noted without inventing their content | Pass / Fail |
| Gap handling — missing data, environment, and criteria documented, not assumed | Pass / Fail |

**Self-validation result:** `<One sentence confirming compliance or listing failures.>`
**Total test conditions generated:** `{TOTAL_TCD_COUNT}`

---

## TONE

Write in precise, neutral, audit-ready QA language. Be concise and factual.
Prefer phrasing such as "The ticket states...", "Per `{TICKET_ID}` AC-{N}...",
or "`{DESCRIPTION}` specifies..." over unsupported assertions. Never present an
assumption or inference as a verified fact. Flag every gap explicitly using
`Not stated in {TICKET_ID} — insufficient information to determine.`
