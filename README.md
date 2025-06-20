# 🚀 Codeforces Student Tracker

![Dashboard Preview](https://res.cloudinary.com/draw-app/image/upload/v1750327297/Screenshot_2025-06-19_153023_dt9xy7.png)

A powerful full-stack web application to track and analyze student performance on the [Codeforces](https://codeforces.com/) competitive programming platform. Designed for educators, mentors, and programming club admins to monitor student progress, identify strengths and weaknesses, and promote healthy competition.

---

## 📚 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Database Schema](#-database-schema)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running the App](#-running-the-app)  
- [Future Improvements](#-future-improvements)
- [License](#-license)
- [Contact](#-contact)

---

## 🌟 Features

### 👨‍🎓 Student Analytics
- Individual profiles with name, email, Codeforces handle, phone number
- Current and max rating
- Submission history with detailed filters

### 📈 Visual Performance
- Interactive line chart of rating changes
- Contest ranking overview with deltas
- Submission heatmaps for recent activity
- Problem-solving distribution by difficulty

### 🔄 Data Sync
- One-click sync from Codeforces API
- Cron-based background sync job
- Detect and handle Codeforces handle changes

### 🛠️ Admin Features
- CRUD operations for student records
- CSV export for offline analysis
- Toggle email reminders for inactive users
- Track last sync time and reminder counts

### 🧠 Smart Filtering
- Filter contests or submissions by time: 7, 30, or 90 days
- Analyze inactive users
- Difficulty & verdict analytics

---

## 🏗 Architecture
Frontend (React + Vite + Recharts)
-- Axios Calls
↓
Backend (Express.js + Prisma + JWT)
-- Prisma ORM
↓
Database (PostgreSQL / SQLite)
 -- Cron Sync (Student <-> Codeforces API)


---

## 🛠 Tech Stack

### 🌐 Frontend
- **React** + **Vite** for fast SPA development
- **TypeScript** for type safety
- **Tailwind CSS** for modern styling
- **Recharts** for interactive data visualization
- **Axios** for REST API communication

### 🖥 Backend
- **Node.js** + **Express** for server and API handling
- **Prisma ORM** for DB access and migrations
- **JWT** for secure authentication
- **Nodemailer** (optional) for sending email reminders
- **node-cron** for scheduling background sync

### 🗃 Database
- PostgreSQL (recommended) or SQLite (for quick start)
- Prisma Migrations to manage schema

---

## 🗃️ Database Schema (Prisma)

```prisma
model Student {
  id                      String   @id @default(uuid())
  name                    String
  email                   String   @unique
  phoneNumber             String
  codeforcesHandle        String   @unique
  currentRating           Int      @default(0)
  maxRating               Int      @default(0)
  lastSyncedAt            DateTime?
  inactiveReminders       Int      @default(0)
  emailRemindersEnabled   Boolean  @default(true)
}
```
---
## 📦 Installation
✅ Prerequisites
Node.js (v16+)
npm (v8+)
PostgreSQL (or SQLite for local setup)

### 🔧 Setup# Clone the repository
```
git clone https://github.com/nitingupta95/SPMS
cd SPMS
```
### ⚙️ Environment Variables
Create a .env file inside the /backend directory with the following:
```
DATABASE_URL="your_postgres_or_sqlite_connection_string"
REMINDER_EMAIL="your_email@gmail.com"
REMINDER_PASS="your_email_password_or_app_password"
JWT_SECRET="your_jwt_secret_key"
 ```
### ▶️ Running the App
Backend
```
cd backend
npm install
# Apply Prisma migrations
cd src/prisma
npx prisma migrate dev
cd ../../
npm start
```
 
 
Frontend
```
cd frontend
npm install
npm run dev
```
---
## 📌 Future Improvements
 - Add charts comparing students in a leaderboard
 - Telegram/Slack alerts for new contests
 - Daily/Weekly performance digests
 - Integration with LeetCode, AtCoder
 - Admin dashboard for managing multiple cohorts
 - Historical rating recovery and contest import
---
📜 License
MIT License © nitingupta95
---
📫 Contact
Feel free to connect:
---
<p className="text-base font-normal"><strong>GitHub:</strong> @nitingupta95</p>
<p className="text-base font-normal"><strong>Email:</strong> ng61315@gmail.com</p>

