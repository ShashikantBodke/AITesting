# FUNCTIONAL REQUIREMENT SPECIFICATION (FRS)
**System Name:** NextGen Enterprise Telco CRM System (B2C & B2B)  
**Document Reference:** FRS-TELCO-CRM-2026-V1.0  
**Author:** Senior Business Analyst (Telecommunications Domain)  
**Target Audience:** QA Test Engineering Lead, Solution Architects, Integration Developers, Product Owners  
**Alignment Standards:** TM Forum eTOM & Frameworx (eKCY, OCS, HLR/HSS Integration)  
**Status:** Approved for QA Test Case Creation  

---

## 1. Document Control & Version History

| Version | Revision Date | Author | Description of Changes | Approved By |
| :--- | :--- | :--- | :--- | :--- |
| **1.0** | 2026-08-03 | Senior BA | Initial Baseline FRS for Telco CRM Modules (Subscriber 360, eKYC, Order Provisioning, SIM Swap, MNP, Billing & Trouble Ticketing) | Lead Telco Enterprise Architect |

---

## 2. System Overview & Scope

### 2.1 System Context
The Enterprise Telco CRM system serves as the central operational hub for managing customer lifecycles across Prepaid, Postpaid, and Enterprise (B2B) segments. It interfaces directly with:
- **eKYC / National Identity Gateway** (Identity verification)
- **HLR / HSS / UDM** (Home Location Register / Subscriber Data Management)
- **OCS / Rating Engine** (Online Charging System / Real-time balance control)
- **Billing System & Payment Gateways** (Invoicing & auto-pay)
- **Provisioning System / SOM** (Service Order Management)

### 2.2 Functional Scope Boundaries
- **In-Scope:** Customer 360 View, eKYC & Subscriber Onboarding, Plan & Add-on Management, Order Provisioning (New Line, SIM Swap, MNP), Real-Time Billing & Recharge, Customer Service & Trouble Ticketing, Retention & Churn Scoring.
- **Out-of-Scope:** Physical network tower hardware provisioning, internal RAN infrastructure diagnostics.

---

## 3. Actor & Role-Based Access Control (RBAC) Matrix

| Role ID | Role Title | Portal / Channel | Scope of System Access |
| :--- | :--- | :--- | :--- |
| **ROLE-TEL-01** | Customer Service Rep (CSR) | Call Center Workspace | Read/Write Subscriber 360, Issue Top-ups, Raise Tickets, Process SIM Swap |
| **ROLE-TEL-02** | Store Agent | Retail POS Terminal | Onboard Subscribers, eKYC Verification, Physical SIM Issuance, Device Sales |
| **ROLE-TEL-03** | Billing Specialist | Admin Back-Office | Billing Adjustment, Refund Approval, Credit Limit Override, Dunning Management |
| **ROLE-TEL-04** | Field Technician | Mobile App | View/Update Home Broadband (FTTH) Installation & Trouble Tickets |
| **ROLE-TEL-05** | Subscriber (Customer) | Self-Service Web/App | View Balances, Pay Bills, Buy Data Add-ons, Request eSIM, Track Tickets |

---

## 4. Detailed Functional Requirement Specifications

---

### MODULE 1: SUBSCRIBER ONBOARDING & eKYC (FR-TEL-010)

#### FR-TEL-011: Subscriber Registration & eKYC Verification
* **Requirement Description:** Real-time identity verification against National ID / Passport database prior to line activation.
* **Pre-conditions:** Store Agent or Customer Self-Service user has initiated "New Connection Request".

##### Step-by-Step Functional Flow (Happy Path)
1. Agent selects Connection Type: **Prepaid** or **Postpaid**, and Segment: **B2C** or **B2B**.
2. Agent enters Customer National ID / Passport Number and scans biometric / photo ID.
3. System invokes Government eKYC REST API payload over TLS 1.3.
4. eKYC API returns `STATUS: VERIFIED` with full name, DOB, and registered address.
5. System auto-populates Customer Profile and checks existing active SIM count (Max **5 Prepaid SIMs** per National ID allowed by Regulator).
6. System proceeds to MSISDN allocation and SIM assignment.

##### Negative & Alternative Scenarios (QA Test Cases)
* **AF-01 (eKYC Verification Failed):** If eKYC API returns `STATUS: REJECTED` or mismatch in biometric, system flags request as `FAILED_KYC`, displays error: *"Biometric verification failed against National ID records."* Order cannot proceed.
* **AF-02 (Regulator Line Limit Exceeded):** If National ID already owns 5 active lines, system blocks creation with error: *"Regulatory limit reached: Maximum 5 active connections allowed per National ID."*
* **AF-03 (eKYC Gateway Timeout):** If API does not respond within 5,000 ms, system falls back to `PENDING_MANUAL_VERIFICATION` status and triggers workflow for Back-Office audit.

---

### MODULE 2: ORDER MANAGEMENT & PROVISIONING (FR-TEL-020)

#### FR-TEL-021: New Connection & Physical SIM / eSIM Activation
* **Requirement Description:** Allocation of MSISDN (Mobile Number) and pairing with ICCID (SIM Card Serial Number) with automatic network HLR/HSS provisioning.
* **Business Rules:**
  - MSISDN must be in state `AVAILABLE` in the Number Inventory Database.
  - ICCID must be 19-20 digits starting with Telco Issuer Identification Number (IIN e.g., `8991...`).

##### Step-by-Step Functional Flow (Happy Path)
1. Agent selects MSISDN from inventory or enters customer-requested VIP number.
2. Agent scans Physical SIM barcode (ICCID) OR selects **eSIM Activation**.
3. System validates ICCID status (`UNASSIGNED`).
4. System submits Provisioning Order to SOM (Service Order Management).
5. SOM triggers HLR/HSS activation payload: `PROVIDE_SUBSCRIBER_DATA (MSISDN, IMSI, Profile_ID)`.
6. HLR responds `200 OK SUCCESS`.
7. For eSIM: System renders dynamic QR Code (LPA string `1$SM-DP+.TELCO.COM$MATCHING_ID`) for scan.
8. Line status updates to `ACTIVE` in CRM within < 3 seconds.

##### Negative & Alternative Scenarios (QA Test Cases)
* **AF-01 (ICCID Already Assigned):** Scanning an already active SIM displays: *"ICCID [8991...] is already bound to MSISDN [+1234567890]."*)
* **AF-02 (HLR Provisioning Failure):** If network node fails, status updates to `PROVISIONING_FAILED`, and auto-retry queue triggers (3 retries at 1-min intervals).

---

#### FR-TEL-022: Mobile Number Portability (MNP - Inbound)
* **Requirement Description:** Porting customer number from donor operator to receiver network compliant with National Telecom Authority rules.
* **Business Rules:**
  - Customer must provide valid Porting Authorization Code (PAC / NPK).
  - MNP Execution window: Standard 24 hours.

##### Functional Validation Matrix for MNP
- Validate donor carrier operator code.
- Verify active status of PAC code (Must not be expired; 15-day validity).
- Trigger Automated NPC (Number Portability Clearinghouse) validation request.

---

#### FR-TEL-023: SIM Swap Procedure (High Security Control)
* **Requirement Description:** Replace existing SIM/eSIM due to loss, damage, or upgrade with strict anti-fraud controls.
* **Security Controls (QA Mandatory Verification):**
  1. Mandatory OTP sent to secondary registered contact number / email.
  2. Account placed under **24-Hour Financial Transaction Lock** (SMS OTP banking notifications barred for 24h post SIM Swap to prevent Fraud/SIM Hijacking).
  3. Deactivation of old ICCID in HLR prior to new ICCID activation.

---

### MODULE 3: TARIFF PLAN, RECHARGE & BILLING (FR-TEL-030)

#### FR-TEL-031: Real-Time Balance, Plan Subscriptions & Add-ons
* **Requirement Description:** Manage voice, data, SMS balance buckets and real-time rating updates via OCS.

##### Plan Subscription & Rating Matrix

| Tariff Plan Type | Base Fee | Data Allowance | Voice Allowance | Out-of-Bundle Rate | Auto-Renewal Rule |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Prepaid Flexi 30** | $30 / 30 Days | 15 GB (5G Speed) | Unlimited Local | $0.05 / MB after 100% usage | Auto-deduct from Main Wallet if Balance ≥ $30 |
| **Postpaid Enterprise Unlimited** | $75 / Month | 100 GB (Fair Usage Policy) | Unlimited National + 500 Int'l Mins | Throttle speed to 512 Kbps | Billed on 1st of every calendar month |
| **Data Booster Add-on 5GB** | $10 (One-time) | 5 GB | N/A | Hard Stop / Redirect to Portal | Expire after 7 Days |

#### FR-TEL-032: Real-Time Top-up & Payment Gateway Processing
* **Prepaid Voucher / Digital Top-up Rules:**
  - Voucher PIN: Exactly 16 digits.
  - Credit instantly reflected in OCS Main Balance.
  - System enforces 5 consecutive wrong PIN attempts limit (Locks top-up for 2 hours).

---

### MODULE 4: 360° CUSTOMER VIEW & TROUBLE TICKETING (FR-TEL-040)

#### FR-TEL-041: Unified Customer 360 Dashboard
CSR Agent Workspace must display in < 1.5 seconds:
1. **Header Panel:** MSISDN, Account Status (`ACTIVE`, `BARRED`, `SUSPENDED`), Customer Tier (Gold, Platinum, Standard), eKYC Compliance Status.
2. **Real-time Balances:** Data remaining (GB), Voice Mins remaining, Main Wallet Balance ($).
3. **Active Services & Hardware:** Current Plan, Active VAS Add-ons, Router/Handset EMI details.
4. **Recent Interactions:** Last 5 calls/chats, recent Top-ups, active Trouble Tickets.

#### FR-TEL-042: Incident Management & Trouble Ticket Lifecycle
* **Ticket Categories:** `NETWORK_COVERAGE`, `BILLING_DISPUTE`, `SIM_ISSUE`, `BROADBAND_FAULT`, `VAS_UNSUBSCRIBE`.
* **SLA Matrix & Escalation Rules:**

| Priority | Ticket Category | Target Resolution SLA | Auto-Escalation Trigger |
| :--- | :--- | :--- | :--- |
| **P1 - Critical** | Network Outage / Enterprise Line Down | **2 Hours** | Escalate to L2 Manager after 45 Mins idle |
| **P2 - High** | Billing Dispute > $100 / Payment Failure | **12 Hours** | Escalate to Billing Lead after 6 Hours |
| **P3 - Medium** | SIM Activation delay / Data Speed complaint | **24 Hours** | Escalate to Operations after 16 Hours |
| **P4 - Low** | General Plan Inquiry / Address Update | **48 Hours** | Auto-close if no customer response in 72h |

---

## 5. Field-Level Validation Matrix (QA Boundary Analysis & Equivalence Partitioning)

> **QA Instruction:** Derive positive, negative, and edge-case automated test scripts using the exact constraints below.

| Field ID | Field Name | Data Type | Required | Length / Range | Validation Rule / RegEx | QA Failure Test Case Input |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `FLD-01` | `MSISDN` | String | Yes | 10 to 15 digits | E.164 Format: `^\+[1-9]\d{1,14}$` | `12345` (Too short), `+1ABC5678` (Alpha characters) |
| `FLD-02` | `ICCID` | Numeric String | Yes | Exactly 19 or 20 digits | `^89[0-9]{17,18}$` | `8812345678901234567` (Wrong IIN prefix) |
| `FLD-03` | `IMSI` | Numeric String | Yes | Exactly 15 digits | `^[0-9]{15}$` | `12345678901234` (14 digits - fail BVA) |
| `FLD-04` | `National ID` | Alphanumeric | Yes | 8 to 20 chars | `^[a-zA-Z0-9\-]{8,20}$` | `ID#@!123` (Special characters invalid) |
| `FLD-05` | `Top-up PIN` | Numeric | Yes | Exactly 16 digits | `^[0-9]{16}$` | `123456789012345` (15 digits - BVA fail) |
| `FLD-06` | `Postpaid Limit` | Decimal | Yes | $10.00 to $5000.00 | Positive floating point with 2 decimals | `-$50.00`, `$10000.00` (Exceeds max threshold) |

---

## 6. Non-Functional Requirements (NFRs - Telco Grade)

### NFR-TEL-01: Performance & Scalability SLAs
- **Throughput:** System must handle up to **5,000 Transactions Per Second (TPS)** during peak hours (e.g., New Year Eve top-up surges).
- **Latency:**
  - Customer 360 Dashboard load: **< 1.5 seconds**.
  - OCS Balance Check API: **< 100 ms**.
  - Provisioning Order Dispatch to HLR: **< 500 ms**.

### NFR-TEL-02: Reliability & Availability
- **Availability:** **99.999% SLA (Five Nines)** for OCS Rating & Provisioning Interfaces.
- **Failover:** Active-Active multi-region deployment with zero data loss (RPO = 0, RTO < 30 seconds).

### NFR-TEL-03: Security & Regulatory Compliance
- **GDPR / Telecommunications Privacy:** Mask MSISDN (`+1 234 *** *890`) and Customer Address in CSR views unless unmasked with manager approval.
- **PCI-DSS:** Zero storage of Credit Card CVV or full PAN numbers in CRM log files.

---

## 7. Requirement Traceability Matrix (RTM Baseline for QA Team)

| Req ID | Module / Feature | Test Type | Recommended QA Test Case Scenarios |
| :--- | :--- | :--- | :--- |
| **FR-TEL-011** | eKYC Verification | Functional / Integration | 1. Positive eKYC response & auto-population.<br>2. Biometric mismatch rejection.<br>3. Attempt to register 6th SIM under same National ID (Regulator Block). |
| **FR-TEL-021** | SIM Activation | Functional / E2E | 1. End-to-End SIM activation with HLR mock 200 OK.<br>2. eSIM QR code generation.<br>3. HLR timeout fallback to retry queue. |
| **FR-TEL-023** | SIM Swap Security | Security / Regression | 1. Validate 24-hour financial SMS lock triggers on SIM swap.<br>2. Ensure old ICCID is deactivated immediately. |
| **FR-TEL-031** | Plan Subscription | Boundary / Logic | 1. Auto-renewal success when balance = $30.00.<br>2. Auto-renewal failure when balance = $29.99 (BVA test).<br>3. Data throttling when 100% threshold reached. |
| **FR-TEL-032** | Recharge / Top-up | Security / Negative | 1. Valid 16-digit PIN top-up.<br>2. Lock account after 5 consecutive invalid PIN attempts. |
| **FR-TEL-042** | Trouble Ticketing | SLA / Workflow | 1. P1 Ticket creation & auto-escalation trigger after 45 mins.<br>2. P4 ticket auto-closure after 72h inactivity. |
| **NFR-TEL-01** | System Latency | Performance / Load | 1. Execute JMeter load test simulating 5,000 TPS on OCS balance check endpoint. |

---

## 8. QA Approval & Sign-Off Checklist

- [ ] 100% Test Case mapping completed against Sections 4, 5, and 7.
- [ ] Integration Mocks configured for eKYC, HLR/HSS, and OCS APIs.
- [ ] Security Penetration Testing completed for SIM Swap & Customer 360 data masking.
- [ ] Zero Open Blockers or Critical Bugs in Test Management System (Jira / Quality Center).
