# ANTI-HALLUCINATION ENFORCED HIGH-LEVEL TEST CASES
**System Name:** NextGen Enterprise Telco CRM System  
**Reference Document:** FRS-TELCO-CRM-2026-V1.0  
**Anti-Hallucination Configuration:** MANDATORY ENABLED (Hard Stop Enforcement)  
**Target File:** `high_level_test_cases_with_AH_Rules.md`  

---

## Verified Facts (Extracted strictly from FRS-TELCO-CRM-2026-V1.0)

1. **System Name & Reference:** NextGen Enterprise Telco CRM System (B2C & B2B), Document Ref: `FRS-TELCO-CRM-2026-V1.0`.
2. **External Interfaces:** eKYC / National Identity Gateway, HLR / HSS / UDM, OCS / Rating Engine, Billing System & Payment Gateways, Provisioning System / SOM.
3. **Actor Roles & Access Scope:**
   - `ROLE-TEL-01` (CSR Agent): Call Center Workspace; Read/Write Subscriber 360, Issue Top-ups, Raise Tickets, Process SIM Swap.
   - `ROLE-TEL-02` (Store Agent): Retail POS Terminal; Onboard Subscribers, eKYC Verification, Physical SIM Issuance, Device Sales.
   - `ROLE-TEL-03` (Billing Specialist): Admin Back-Office; Billing Adjustment, Refund Approval, Credit Limit Override, Dunning Management.
   - `ROLE-TEL-04` (Field Technician): Mobile App; View/Update Home Broadband (FTTH) Installation & Trouble Tickets.
   - `ROLE-TEL-05` (Subscriber): Self-Service Web/App; View Balances, Pay Bills, Buy Data Add-ons, Request eSIM, Track Tickets.
4. **Onboarding & eKYC Rules (`FR-TEL-011`):**
   - Connection Types: `Prepaid` or `Postpaid`; Segments: `B2C` or `B2B`.
   - Protocol: TLS 1.3 for Government eKYC REST API.
   - eKYC Success: Returns `STATUS: VERIFIED` with full name, DOB, registered address. Max 5 Prepaid SIMs per National ID.
   - eKYC Mismatch/Rejection: Returns `STATUS: REJECTED`, flags request `FAILED_KYC`, error message: *"Biometric verification failed against National ID records."*
   - Regulatory Line Limit Exceeded (>5 lines): Error message: *"Regulatory limit reached: Maximum 5 active connections allowed per National ID."*
   - eKYC Timeout (>5,000 ms): Status transitions to `PENDING_MANUAL_VERIFICATION` and triggers Back-Office audit workflow.
5. **Provisioning, MNP & SIM Swap Rules (`FR-TEL-021`, `FR-TEL-022`, `FR-TEL-023`):**
   - MSISDN requirement: State `AVAILABLE` in Number Inventory Database.
   - ICCID format: 19-20 digits starting with Telco Issuer ID `8991...`.
   - HLR payload: `PROVIDE_SUBSCRIBER_DATA (MSISDN, IMSI, Profile_ID)` returning `200 OK SUCCESS`.
   - eSIM LPA string format: `1$SM-DP+.TELCO.COM$MATCHING_ID`. CRM activation status update target: < 3 seconds.
   - Duplicate ICCID error message: *"ICCID [8991...] is already bound to MSISDN [+1234567890]."*
   - HLR Failure handling: Status set to `PROVISIONING_FAILED`, auto-retry queue triggers 3 retries at 1-min intervals.
   - MNP requirements: Valid PAC/NPK code (15-day validity period), 24-hour execution window, triggers NPC clearinghouse request.
   - SIM Swap Security: Mandatory OTP to secondary contact number/email; **24-Hour Financial Transaction Lock** (SMS OTP banking notifications barred for 24h post SIM Swap); immediate deactivation of old ICCID in HLR.
6. **Billing, Top-up & Rating Rules (`FR-TEL-031`, `FR-TEL-032`):**
   - Prepaid Flexi 30: $30 / 30 Days, 15 GB 5G data, Unlimited Local voice, out-of-bundle $0.05/MB. Auto-renews if Main Wallet Balance ≥ $30.
   - Postpaid Enterprise Unlimited: $75 / Month, 100 GB FUP, Unlimited National + 500 Int'l mins. Throttles to 512 Kbps after 100 GB. Billed on 1st of month.
   - Data Booster Add-on 5GB: $10 one-time, 5 GB data, expires after 7 Days.
   - Voucher PIN: Exactly 16 digits. Instant credit in OCS. 5 consecutive wrong PIN attempts lock top-up service for 2 hours.
7. **Customer 360 & Trouble Ticketing Rules (`FR-TEL-041`, `FR-TEL-042`):**
   - Customer 360 Dashboard render target: < 1.5 seconds.
   - Ticket categories: `NETWORK_COVERAGE`, `BILLING_DISPUTE`, `SIM_ISSUE`, `BROADBAND_FAULT`, `VAS_UNSUBSCRIBE`.
   - Ticket SLAs & Escalation triggers:
     - P1 Critical (Network Outage / Line Down): 2 Hours SLA; auto-escalates to L2 Manager after 45 Mins idle.
     - P2 High (Billing Dispute > $100 / Payment Failure): 12 Hours SLA; auto-escalates to Billing Lead after 6 Hours.
     - P3 Medium (SIM Activation delay / Speed complaint): 24 Hours SLA; auto-escalates to Operations after 16 Hours.
     - P4 Low (General Inquiry / Address Update): 48 Hours SLA; auto-closes if no customer response in 72h.
8. **Field Validation Constraints (Section 5):**
   - `MSISDN`: String, 10-15 digits, RegEx `^\+[1-9]\d{1,14}$`.
   - `ICCID`: Numeric String, 19-20 digits, RegEx `^89[0-9]{17,18}$`.
   - `IMSI`: Numeric String, 15 digits, RegEx `^[0-9]{15}$`.
   - `National ID`: Alphanumeric, 8-20 chars, RegEx `^[a-zA-Z0-9\-]{8,20}$`.
   - `Top-up PIN`: Numeric, 16 digits, RegEx `^[0-9]{16}$`.
   - `Postpaid Limit`: Decimal, $10.00 to $5000.00.
9. **NFR Constraints (Section 6):**
   - Throughput: Up to 5,000 TPS.
   - Latency: Customer 360 < 1.5s; OCS Balance Check < 100 ms; Provisioning Dispatch < 500 ms.
   - Availability & Failover: 99.999% SLA; Active-Active multi-region deployment (RPO = 0, RTO < 30s).
   - Data Privacy & Security: Mask MSISDN (`+1 234 *** *890`) and Address in CSR view unless unmasked with manager approval. Zero storage of CVV or full PAN numbers in logs/DB.

---

## Missing / Unknown Information

1. Specific database table/column schema names (e.g., `tbl_subscribers`, `sub_id`) - *Not provided in FRS*.
2. Specific payment gateway vendor names (e.g., Stripe, PayPal, Adyen) - *Not provided in FRS*.
3. Specific IP addresses, URLs, or hostnames for eKYC or HLR endpoints - *Not provided in FRS*.
4. Specific UI DOM element selectors or CSS classes (e.g., `#btn-submit`) - *Not provided in FRS*.
5. Specific email server configurations or SMS gateway vendor names - *Not provided in FRS*.

---

## Generated Output (High-Level Test Cases Derived Exclusively from Verified Facts)

---

### MODULE 1: SUBSCRIBER ONBOARDING & eKYC (Traceable to `FR-TEL-011` & Section 5)

#### TC-AH-ONB-001: Verify Successful Subscriber Registration & eKYC Auto-Population
* **Requirement Traceability:** `FR-TEL-011` (Steps 1-6)
* **Pre-conditions:** Store Agent (`ROLE-TEL-02`) logged into Retail POS Terminal; Government eKYC API active over TLS 1.3; National ID has < 5 active lines.
* **Test Inputs:** Connection Type = `Prepaid`, Segment = `B2C`, Valid National ID (8-20 alphanumeric chars), Valid Biometric scan.
* **Expected Result:** eKYC API returns `STATUS: VERIFIED` with full name, DOB, and registered address. Customer Profile auto-populates. System verifies active line count < 5 and proceeds to MSISDN allocation step.

#### TC-AH-ONB-002: Verify Onboarding Rejection on eKYC Biometric Mismatch
* **Requirement Traceability:** `FR-TEL-011` (AF-01)
* **Pre-conditions:** Store Agent (`ROLE-TEL-02`) on Onboarding screen.
* **Test Inputs:** Valid National ID with non-matching biometric data.
* **Expected Result:** eKYC API returns `STATUS: REJECTED`. Order flagged as `FAILED_KYC`. System displays exact error message: *"Biometric verification failed against National ID records."* Order cannot proceed.

#### TC-AH-ONB-003: Enforce Regulatory Limit of Maximum 5 Active Lines per National ID
* **Requirement Traceability:** `FR-TEL-011` (AF-02)
* **Pre-conditions:** National ID already owns 5 active Prepaid lines in CRM.
* **Test Inputs:** Attempt onboarding for a 6th Prepaid connection under the same National ID.
* **Expected Result:** System blocks creation and displays exact error message: *"Regulatory limit reached: Maximum 5 active connections allowed per National ID."*

#### TC-AH-ONB-004: Verify eKYC Gateway Timeout Handling (> 5,000 ms)
* **Requirement Traceability:** `FR-TEL-011` (AF-03)
* **Pre-conditions:** eKYC API response delayed beyond 5,000 ms.
* **Test Inputs:** Submit eKYC verification request.
* **Expected Result:** Order status transitions to `PENDING_MANUAL_VERIFICATION`. System triggers Back-Office audit workflow.

#### TC-AH-ONB-005: Validate Field Rules on National ID Input (`FLD-04`)
* **Requirement Traceability:** Section 5 (`FLD-04`)
* **Test Inputs:**
  - Input A: `1234567` (7 chars - fails min length 8)
  - Input B: `12345678` (8 chars - valid)
  - Input C: `12345678901234567890` (20 chars - valid)
  - Input D: `123456789012345678901` (21 chars - fails max length 20)
  - Input E: `ID#@!123` (Contains special characters - fails RegEx `^[a-zA-Z0-9\-]{8,20}$`)
* **Expected Result:** Inputs A, D, and E fail field validation. Inputs B and C pass validation.

---

### MODULE 2: ORDER MANAGEMENT, PROVISIONING & SECURITY (Traceable to `FR-TEL-021`, `FR-TEL-022`, `FR-TEL-023`)

#### TC-AH-PROV-001: Verify Physical SIM Activation & HLR Payload Sync
* **Requirement Traceability:** `FR-TEL-021` (Steps 1-8)
* **Pre-conditions:** MSISDN in state `AVAILABLE`; ICCID in state `UNASSIGNED` (19-20 digits starting with `8991...`).
* **Test Inputs:** Available MSISDN, Valid ICCID `8991123456789012345`.
* **Expected Result:** SOM dispatches payload `PROVIDE_SUBSCRIBER_DATA (MSISDN, IMSI, Profile_ID)` to HLR/HSS. HLR returns `200 OK SUCCESS`. Line status updates to `ACTIVE` in CRM within < 3 seconds.

#### TC-AH-PROV-002: Verify eSIM Activation & QR Code LPA String Generation
* **Requirement Traceability:** `FR-TEL-021` (Step 7)
* **Pre-conditions:** User selects eSIM Activation option.
* **Test Inputs:** eSIM activation order submission.
* **Expected Result:** System renders dynamic QR Code containing LPA string format `1$SM-DP+.TELCO.COM$MATCHING_ID`.

#### TC-AH-PROV-003: Reject Already Assigned ICCID
* **Requirement Traceability:** `FR-TEL-021` (AF-01)
* **Pre-conditions:** ICCID `8991123456789012345` is already bound to MSISDN `+1234567890`.
* **Test Inputs:** Scan ICCID `8991123456789012345` for new activation.
* **Expected Result:** System displays exact error message: *"ICCID [8991123456789012345] is already bound to MSISDN [+1234567890]."*

#### TC-AH-PROV-004: Handle HLR Provisioning Failure and Auto-Retry Queue Trigger
* **Requirement Traceability:** `FR-TEL-021` (AF-02)
* **Pre-conditions:** Network node returns failure during HLR provisioning.
* **Test Inputs:** Submit activation order while HLR returns error.
* **Expected Result:** Order status updates to `PROVISIONING_FAILED`. System triggers auto-retry queue configured for 3 retries at 1-minute intervals.

#### TC-AH-PROV-005: Reject Inbound MNP Order with Expired PAC Code (> 15 Days)
* **Requirement Traceability:** `FR-TEL-022`
* **Pre-conditions:** Inbound MNP request initiated.
* **Test Inputs:** PAC code older than 15 days (expired).
* **Expected Result:** System validation fails PAC active status check. Order blocked.

#### TC-AH-PROV-006: Verify SIM Swap Security Controls & 24-Hour Financial Transaction Lock
* **Requirement Traceability:** `FR-TEL-023` (Controls 1-3)
* **Pre-conditions:** Existing active subscriber requests SIM Swap.
* **Test Inputs:** Submit SIM Swap request with mandatory OTP.
* **Expected Result:**
  1. Mandatory OTP verified against secondary contact number/email.
  2. Old ICCID deactivated in HLR prior to new ICCID activation.
  3. Account placed under **24-Hour Financial Transaction Lock** (SMS OTP banking notifications barred for 24h).

---

### MODULE 3: TARIFF PLANS, RECHARGE & BILLING (Traceable to `FR-TEL-031`, `FR-TEL-032`)

#### TC-AH-BIL-001: Verify Prepaid Flexi 30 Auto-Renewal when Balance ≥ $30.00
* **Requirement Traceability:** `FR-TEL-031` (Plan Matrix)
* **Pre-conditions:** Subscriber on `Prepaid Flexi 30`; Main Wallet Balance = `$30.00`; Plan expiry reached.
* **Test Inputs:** Trigger plan renewal check.
* **Expected Result:** System deducts $30.00 from Main Wallet Balance. 15 GB 5G Data and Unlimited Local Voice renewed for 30 Days.

#### TC-AH-BIL-002: Verify Prepaid Flexi 30 Auto-Renewal Failure when Balance < $30.00
* **Requirement Traceability:** `FR-TEL-031` (Plan Matrix)
* **Pre-conditions:** Subscriber on `Prepaid Flexi 30`; Main Wallet Balance = `$29.99` (Boundary input).
* **Test Inputs:** Trigger plan renewal check.
* **Expected Result:** Auto-renewal condition `Balance ≥ $30` fails. Renewal rejected. Out-of-bundle rate of `$0.05 / MB` applied after 100% usage.

#### TC-AH-BIL-003: Verify Data Throttling to 512 Kbps for Postpaid Enterprise Unlimited at 100 GB FUP
* **Requirement Traceability:** `FR-TEL-031` (Plan Matrix)
* **Pre-conditions:** Subscriber on `Postpaid Enterprise Unlimited`; cumulative data usage reaches 100 GB.
* **Test Inputs:** Data consumption event exceeding 100 GB FUP limit.
* **Expected Result:** OCS throttles data speed to 512 Kbps.

#### TC-AH-BIL-004: Verify Data Booster Add-on 5GB Expiration After 7 Days
* **Requirement Traceability:** `FR-TEL-031` (Plan Matrix)
* **Pre-conditions:** $10 Data Booster Add-on purchased; 5 GB bucket added.
* **Test Inputs:** Advance system timestamp past 7 Days (168 hours).
* **Expected Result:** Unused portion of 5 GB Add-on bucket expires.

#### TC-AH-BIL-005: Enforce 2-Hour Top-up Lockout After 5 Consecutive Wrong 16-Digit PIN Attempts
* **Requirement Traceability:** `FR-TEL-032`
* **Pre-conditions:** Prepaid subscriber account active.
* **Test Inputs:** Enter invalid 16-digit voucher PIN 5 consecutive times.
* **Expected Result:** On the 5th failed attempt, system enforces 5-attempt limit and locks top-up service for 2 hours. Valid PINs credited instantly to OCS Main Balance.

---

### MODULE 4: CUSTOMER 360° VIEW & TROUBLE TICKETING (Traceable to `FR-TEL-041`, `FR-TEL-042`)

#### TC-AH-TCK-001: Verify Customer 360° Dashboard Display Latency (< 1.5 Seconds)
* **Requirement Traceability:** `FR-TEL-041` & `NFR-TEL-01`
* **Pre-conditions:** CSR Agent (`ROLE-TEL-01`) logged into Call Center Workspace.
* **Test Inputs:** Query subscriber MSISDN.
* **Expected Result:** Dashboard loads complete view in < 1.5 seconds displaying: Header Panel (MSISDN, Account Status, Tier, eKYC Status), Real-time Balances (Data, Voice, Wallet), Active Services, and Recent Interactions.

#### TC-AH-TCK-002: Verify P1 Critical Trouble Ticket SLA Auto-Escalation After 45 Minutes Idle
* **Requirement Traceability:** `FR-TEL-042` (SLA Matrix)
* **Pre-conditions:** Ticket created under category `NETWORK_COVERAGE` with Priority `P1 - Critical` (Target Resolution SLA: 2 Hours).
* **Test Inputs:** Leave ticket unhandled/idle for 45 minutes.
* **Expected Result:** Auto-escalation trigger fires at 45 minutes idle time. Ticket escalates to L2 Manager.

#### TC-AH-TCK-003: Verify P4 Low Trouble Ticket Auto-Closure After 72 Hours Inactivity
* **Requirement Traceability:** `FR-TEL-042` (SLA Matrix)
* **Pre-conditions:** Ticket created under category `VAS_UNSUBSCRIBE` with Priority `P4 - Low` (Target Resolution SLA: 48 Hours).
* **Test Inputs:** No customer response recorded for 72 hours.
* **Expected Result:** Ticket auto-closes after 72 hours of customer inactivity.

---

### MODULE 5: SECURITY, DATA PRIVACY & ACCESS CONTROL (Traceable to `NFR-TEL-03` & RBAC Matrix)

#### TC-AH-SEC-001: Verify MSISDN and Customer Address PII Masking for CSR Role
* **Requirement Traceability:** `NFR-TEL-03` & Section 3 (`ROLE-TEL-01`)
* **Pre-conditions:** Logged in as CSR Agent (`ROLE-TEL-01`).
* **Test Inputs:** View Subscriber 360 page.
* **Expected Result:** MSISDN is masked in format `+1 234 *** *890`. Customer address is masked. Unmasking requires manager approval.

#### TC-AH-SEC-002: Verify Zero Storage of Credit Card CVV and Full PAN Numbers
* **Requirement Traceability:** `NFR-TEL-03` (PCI-DSS)
* **Pre-conditions:** Payment Gateway transaction completed.
* **Test Inputs:** Inspect CRM database records and system application logs.
* **Expected Result:** Zero instances of CVV or full PAN numbers present in CRM log files or database tables.

#### TC-AH-SEC-003: Enforce RBAC Restriction on Credit Limit Override
* **Requirement Traceability:** Section 3 (`ROLE-TEL-01` vs `ROLE-TEL-03`)
* **Pre-conditions:** Logged in as CSR Agent (`ROLE-TEL-01`).
* **Test Inputs:** Attempt to perform Credit Limit Override on Postpaid account.
* **Expected Result:** Operation blocked. Only Billing Specialist (`ROLE-TEL-03`) has scope of access for Credit Limit Override.

---

### MODULE 6: PERFORMANCE & HIGH AVAILABILITY SLAs (Traceable to `NFR-TEL-01`, `NFR-TEL-02`)

#### TC-AH-PERF-001: Verify System Throughput of 5,000 TPS and Latency SLAs
* **Requirement Traceability:** `NFR-TEL-01`
* **Test Inputs:** High-volume load test targeting CRM endpoints at 5,000 TPS concurrency.
* **Expected Result:**
  - System handles up to 5,000 TPS.
  - OCS Balance Check API response time < 100 ms.
  - Provisioning Order Dispatch to HLR < 500 ms.

#### TC-AH-PERF-002: Verify Active-Active Multi-Region Availability & Failover SLA
* **Requirement Traceability:** `NFR-TEL-02`
* **Test Inputs:** Simulate region outage during Active-Active operation.
* **Expected Result:** OCS Rating & Provisioning Interfaces maintain 99.999% SLA. Multi-region failover completes with RPO = 0 (zero data loss) and RTO < 30 seconds.

---

## Self-Validation Check

1. **Fact Traceability Check:** Every requirement ID (`FR-TEL-011`, `FR-TEL-021`, `FR-TEL-022`, `FR-TEL-023`, `FR-TEL-031`, `FR-TEL-032`, `FR-TEL-041`, `FR-TEL-042`, `FLD-01` to `FLD-06`, `NFR-TEL-01` to `03`), role ID (`ROLE-TEL-01` to `05`), SLA time, error message, and RegEx string in this document corresponds strictly to an entry in `FRS-TELCO-CRM-2026-V1.0`.
2. **Zero Hallucination Verification:**
   - No unmentioned third-party gateway names (e.g. Stripe, Twilio) were added.
   - No unmentioned UI element IDs (e.g. `#submitBtn`) were invented.
   - No unmentioned error codes (e.g. `ERR_5001`) were assumed.
3. **Format Compliance:** Document strictly follows the 4 required sections: *Verified Facts*, *Missing / Unknown Information*, *Generated Output*, and *Self-Validation Check*.
4. **Result:** Self-Validation Status = **PASSED (100% Deterministic & Traceable)**.
