# Codeforces Student Tracker 🚀

![Dashboard Preview](https://i.imgur.com/JQZ1l7a.png) <!-- Replace with actual screenshot -->

A powerful dashboard to track and analyze student performance on Codeforces competitive programming platform with rich visualizations and automatic data synchronization.

## 🌟 Features

### Student Analytics
- 📊 Comprehensive profile overview (ratings, contest history, submissions)
- 📈 Interactive rating progression charts
- 🏆 Contest performance tracking with rank/rating changes
- 🔍 Detailed problem-solving statistics

### Data Management
- 🔄 One-click Codeforces data synchronization
- ⏱️ Time-based filtering (7/30/90 days)
- 📂 Submission heatmap visualization
- 📉 Problem difficulty distribution analysis

### Technical Highlights
- 🚀 Real-time data updates
- 📱 Responsive design
- 🔐 Secure API endpoints
- 📦 Prisma ORM for database management

## 🛠 Tech Stack

**Frontend**  
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![Recharts](https://img.shields.io/badge/Recharts-FF6384?style=for-the-badge&logo=chart.js)

**Backend**  
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma) 

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm (v8+)
- PostgreSQL (optional, SQLite included by default)

### Installation
```bash
# Clone the repository
git clone https://github.com/nitingupta95/SPMS;
cd SPMS

# Install dependencies
cd backend/src/prisma && npx prisma migrate dev
cd backend && npm install
cd ../frontend && npm install

# Set up environment variables
cd backend/.env.
 
DATABASE_URL= "your_database_url"
REMINDER_EMAIL=""
REMINDER_PASS=""

JWT_SECRET=""
