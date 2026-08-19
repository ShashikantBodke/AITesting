# Automation-Focused Test Case Suite: NextGen Enterprise Telco CRM System

## Verified Facts

| Item | Verified fact |
| --- | --- |
| Source FRS | `FRS-TELCO-CRM-2026-V1.0`, version 1.0, revised 2026-08-03 |
| Source status | Approved for QA Test Case Creation |
| Test Plan | `NextGen_Telco_CRM_Test_Plan.md` |
| Evidence boundary | Supplied FRS, supplied Test Plan, supplied RICE POT template, and supplied Anti-Hallucination Rules only |
| Test approach | Automation-focused assertions; no automation tool, endpoint, UI control, or environment is specified |
| In scope | The FRS detailed requirements, field validation matrix, and NFRs listed in the coverage matrix in this document |
| Out of scope | Physical network tower hardware provisioning and internal RAN infrastructure diagnostics |

### RICE POT Control Block

| RICE POT element | Control |
| --- | --- |
| ROLE | Act as a QA automation analyst operating under strict verification rules. |
| INSTRUCTIONS | Derive each test case only from verified FRS/Test Plan facts; retain exact stated statuses, messages, constraints, thresholds, and ordering. |
| CONTEXT | The system is the NextGen Enterprise Telco CRM System (B2C & B2B). The FRS defines onboarding, provisioning, MNP, SIM swap, tariff/recharge, Customer 360, ticketing, field validation, and NFR requirements. |
| EXPECTED | Produce repeatable, source-traceable automation-focused test cases and explicitly identify unsupported execution details. |
| PARAMETERS | Do not invent APIs, UI elements, endpoints, credentials, tools, environment setup, error codes, or unstated behavior. Use `Insufficient information to determine.` for gaps. |
| OUTPUT | Markdown test cases with ID, source traceability, test type, objective, preconditions, test-data specification, automation actions/assertions, expected result, and limitations. |
| TONE | Precise, neutral, and audit-ready. |

## Missing / Unknown Information

| Missing or unknown information | Test-case treatment |
| --- | --- |
| Automation framework, tools, and test runner | Not named; automation actions remain tool-neutral. |
| API endpoints, schemas, authentication, and complete mock contracts | Not supplied; no endpoint-specific calls or payload fields beyond the stated `PROVIDE_SUBSCRIBER_DATA (MSISDN, IMSI, Profile_ID)` are asserted. |
| Environment, build, deployment, credentials, and test accounts | Not supplied; cases use FRS-defined state only. |
| Exact valid National ID, Passport, PAC/NPK, MSISDN, ICCID, IMSI, and account values | Not supplied; test data is expressed as a constraint or state, not fabricated identifiers. |
| UI control names, navigation, and user journey implementation | Not supplied; actions describe business operations rather than UI steps. |
| MNP success/failure statuses and error messages | Not supplied; cases assert the stated validations, NPC request, and time window only. |
| Invalid MSISDN/ICCID/IMSI/National ID/Top-up PIN/Postpaid Limit response messages | Not supplied; validation conformance is asserted without inventing a response message. |
| Measurement method for availability, latency, RPO, and RTO | Not supplied; cases assert the stated targets and mark the measurement mechanism as unknown. |
| Retention and Churn Scoring detail | Listed in FRS scope but lacks detailed requirements; no test case is generated. |

## Generated Output: Test Cases

### Case structure

Each test case uses these fields: **Test Case ID**, **Source Requirement / FRS section**, **Test Type**, **Objective**, **Preconditions**, **Test Data Specification**, **Automation Actions / Assertions**, **Expected Result**, and **Unknowns or Evidence Limitations**.

### Subscriber Onboarding and eKYC (`FR-TEL-011`)

#### TC-TEL-011-01 - Successful eKYC verification and onboarding progression

- **Source Requirement / FRS section:** `FR-TEL-011`; FRS Section 4, Module 1.
- **Test Type:** Functional / Integration.
- **Objective:** Verify the stated successful eKYC flow before line activation.
- **Preconditions:** A Store Agent or Customer Self-Service user has initiated a `New Connection Request`.
- **Test Data Specification:** A connection type of Prepaid or Postpaid; a segment of B2C or B2B; a National ID or Passport Number; biometric or photo ID; an eKYC response with `STATUS: VERIFIED`, full name, DOB, and registered address; fewer than 5 active Prepaid SIMs for the National ID.
- **Automation Actions / Assertions:** Initiate the new connection request; supply the stated connection/segment and identity inputs; verify invocation of the Government eKYC REST API over TLS 1.3; return `STATUS: VERIFIED`; assert profile population, active-SIM-count check, and progression to MSISDN allocation and SIM assignment.
- **Expected Result:** The system auto-populates the Customer Profile with the `VERIFIED` response details, checks the active SIM count, and proceeds to MSISDN allocation and SIM assignment.
- **Unknowns or Evidence Limitations:** The FRS does not define API endpoint, request schema, valid identity values, or the exact profile fields beyond full name, DOB, and registered address.

#### TC-TEL-011-02 - eKYC rejected response

- **Source Requirement / FRS section:** `FR-TEL-011`, AF-01; FRS Section 4, Module 1.
- **Test Type:** Functional / Integration.
- **Objective:** Verify handling of an eKYC `STATUS: REJECTED` response.
- **Preconditions:** A `New Connection Request` has been initiated.
- **Test Data Specification:** eKYC response `STATUS: REJECTED`.
- **Automation Actions / Assertions:** Submit the eKYC request with the stated response; assert request status and order-progression outcome.
- **Expected Result:** The request is flagged `FAILED_KYC`, the error text is `Biometric verification failed against National ID records.`, and the order cannot proceed.
- **Unknowns or Evidence Limitations:** The FRS does not state the response body format or how the error is exposed.

#### TC-TEL-011-03 - Biometric mismatch

- **Source Requirement / FRS section:** `FR-TEL-011`, AF-01; FRS Section 4, Module 1.
- **Test Type:** Functional / Integration.
- **Objective:** Verify handling of a biometric mismatch against National ID records.
- **Preconditions:** A `New Connection Request` has been initiated.
- **Test Data Specification:** Identity input with a biometric mismatch.
- **Automation Actions / Assertions:** Submit the eKYC operation with the mismatch condition; assert request status, error text, and order-progression outcome.
- **Expected Result:** The request is flagged `FAILED_KYC`, the error text is `Biometric verification failed against National ID records.`, and the order cannot proceed.
- **Unknowns or Evidence Limitations:** The FRS does not define the biometric data representation.

#### TC-TEL-011-04 - Regulatory active-line limit

- **Source Requirement / FRS section:** `FR-TEL-011`, AF-02; FRS Section 4, Module 1.
- **Test Type:** Functional / Negative.
- **Objective:** Verify the maximum 5 active Prepaid SIMs per National ID rule.
- **Preconditions:** A `New Connection Request` has been initiated and eKYC verification has completed to the SIM-count check.
- **Test Data Specification:** A National ID that already owns 5 active lines.
- **Automation Actions / Assertions:** Attempt to create an additional connection for the National ID; assert creation outcome and error text.
- **Expected Result:** Creation is blocked with `Regulatory limit reached: Maximum 5 active connections allowed per National ID.`
- **Unknowns or Evidence Limitations:** The FRS calls the limit `5 Prepaid SIMs` in the successful flow and `5 active lines` in AF-02. The test asserts the AF-02 block condition exactly; applicability to non-Prepaid lines is Insufficient information to determine.

#### TC-TEL-011-05 - eKYC gateway timeout

- **Source Requirement / FRS section:** `FR-TEL-011`, AF-03; FRS Section 4, Module 1.
- **Test Type:** Integration / Resilience.
- **Objective:** Verify eKYC timeout fallback.
- **Preconditions:** A `New Connection Request` has been initiated.
- **Test Data Specification:** eKYC API does not respond within 5,000 ms.
- **Automation Actions / Assertions:** Simulate no response for more than 5,000 ms; assert request status and Back-Office audit workflow trigger.
- **Expected Result:** The request moves to `PENDING_MANUAL_VERIFICATION` and a Back-Office audit workflow is triggered.
- **Unknowns or Evidence Limitations:** The FRS does not specify timeout implementation, workflow payload, or audit destination.

### Order Management and Provisioning (`FR-TEL-021`)

#### TC-TEL-021-01 - Available MSISDN and unassigned physical SIM activation

- **Source Requirement / FRS section:** `FR-TEL-021`; FRS Section 4, Module 2.
- **Test Type:** Functional / End-to-End.
- **Objective:** Verify the stated physical SIM activation flow.
- **Preconditions:** An MSISDN is `AVAILABLE` in the Number Inventory Database; an ICCID is `UNASSIGNED`.
- **Test Data Specification:** An available MSISDN; physical-SIM ICCID of exactly 19 or 20 digits beginning with `89`; IMSI and Profile_ID values required for the stated HLR payload.
- **Automation Actions / Assertions:** Select the MSISDN; scan the physical-SIM ICCID; validate `UNASSIGNED`; submit the Provisioning Order to SOM; assert the `PROVIDE_SUBSCRIBER_DATA (MSISDN, IMSI, Profile_ID)` payload; return HLR `200 OK SUCCESS`; assert CRM status within 3 seconds.
- **Expected Result:** Following `200 OK SUCCESS`, the line status updates to `ACTIVE` in CRM within less than 3 seconds.
- **Unknowns or Evidence Limitations:** The FRS does not provide MSISDN, ICCID, IMSI, or Profile_ID values; SOM/HLR interfaces and exact status-observation method are not supplied.

#### TC-TEL-021-02 - eSIM activation and QR rendering

- **Source Requirement / FRS section:** `FR-TEL-021`; FRS Section 4, Module 2.
- **Test Type:** Functional / End-to-End.
- **Objective:** Verify the eSIM activation branch.
- **Preconditions:** An MSISDN is `AVAILABLE` in Number Inventory; eSIM Activation is selected; HLR returns `200 OK SUCCESS`.
- **Test Data Specification:** IMSI and Profile_ID values; matching ID for the stated LPA string.
- **Automation Actions / Assertions:** Select eSIM Activation; submit the provisioning order; assert HLR activation payload and `200 OK SUCCESS`; inspect the rendered dynamic QR Code content; assert CRM line status timing.
- **Expected Result:** A dynamic QR Code is rendered with LPA string pattern `1$SM-DP+.TELCO.COM$MATCHING_ID`, and line status updates to `ACTIVE` in CRM within less than 3 seconds.
- **Unknowns or Evidence Limitations:** QR rendering interface, QR scanner behavior, matching-ID format, and activation completion behavior after scanning are Insufficient information to determine.

#### TC-TEL-021-03 - ICCID already assigned

- **Source Requirement / FRS section:** `FR-TEL-021`, AF-01; FRS Section 4, Module 2.
- **Test Type:** Functional / Negative.
- **Objective:** Verify response when an active SIM ICCID is scanned.
- **Preconditions:** The supplied ICCID is already active and bound to an MSISDN.
- **Test Data Specification:** An already active ICCID beginning with `8991...` and its bound MSISDN.
- **Automation Actions / Assertions:** Scan the already assigned ICCID; assert the displayed binding error.
- **Expected Result:** The message is `ICCID [8991...] is already bound to MSISDN [+1234567890].`
- **Unknowns or Evidence Limitations:** The bracketed values are FRS placeholders. Exact ICCID/MSISDN interpolation behavior is Insufficient information to determine.

#### TC-TEL-021-04 - HLR provisioning failure and retries

- **Source Requirement / FRS section:** `FR-TEL-021`, AF-02; FRS Section 4, Module 2.
- **Test Type:** Integration / Resilience.
- **Objective:** Verify provisioning-failure status and retry schedule.
- **Preconditions:** A provisioning order has been submitted to SOM.
- **Test Data Specification:** Network-node failure response/condition.
- **Automation Actions / Assertions:** Cause the stated network-node failure; assert CRM/provisioning status; record retry queue invocations and their intervals.
- **Expected Result:** Status updates to `PROVISIONING_FAILED`; an auto-retry queue triggers 3 retries at 1-minute intervals.
- **Unknowns or Evidence Limitations:** Failure signal, retry implementation, and terminal outcome after the third retry are Insufficient information to determine.

#### TC-TEL-021-05 - ICCID format boundary validation

- **Source Requirement / FRS section:** `FR-TEL-021`; FRS Section 4, Module 2; `FLD-02`, FRS Section 5.
- **Test Type:** Boundary / Equivalence Partitioning.
- **Objective:** Verify the ICCID business rule and field validation constraint.
- **Preconditions:** ICCID validation is reached during activation.
- **Test Data Specification:** Numeric strings with 19 digits and 20 digits beginning with `89`; a supplied invalid value `8812345678901234567`; strings outside the stated length range. Boundary values outside the stated range are derived directly from the 19-20 digit constraint.
- **Automation Actions / Assertions:** Submit each conforming and nonconforming partition; assert conformance to `^89[0-9]{17,18}$`.
- **Expected Result:** The 19- and 20-digit `89`-prefixed partitions conform to the stated rule; `8812345678901234567` does not conform. The system response to nonconformance is Insufficient information to determine.
- **Unknowns or Evidence Limitations:** No validation error message or rejection status is supplied.

### Mobile Number Portability (`FR-TEL-022`)

#### TC-TEL-022-01 - Valid MNP validation and NPC request

- **Source Requirement / FRS section:** `FR-TEL-022`; FRS Section 4, Module 2.
- **Test Type:** Functional / Integration.
- **Objective:** Verify stated MNP validations and NPC request.
- **Preconditions:** An inbound MNP request is initiated.
- **Test Data Specification:** Valid donor carrier operator code; valid, active, non-expired PAC/NPK within its 15-day validity.
- **Automation Actions / Assertions:** Provide the donor code and PAC/NPK; assert donor-code validation, PAC active-status/expiry validation, and the automated NPC validation request.
- **Expected Result:** The donor carrier operator code and PAC/NPK are validated, and an automated NPC validation request is triggered.
- **Unknowns or Evidence Limitations:** MNP success status, NPC request/response contract, and error behavior are Insufficient information to determine.

#### TC-TEL-022-02 - PAC/NPK 15-day validity boundary

- **Source Requirement / FRS section:** `FR-TEL-022`; FRS Section 4, Module 2.
- **Test Type:** Boundary / Logic.
- **Objective:** Verify the stated 15-day PAC validity rule.
- **Preconditions:** An inbound MNP request is initiated.
- **Test Data Specification:** PAC/NPK records that are active and within 15-day validity; active and expired beyond the stated validity. Exact date boundary inclusivity is Insufficient information to determine.
- **Automation Actions / Assertions:** Submit the records and assert active-status and expiry validation against the stated 15-day rule.
- **Expected Result:** PAC code is validated as active and not expired; values that do not meet the stated validity rule do not satisfy the validation condition. The system response is Insufficient information to determine.
- **Unknowns or Evidence Limitations:** Exact expiry calculation, timezone, and response status are not supplied.

#### TC-TEL-022-03 - MNP 24-hour execution window

- **Source Requirement / FRS section:** `FR-TEL-022`; FRS Section 4, Module 2.
- **Test Type:** SLA / Workflow.
- **Objective:** Verify the stated standard MNP execution window.
- **Preconditions:** An inbound MNP request has passed the stated validation conditions.
- **Test Data Specification:** A time-observable MNP request.
- **Automation Actions / Assertions:** Measure the execution window from the FRS-defined MNP workflow start to completion event, if the implementation exposes those events.
- **Expected Result:** MNP execution window is 24 hours.
- **Unknowns or Evidence Limitations:** Start/end event definitions, measurement mechanism, and whether 24 hours is a maximum, target, or fixed window are Insufficient information to determine.

### SIM Swap (`FR-TEL-023`)

#### TC-TEL-023-01 - Secondary-contact OTP

- **Source Requirement / FRS section:** `FR-TEL-023`; FRS Section 4, Module 2.
- **Test Type:** Security / Regression.
- **Objective:** Verify mandatory OTP dispatch during SIM swap.
- **Preconditions:** A SIM/eSIM replacement is requested because of loss, damage, or upgrade.
- **Test Data Specification:** An account with a secondary registered contact number or email.
- **Automation Actions / Assertions:** Initiate SIM swap; inspect the dispatch target/event for OTP.
- **Expected Result:** A mandatory OTP is sent to the secondary registered contact number or email.
- **Unknowns or Evidence Limitations:** OTP value, expiry, validation method, and selection behavior when both contact methods exist are Insufficient information to determine.

#### TC-TEL-023-02 - Financial transaction lock

- **Source Requirement / FRS section:** `FR-TEL-023`; FRS Section 4, Module 2.
- **Test Type:** Security / Regression.
- **Objective:** Verify post-swap financial transaction lock.
- **Preconditions:** A SIM swap is completed to the lock-triggering point.
- **Test Data Specification:** Account with an observable financial transaction-lock state and SMS OTP banking notification event.
- **Automation Actions / Assertions:** Complete the SIM swap; inspect lock duration and banking-notification state through the stated 24-hour interval.
- **Expected Result:** The account is under a 24-Hour Financial Transaction Lock, and SMS OTP banking notifications are barred for 24 hours after SIM Swap.
- **Unknowns or Evidence Limitations:** The FRS does not define financial transaction types, clock source, or post-24-hour release behavior.

#### TC-TEL-023-03 - Old ICCID deactivation before new activation

- **Source Requirement / FRS section:** `FR-TEL-023`; FRS Section 4, Module 2.
- **Test Type:** Security / Integration.
- **Objective:** Verify HLR ordering for SIM swap.
- **Preconditions:** A SIM swap request has an old and a new ICCID.
- **Test Data Specification:** Existing active ICCID and replacement ICCID.
- **Automation Actions / Assertions:** Capture HLR events/state changes for old-ICCID deactivation and new-ICCID activation; compare event order.
- **Expected Result:** The old ICCID is deactivated in HLR before the new ICCID is activated.
- **Unknowns or Evidence Limitations:** HLR event format and same-timestamp ordering behavior are Insufficient information to determine.

### Tariff Plans, Add-ons, and Recharge (`FR-TEL-031`, `FR-TEL-032`)

#### TC-TEL-031-01 - Prepaid Flexi 30 auto-renewal at exact balance

- **Source Requirement / FRS section:** `FR-TEL-031`; FRS Section 4, Module 3; FRS RTM Section 7.
- **Test Type:** Boundary / Logic.
- **Objective:** Verify stated auto-renewal success threshold.
- **Preconditions:** Subscriber is on Prepaid Flexi 30 at an auto-renewal event.
- **Test Data Specification:** Main Wallet balance exactly `$30.00`.
- **Automation Actions / Assertions:** Trigger the auto-renewal evaluation and inspect Main Wallet deduction and plan renewal state.
- **Expected Result:** `$30` is auto-deducted from Main Wallet because balance is greater than or equal to `$30`.
- **Unknowns or Evidence Limitations:** The FRS does not define post-deduction balance presentation or renewal status value.

#### TC-TEL-031-02 - Prepaid Flexi 30 insufficient balance boundary

- **Source Requirement / FRS section:** `FR-TEL-031`; FRS Section 4, Module 3; FRS RTM Section 7.
- **Test Type:** Boundary / Logic.
- **Objective:** Verify the RTM stated auto-renewal failure condition.
- **Preconditions:** Subscriber is on Prepaid Flexi 30 at an auto-renewal event.
- **Test Data Specification:** Main Wallet balance `$29.99`.
- **Automation Actions / Assertions:** Trigger the auto-renewal evaluation; assert whether auto-deduction condition is satisfied.
- **Expected Result:** The condition `Balance >= $30` is not satisfied. The FRS RTM identifies this as an auto-renewal failure test. Failure status/message and next behavior are Insufficient information to determine.
- **Unknowns or Evidence Limitations:** No insufficient-balance response is specified.

#### TC-TEL-031-03 - Prepaid Flexi 30 allowance and out-of-bundle rate

- **Source Requirement / FRS section:** `FR-TEL-031`; FRS Section 4, Module 3.
- **Test Type:** Functional / Rating.
- **Objective:** Verify stated Prepaid Flexi 30 allowance and post-usage rate.
- **Preconditions:** Subscriber has Prepaid Flexi 30.
- **Test Data Specification:** Usage reaching 100% of the stated 15 GB data allowance.
- **Automation Actions / Assertions:** Inspect plan allowance and rate before/after 100% usage.
- **Expected Result:** Plan includes 15 GB at 5G Speed and Unlimited Local voice; out-of-bundle rate is `$0.05 / MB` after 100% usage.
- **Unknowns or Evidence Limitations:** Rounding, unit conversion, charging-event timing, and balance impact are Insufficient information to determine.

#### TC-TEL-031-04 - Postpaid Enterprise Unlimited allowance and throttle

- **Source Requirement / FRS section:** `FR-TEL-031`; FRS Section 4, Module 3; FRS RTM Section 7.
- **Test Type:** Boundary / Logic.
- **Objective:** Verify stated 100 GB fair-use threshold and throttle behavior.
- **Preconditions:** Subscriber has Postpaid Enterprise Unlimited.
- **Test Data Specification:** Usage reaching 100% of the stated 100 GB allowance.
- **Automation Actions / Assertions:** Inspect allowance and service speed when the 100 GB threshold is reached.
- **Expected Result:** Plan includes Unlimited National plus 500 International Minutes; speed is throttled to 512 Kbps at the 100 GB Fair Usage Policy threshold.
- **Unknowns or Evidence Limitations:** Exact threshold inclusivity, measurement point, and usage counter are Insufficient information to determine.

#### TC-TEL-031-05 - Postpaid billing calendar rule

- **Source Requirement / FRS section:** `FR-TEL-031`; FRS Section 4, Module 3.
- **Test Type:** Billing / Workflow.
- **Objective:** Verify stated billing date for Postpaid Enterprise Unlimited.
- **Preconditions:** Subscriber has Postpaid Enterprise Unlimited.
- **Test Data Specification:** A calendar-month billing event.
- **Automation Actions / Assertions:** Observe the billing trigger date for the plan.
- **Expected Result:** The plan is billed on the 1st of every calendar month.
- **Unknowns or Evidence Limitations:** Billing timezone, invoice content, payment behavior, and non-business-day handling are Insufficient information to determine.

#### TC-TEL-031-06 - Data Booster Add-on 5GB purchase and expiry

- **Source Requirement / FRS section:** `FR-TEL-031`; FRS Section 4, Module 3.
- **Test Type:** Functional / Time-based.
- **Objective:** Verify stated Data Booster Add-on 5GB commercial and expiry rules.
- **Preconditions:** A subscriber is eligible to buy the add-on. Eligibility rules are Insufficient information to determine.
- **Test Data Specification:** Data Booster Add-on 5GB selection and a time-observable activation.
- **Automation Actions / Assertions:** Purchase/select the add-on; inspect price, allowance, and expiry interval.
- **Expected Result:** The add-on is `$10` one-time, provides 5 GB, and expires after 7 days.
- **Unknowns or Evidence Limitations:** Purchase completion, payment method, expiry clock, and post-expiry status are Insufficient information to determine.

#### TC-TEL-031-07 - Data Booster exhaustion behavior

- **Source Requirement / FRS section:** `FR-TEL-031`; FRS Section 4, Module 3.
- **Test Type:** Functional / Workflow.
- **Objective:** Verify stated behavior after Data Booster allowance exhaustion.
- **Preconditions:** Subscriber has active Data Booster Add-on 5GB.
- **Test Data Specification:** Usage reaching 100% of the stated 5 GB add-on allowance.
- **Automation Actions / Assertions:** Exhaust the add-on allowance and inspect the specified service outcome.
- **Expected Result:** Hard Stop / Redirect to Portal behavior occurs.
- **Unknowns or Evidence Limitations:** The FRS does not define whether one or both outcomes occur, destination portal, redirect method, or status/error message.

#### TC-TEL-032-01 - Valid 16-digit top-up PIN and OCS credit

- **Source Requirement / FRS section:** `FR-TEL-032`; FRS Section 4, Module 3; FRS RTM Section 7.
- **Test Type:** Functional / Integration.
- **Objective:** Verify valid prepaid voucher/digital top-up processing.
- **Preconditions:** A top-up operation is initiated.
- **Test Data Specification:** A valid 16-digit Voucher PIN.
- **Automation Actions / Assertions:** Submit the PIN; assert PIN length and inspect OCS Main Balance update.
- **Expected Result:** Voucher PIN is exactly 16 digits and credit is instantly reflected in OCS Main Balance.
- **Unknowns or Evidence Limitations:** Valid PIN lifecycle, top-up amount, definition of `instantly`, and error behavior are Insufficient information to determine.

#### TC-TEL-032-02 - Top-up lock after consecutive wrong PINs

- **Source Requirement / FRS section:** `FR-TEL-032`; FRS Section 4, Module 3; FRS RTM Section 7.
- **Test Type:** Security / Negative.
- **Objective:** Verify failed-PIN attempt limit and lock duration.
- **Preconditions:** A top-up operation is available and not locked.
- **Test Data Specification:** Five consecutive wrong Voucher PIN attempts.
- **Automation Actions / Assertions:** Submit five consecutive wrong PIN attempts; inspect lock state and duration.
- **Expected Result:** Top-up is locked for 2 hours after 5 consecutive wrong PIN attempts.
- **Unknowns or Evidence Limitations:** Attempt-counter reset conditions, incorrect-PIN error message, and time source are Insufficient information to determine.

### Customer 360 and Trouble Ticketing (`FR-TEL-041`, `FR-TEL-042`)

#### TC-TEL-041-01 - Customer 360 data set

- **Source Requirement / FRS section:** `FR-TEL-041`; FRS Section 4, Module 4.
- **Test Type:** Functional.
- **Objective:** Verify required CSR Customer 360 information.
- **Preconditions:** CSR Agent Workspace opens a Customer 360 view.
- **Test Data Specification:** A subscriber with header, balance, service/hardware, and interaction data available to the view.
- **Automation Actions / Assertions:** Inspect displayed data set.
- **Expected Result:** Display includes: MSISDN; Account Status (`ACTIVE`, `BARRED`, `SUSPENDED`); Customer Tier (Gold, Platinum, Standard); eKYC Compliance Status; data/voice/wallet balances; Current Plan; Active VAS Add-ons; Router/Handset EMI details; last 5 calls/chats; recent Top-ups; and active Trouble Tickets.
- **Unknowns or Evidence Limitations:** The FRS does not define data ordering beyond `Last 5 calls/chats`, field labels, or behavior when data is absent.

#### TC-TEL-041-02 - Customer 360 response-time target

- **Source Requirement / FRS section:** `FR-TEL-041`; FRS Section 4, Module 4; `NFR-TEL-01`, FRS Section 6.
- **Test Type:** Performance.
- **Objective:** Verify Customer 360 dashboard load target.
- **Preconditions:** CSR Agent Workspace requests Customer 360.
- **Test Data Specification:** A time-observable Customer 360 request.
- **Automation Actions / Assertions:** Measure load duration using the implementation's available timing evidence.
- **Expected Result:** Customer 360 dashboard displays in less than 1.5 seconds.
- **Unknowns or Evidence Limitations:** Timing start/end events, workload, and measurement tool are Insufficient information to determine.

#### TC-TEL-042-01 - P1 ticket SLA and escalation

- **Source Requirement / FRS section:** `FR-TEL-042`; FRS Section 4, Module 4; FRS RTM Section 7.
- **Test Type:** SLA / Workflow.
- **Objective:** Verify P1 Critical ticket resolution and idle escalation rule.
- **Preconditions:** A ticket is categorized as Network Outage or Enterprise Line Down with P1 - Critical priority.
- **Test Data Specification:** A time-observable P1 ticket with 45 minutes idle time.
- **Automation Actions / Assertions:** Create/observe the ticket; measure idle interval; inspect escalation target and resolution target.
- **Expected Result:** Target resolution SLA is 2 Hours and ticket escalates to L2 Manager after 45 Mins idle.
- **Unknowns or Evidence Limitations:** Ticket state model, idle definition, and resolution measurement method are Insufficient information to determine.

#### TC-TEL-042-02 - P2 ticket SLA and escalation

- **Source Requirement / FRS section:** `FR-TEL-042`; FRS Section 4, Module 4.
- **Test Type:** SLA / Workflow.
- **Objective:** Verify P2 High ticket resolution and escalation rule.
- **Preconditions:** A ticket is categorized as Billing Dispute greater than `$100` or Payment Failure with P2 - High priority.
- **Test Data Specification:** A time-observable P2 ticket with 6 hours idle time.
- **Automation Actions / Assertions:** Observe the ticket at the 6-hour idle threshold and inspect escalation and resolution targets.
- **Expected Result:** Target resolution SLA is 12 Hours and ticket escalates to Billing Lead after 6 Hours.
- **Unknowns or Evidence Limitations:** The FRS does not specify currency, billing-dispute calculation, ticket state model, or idle definition.

#### TC-TEL-042-03 - P3 ticket SLA and escalation

- **Source Requirement / FRS section:** `FR-TEL-042`; FRS Section 4, Module 4.
- **Test Type:** SLA / Workflow.
- **Objective:** Verify P3 Medium ticket resolution and escalation rule.
- **Preconditions:** A ticket is categorized as SIM Activation delay or Data Speed complaint with P3 - Medium priority.
- **Test Data Specification:** A time-observable P3 ticket with 16 hours idle time.
- **Automation Actions / Assertions:** Observe the ticket at the 16-hour idle threshold and inspect escalation and resolution targets.
- **Expected Result:** Target resolution SLA is 24 Hours and ticket escalates to Operations after 16 Hours.
- **Unknowns or Evidence Limitations:** Ticket state model and idle definition are Insufficient information to determine.

#### TC-TEL-042-04 - P4 ticket SLA and auto-close

- **Source Requirement / FRS section:** `FR-TEL-042`; FRS Section 4, Module 4; FRS RTM Section 7.
- **Test Type:** SLA / Workflow.
- **Objective:** Verify P4 Low ticket resolution and auto-closure rule.
- **Preconditions:** A ticket is categorized as General Plan Inquiry or Address Update with P4 - Low priority.
- **Test Data Specification:** A time-observable P4 ticket with no customer response for 72 hours.
- **Automation Actions / Assertions:** Observe resolution target and customer-response inactivity interval; inspect closure state.
- **Expected Result:** Target resolution SLA is 48 Hours and the ticket auto-closes if there is no customer response in 72 hours.
- **Unknowns or Evidence Limitations:** Customer response event, closure state, and timing method are Insufficient information to determine.

### Field Validation Matrix (`FLD-01` to `FLD-06`)

#### TC-TEL-FLD-01 - MSISDN equivalence partitions and boundaries

- **Source Requirement / FRS section:** `FLD-01`; FRS Section 5.
- **Test Type:** Boundary / Equivalence Partitioning.
- **Objective:** Verify required MSISDN data rule.
- **Preconditions:** MSISDN validation is available.
- **Test Data Specification:** Values conforming to `^\+[1-9]\d{1,14}$` at the stated 10- and 15-digit boundaries; supplied invalid values `12345` and `+1ABC5678`; values outside the stated 10-15 digit range. Boundary values are derived from the FRS range.
- **Automation Actions / Assertions:** Evaluate each value against the stated regex and range.
- **Expected Result:** Values conforming to the stated E.164 regex and range satisfy the supplied validation rule; supplied invalid values do not conform. System response on nonconformance is Insufficient information to determine.
- **Unknowns or Evidence Limitations:** The FRS does not reconcile the stated `10 to 15 digits` field range with the regex's possible total length; exact interpretation is Insufficient information to determine.

#### TC-TEL-FLD-02 - ICCID equivalence partitions and boundaries

- **Source Requirement / FRS section:** `FLD-02`; FRS Section 5.
- **Test Type:** Boundary / Equivalence Partitioning.
- **Objective:** Verify required ICCID rule.
- **Preconditions:** ICCID validation is available.
- **Test Data Specification:** 19- and 20-digit values conforming to `^89[0-9]{17,18}$`; supplied invalid value `8812345678901234567`; values outside stated lengths.
- **Automation Actions / Assertions:** Evaluate each value against the stated regex and length requirement.
- **Expected Result:** Values beginning with `89` and having exactly 19 or 20 digits satisfy the rule; the supplied failure input does not conform. System response is Insufficient information to determine.
- **Unknowns or Evidence Limitations:** No validation error behavior is stated.

#### TC-TEL-FLD-03 - IMSI equivalence partitions and boundaries

- **Source Requirement / FRS section:** `FLD-03`; FRS Section 5.
- **Test Type:** Boundary / Equivalence Partitioning.
- **Objective:** Verify required IMSI rule.
- **Preconditions:** IMSI validation is available.
- **Test Data Specification:** A 15-digit numeric string matching `^[0-9]{15}$`; supplied invalid 14-digit value `12345678901234`; nonnumeric partition.
- **Automation Actions / Assertions:** Evaluate each value against the stated regex and length requirement.
- **Expected Result:** A 15-digit numeric value conforms; the supplied 14-digit value does not conform. System response is Insufficient information to determine.
- **Unknowns or Evidence Limitations:** No nonnumeric sample or validation error behavior is stated.

#### TC-TEL-FLD-04 - National ID equivalence partitions and boundaries

- **Source Requirement / FRS section:** `FLD-04`; FRS Section 5.
- **Test Type:** Boundary / Equivalence Partitioning.
- **Objective:** Verify required National ID rule.
- **Preconditions:** National ID validation is available.
- **Test Data Specification:** Alphanumeric/hyphen values matching `^[a-zA-Z0-9\-]{8,20}$` at 8- and 20-character boundaries; supplied invalid value `ID#@!123`; values outside the range.
- **Automation Actions / Assertions:** Evaluate each value against the stated regex and range.
- **Expected Result:** Values matching the stated 8-20 character regex conform; `ID#@!123` does not conform. System response is Insufficient information to determine.
- **Unknowns or Evidence Limitations:** The FRS does not define country-specific National ID semantics or error behavior.

#### TC-TEL-FLD-05 - Top-up PIN equivalence partitions and boundaries

- **Source Requirement / FRS section:** `FLD-05`; FRS Section 5 and `FR-TEL-032`, FRS Section 4.
- **Test Type:** Boundary / Equivalence Partitioning.
- **Objective:** Verify required Top-up PIN rule.
- **Preconditions:** Top-up PIN validation is available.
- **Test Data Specification:** A 16-digit numeric value matching `^[0-9]{16}$`; supplied 15-digit invalid value `123456789012345`; nonnumeric partition.
- **Automation Actions / Assertions:** Evaluate each value against the stated regex and length requirement.
- **Expected Result:** Exactly 16 numeric digits conform; the supplied 15-digit value does not conform. System response is Insufficient information to determine.
- **Unknowns or Evidence Limitations:** A syntactically valid PIN's commercial validity and nonnumeric response behavior are not supplied.

#### TC-TEL-FLD-06 - Postpaid Limit equivalence partitions and boundaries

- **Source Requirement / FRS section:** `FLD-06`; FRS Section 5.
- **Test Type:** Boundary / Equivalence Partitioning.
- **Objective:** Verify required Postpaid Limit rule.
- **Preconditions:** Postpaid Limit validation is available.
- **Test Data Specification:** Positive floating-point values with two decimals at `$10.00` and `$5000.00`; supplied invalid values `-$50.00` and `$10000.00`; values outside the stated range. Boundary values are derived from the FRS range.
- **Automation Actions / Assertions:** Evaluate each value against the stated decimal and range constraints.
- **Expected Result:** Positive two-decimal values from `$10.00` through `$5000.00` conform; the supplied invalid values do not conform. System response is Insufficient information to determine.
- **Unknowns or Evidence Limitations:** Currency representation, rounding, and validation error behavior are not supplied.

### Non-Functional Requirements (`NFR-TEL-01` to `NFR-TEL-03`)

#### TC-TEL-NFR-01 - Peak-hour throughput

- **Source Requirement / FRS section:** `NFR-TEL-01`; FRS Section 6; FRS RTM Section 7.
- **Test Type:** Performance / Load.
- **Objective:** Verify the stated throughput requirement.
- **Preconditions:** A performance-test environment capable of exercising the target system is available. Environment definition is Insufficient information to determine.
- **Test Data Specification:** Peak-hour transaction workload at 5,000 TPS.
- **Automation Actions / Assertions:** Execute the supplied RTM-recommended 5,000 TPS load simulation on the OCS balance-check endpoint, if that endpoint and load tooling are made available; record observed throughput.
- **Expected Result:** The system handles up to 5,000 TPS during peak hours.
- **Unknowns or Evidence Limitations:** The FRS RTM names JMeter, but tool configuration, workload mix, duration, response/error acceptance criteria, and endpoint contract are not supplied.

#### TC-TEL-NFR-02 - Latency thresholds

- **Source Requirement / FRS section:** `NFR-TEL-01`; FRS Section 6.
- **Test Type:** Performance.
- **Objective:** Verify stated latency limits.
- **Preconditions:** Timing evidence is available for the stated operations.
- **Test Data Specification:** Customer 360 load, OCS Balance Check API request, and Provisioning Order Dispatch to HLR request.
- **Automation Actions / Assertions:** Measure each operation using the implementation's available timing evidence.
- **Expected Result:** Customer 360 load is less than 1.5 seconds; OCS Balance Check API is less than 100 ms; Provisioning Order Dispatch to HLR is less than 500 ms.
- **Unknowns or Evidence Limitations:** Timing boundaries, percentile, load level, measurement point, and clock source are Insufficient information to determine.

#### TC-TEL-NFR-03 - OCS/provisioning availability target

- **Source Requirement / FRS section:** `NFR-TEL-02`; FRS Section 6.
- **Test Type:** Reliability / Availability.
- **Objective:** Verify the stated availability SLA.
- **Preconditions:** Availability measurement data for OCS Rating and Provisioning Interfaces is available.
- **Test Data Specification:** Observation period and interface availability data. Observation period is Insufficient information to determine.
- **Automation Actions / Assertions:** Calculate or inspect availability for the stated interfaces using the approved measurement data, if available.
- **Expected Result:** OCS Rating and Provisioning Interfaces meet 99.999% SLA (Five Nines).
- **Unknowns or Evidence Limitations:** SLA measurement window, exclusions, and calculation method are not supplied.

#### TC-TEL-NFR-04 - Active-active failover and recovery targets

- **Source Requirement / FRS section:** `NFR-TEL-02`; FRS Section 6.
- **Test Type:** Reliability / Resilience.
- **Objective:** Verify stated failover requirements.
- **Preconditions:** A controlled failover observation is available. Failover trigger method is Insufficient information to determine.
- **Test Data Specification:** Active-active multi-region deployment state and failover timing evidence.
- **Automation Actions / Assertions:** Trigger or observe a controlled failover if an approved mechanism is available; inspect recovery timing and data-loss evidence.
- **Expected Result:** Deployment is active-active multi-region with zero data loss, RPO = 0, and RTO less than 30 seconds.
- **Unknowns or Evidence Limitations:** Region definitions, failover trigger, data-consistency evidence, and RTO measurement start/end points are not supplied.

#### TC-TEL-NFR-05 - CSR privacy masking and manager approval

- **Source Requirement / FRS section:** `NFR-TEL-03`; FRS Section 6.
- **Test Type:** Security / Compliance.
- **Objective:** Verify privacy masking control in CSR views.
- **Preconditions:** CSR view contains MSISDN and Customer Address; a manager-approval condition can be represented.
- **Test Data Specification:** MSISDN comparable to supplied mask example `+1 234 *** *890`; Customer Address; scenarios with and without manager approval.
- **Automation Actions / Assertions:** Inspect CSR view without manager approval; inspect it with manager approval, if the implementation exposes approval evidence.
- **Expected Result:** MSISDN and Customer Address are masked in CSR views unless unmasked with manager approval.
- **Unknowns or Evidence Limitations:** Exact address-mask pattern, manager-approval workflow, role identity, audit evidence, and unmasking result are Insufficient information to determine.

#### TC-TEL-NFR-06 - PCI-DSS CRM log data exclusion

- **Source Requirement / FRS section:** `NFR-TEL-03`; FRS Section 6.
- **Test Type:** Security / Compliance.
- **Objective:** Verify card-sensitive data is not stored in CRM log files.
- **Preconditions:** CRM log evidence is accessible through an approved test mechanism.
- **Test Data Specification:** Transaction/log conditions that could include Credit Card CVV or full PAN. Exact data source is Insufficient information to determine.
- **Automation Actions / Assertions:** Inspect CRM log files for Credit Card CVV and full PAN values using the approved evidence source, if available.
- **Expected Result:** CRM log files contain zero storage of Credit Card CVV or full PAN numbers.
- **Unknowns or Evidence Limitations:** Log locations, retention, format, redaction process, and approved access method are not supplied.

## Coverage Matrix

| Source requirement | Test case IDs | Test Plan RTM baseline coverage |
| --- | --- | --- |
| `FR-TEL-011` | `TC-TEL-011-01` to `TC-TEL-011-05` | Yes |
| `FR-TEL-021` | `TC-TEL-021-01` to `TC-TEL-021-05` | Yes |
| `FR-TEL-022` | `TC-TEL-022-01` to `TC-TEL-022-03` | Not listed in baseline RTM; covered from detailed FRS |
| `FR-TEL-023` | `TC-TEL-023-01` to `TC-TEL-023-03` | Yes |
| `FR-TEL-031` | `TC-TEL-031-01` to `TC-TEL-031-07` | Yes |
| `FR-TEL-032` | `TC-TEL-032-01` to `TC-TEL-032-02` | Yes |
| `FR-TEL-041` | `TC-TEL-041-01` to `TC-TEL-041-02` | Not listed in baseline RTM; covered from detailed FRS |
| `FR-TEL-042` | `TC-TEL-042-01` to `TC-TEL-042-04` | Yes |
| `FLD-01` to `FLD-06` | `TC-TEL-FLD-01` to `TC-TEL-FLD-06` | Not listed in baseline RTM; covered from FRS Section 5 instruction |
| `NFR-TEL-01` | `TC-TEL-NFR-01` to `TC-TEL-NFR-02` | Yes |
| `NFR-TEL-02` | `TC-TEL-NFR-03` to `TC-TEL-NFR-04` | Not listed in baseline RTM; covered from detailed FRS |
| `NFR-TEL-03` | `TC-TEL-NFR-05` to `TC-TEL-NFR-06` | Not listed in baseline RTM; covered from detailed FRS |

## Self-Validation Check

- **Traceability:** Every test case cites a requirement, field, or NFR ID and FRS section.
- **RTM alignment:** All seven baseline RTM rows are mapped in the Coverage Matrix. Additional cases are included only for detailed FRS requirements that the baseline RTM does not list.
- **Evidence fidelity:** Exact stated messages, statuses, limits, regular expressions, timing targets, and order constraints are retained.
- **No invented execution details:** Test cases do not name an endpoint, UI control, automation framework, credential, environment, undocumented error code, or unstated workflow behavior.
- **Gap control:** Each case records missing information as `Insufficient information to determine.` or as a source-specific limitation.
- **Inference control:** Boundary partitions outside stated ranges are explicitly identified as derived directly from the FRS constraints; no low-confidence implementation behavior is asserted.

Self-validation result: The suite contains 43 test cases and covers all detailed functional requirements, field validations, and NFRs supplied by the FRS. Retention and Churn Scoring has no detailed requirement and remains untestable from the supplied evidence.
