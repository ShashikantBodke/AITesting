# TELCO Project Test Cases (Generated with Anti-Hallucination Protocol)

> **Document Status:** Verified & Enforced  
> **Source Documents:** `Anti_Hallucination_Rules.md` & `Functional_requirement_specifications.md`  
> **Protocol Enforcement Level:** Hard Stop (Strict 4-Step Process Applied)

---

## 1. Verified Facts

The following facts were extracted directly from the provided Functional Requirement Specification document (`FRS-TELCO-CRM-2026-V1.0`):

1. **System Name**: NextGen Enterprise Telco CRM System (B2C & B2B).
2. **System Context & Interfaces**: eKYC / National Identity Gateway, HLR/HSS/UDM, OCS / Rating Engine, Billing System & Payment Gateways, Provisioning System / SOM.
3. **Role-Based Access Control (RBAC) Matrix**:
   - `ROLE-TEL-01` (Customer Service Rep - Call Center Workspace): Read/Write Subscriber 360, Issue Top-ups, Raise Tickets, Process SIM Swap.
   - `ROLE-TEL-02` (Store Agent - Retail POS Terminal): Onboard Subscribers, eKYC Verification, Physical SIM Issuance, Device Sales.
   - `ROLE-TEL-03` (Billing Specialist - Admin Back-Office): Billing Adjustment, Refund Approval, Credit Limit Override, Dunning Management.
   - `ROLE-TEL-04` (Field Technician - Mobile App): View/Update Home Broadband (FTTH) Installation & Trouble Tickets.
   - `ROLE-TEL-05` (Subscriber - Self-Service Web/App): View Balances, Pay Bills, Buy Data Add-ons, Request eSIM, Track Tickets.
4. **FR-TEL-011 (Subscriber Registration & eKYC Verification)**:
   - Happy Path: Connection Type (`Prepaid`/`Postpaid`), Segment (`B2C`/`B2B`), National ID / Passport entry, eKYC REST API over TLS 1.3 returns `STATUS: VERIFIED` with full name, DOB, address. Auto-populates profile. Regulator limit check: Max 5 Prepaid SIMs per National ID.
   - AF-01: eKYC API `STATUS: REJECTED` or biometric mismatch -> status `FAILED_KYC`, error message: `"Biometric verification failed against National ID records."` Order blocked.
   - AF-02: National ID already has 5 active lines -> error message: `"Regulatory limit reached: Maximum 5 active connections allowed per National ID."` Order blocked.
   - AF-03: eKYC Gateway timeout (> 5,000 ms) -> status `PENDING_MANUAL_VERIFICATION`, triggers Back-Office audit workflow.
5. **FR-TEL-021 (New Connection & SIM / eSIM Activation)**:
   - MSISDN state must be `AVAILABLE`. ICCID must be 19–20 digits starting with IIN `8991...`.
   - SOM triggers HLR/HSS payload: `PROVIDE_SUBSCRIBER_DATA (MSISDN, IMSI, Profile_ID)`. HLR returns `200 OK SUCCESS`. eSIM LPA string format: `1$SM-DP+.TELCO.COM$MATCHING_ID`. Line status updates to `ACTIVE` in < 3 seconds.
   - AF-01: Scanning active SIM displays error: `"ICCID [8991...] is already bound to MSISDN [+1234567890]."`
   - AF-02: HLR failure updates status to `PROVISIONING_FAILED`, triggers auto-retry queue (3 retries at 1-min intervals).
6. **FR-TEL-022 (Mobile Number Portability - MNP Inbound)**:
   - Requires valid Porting Authorization Code (PAC / NPK) with 15-day validity. Execution window: 24 hours. NPC clearinghouse validation request.
7. **FR-TEL-023 (SIM Swap Procedure)**:
   - Mandatory OTP to secondary registered contact number/email.
   - 24-Hour Financial Transaction Lock (SMS OTP banking notifications barred for 24h post SIM Swap).
   - Deactivation of old ICCID in HLR prior to new ICCID activation.
8. **FR-TEL-031 (Real-Time Balance, Plan Subscriptions & Add-ons)**:
   - *Prepaid Flexi 30*: $30 / 30 Days, 15 GB (5G), Unlimited Local Voice, $0.05/MB out-of-bundle rate after 100% usage, auto-renewal if Main Wallet ≥ $30.
   - *Postpaid Enterprise Unlimited*: $75 / Month, 100 GB (FUP), Unlimited National + 500 Int'l Mins, throttle speed to 512 Kbps after 100%, billed on 1st of month.
   - *Data Booster Add-on 5GB*: $10 one-time, 5 GB, hard stop/redirect after 100%, expires after 7 days.
9. **FR-TEL-032 (Real-Time Top-up & Payment Gateway)**:
   - Voucher PIN: Exactly 16 digits. Instant credit in OCS Main Balance. 5 consecutive wrong PIN attempts lock top-up for 2 hours.
10. **FR-TEL-041 (Unified Customer 360 Dashboard)**:
    - Load time < 1.5s. Displays Header Panel (MSISDN, Status `ACTIVE`/`BARRED`/`SUSPENDED`, Tier Gold/Platinum/Standard, eKYC status), Real-time Balances, Active Services & Hardware, Recent Interactions (last 5 calls/chats, recent top-ups, active tickets).
11. **FR-TEL-042 (Trouble Ticketing & SLA)**:
    - Categories: `NETWORK_COVERAGE`, `BILLING_DISPUTE`, `SIM_ISSUE`, `BROADBAND_FAULT`, `VAS_UNSUBSCRIBE`.
    - SLA & Auto-escalation:
      - P1 (Critical): 2h SLA; Escalate to L2 Manager after 45 Mins idle.
      - P2 (High): 12h SLA; Escalate to Billing Lead after 6 Hours.
      - P3 (Medium): 24h SLA; Escalate to Operations after 16 Hours.
      - P4 (Low): 48h SLA; Auto-close if no customer response in 72h.
12. **Field Validation Rules**:
    - `MSISDN` (`FLD-01`): 10–15 digits, E.164 RegEx `^\+[1-9]\d{1,14}$`.
    - `ICCID` (`FLD-02`): 19–20 numeric digits, RegEx `^89[0-9]{17,18}$`.
    - `IMSI` (`FLD-03`): Exactly 15 numeric digits, RegEx `^[0-9]{15}$`.
    - `National ID` (`FLD-04`): 8–20 alphanumeric chars, RegEx `^[a-zA-Z0-9\-]{8,20}$`.
    - `Top-up PIN` (`FLD-05`): Exactly 16 numeric digits, RegEx `^[0-9]{16}$`.
    - `Postpaid Limit` (`FLD-06`): Positive float with 2 decimals, range $10.00 to $5000.00.
13. **Non-Functional Requirements**:
    - NFR-TEL-01: 5,000 TPS peak throughput. Latency: Customer 360 < 1.5s, OCS Balance Check < 100ms, Provisioning Order to HLR < 500ms.
    - NFR-TEL-02: 99.999% Availability SLA; Active-Active multi-region (RPO = 0, RTO < 30s).
    - NFR-TEL-03: GDPR masking of MSISDN (`+1 234 *** *890`) & address in CSR view unless unmasked by manager approval. Zero storage of Credit Card CVV or full PAN in CRM logs.

---

## 2. Missing / Unknown Information

- Specific HTML/DOM element IDs or CSS selectors for Call Center Workspace or Retail POS UI screens.
- Specific database table schemas beyond the fields explicitly documented in the FRS.
- External payment gateway vendor protocol names (e.g., Stripe/Adyen API specs).
- Government eKYC REST API endpoint URL (only protocol TLS 1.3 and payload statuses `VERIFIED`/`REJECTED` are specified).

---

## 3. Generated Output: Comprehensive QA Test Cases

### Module 1: Subscriber Onboarding & eKYC (FR-TEL-011)

| Test Case ID | Test Scenario / Title | Pre-Conditions | Execution Steps | Expected Result | Traceability ID |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-TEL-011-01** | Verify successful eKYC onboarding & profile auto-population (Happy Path) | Store Agent (`ROLE-TEL-02`) logged into Retail POS; Customer owns < 5 active SIMs. | 1. Select Connection Type: `Prepaid` and Segment: `B2C`.<br>2. Enter valid National ID (`A12345678`) and scan valid photo ID.<br>3. Submit request over TLS 1.3 payload to eKYC API. | eKYC API returns `STATUS: VERIFIED` with full name, DOB, and registered address. Customer Profile is auto-populated. System proceeds to MSISDN allocation. | `FR-TEL-011` |
| **TC-TEL-011-02** | Verify eKYC rejection handling on biometric mismatch (AF-01) | Store Agent (`ROLE-TEL-02`) logged into Retail POS. | 1. Select Connection Type: `Postpaid`, Segment: `B2B`.<br>2. Enter National ID and provide mismatched biometric scan.<br>3. Submit eKYC verification request. | eKYC API returns `STATUS: REJECTED`. System flags request as `FAILED_KYC` and displays exact error: `"Biometric verification failed against National ID records."` Order is blocked. | `FR-TEL-011 (AF-01)` |
| **TC-TEL-011-03** | Verify regulator limit enforcement for > 5 active SIMs per National ID (AF-02) | Customer National ID already has 5 active Prepaid SIM lines registered in CRM database. | 1. Initiate "New Connection Request" for 6th Prepaid SIM under same National ID.<br>2. Perform eKYC verification. | System blocks creation and displays exact error message: `"Regulatory limit reached: Maximum 5 active connections allowed per National ID."` | `FR-TEL-011 (AF-02)` |
| **TC-TEL-011-04** | Verify fallback workflow on eKYC gateway timeout > 5,000 ms (AF-03) | eKYC Gateway configured to delay response beyond 5,000 ms. | 1. Initiate eKYC verification request from Retail POS terminal.<br>2. Observe system response after 5,000 ms threshold. | System falls back to `PENDING_MANUAL_VERIFICATION` status and automatically triggers a workflow task for Back-Office audit. | `FR-TEL-011 (AF-03)` |

---

### Module 2: Order Management & Provisioning (FR-TEL-021, FR-TEL-022, FR-TEL-023)

| Test Case ID | Test Scenario / Title | Pre-Conditions | Execution Steps | Expected Result | Traceability ID |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-TEL-021-01** | Verify physical SIM activation and HLR provisioning | MSISDN in state `AVAILABLE`; Unassigned ICCID starting with `8991...`. | 1. Select MSISDN from inventory.<br>2. Scan unassigned physical SIM barcode (ICCID).<br>3. Submit Provisioning Order to SOM. | SOM sends `PROVIDE_SUBSCRIBER_DATA (MSISDN, IMSI, Profile_ID)` to HLR. HLR responds `200 OK SUCCESS`. Line status updates to `ACTIVE` in CRM in < 3 seconds. | `FR-TEL-021` |
| **TC-TEL-021-02** | Verify eSIM QR code generation and profile activation | MSISDN in state `AVAILABLE`. | 1. Select `eSIM Activation` option.<br>2. Submit provisioning request to SOM. | System generates dynamic QR Code containing LPA string `1$SM-DP+.TELCO.COM$MATCHING_ID`. Line updates to `ACTIVE` in < 3s upon HLR 200 OK response. | `FR-TEL-021` |
| **TC-TEL-021-03** | Verify error handling when scanning an already assigned ICCID (AF-01) | ICCID `89912345678901234567` is currently bound to MSISDN `+1234567890`. | 1. Scan physical SIM barcode `89912345678901234567`.<br>2. Submit for new connection. | System validates ICCID status (`ASSIGNED`) and displays exact error message: `"ICCID [8991...] is already bound to MSISDN [+1234567890]."` | `FR-TEL-021 (AF-01)` |
| **TC-TEL-021-04** | Verify HLR failure auto-retry queue (AF-02) | HLR network node configured to return failure/error response. | 1. Submit SIM Provisioning Order to SOM.<br>2. Monitor status upon HLR node failure. | Order status updates to `PROVISIONING_FAILED`. System automatically triggers retry queue (schedules 3 retries at 1-minute intervals). | `FR-TEL-021 (AF-02)` |
| **TC-TEL-022-01** | Verify Inbound MNP PAC validation and execution window | Customer possesses active PAC/NPK code (issued < 15 days ago). | 1. Initiate inbound MNP request with valid donor operator code and active PAC code.<br>2. Trigger NPC validation request. | NPC validation succeeds. MNP execution process is scheduled within the standard 24-hour window. | `FR-TEL-022` |
| **TC-TEL-023-01** | Verify SIM Swap OTP verification, old ICCID deactivation, and 24-hour financial lock | Active customer requesting replacement SIM card. | 1. Initiate SIM Swap in CSR Workspace (`ROLE-TEL-01`).<br>2. Verify OTP sent to secondary contact.<br>3. Complete SIM Swap. | 1. Mandatory OTP is requested and verified.<br>2. Old ICCID is deactivated in HLR prior to new ICCID activation.<br>3. Account is placed under 24-Hour Financial Transaction Lock (SMS OTP banking notifications barred for 24 hours). | `FR-TEL-023` |

---

### Module 3: Tariff Plan, Recharge & Billing (FR-TEL-031, FR-TEL-032)

| Test Case ID | Test Scenario / Title | Pre-Conditions | Execution Steps | Expected Result | Traceability ID |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-TEL-031-01** | Verify Prepaid Flexi 30 auto-renewal logic based on wallet balance threshold | Subscriber on Prepaid Flexi 30 plan reaching 30-day expiry. | **Case A**: Main Wallet Balance = $30.00.<br>**Case B**: Main Wallet Balance = $29.99. | **Case A**: $30 is auto-deducted, plan auto-renews for 30 days.<br>**Case B**: Auto-deduction fails due to insufficient balance ($29.99 < $30.00). | `FR-TEL-031` |
| **TC-TEL-031-02** | Verify Postpaid Enterprise Unlimited speed throttling upon 100% data usage | Subscriber on Postpaid Enterprise Unlimited ($75/mo, 100 GB FUP). | 1. Consume 100 GB of data allowance.<br>2. Continue browsing data post 100% usage threshold. | System throttles data connection speed to exactly 512 Kbps. Bill is generated on 1st of calendar month. | `FR-TEL-031` |
| **TC-TEL-031-03** | Verify Data Booster Add-on 5GB hard stop and 7-day expiration | Subscriber subscribes to $10 Data Booster Add-on (5 GB). | **Case A**: Consume 5 GB data within 7 days.<br>**Case B**: Reach Day 8 with remaining unused data. | **Case A**: Hard Stop enforced; user is redirected to self-service portal.<br>**Case B**: Add-on expires after 7 days; remaining data is forfeited. | `FR-TEL-031` |
| **TC-TEL-032-01** | Verify 16-digit voucher top-up & instant OCS main balance credit | Subscriber on Prepaid plan with valid 16-digit voucher PIN. | 1. Enter valid 16-digit numeric top-up PIN.<br>2. Submit top-up request. | Credit is instantly reflected in OCS Main Wallet Balance. | `FR-TEL-032` |
| **TC-TEL-032-02** | Verify top-up account lock after 5 consecutive invalid PIN attempts | Subscriber attempting top-up with invalid PINs. | 1. Enter invalid voucher PIN 5 consecutive times. | System locks top-up functionality for the subscriber for exactly 2 hours. | `FR-TEL-032` |

---

### Module 4: Customer 360 View & Trouble Ticketing (FR-TEL-041, FR-TEL-042)

| Test Case ID | Test Scenario / Title | Pre-Conditions | Execution Steps | Expected Result | Traceability ID |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-TEL-041-01** | Verify CSR Customer 360 Dashboard performance and display elements | CSR (`ROLE-TEL-01`) opens workspace for an active MSISDN. | 1. Search subscriber MSISDN in Call Center Workspace.<br>2. Measure page render latency. | Dashboard loads in < 1.5 seconds. Header displays MSISDN, Account Status (`ACTIVE`/`BARRED`/`SUSPENDED`), Customer Tier, eKYC status. Displays real-time balances, active services/hardware EMI, and last 5 interactions/top-ups/tickets. | `FR-TEL-041` |
| **TC-TEL-042-01** | Verify P1 Critical Ticket creation, 2h SLA, and 45-min auto-escalation | CSR (`ROLE-TEL-01`) raising ticket for Network Outage / Enterprise Line Down. | 1. Raise Trouble Ticket under category `NETWORK_COVERAGE` / Enterprise line down.<br>2. Set Priority to `P1 - Critical`.<br>3. Leave ticket idle for 45 minutes. | Target resolution SLA is set to 2 Hours. System automatically triggers escalation to L2 Manager after 45 minutes of idle status. | `FR-TEL-042` |
| **TC-TEL-042-02** | Verify P2 High Ticket 12h SLA and 6h Billing Lead auto-escalation | Ticket category `BILLING_DISPUTE` (> $100) or Payment Failure. | 1. Raise `P2 - High` ticket.<br>2. Leave idle for 6 hours. | Resolution SLA is set to 12 Hours. System auto-escalates to Billing Lead after 6 hours idle. | `FR-TEL-042` |
| **TC-TEL-042-03** | Verify P3 Medium Ticket 24h SLA and 16h Operations auto-escalation | Ticket category `SIM_ISSUE` (delay) or data speed complaint. | 1. Raise `P3 - Medium` ticket.<br>2. Leave idle for 16 hours. | Resolution SLA is set to 24 Hours. System auto-escalates to Operations after 16 hours idle. | `FR-TEL-042` |
| **TC-TEL-042-04** | Verify P4 Low Ticket 48h SLA and 72h auto-closure on customer inactivity | Ticket category `VAS_UNSUBSCRIBE` or General Plan Inquiry. | 1. Raise `P4 - Low` ticket.<br>2. Provide no customer response for 72 hours. | Resolution SLA is set to 48 Hours. Ticket auto-closes after 72 hours of customer inactivity. | `FR-TEL-042` |

---

### Field-Level Validation Matrix Test Cases (Section 5)

| Test Case ID | Target Field | Tested Rule / Range | Input Data Used | Expected Validation Outcome | Traceability ID |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-FLD-01-01** | `MSISDN` (`FLD-01`) | Valid E.164 format (10-15 digits, `^\+[1-9]\d{1,14}$`) | `+12345678901` | Accepted as valid MSISDN format. | `FLD-01` |
| **TC-FLD-01-02** | `MSISDN` (`FLD-01`) | Invalid short length & alpha characters | `12345` (short), `+1ABC5678` (alpha) | Rejected with field validation error. | `FLD-01` |
| **TC-FLD-02-01** | `ICCID` (`FLD-02`) | Valid 19-20 digits starting with `89` | `89912345678901234567` | Accepted as valid ICCID. | `FLD-02` |
| **TC-FLD-02-02** | `ICCID` (`FLD-02`) | Invalid IIN prefix | `8812345678901234567` | Rejected (Must match `^89[0-9]{17,18}$`). | `FLD-02` |
| **TC-FLD-03-01** | `IMSI` (`FLD-03`) | Exactly 15 digits (`^[0-9]{15}$`) | `123456789012345` (Valid), `12345678901234` (14 digits - invalid) | 15 digits accepted; 14 digits rejected (Boundary Failure). | `FLD-03` |
| **TC-FLD-04-01** | `National ID` (`FLD-04`) | 8-20 alphanumeric (`^[a-zA-Z0-9\-]{8,20}$`) | `ID#@!123` (Contains special chars) | Rejected with special character format error. | `FLD-04` |
| **TC-FLD-05-01** | `Top-up PIN` (`FLD-05`) | Exactly 16 numeric digits (`^[0-9]{16}$`) | `123456789012345` (15 digits) | Rejected with 16-digit length validation error. | `FLD-05` |
| **TC-FLD-06-01** | `Postpaid Limit` (`FLD-06`) | $10.00 to $5000.00 positive float | `-$50.00` (Negative), `$10000.00` (Exceeds max) | Both rejected per range rule ($10.00 to $5000.00). | `FLD-06` |

---

### Non-Functional & RBAC Security Test Cases (Sections 3 & 6)

| Test Case ID | Test Category | Target SLA / Rule | Execution Steps | Expected Result | Traceability ID |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-NFR-01-01** | Performance / Throughput | 5,000 TPS peak load on OCS Balance Check API | Execute load test simulating 5,000 TPS concurrent requests on OCS endpoint. | OCS balance check latency remains < 100 ms with 0% error rate. | `NFR-TEL-01` |
| **TC-NFR-01-02** | Latency SLA | Provisioning Order dispatch to HLR < 500 ms | Trigger SOM provisioning order. | SOM dispatches payload to HLR in < 500 ms. | `NFR-TEL-01` |
| **TC-NFR-03-01** | Security / GDPR | MSISDN & Address Data Masking | Log into Call Center Workspace as CSR (`ROLE-TEL-01`). View customer details. | MSISDN is displayed as `+1 234 *** *890` and Address is masked unless explicitly unmasked via manager approval. | `NFR-TEL-03` |
| **TC-NFR-03-02** | Security / PCI-DSS | Zero storage of Credit Card CVV or full PAN in logs | Execute payment transaction via payment gateway. Inspect CRM log files. | Zero storage of Credit Card CVV or full PAN in CRM log files. | `NFR-TEL-03` |
| **TC-RBAC-01** | Role Access Control | Field Technician (`ROLE-TEL-04`) scope restrictions | Log into app as Field Technician (`ROLE-TEL-04`). Attempt to issue Top-up or perform eKYC onboarding. | Action is denied with unauthorized access permission error. Access restricted to FTTH installation and trouble tickets. | `Section 3 RBAC` |

---

## 4. Self-Validation Check

- **Traceability**: Every test case maps 1:1 to explicit requirement IDs (`FR-TEL-011` through `FR-TEL-042`, `FLD-01` through `FLD-06`, `NFR-TEL-01` through `NFR-TEL-03`, and Section 3 RBAC).
- **Exact String & Numerical Accuracy**:
  - eKYC rejection message: `"Biometric verification failed against National ID records."`
  - Regulator limit error: `"Regulatory limit reached: Maximum 5 active connections allowed per National ID."`
  - ICCID bound error: `"ICCID [8991...] is already bound to MSISDN [+1234567890]."`
  - Max Prepaid SIM count: Exactly `5`.
  - eKYC timeout: Exactly `5,000 ms`.
  - HLR retries: `3 retries` at `1-min intervals`.
  - MNP PAC validity: `15 days`.
  - SIM Swap lock: `24-Hour Financial Transaction Lock`.
  - Prepaid Flexi 30 threshold: `$30.00` vs `$29.99`.
  - Postpaid throttle speed: `512 Kbps`.
  - Data Booster 5GB expiration: `7 Days`.
  - Voucher PIN wrong attempt lock: `5 consecutive wrong attempts` -> `2 hours lock`.
  - Ticket SLA & Escalation times: P1 (2h / 45m), P2 (12h / 6h), P3 (24h / 16h), P4 (48h / 72h auto-close).
  - RegEx & Field rules: Exact match to Section 5 validation matrix.
- **Zero Hallucination Compliance**: No unmentioned features, external libraries, or unverified assumptions were introduced. All output is derived strictly from facts extracted from `Functional_requirement_specifications.md`.
