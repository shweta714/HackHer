# 🚀 WAITWISE — Smart Queue Intelligence System
> **"Stop Waiting. Start Living."**

WAITWISE is a production-quality, real-time **Smart Queue Intelligence System** engineered for high-traffic environments like College Canteens, clinics, and service desks. It solves the everyday problem of physical queue congestion by letting users join a digital line, receive live predictive ETAs, and walk over only when their turn is near.

---

## ✨ Key Features

### 👤 Student / User Experience
- **1-Tap Digital Token**: Join the queue from anywhere on campus (library, classroom, hostel).
- **Predictive Live ETA**: Dynamic calculation engine computes exact waiting minutes using active counters and service velocity.
- **Real-Time Position Tracker**: Live sync via Socket.IO — watch your position update without manual page reloads.
- **Smart Near-Turn Alerts 🔔**: Visual pulse + gentle audio chime triggers when you are 3–5 minutes or $\le 2$ positions away.
- **Turn Celebration 🎉**: High-visibility collection screen with fanfare & confetti when your token is being served.

### 🛡️ Admin Command Center
- **Prominent "SERVE NEXT" Action**: 1-click token dispatch that completes the current order, advances the queue, and broadcasts real-time recalculations to all screens instantly.
- **Live Counter Controls**: Dynamically adjust the number of active counters and average service speeds on the fly.
- **Hackathon Demo Utilities**:
  - 🚀 **Seed Demo Queue**: Pre-loads token `#12` serving and `#13`–`#17` waiting for instant demonstrations.
  - 🔄 **Reset Queue**: Clears all active tokens for clean restarts.
- **Queue Analytics**: Real-time throughput metrics, peak rush hour indicators, and estimated physical waiting time saved.

### 🤖 Machine Learning (ML) Content-Based Recommender
- **Cosine Similarity Engine**: Computes exact mathematical Cosine Similarity ($\frac{\vec{A} \cdot \vec{B}}{\|\vec{A}\| \cdot \|\vec{B}\|}$) across multidimensional binary feature vectors derived from canteen counter attributes and tags.
- **Similar Counter Discovery**: When viewing any counter, displays 3–5 similar alternatives with **Match Percentages**, **Matching Tags**, and **Predicted Wait Times**.
- **Interactive Recalculation**: Clicking any recommended counter dynamically updates the recommendation list for that newly selected counter.

### ☀️ / 🌙 Light Mode & Dark Mode Dual Theme
- **1-Click Theme Toggle**: Fast animated Sun/Moon toggle in the navigation bar.
- **Tailwind Class-Based Theme Switching**: Comprehensive theme tokens with glassmorphism across both light and dark modes.
- **Persistent Preferences**: Saves selected theme in `localStorage` (`waitwise_theme`) with Dark Mode as default.
- **Smooth CSS Transitions**: Zero harsh flashes or layout shifts during theme transitions.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React (Vite), Tailwind CSS, Lucide React, Canvas Confetti, Web Audio API |
| **Backend** | Node.js, Express.js, Socket.IO, CORS, Dotenv |
| **ML Engine** | Content-Based Cosine Similarity Vector Space Recommender (Pure JS Math) |
| **Database** | MongoDB with Mongoose + Automatic High-Performance In-Memory Fallback Engine |
| **Communication**| Full-Duplex WebSockets (Socket.IO) + REST API fallback |

---

## 📐 Machine Learning & ETA Logic

### 1. Content-Based Cosine Similarity:
$$\text{Cosine Similarity}(\vec{A}, \vec{B}) = \frac{\vec{A} \cdot \vec{B}}{\|\vec{A}\|_2 \times \|\vec{B}\|_2} = \frac{\sum_{i=1}^{|V|} A_i B_i}{\sqrt{\sum_{i=1}^{|V|} A_i^2} \times \sqrt{\sum_{i=1}^{|V|} B_i^2}}$$

### 2. Predicted Wait Time Engine:
$$\text{Predicted Wait (min)} = \left\lceil \frac{\text{People Ahead} \times \text{Average Service Time}}{\text{Active Counters}} \times \text{Load Factor} \right\rceil$$

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm**

### 2. Installation
Run the following command in the project root to install all dependencies:
```bash
npm run install-all
```

*(Or install individually: `npm install`, `cd server && npm install`, `cd client && npm install`)*

### 3. Run the Application
Start both the backend server and frontend client concurrently:
```bash
npm run dev
```

- **Frontend Client**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 📱 Application Pages & Routes

| Route | Page Description |
|---|---|
| `/` | **Landing Page** with hero, live queue preview, and Counter Explorer. |
| `/service/:serviceId` | **Service Details & ML Recommender** with live queue load & Cosine Similarity matches. |
| `/login` | **Authentication Portal** with dual-role (Staff & Student) tabs and 1-click demo logins. |
| `/join` | **Join Queue Page** with canteen selection, meal category, and token generator. |
| `/queue/:tokenNumber` | **Live User Dashboard** with real-time ETA, position, and near-turn notifications. |
| `/admin` | **Admin Command Center** with the **SERVE NEXT** button and counter controls. |
| `/admin/analytics` | **Analytics Page** showing throughput, rush hours, and time saved. |

---

## 🔑 Demo Login Credentials

You can use the 1-click login buttons on `/login` or enter the following:
- **Canteen Staff / Admin**: `admin@waitwise.com` / `admin123`
- **Student User**: `student.riya@waitwise.com` / `student123`

---

## 🔌 API Endpoints Reference

### Machine Learning & Services
- `GET /api/services` — List all 8 canteen counters with live crowd and predicted ETA.
- `GET /api/services/:serviceId` — Get single counter details and queue metrics.
- `GET /api/services/:serviceId/recommendations` — Compute top 3–5 similar counters via Cosine Similarity.

### Authentication
- `POST /api/auth/login` — Authenticate as Admin or Student.
- `GET /api/auth/me` — Verify active session.

### Queue Operations
- `POST /api/queue/join` — Join the digital queue and receive a token.
- `GET /api/queue/status/:locationId` — Retrieve current queue load and waiting list.
- `POST /api/queue/serve-next/:locationId` — Advance the queue and mark current token completed.
- `PUT /api/queue/config/:locationId` — Update active counters or average service time.
- `POST /api/queue/seed/:locationId` — Pre-populate demo dataset (#12 serving, #13-#17 waiting).
- `POST /api/queue/reset/:locationId` — Reset queue to empty state.
- `GET /api/queue/analytics/:locationId` — Get analytics and throughput stats.

### Token Operations
- `GET /api/token/:tokenNumber` — Fetch individual token position, ETA, and status.
- `DELETE /api/token/:tokenNumber` — Cancel token and exit queue.

---

## 💡 Built for HackHer 2026
Designed and built for rapid, reliable demonstration and seamless user experience.
