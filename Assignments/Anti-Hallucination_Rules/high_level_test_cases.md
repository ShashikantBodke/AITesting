# HIGH-LEVEL TEST CASES (HLTC) SPECIFICATION
**System Name:** NextGen Enterprise Telco CRM System  
**Document Reference:** TC-SPEC-TELCO-CRM-2026-V1.0  
**Derived From:** FRS-TELCO-CRM-2026-V1.0  
**Author:** QA Engineering Lead / Senior Business Analyst  
**Target Audience:** QA Testers, Automation Engineers, Product Owners, Release Managers  
**Status:** Ready for Test Execution & Automation Scripting  

---

## 1. Document Overview & Test Coverage Summary

| Module ID | Module Name | Total Test Cases | Positive | Negative / Edge | Security / Perf |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **MOD-01** | Subscriber Onboarding & eKYC | 6 | 2 | 3 | 1 |
| **MOD-02** | Order Provisioning, MNP & SIM Swap | 8 | 3 | 3 | 2 |
| **MOD-03** | Tariff Plans, Top-up & Billing | 7 | 3 | 3 | 1 |
| **MOD-04** | Customer 360 & Trouble Ticketing | 5 | 2 | 2 | 1 |
| **MOD-05** | Security, Data Masking & Compliance | 4 | 0 | 1 | 3 |
| **MOD-06** | High-Volume Performance & Latency | 3 | 1 | 0 | 2 |
| **TOTAL** | **Telco CRM End-to-End Suite** | **33** | **11** | **12** | **10** |

---

## 2. Test Case Specifications

---

### MODULE 1: SUBSCRIBER ONBOARDING & eKYC

#### TC-TEL-ONB-001: Verify Successful Subscriber Onboarding with Valid eKYC (Happy Path)
* **Req Ref:** `FR-TEL-011` | **Priority:** `P1 - Critical` | **Execution:** `Automated`
* **Pre-conditions:** Agent is logged into Retail POS Portal; eKYC Gateway is active; National ID has 0 active lines.
* **Test Steps:**
  1. Navigate to Subscriber Onboarding page.
  2. Select Connection Type = `Prepaid`, Segment = `B2C`.
  3. Enter valid National ID and scan biometric.
  4. Submit for eKYC verification.
* **Expected Result:** eKYC API returns `STATUS: VERIFIED`. Customer Profile auto-populates. System permits navigation to MSISDN allocation step.

#### TC-TEL-ONB-002: Verify Onboarding Rejection on eKYC Biometric Mismatch
* **Req Ref:** `FR-TEL-011` | **Priority:** `P1 - Critical` | **Execution:** `Automated`
* **Pre-conditions:** Agent is on Onboarding screen.
* **Test Steps:**
  1. Enter valid National ID with non-matching biometric data.
  2. Click "Verify eKYC".
* **Expected Result:** System blocks registration. Toast message displays: *"Biometric verification failed against National ID records."* Order status marked `FAILED_KYC`.

#### TC-TEL-ONB-003: Enforce Regulatory Limit of Maximum 5 Active Lines per National ID
* **Req Ref:** `FR-TEL-011` | **Priority:** `P1 - Critical` | **Execution:** `Automated`
* **Pre-conditions:** Test National ID already has 5 active Prepaid lines in CRM database.
* **Test Steps:**
  1. Initiate onboarding for the same National ID for a 6th Prepaid connection.
  2. Complete eKYC step.
* **Expected Result:** System triggers regulatory validation error: *"Regulatory limit reached: Maximum 5 active connections allowed per National ID."* Order blocked.

#### TC-TEL-ONB-004: Handle eKYC Gateway Timeout and Graceful Fallback
* **Req Ref:** `FR-TEL-011` | **Priority:** `P2 - High` | **Execution:** `Manual / Mocked`
* **Pre-conditions:** eKYC Mock Gateway configured to delay response > 5000 ms.
* **Test Steps:**
  1. Submit eKYC request.
* **Expected Result:** CRM waiting spinner times out after 5s. Order transitions to `PENDING_MANUAL_VERIFICATION`. Manual audit task created in Back-Office queue.

#### TC-TEL-ONB-005: Verify Field Boundary Validation on National ID Field
* **Req Ref:** `FR-TEL-002` (`FLD-04`) | **Priority:** `P2 - High` | **Execution:** `Automated`
* **Test Steps:**
  1. Test inputs: 7 characters (Fail BVA), 8 characters (Pass), 20 characters (Pass), 21 characters (Fail BVA), Special chars `#$@!`.
* **Expected Result:** Invalid lengths and special characters trigger inline validation error: *"Invalid National ID format."*

#### TC-TEL-ONB-006: Verify Corporate (B2B) Subscriber Onboarding with Tax ID
* **Req Ref:** `FR-TEL-011` | **Priority:** `P2 - High` | **Execution:** `Manual`
* **Test Steps:** Select Segment = `B2B`, enter Corporate Tax ID and authorized signatory credentials.
* **Expected Result:** Corporate profile created with credit limit configuration enabled.

---

### MODULE 2: ORDER PROVISIONING, MNP & SIM SWAP

#### TC-TEL-PROV-001: Verify End-to-End Physical SIM Activation & HLR Sync
* **Req Ref:** `FR-TEL-021` | **Priority:** `P1 - Critical` | **Execution:** `Automated`
* **Pre-conditions:** Available MSISDN and unassigned ICCID (`8991...`).
* **Test Steps:**
  1. Select MSISDN `+12025550143` and scan ICCID `8991123456789012345`.
  2. Click "Activate Line".
* **Expected Result:** HLR provisioned with `PROVIDE_SUBSCRIBER_DATA`. Line status becomes `ACTIVE` within < 3s.

#### TC-TEL-PROV-002: Verify eSIM Provisioning and Dynamic QR Code Generation
* **Req Ref:** `FR-TEL-021` | **Priority:** `P1 - Critical` | **Execution:** `Automated`
* **Test Steps:** Select Connection = `eSIM Activation`, submit order.
* **Expected Result:** System generates valid LPA string (`1$SM-DP+.TELCO.COM$...`) and renders scannable QR Code.

#### TC-TEL-PROV-003: Verify Duplicate SIM Allocation Prevention
* **Req Ref:** `FR-TEL-021` | **Priority:** `P2 - High` | **Execution:** `Automated`
* **Test Steps:** Attempt to assign an ICCID that is already bound to an active subscriber.
* **Expected Result:** Error displayed: *"ICCID [8991...] is already bound to MSISDN [...]." System prevents assignment.*

#### TC-TEL-PROV-004: Validate Inbound Mobile Number Portability (MNP) Flow
* **Req Ref:** `FR-TEL-022` | **Priority:** `P1 - Critical` | **Execution:** `Automated`
* **Test Steps:** Submit MNP request with valid Porting Authorization Code (PAC).
* **Expected Result:** Automated NPC clearinghouse request sent. Order status set to `PORTING_IN_PROGRESS`.

#### TC-TEL-PROV-005: Reject Expired MNP Porting Authorization Code (PAC)
* **Req Ref:** `FR-TEL-022` | **Priority:** `P2 - High` | **Execution:** `Automated`
* **Test Steps:** Submit MNP request using a PAC code created 16 days ago (expired).
* **Expected Result:** System rejects request: *"Porting Authorization Code (PAC) has expired. Request new code from donor operator."*

#### TC-TEL-PROV-006: Verify SIM Swap Execution and Old ICCID Immediate Deactivation
* **Req Ref:** `FR-TEL-023` | **Priority:** `P1 - Critical` | **Execution:** `Automated`
* **Test Steps:** Initiate SIM Swap for existing subscriber with new ICCID. Verify old SIM status immediately.
* **Expected Result:** Old ICCID status set to `DEACTIVATED` in HLR. New ICCID provisioned to subscriber.

#### TC-TEL-PROV-007: Verify 24-Hour Financial SMS Security Lock Post-SIM Swap
* **Req Ref:** `FR-TEL-023` | **Priority:** `P1 - Critical (Security)` | **Execution:** `Automated`
* **Pre-conditions:** SIM Swap completed successfully 5 minutes ago.
* **Test Steps:** Trigger financial OTP SMS (Banking OTP simulation) to the MSISDN.
* **Expected Result:** Financial SMS OTP blocked by gateway with log: `STATUS: BLOCKED_24H_SIM_SWAP_LOCK`. Standard voice/SMS operational.

#### TC-TEL-PROV-008: Verify HLR Provisioning Failure Auto-Retry Queue
* **Req Ref:** `FR-TEL-021` | **Priority:** `P2 - High` | **Execution:** `Manual / Mocked`
* **Test Steps:** Simulate HLR 500 error during activation.
* **Expected Result:** Order set to `PROVISIONING_FAILED`. System schedules Retry #1 after 60 seconds.

---

### MODULE 3: TARIFF PLANS, BUNDLES, RECHARGE & BILLING

#### TC-TEL-BIL-001: Verify Prepaid Plan Auto-Renewal on Sufficient Balance
* **Req Ref:** `FR-TEL-031` | **Priority:** `P1 - Critical` | **Execution:** `Automated`
* **Pre-conditions:** Plan = `Prepaid Flexi 30` ($30 fee); Main Wallet Balance = `$30.00`. Expiry = Today.
* **Test Steps:** Trigger billing cycle batch process.
* **Expected Result:** $30.00 deducted. Plan extended for 30 days. Balance becomes `$0.00`.

#### TC-TEL-BIL-002: Verify Prepaid Plan Auto-Renewal Failure on Insufficient Balance (Boundary Test)
* **Req Ref:** `FR-TEL-031` | **Priority:** `P1 - Critical` | **Execution:** `Automated`
* **Pre-conditions:** Main Wallet Balance = `$29.99` (Boundary test: 1 cent short).
* **Test Steps:** Trigger billing cycle batch.
* **Expected Result:** Plan renewal fails. Line status changes to `SUSPENDED_GRACE_PERIOD`. SMS notification dispatched.

#### TC-TEL-BIL-003: Verify Real-Time Top-up via 16-Digit Voucher Code
* **Req Ref:** `FR-TEL-032` | **Priority:** `P1 - Critical` | **Execution:** `Automated`
* **Test Steps:** Submit top-up with valid unused 16-digit PIN `1234567890123456` ($20 value).
* **Expected Result:** OCS Main Balance increases instantly by $20.00. Voucher status set to `REDEEMED`.

#### TC-TEL-BIL-004: Enforce Top-up Lockout After 5 Invalid PIN Attempts
* **Req Ref:** `FR-TEL-032` | **Priority:** `P1 - Critical (Security)` | **Execution:** `Automated`
* **Test Steps:** Submit invalid 16-digit PIN 5 consecutive times for the same MSISDN.
* **Expected Result:** On 5th attempt, top-up service locked for 2 hours. Message: *"Maximum failed attempts exceeded. Top-up locked for 2 hours."*

#### TC-TEL-BIL-005: Verify Data Throttling Upon Reaching 100% Fair Usage Policy (FUP) Limit
* **Req Ref:** `FR-TEL-031` | **Priority:** `P2 - High` | **Execution:** `Automated`
* **Pre-conditions:** Postpaid subscriber reaches 100 GB usage limit.
* **Test Steps:** Simulate data consumption event over 100 GB.
* **Expected Result:** OCS updates data speed policy from 5G Unrestricted to 512 Kbps throttle.

#### TC-TEL-BIL-006: Verify Data Add-on Purchase and Immediate Bucket Allocation
* **Req Ref:** `FR-TEL-031` | **Priority:** `P2 - High` | **Execution:** `Automated`
* **Test Steps:** Purchase Data Booster Add-on 5GB ($10).
* **Expected Result:** $10 deducted from balance; 5 GB added to data balance bucket with 7-day expiration countdown.

#### TC-TEL-BIL-007: Verify Postpaid Monthly Bill Generation & Tax Calculation
* **Req Ref:** `FR-TEL-031` | **Priority:** `P2 - High` | **Execution:** `Automated`
* **Test Steps:** Run monthly billing cycle for Postpaid account with $75 base + $10 roaming.
* **Expected Result:** Invoice generated for $85.00 + applicable government telecom tax. PDF rendered in Customer Self-Service.

---

### MODULE 4: CUSTOMER 360 VIEW & TROUBLE TICKETING

#### TC-TEL-TCK-001: Verify CSR 360° Dashboard Load & Component Aggregation
* **Req Ref:** `FR-TEL-041` | **Priority:** `P1 - Critical` | **Execution:** `Automated`
* **Test Steps:** CSR searches MSISDN `+12025550143` in workspace.
* **Expected Result:** Dashboard loads within < 1.5s displaying Header, Balances, Active VAS, and Recent Tickets.

#### TC-TEL-TCK-002: Verify P1 Critical Trouble Ticket SLA Auto-Escalation
* **Req Ref:** `FR-TEL-042` | **Priority:** `P1 - Critical` | **Execution:** `Automated`
* **Pre-conditions:** P1 Ticket (`NETWORK_COVERAGE`) created and assigned to L1.
* **Test Steps:** Simulate 45 minutes of no status update on ticket.
* **Expected Result:** Ticket priority flags `OVERDUE_SLA_WARNING`. Auto-escalated to L2 Manager queue. Escalation email sent.

#### TC-TEL-TCK-003: Verify P4 Low Priority Ticket Auto-Closure After 72 Hours Inactivity
* **Req Ref:** `FR-TEL-042` | **Priority:** `P3 - Medium` | **Execution:** `Automated`
* **Test Steps:** Simulate 72 hours of customer non-response on P4 inquiry ticket.
* **Expected Result:** Ticket status updates to `AUTO_CLOSED`. System dispatches feedback survey link to customer.

#### TC-TEL-TCK-004: Validate Trouble Ticket Creation for Outage Complaints
* **Req Ref:** `FR-TEL-042` | **Priority:** `P2 - High` | **Execution:** `Automated`
* **Test Steps:** Create ticket under category `BROADBAND_FAULT` with address details.
* **Expected Result:** Unique Ticket ID generated (`TICK-2026-XXXXX`), SLA counter initiated (24h target).

#### TC-TEL-TCK-005: Verify Field Technician App Ticket Status Sync
* **Req Ref:** `FR-TEL-042` | **Priority:** `P2 - High` | **Execution:** `Manual`
* **Test Steps:** Field Tech updates ticket status to `RESOLVED` on Mobile App.
* **Expected Result:** Status reflects immediately in CSR Call Center view.

---

### MODULE 5: SECURITY, DATA MASKING & COMPLIANCE

#### TC-TEL-SEC-001: Verify PII Data Masking in CSR Call Center Portal
* **Req Ref:** `NFR-TEL-03` | **Priority:** `P1 - Critical (Security)` | **Execution:** `Automated`
* **Test Steps:** Log in as standard CSR Agent (`ROLE-TEL-01`) and view customer details.
* **Expected Result:** MSISDN displayed as `+1 202 *** *143`. Full address masked. Unmask button requires Security Reason entry.

#### TC-TEL-SEC-002: Validate OWASP Rate Limiting on Authentication & Top-up APIs
* **Req Ref:** `NFR-TEL-03` | **Priority:** `P1 - Critical (Security)` | **Execution:** `Automated`
* **Test Steps:** Send 15 consecutive requests within 10 seconds to `/api/v1/topup` from single IP.
* **Expected Result:** Request #11 onwards returned HTTP `429 Too Many Requests`.

#### TC-TEL-SEC-003: Verify PCI-DSS Zero Storage of Payment Card Sensitive Data
* **Req Ref:** `NFR-TEL-03` | **Priority:** `P1 - Critical (Security)` | **Execution:** `Automated`
* **Test Steps:** Inspect CRM database tables and application logs after completing credit card payment.
* **Expected Result:** CVV and full PAN numbers are NOT present in any table or log file. Only tokenized string stored.

#### TC-TEL-SEC-004: Verify Role-Based Access Control (RBAC) Enforcement on Credit Limit Override
* **Req Ref:** `ROLE-TEL-01` vs `ROLE-TEL-03` | **Priority:** `P1 - Critical` | **Execution:** `Automated`
* **Test Steps:** Attempt credit limit override logged in as standard CSR (`ROLE-TEL-01`).
* **Expected Result:** HTTP `403 Forbidden`. Error message: *"Access Denied: Requires Billing Specialist (ROLE-TEL-03) privileges."*

---

### MODULE 6: HIGH-VOLUME PERFORMANCE & LATENCY SLAs

#### TC-TEL-PERF-001: Verify Real-Time OCS Balance Check Latency Under Normal Load
* **Req Ref:** `NFR-TEL-01` | **Priority:** `P1 - Critical` | **Execution:** `Automated (JMeter)`
* **Test Steps:** Execute API performance test targeting `/api/v1/ocs/balance` at 500 TPS.
* **Expected Result:** 95th percentile response time is **< 100 ms**. Error rate 0%.

#### TC-TEL-PERF-002: Verify CRM Peak Hour Throughput Scaling (5,000 TPS Load Test)
* **Req Ref:** `NFR-TEL-01` | **Priority:** `P1 - Critical` | **Execution:** `Automated (JMeter / Locust)`
* **Test Steps:** Ramp up concurrency to 5,000 TPS over a 15-minute execution window.
* **Expected Result:** System maintains stability without pod crashes. CPU utilization < 80%. HTTP 200 success rate ≥ 99.99%.

#### TC-TEL-PERF-003: Verify System High Availability Active-Active Failover
* **Req Ref:** `NFR-TEL-02` | **Priority:** `P2 - High` | **Execution:** `Automated Chaos Test`
* **Test Steps:** Terminate Primary Region Database Node during active top-up traffic.
* **Expected Result:** Traffic seamlessly fails over to Secondary Region within < 30 seconds. Zero transaction data loss (RPO = 0).

---

## 3. Test Execution & Automation Strategy

- **Automated Regression Suite:** Test cases tagged as `Automated` (28 out of 33) must be integrated into the CI/CD pipeline (Jenkins/GitHub Actions) for nightly execution using Playwright/Selenium (UI) and RestAssured/Postman (API).
- **Security & Load Scenarios:** OWASP rate-limiting, PCI-DSS compliance, and 5,000 TPS performance tests must be executed prior to each Major Release candidate (RC).
