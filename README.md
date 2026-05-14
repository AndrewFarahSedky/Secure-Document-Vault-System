# Secure Document Vault 🔐

## Overview
A secure web-based platform for managing encrypted documents with modern authentication.

## Features
- JWT Authentication
- Password Hashing (bcrypt)
- Password Policy Enforcement
- OAuth Login (GitHub)
- Two-Factor Authentication (2FA)
- Role-Based Access Control (Admin/Manager/User)
- Document Encryption (AES-256)
- Digital Signatures (RSA + SHA-256)
- Integrity Verification
- HTTPS Secure Communication

## Tech Stack
- **Backend**: Node.js + Express
- **Frontend**: React + Vite
- **Database**: PostgreSQL + Sequelize
- **Auth**: JWT + Passport.js

## How to Run

### Prerequisites
- Node.js v20+
- PostgreSQL v15+

### Backend
cd backend
npm install
# Configure .env file
npm run dev

### Frontend
cd frontend
npm install
npm run dev

### Database
Run schema.sql in pgAdmin

## Access
- Frontend: https://localhost:5173
- Backend: https://localhost:5000/api/health

## Default Admin Setup

After running the project, create an admin user by registering normally,
then run this SQL query in pgAdmin:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your_email@example.com';
```