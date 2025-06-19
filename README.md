# 🚀 Codeforces Student Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![Dashboard Preview](https://res.cloudinary.com/draw-app/image/upload/v1750327297/Screenshot_2025-06-19_153023_dt9xy7.png)

A comprehensive full-stack solution for tracking and analyzing student performance on Codeforces competitive programming platform.

## 🌟 Key Features

### 📊 Student Analytics
- **Profile Management**: Track names, emails, Codeforces handles, and contact info
- **Rating History**: Visualize current/max ratings with trend analysis
- **Submission Insights**: Filter by time period, difficulty, and verdict

### 🔄 Automated Sync
- One-click synchronization with Codeforces API
- Background cron jobs for regular updates
- Handle change detection system

### 📈 Visualization Tools
- Interactive rating progression charts
- Submission heatmaps and activity graphs
- Problem-solving distribution by difficulty

### ⚙️ Admin Controls
- Complete CRUD operations for student records
- CSV export functionality
- Configurable email reminders for inactive users

## 🏗 System Architecture
![Architecture Diagram](https://res.cloudinary.com/draw-app/image/upload/v1750327300/Screenshot_2025-06-19_153023_dt9xy7.png)


Frontend (React) → Backend (Node.js/Express) → Database (PostgreSQL)
↑ ↑
User Browser Codeforces API



## 🛠 Technology Stack

| Component       | Technologies Used                     |
|-----------------|---------------------------------------|
| **Frontend**    | React, TypeScript, Tailwind CSS, Vite |
| **Backend**     | Node.js, Express, Prisma ORM          |
| **Database**    | PostgreSQL (SQLite for development)   |
| **Auth**        | JWT Authentication                    |
| **DevOps**      | Docker, GitHub Actions                |

## 🗃 Database Schema

```prisma
model Student {
  id                    String   @id @default(uuid())
  name                  String
  email                 String   @unique
  phoneNumber           String
  codeforcesHandle      String   @unique
  currentRating         Int      @default(0)
  maxRating             Int      @default(0)
  lastSyncedAt          DateTime?
  inactiveReminders     Int      @default(0)
  emailRemindersEnabled Boolean  @default(true)
}



🚀 Getting Started
Prerequisites
Node.js v16+

npm v8+

PostgreSQL (or SQLite for development)

Installation
1. Clone the repository
git clone https://github.com/nitingupta95/SPMS
cd SPMS
2.Set up backend:
cd backend
npm install
3. Configure environment variables:
cp .env.example .env 
4. Run database migrations:
npx prisma migrate dev
5.Start the backend server:
npm run dev
6. Start the frontend:
cd frontend
npm install
npm run dev


⚙️ Configuration
Required environment variables (backend/.env):
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
JWT_SECRET="your_random_secret_key_here"

# Optional for email features:
REMINDER_EMAIL="your.email@provider.com"
REMINDER_PASS="your_app_specific_password"



📸 Application Screenshots
https://res.cloudinary.com/draw-app/image/upload/v1750327297/Screenshot_2025-06-19_153023_dt9xy7.png

(Additional screenshots will be added in future updates)

🔮 Roadmap & Future Features
Multi-platform integration (LeetCode, AtCoder)

Advanced comparative analytics

Team/group management

Mobile application version

Contest reminder system

Docker containerization



🤝 Contributing
Fork the project

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📜 License
Distributed under the MIT License. See LICENSE for more information.

📫 Contact
Nitin Gupta - @nitingupta95 - ng61315@gmail.com

Project Link: https://github.com/nitingupta95/SPMS

text

This version includes:
1. Proper Markdown formatting throughout
2. Clear section organization
3. Consolidated installation instructions
4. Improved visual hierarchy
5. Added badges and proper links
6. Contribution guidelines
7. Complete contact information
8. Roadmap section
9. License information
10. Responsive table layout for tech stack

The file is now ready to use as your project's main README.md.
 

This version includes:
1. Proper Markdown formatting throughout
2. Clear section organization
3. Consolidated installation instructions
4. Improved visual hierarchy
5. Added badges and proper links
6. Contribution guidelines
7. Complete contact information
8. Roadmap section
9. License information
10. Responsive table layout for tech stack
 