# ⏳ WaitWise - Smart Virtual Queue & Wait-Time Management System
> **Cypher Verse 5 / HackHer Hackathon 2026**

WaitWise eliminates physical queues across hospitals, banks, DMVs, and restaurants with real-time virtual queue ticketing, live countdowns, sound announcements, and staff triage dashboards.

---

## 📁 Repository Structure
```
WaitWise/
│
├── frontend/                 ← FRONTEND (React 18 + Vite)
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── QueueCard.jsx
│   │   │   ├── TokenCard.jsx
│   │   │   ├── StatCard.jsx
│   │   │   └── Loading.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Locations.jsx
│   │   │   ├── JoinQueue.jsx
│   │   │   ├── MyQueue.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── Analytics.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  ← BACKEND (Teammates)
├── README.md
└── .gitignore
```

---

## 🚀 How to Run the Frontend Locally

```bash
# 1. Navigate to the frontend directory
cd HackHer-main/WaitWise/frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The application will run at: `http://localhost:5173`

---

## 🌟 Key Features
- **Live Virtual Queues**: Remote token generation with priority categorization.
- **Real-Time Progress**: Live tracking of position ("X people ahead"), wait countdown, and digital QR passes.
- **Audio Chime System**: Synthesized Web Audio API announcements when a customer's token is called.
- **Admin Control Board**: 1-click "Call Next", "Mark Served", "Skip No-Show", and walk-in customer support.
- **Operations Analytics**: Peak-hour heatmaps, department load charts, and CSV report export.
- **Dark/Light Mode**: Sleek modern UI design system.
