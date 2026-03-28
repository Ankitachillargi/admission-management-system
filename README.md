# Admission Management System (Edumerge Assignment)

## Overview

A minimal web-based Admission Management system to configure programs & quotas, manage applicants, allocate seats with quota validation, confirm admissions with fee check, and view basic dashboards.

## Tech Stack

* Backend: Node.js, Express
* Database: SQLite
* Frontend: React (Vite)
* HTTP Client: Axios

## Features

* **Master Setup**: Create programs and define quota distribution
* **Applicant Management**: Create applicants with basic details and document status
* **Seat Allocation**: Allocates seats per program & quota with strict limit checks
* **Admission Confirmation**: Confirms only when fee is Paid; generates unique admission number
* **Dashboard**: Shows total intake, admitted, remaining, and quota-wise counts

## Business Rules Enforced

* No seat overbooking (quota-wise)
* Allocation blocked when quota is full
* Admission number is unique and generated once
* Admission confirmed only when fee is Paid
* Seat counters update in real-time

## Project Structure


edumerge-assignment/
├── backend/
├── frontend/
└── README.md

## Setup Instructions

### 1) Backend


cd backend
npm install
npm start


Server runs at: http://localhost:5000

### 2) Frontend


cd frontend
npm install
npm run dev


App runs at: http://localhost:5174

## How to Use (Quick Demo)

1. **Create Program & Quotas (via API)**

   * POST `/program` → { "name": "CSE", "intake": 100 }
   * POST `/quota` (3 times):

     * { "program_id": 1, "name": "KCET", "seats": 50 }
     * { "program_id": 1, "name": "COMEDK", "seats": 30 }
     * { "program_id": 1, "name": "Management", "seats": 20 }

2. **Create Applicant (UI)**

   * Fill form → Create

3. **Allocate Seat (UI)**

   * Applicant ID, Program ID (1), Quota (e.g., KCET) → Allocate
   * Blocks when quota is full

4. **Confirm Admission (UI)**

   * Admission ID, Fee = Paid → Confirm
   * Returns admission number (e.g., INST/2026/PRG1/KCET/0001)

5. **Dashboard (UI)**

   * Load Dashboard to view totals and quota stats

## API Endpoints (Core)

* POST `/program`
* POST `/quota`
* POST `/applicant`
* POST `/allocate-seat`
* POST `/confirm-admission`
* GET `/dashboard`

## AI Usage Disclosure

ChatGPT was used for:

* Structuring the project and defining schema/APIs
* Guidance on validation logic and edge cases

All core implementation, testing, and integration were done manually.

## Author

Ankita Chillargi
