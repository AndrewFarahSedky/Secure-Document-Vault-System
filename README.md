# Secure Document Vault System 🔐

A full-stack secure web application for managing encrypted documents with modern authentication mechanisms, built as a final project for the **Data Integrity and Authentication** course.

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-Vite-blue)](https://vitejs.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v15+-blue)](https://postgresql.org)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---

## 📸 Screenshots

### Register & Password Policy
![Register](screenshots/register.png)
![Password Policy](screenshots/password-policy.png)

### Login & Dashboard & JWT Token
![Login](screenshots/login.png)
![Dashboard](screenshots/dashboard.png)
![JWT Token](screenshots/jwt-token.png)

### GitHub OAuth
![GitHub OAuth](screenshots/github-oauth.png)

### Two-Factor Authentication (2FA)
![2FA Setup](screenshots/2fa-setup.png)

### Admin Panel (RBAC)
![Admin Panel](screenshots/admin-panel.png)

### Document Management & Encryption
![Documents](screenshots/documents.png)
![Encrypted File](screenshots/encrypted-file.png)

### Integrity Verification
![Verify](screenshots/verify.png)

### Wireshark — HTTP vs HTTPS
![Wireshark HTTP](screenshots/wireshark-http.png)
![Wireshark HTTPS](screenshots/wireshark-https.png)

---

## ✅ Security Features

- 🔑 JWT Authentication & Authorization
- 🔒 Password Hashing with bcrypt (cost factor 12)
- 📋 Password Policy Enforcement
- 🐙 OAuth 2.0 Login via GitHub
- 📱 Two-Factor Authentication (TOTP + Google Authenticator)
- 👥 Role-Based Access Control (Admin / Manager / User)
- 🛡️ Document Encryption — AES-256-CBC
- ✍️ Digital Signatures — RSA-2048
- 🔍 Integrity Verification — SHA-256
- 🌐 HTTPS with SSL/TLS Certificates
- 🦈 MITM Traffic Analysis using Wireshark

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js + Express.js |
| Frontend | React.js + Vite |
| Database | PostgreSQL + Sequelize |
| Authentication | JWT + Passport.js |
| Encryption | AES-256-CBC + RSA-2048 |
| Password Hashing | bcryptjs |
| 2FA | Speakeasy + Google Authenticator |
| HTTPS | Self-signed SSL (mkcert) |

---

## 🚀 How to Run

### Prerequisites
- Node.js v20+
- PostgreSQL v15+
- Git

### 1. Clone the repository
```bash
git clone https://github.com/AndrewFarahSedky/Secure-Document-Vault-System.git
cd Secure-Document-Vault-System
```

### 2. Setup Database
- Open pgAdmin
- Create a database named `secure_vault`
- Run `database/schema.sql` in the Query Tool

### 3. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=secure_vault
DB_USER=postgres
DB_PASSWORD=your_postgres_password

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=https://localhost:5000/api/auth/github/callback

ENCRYPTION_KEY=12345678901234567890123456789012
FRONTEND_URL=https://localhost:5173
```

```bash
npm run dev
```

### 4. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Access

| Service | URL |
|---------|-----|
| Backend API | https://localhost:5000/api/health |
| Frontend | https://localhost:5173 |

---

## 👑 Default Admin Setup

After registering, run this SQL in pgAdmin to grant admin access:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your_email@example.com';
```

---

## 📄 Project Report

The full project report is available in the [`docs/`](docs/) folder.

---

## 🎓 Course Info

**Data Integrity and Authentication** — Spring 2026
Faculty of Computers and Data Science — Cyber Security
Alexandria National University