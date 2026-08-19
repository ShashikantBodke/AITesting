# QA Test Plan: NextGen Enterprise Telco CRM System (B2C & B2B)

## Verified Facts

| Item | Verified information |
| --- | --- |
| Source FRS | `FRS-TELCO-CRM-2026-V1.0`, version 1.0, revised 2026-08-03 |
| FRS status | Approved for QA Test Case Creation |
| System | NextGen Enterprise Telco CRM System (B2C & B2B) |
| FRS audience | QA Test Engineering Lead, Solution Architects, Integration Developers, Product Owners |
| Stated integrations | eKYC / National Identity Gateway; HLR / HSS / UDM; OCS / Rating Engine; Billing System and Payment Gateways; Provisioning System / SOM |
| In-scope functions | Customer 360 View; eKYC and Subscriber Onboarding; Plan and Add-on Management; Order Provisioning (New Line, SIM Swap, MNP); Real-Time Billing and Recharge; Customer Service and Trouble Ticketing; Retention and Churn Scoring |
| Out-of-scope functions | Physical network tower hardware provisioning; internal RAN infrastructure diagnostics |
| Evidence rule | This plan uses only the supplied FRS and the supplied Anti-Hallucination Rules. |

The product roles and channels stated in the FRS are CSR / Call Center Workspace, Store Agent / Retail POS Terminal, Billing Specialist / Admin Back-Office, Field Technician / Mobile App, and Subscriber / Self-Service Web/App.

## Test Plan

### Document Control

| Attribute | Value |
| --- | --- |
| Test Plan title | QA Test Plan: NextGen Enterprise Telco CRM System (B2C & B2B) |
| Source document | `FRS-TELCO-CRM-2026-V1.0` |
| Source version | 1.0 |
| Source status | Approved for QA Test Case Creation |
| Test Plan status | Insufficient information to determine. |
| Evidence boundary | Supplied FRS and Anti-Hallucination Rules only |

### Objective

Plan verification of the FRS-defined functional behavior, validations, integrations, service-level requirements, security controls, and compliance controls. This plan provides requirement traceability and identifies information that is not available for execution planning.

### Scope

#### In scope

- Subscriber Registration and eKYC Verification (`FR-TEL-011`).
- New Connection and Physical SIM / eSIM Activation (`FR-TEL-021`).
- Mobile Number Portability - Inbound (`FR-TEL-022`).
- SIM Swap Procedure (`FR-TEL-023`).
- Real-Time Balance, Plan Subscriptions and Add-ons (`FR-TEL-031`).
- Real-Time Top-up and Payment Gateway Processing (`FR-TEL-032`).
- Unified Customer 360 Dashboard (`FR-TEL-041`).
- Incident Management and Trouble Ticket Lifecycle (`FR-TEL-042`).
- Field validation requirements `FLD-01` through `FLD-06`.
- Non-functional requirements `NFR-TEL-01` through `NFR-TEL-03`.

#### Out of scope

- Physical network tower hardware provisioning.
- Internal RAN infrastructure diagnostics.

#### Scope constraint

Retention and Churn Scoring is stated as in scope, but the FRS supplies no detailed functional requirement, business rule, acceptance criterion, or RTM scenario for it. Insufficient information to determine test conditions.

### Test Approach and Test Types

The FRS explicitly identifies or instructs the following coverage: Functional, Integration, End-to-End, Security, Regression, Boundary, Logic, Negative, SLA, Workflow, Performance, Load, and automated positive, negative, and edge-case validation scripts for the field validation matrix.

The plan uses requirement-derived test conditions. It does not invent executable steps, API endpoints, tools, fixtures, data values, schedules, or acceptance methods that are not supplied.

### Test Items and Test Conditions

| Source ID | Test item | Test type | Planned test conditions |
| --- | --- | --- | --- |
| `FR-TEL-011` | eKYC registration | Functional / Integration | Verify Prepaid/Postpaid and B2C/B2B selection; National ID/Passport and biometric/photo ID capture; TLS 1.3 eKYC request; `VERIFIED` profile auto-population; active SIM count check; and progression to MSISDN allocation and SIM assignment. |
| `FR-TEL-011` | eKYC alternatives | Functional / Integration | Verify `REJECTED` or biometric mismatch results in `FAILED_KYC`, the stated biometric error, and no order progression. Verify the regulator limit: a National ID with 5 active Prepaid SIMs is not permitted to create an additional line. Verify a response exceeding 5,000 ms produces `PENDING_MANUAL_VERIFICATION` and a Back-Office audit workflow. |
| `FR-TEL-021` | Physical SIM and eSIM activation | Functional / End-to-End | Verify `AVAILABLE` MSISDN selection; 19-20 digit ICCID beginning with `89`; `UNASSIGNED` ICCID validation; SOM order; `PROVIDE_SUBSCRIBER_DATA (MSISDN, IMSI, Profile_ID)` payload; HLR `200 OK SUCCESS`; eSIM QR generation using the stated LPA pattern; and CRM `ACTIVE` status within 3 seconds. |
| `FR-TEL-021` | Provisioning exceptions | Functional / End-to-End | Verify an already assigned ICCID displays the stated binding error. Verify network-node failure results in `PROVISIONING_FAILED` and 3 retries at 1-minute intervals. |
| `FR-TEL-022` | Inbound MNP | Functional validation | Verify donor carrier operator code; valid, active, unexpired PAC/NPK; 15-day PAC validity; NPC validation request; and the stated 24-hour execution window. |
| `FR-TEL-023` | SIM swap anti-fraud controls | Security / Regression | Verify OTP sent to the secondary registered contact number or email; 24-hour financial transaction lock, including barred SMS OTP banking notifications; and old ICCID deactivation in HLR before new ICCID activation. |
| `FR-TEL-031` | Plan, add-on, and rating behavior | Boundary / Logic | Verify Prepaid Flexi 30 auto-renewal at `$30.00` and failure at `$29.99`; 15 GB allowance and `$0.05 / MB` after 100% usage; Postpaid 100 GB fair-usage threshold and 512 Kbps throttle; and Data Booster 5GB price, expiry, hard-stop, and portal redirect rules. |
| `FR-TEL-032` | Top-up processing | Security / Negative | Verify exactly 16-digit voucher PIN; instant OCS Main Balance credit; and 2-hour top-up lock after 5 consecutive wrong PIN attempts. |
| `FR-TEL-041` | Customer 360 dashboard | Functional / Performance | Verify CSR display in less than 1.5 seconds and the stated header, real-time balances, active services/hardware, and recent-interaction contents. |
| `FR-TEL-042` | Trouble ticket lifecycle | SLA / Workflow | Verify all stated ticket categories and the P1-P4 resolution, escalation, and auto-closure rules. |
| `FLD-01` to `FLD-06` | Field validation | Boundary / Equivalence Partitioning | Verify required data types, ranges, regular expressions, positive values, supplied failure inputs, and boundary conditions. |
| `NFR-TEL-01` | Performance and scalability | Performance / Load | Verify up to 5,000 TPS; Customer 360 under 1.5 seconds; OCS Balance Check API under 100 ms; Provisioning Order Dispatch to HLR under 500 ms. The FRS RTM recommends a JMeter load test simulating 5,000 TPS on the OCS balance-check endpoint. |
| `NFR-TEL-02` | Availability and failover | Reliability | Verify 99.999% SLA for OCS Rating and Provisioning Interfaces; active-active multi-region deployment; RPO = 0; and RTO under 30 seconds. |
| `NFR-TEL-03` | Privacy and PCI-DSS | Security / Compliance | Verify MSISDN and Customer Address masking in CSR views unless unmasked with manager approval. Verify no Credit Card CVV or full PAN is stored in CRM log files. |

### Requirement Traceability Matrix

| Requirement ID | FRS section | Requirement / rule | Test type | Planned test conditions |
| --- | --- | --- | --- | --- |
| `FR-TEL-011` | 4, Module 1 | eKYC, regulatory SIM limit, rejection, and timeout behavior | Functional / Integration | Positive verification and auto-population; biometric mismatch / rejection; 6th-SIM block; 5,000 ms timeout. |
| `FR-TEL-021` | 4, Module 2 | MSISDN/ICCID pairing and HLR/HSS provisioning | Functional / End-to-End | SIM/eSIM activation; HLR success; assigned ICCID; provisioning failure and retries. |
| `FR-TEL-022` | 4, Module 2 | Inbound MNP PAC/NPK and NPC validation | Functional validation | Donor code; active PAC; 15-day validity; NPC request; 24-hour window. |
| `FR-TEL-023` | 4, Module 2 | SIM swap security controls | Security / Regression | OTP; 24-hour lock; old ICCID deactivation before new activation. |
| `FR-TEL-031` | 4, Module 3 | Plans, add-ons, rating, and renewal | Boundary / Logic | `$30.00` vs `$29.99` renewal; usage outcomes; plan and add-on rules. |
| `FR-TEL-032` | 4, Module 3 | Voucher top-up and lockout | Security / Negative | 16-digit PIN; OCS credit; 5 wrong PINs and 2-hour lock. |
| `FR-TEL-041` | 4, Module 4 | Customer 360 content and response time | Functional / Performance | Required panels and less-than-1.5-second display. |
| `FR-TEL-042` | 4, Module 4 | Ticket categories, SLA, and escalation | SLA / Workflow | P1-P4 resolution, escalation, and auto-close conditions. |
| `FLD-01` to `FLD-06` | 5 | Field validation matrix | Boundary / Equivalence Partitioning | Positive, negative, edge input, and stated regex/range checks. |
| `NFR-TEL-01` | 6 and 7 | Throughput and latency | Performance / Load | 5,000 TPS and all stated latency thresholds. |
| `NFR-TEL-02` | 6 | Availability and failover | Reliability | Five nines, RPO 0, and RTO under 30 seconds. |
| `NFR-TEL-03` | 6 | Privacy and payment-card data | Security / Compliance | Masking / manager approval; no CVV or full PAN in logs. |

### Field Validation Coverage

| Field ID | Field | FRS constraint | Supplied failure input |
| --- | --- | --- | --- |
| `FLD-01` | MSISDN | Required; 10 to 15 digits; E.164 `^\+[1-9]\d{1,14}$` | `12345`; `+1ABC5678` |
| `FLD-02` | ICCID | Required; exactly 19 or 20 digits; `^89[0-9]{17,18}$` | `8812345678901234567` |
| `FLD-03` | IMSI | Required; exactly 15 digits; `^[0-9]{15}$` | `12345678901234` |
| `FLD-04` | National ID | Required; 8 to 20 characters; `^[a-zA-Z0-9\-]{8,20}$` | `ID#@!123` |
| `FLD-05` | Top-up PIN | Required; exactly 16 digits; `^[0-9]{16}$` | `123456789012345` |
| `FLD-06` | Postpaid Limit | Required; `$10.00` to `$5000.00`; positive floating point with 2 decimals | `-$50.00`; `$10000.00` |

### Test Environment and Integration Dependencies

The FRS states dependencies on eKYC / National Identity Gateway, HLR / HSS / UDM, OCS / Rating Engine, Billing System and Payment Gateways, Provisioning System / SOM, Number Inventory Database, NPC, and a Back-Office audit workflow.

The QA Approval and Sign-Off Checklist states that integration mocks must be configured for eKYC, HLR/HSS, and OCS APIs.

Environment topology, endpoints, authentication, test accounts, mock behavior, observability, and availability windows are not supplied. Insufficient information to determine.

### Test Data Requirements

The FRS requires data representing:

- Prepaid/Postpaid and B2C/B2B selections.
- National ID/Passport and biometric/photo ID outcomes.
- A National ID with 5 active Prepaid SIMs.
- MSISDN inventory states; ICCID states; and IMSI.
- PAC/NPK states and validity.
- Plan balances and voucher PIN attempt counts.
- Ticket priority/category/time conditions.
- The supplied invalid field values.

Actual test-data values, data-provisioning method, data masking method, reset approach, and ownership are not supplied. Insufficient information to determine.

### Entry Criteria

The FRS does not define entry criteria. Insufficient information to determine.

### Exit Criteria

The FRS QA Approval and Sign-Off Checklist states the following checks:

- 100% Test Case mapping completed against Sections 4, 5, and 7.
- Integration Mocks configured for eKYC, HLR/HSS, and OCS APIs.
- Security Penetration Testing completed for SIM Swap and Customer 360 data masking.
- Zero Open Blockers or Critical Bugs in the Test Management System (Jira / Quality Center).

No additional exit criteria, pass-rate threshold, defect-severity definition, or approval workflow is supplied. Insufficient information to determine.

### Deliverables

- This requirements-traceable QA Test Plan.

The FRS is approved for QA Test Case Creation. Test case artifacts, reports, execution evidence, and any other deliverables are not supplied. Insufficient information to determine.

### Roles and Responsibilities

The FRS names QA Test Engineering Lead, Solution Architects, Integration Developers, and Product Owners as its target audience. It also defines product-role access for CSR, Store Agent, Billing Specialist, Field Technician, and Subscriber.

Named QA delivery owners, responsibility assignments, and approval authority are not supplied. Insufficient information to determine.

### Approval / Sign-off

The FRS lists a QA Approval and Sign-Off Checklist. Sign-off approver names, signatures, dates, and workflow are not supplied. Insufficient information to determine.

### Risks, Dependencies, and Mitigations

| Type | FRS-derived item | Planning treatment |
| --- | --- | --- |
| Dependency | eKYC, HLR/HSS/UDM, OCS/Rating, Billing/Payment, SOM, NPC, and Number Inventory | Plan integration coverage from stated flows. Interface configuration details remain unknown. |
| Risk/control | SIM Swap anti-fraud controls and Customer 360 privacy masking | Include stated Security/Regression and Security/Compliance conditions. |
| Risk/control | OCS and Provisioning availability/failover targets | Include stated reliability conditions. Measurement method is unknown. |
| Unknown | Risk ranking, mitigation owner, and contingency plan | Insufficient information to determine. |

## Missing / Unknown Information

| Missing or unknown information | Why it constrains planning |
| --- | --- |
| Test schedule and milestones | No dates, phases, or execution timeline are stated. |
| Named test team and responsibilities | Product RBAC roles are stated, but no QA delivery ownership model is provided. |
| Entry criteria | The FRS does not define readiness conditions for starting testing. |
| Environment configuration | No endpoints, credentials, topology, deployment build, mock contracts, or access instructions are supplied. |
| Test-data governance | No approved test accounts, synthetic-data rules, data provisioning, or reset approach is supplied. |
| Detailed API contracts | The FRS names integrations and selected payload/status details but does not provide complete API documentation. |
| Defect workflow and metrics | No severity definitions, reporting cadence, pass-rate threshold, or defect-triage process is supplied. |
| Retention and Churn Scoring requirements | The feature is in scope but has no detailed requirement or RTM scenario. |
| MNP success/failure behavior | MNP validation conditions and the execution window are stated; success/failure statuses and error behavior are not. |
| Performance measurement method | Thresholds and a JMeter recommendation are stated; workload profile, duration, environment capacity, and acceptance method are not. |
| Security test method | Required controls are stated; test tools, evidence format, and manager-approval process are not. |

## Assumptions and Inferences

None.

## Self-Validation Check

- Traceability: Every planned test condition is mapped to an FRS requirement ID, field ID, or NFR ID and section.
- Evidence boundary: Statements are limited to the supplied FRS and Anti-Hallucination Rules.
- No invented behavior: Unprovided tools, endpoints, detailed data, schedules, owners, and workflows are not asserted as facts.
- Scope consistency: In-scope and out-of-scope items match FRS Section 2.2. Retention and Churn Scoring is identified as lacking detailed requirements.
- Gap handling: Missing information is listed explicitly and is not resolved by assumption.

Self-validation result: No contradiction was identified between this Test Plan and the supplied FRS. Execution planning remains constrained by the Missing / Unknown Information section.
