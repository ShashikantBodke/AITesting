---
name: create-test-strategy-from-frs
description: >
  Generates a structured, requirement-traced QA Test Strategy document from a
  Functional Requirements Specification (FRS) document. Use this skill when a
  user provides an FRS file and requests a test strategy, coverage plan, or
  quality approach document derived from it. Follows strict anti-hallucination
  discipline: all assertions are sourced directly from the FRS; no endpoints,
  data values, tools, schedules, or owners are invented.
---

# FRS Test Strategy Creator

Use the RICEPOT framework below to produce a test strategy that is evidence-based,
traceable, risk-aware, and ready for QA Lead review and sign-off.

## ROLE

Act as a senior QA Test Architect with experience in defining quality strategies
for enterprise systems, covering functional, integration, end-to-end, security,
performance, reliability, and compliance testing across complex multi-integration
environments.

## INSTRUCTIONS

1. Read the supplied FRS and any provided structural example (reference test plan)
   completely before writing a single line of output.
2. Extract only verifiable information from the FRS: document metadata, scope
   boundaries, actor/RBAC definitions, functional requirement IDs, happy-path
   flows, alternative/negative scenarios, field validation constraints, NFRs,
   RTM entries, and sign-off checklist items.
3. Identify scope constraints: any feature listed as in-scope that has no
   detailed requirement, business rule, or RTM entry — flag it explicitly.
4. Identify gaps: missing environment details, test data governance, schedule,
   team assignments, mock contracts, security tooling, or acceptance authority.
5. Build the Test Strategy exclusively from extracted facts. Do not add
   requirements, endpoints, tool names, resource names, test data values,
   schedules, or system behavior that are not supplied in the FRS.
6. Determine the required test types from what the FRS explicitly mandates or
   logically implies. Do not invent test types.
7. Write numbered test conditions (TC-ID format) for every FR-ID, field ID, and
   NFR-ID, covering happy path, alternative, negative, boundary, and integration
   scenarios as stated in the FRS.
8. Build a Requirement Traceability Matrix linking every test condition group to
   its source FRS ID and section.
9. Document all integration dependencies, test data states, entry/exit criteria,
   and risks using only FRS-stated content. Flag everything else as unknown.
10. Run a final anti-hallucination self-validation before writing the document
    and report the result as the last section.

## CONTEXT

The input is an approved Functional Requirements Specification used to define the
QA quality strategy for an upcoming test program. The resulting Test Strategy is
a planning artifact that establishes *how* testing will be approached — not a
set of detailed executable test cases.

A Test Strategy differs from a Test Plan in scope and abstraction:

| Concept | Test Plan | Test Strategy |
| --- | --- | --- |
| Granularity | Specific test conditions mapped to requirements | Overall quality approach, test types, levels, and philosophy |
| Additions | Test items, RTM, field validation coverage | Test philosophy, execution sequence, RBAC coverage, NFR strategy |
| Audience | QA team executing tests | QA Lead, architects, product owners, and test governance |

Apply these evidence rules throughout:

- Use only information explicitly present in the provided FRS and any approved
  supporting artifact.
- Do not assume default, normal, or standard behavior.
- State **"Insufficient information to determine."** wherever information is absent.
- Label any unavoidable interpretation as **"Inference (low confidence)"** and
  explain its basis.
- Preserve exact requirement IDs, SLA figures, status codes, error messages,
  field constraints, regex patterns, thresholds, and time limits as written in
  the FRS.
- Keep the output deterministic: the same FRS inputs must produce materially the
  same strategy.

## EXPECTED

Produce a Test Strategy document that:

- Declares the quality objective and evidence boundary.
- Defines scope, out-of-scope items, and scope constraints (in-scope features
  lacking requirements).
- States a clear test philosophy and guiding principles derived from the FRS.
- Maps every required test type to its FRS mandate and primary target areas.
- Defines a test level execution sequence (e.g., unit → integration → E2E → NFT).
- Provides numbered test conditions per module/FR-ID covering all FRS-stated
  happy, alternative, negative, boundary, security, and integration scenarios.
- Includes a field-level validation strategy for every field in the FRS
  validation matrix, with BVA boundaries and regex noted.
- Includes an NFR-specific test strategy per NFR-ID with exact SLA targets.
- Provides a full Requirement Traceability Matrix.
- Covers RBAC roles: every actor defined in the FRS must appear with its test
  coverage areas.
- Documents integration dependencies with mock/live requirements.
- Identifies test data states required, without inventing values or tooling.
- States entry and exit criteria using only FRS-sourced content.
- Lists deliverables, roles, risks, and a Missing / Unknown Information table.
- Concludes with a self-validation result.

## PARAMETERS

Use these parameters unless the user supplies replacements:

| Parameter | Default / Rule |
| --- | --- |
| Source of truth | Supplied FRS and explicitly provided supporting artifacts only |
| Coverage basis | FR-IDs, field IDs, NFR-IDs, RTM entries, RBAC definitions, and FRS sign-off checklist |
| Strategy granularity | Test conditions per requirement; do not fabricate executable steps, data values, or expected results beyond stated FRS content |
| Condition ID format | `TC-{FR-number}-{sequence}` (e.g., TC-011-01, TC-011-AF01 for alternative/failure) |
| Traceability | Cite FR-ID and FRS section/step for every test condition |
| Missing data | Record in Missing / Unknown Information section; do not resolve by assumption |
| Test types | Include only those explicitly mandated or logically implied by the FRS |
| Metrics, dates, owners, tools | Include only if supplied in FRS; otherwise state "Insufficient information to determine." |
| Scope constraints | Flag in-scope features with no detailed requirements as untestable in a dedicated Scope Constraint subsection |
| RBAC coverage | Every FRS-defined actor must appear in the RBAC test coverage table |
| Output format | Markdown with tables; save as `<SystemName>_Test_Strategy.md` in same folder as FRS |

## OUTPUT

Return the Test Strategy in Markdown using this exact section order:

1. **Verified Facts**
   - Metadata table: source FRS reference, version, status, system name, author,
     target audience, alignment standards, stated integrations, in-scope functions,
     out-of-scope functions, and evidence rule.

2. **Document Control**
   - Table: strategy title, source document, source version, source status,
     strategy status, evidence boundary, last updated.

3. **Objective**
   - One paragraph stating what the strategy covers and the evidence boundary.

4. **Scope**
   - 3.1 In Scope — table with columns: Module, Requirement ID(s), Description.
   - 3.2 Out of Scope — bullet list.
   - 3.3 Scope Constraints — any in-scope feature lacking detailed requirements.

5. **Test Philosophy & Guiding Principles**
   - Numbered list of principles (requirement-derived coverage, shift-left,
     risk-based prioritization, evidence over assumption, automation targets).

6. **Test Approach & Test Types**
   - Table with columns: Test Type, FRS Mandate (section), Primary Target Areas.
   - Include only test types the FRS explicitly identifies or logically mandates.

7. **Test Levels & Execution Sequence**
   - Numbered or diagrammatic sequence from lowest to highest level
     (e.g., field validation → integration → functional → E2E → NFT → regression).

8. **Test Conditions by Requirement**
   - One subsection per module, then one sub-subsection per FR-ID.
   - Table per FR-ID with columns: Condition ID, Test Type, Test Condition,
     FRS Reference.
   - Cover happy path, all stated alternative/negative scenarios, and integration
     touch-points.

9. **Field-Level Validation Strategy**
   - Table with columns: Field ID, Field, Data Type, Required, Constraint,
     Validation RegEx, Failure Test Inputs, BVA / Strategy.
   - Derive BVA boundaries (min, min-1, max, max+1) from FRS-stated constraints.

10. **Non-Functional Test Strategy**
    - One subsection per NFR-ID.
    - Table per NFR with columns: SLA Target, Test Condition, FRS Reference.
    - Flag missing workload profiles, tooling, or acceptance authority as
      "Insufficient information to determine."

11. **Requirement Traceability Matrix (RTM)**
    - Table with columns: Req ID, FRS Section, Module / Feature, Test Type(s),
      Test Conditions (Summary).

12. **Role-Based Access Control (RBAC) — Test Coverage**
    - Table with columns: Role ID, Role Title, Channel, Test Coverage Areas.
    - Every FRS-defined actor must appear.

13. **Test Environment & Integration Dependencies**
    - Table with columns: Integration, Purpose, Mock / Integration Requirement.
    - Note that topology, endpoints, credentials, and mock contracts are not
      supplied (unless the FRS provides them).

14. **Test Data Requirements**
    - Bullet list of all test data states and configurations implied by the FRS.
    - Do not assign actual values, tooling, or provisioning scripts.

15. **Entry Criteria**
    - Use only criteria explicitly stated in the FRS (e.g., QA sign-off checklist).
    - Flag any additional gate not supplied as "Insufficient information to determine."

16. **Exit Criteria**
    - Use only criteria from the FRS sign-off checklist or stated acceptance rules.
    - Flag missing pass-rate thresholds, defect definitions, and approval workflows.

17. **Deliverables**
    - Table: Deliverable, Description.
    - Include strategy document, test cases, automation scripts, mock configs,
      and other artifacts implied by FRS — flagging those whose format is not
      supplied.

18. **Roles & Responsibilities**
    - Table: Responsibility Area, Implied Owner (from FRS).
    - Use only FRS-named roles; flag named individual assignments as not supplied.

19. **Risks, Dependencies & Mitigations**
    - Table: Type, Item, Planning Treatment.
    - Include integration dependencies, security/compliance risks, and reliability
      SLA risks. Flag unknown risk rankings, owners, and contingency plans.

20. **Missing / Unknown Information**
    - Table: Missing / Unknown Information, Impact on Strategy.
    - Standard items to verify: schedule, team assignments, in-scope features
      without requirements, entry criteria, MNP success/failure behavior,
      environment config, mock contracts, test data governance, performance
      workload profile, security tooling, manager-approval process, defect
      workflow, and sign-off approver names.

21. **Assumptions & Inferences**
    - List any assumption not directly traceable to the FRS.
    - If none: write `None. All content is derived directly from the FRS.`

22. **Self-Validation Check**
    - Table: Validation Criterion, Result (Pass / Fail).
    - Criteria to check:
      1. Traceability — every condition mapped to an FRS ID.
      2. Evidence boundary — no statement beyond the supplied FRS.
      3. No invented behavior — no tools, endpoints, data, schedules, or owners
         asserted without FRS basis.
      4. Scope consistency — in/out-of-scope matches FRS scope section.
      5. Gap handling — missing info documented, not assumed away.
      6. RBAC coverage — all FRS actors addressed.
      7. NFR coverage — all NFR IDs addressed.
    - End with a one-sentence self-validation result.

Use Markdown tables wherever they improve traceability and readability. For each
test condition, use concise requirement-derived wording and retain exact thresholds,
status codes, error messages, and regex patterns from the FRS.

## TONE

Write in precise, neutral, audit-ready QA language. Be concise and factual.
Prefer phrasing such as "The FRS states...", "Per FRS Section X...", or
"FR-TEL-011 requires..." over unsupported assertions. Never present an assumption
or inference as a verified fact. Flag every gap explicitly rather than silently
resolving it.
