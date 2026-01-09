# 🗺️ HushMap - Urban Noise Awareness & Quiet-Zone Mapping Application

![HushMap Banner](./frontend/src/assets/hero-quiet-city.jpg)

## 📋 Project Overview

**HushMap** is a crowd-sourced urban noise awareness web application that helps users identify noise-polluted and quiet zones in cities. Users can log noise levels at different locations and times, creating a comprehensive noise map that helps students, remote workers, and elderly people find peaceful areas.

### Key Features

- 🎯 **Interactive Noise Map** - Real-time visualization of noise levels across the city
- 📊 **Noise Reporting** - Submit noise reports with location, decibel level, and source
- 🌳 **Quiet Zones Discovery** - Find and rate peaceful locations for work and relaxation
- 📈 **Analytics Dashboard** - View noise patterns, trends, and hotspots
- 🔐 **User Authentication** - Secure registration and login system
- ⚡ **Real-time Updates** - WebSocket integration for live noise reports
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

---

## 🏗️ Architecture

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui (Radix UI components)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v6
- **Maps**: Leaflet + React Leaflet
- **Charts**: Recharts
- **Animations**: Framer Motion
- **State Management**: TanStack Query
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js + TypeScript
- **Database**: SQLite with better-sqlite3
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: WebSocket (ws library)
- **Validation**: express-validator
- **Password Hashing**: bcryptjs

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HushMap
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install --legacy-peer-deps
   ```

### Running the Application

#### Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:5000`
- HTTP API: `http://localhost:5000/api`
- WebSocket: `ws://localhost:5000/ws`

#### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:8080`

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Noise Reports
- `POST /api/reports` - Submit noise report
- `GET /api/reports` - Get all reports (with filters)
- `GET /api/reports/nearby?latitude=X&longitude=Y&radius=Z` - Get nearby reports
- `GET /api/reports/:id` - Get specific report
- `DELETE /api/reports/:id` - Delete own report (requires auth)

### Quiet Zones
- `GET /api/zones` - Get all quiet zones
- `GET /api/zones/nearby?latitude=X&longitude=Y&radius=Z` - Get nearby zones
- `GET /api/zones/:id` - Get specific zone
- `POST /api/zones` - Create quiet zone (requires auth)
- `POST /api/zones/:id/rate` - Rate a zone (requires auth)

### Analytics
- `GET /api/analytics/hourly` - Hourly noise patterns
- `GET /api/analytics/weekly` - Weekly statistics
- `GET /api/analytics/sources` - Noise source distribution
- `GET /api/analytics/hotspots` - Noisiest locations
- `GET /api/analytics/city-stats` - Overall city statistics

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Noise Reports Table
```sql
CREATE TABLE noise_reports (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  decibel_level INTEGER NOT NULL,
  noise_category TEXT NOT NULL,
  noise_source TEXT,
  description TEXT,
  timestamp DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
)
```

### Quiet Zones Table
```sql
CREATE TABLE quiet_zones (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  avg_decibels INTEGER,
  rating REAL DEFAULT 0,
  description TEXT,
  amenities TEXT,
  best_time TEXT,
  created_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
)
```

---

## 🌐 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
DATABASE_PATH=./data/hushmap.db
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=ws://localhost:5000/ws
```

---

## 📂 Project Structure

```
HushMap/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── database.ts      # Database connection
│   │   │   └── schema.ts        # Schema & seeding
│   │   ├── middleware/
│   │   │   └── auth.ts          # JWT authentication
│   │   ├── routes/
│   │   │   ├── auth.ts          # Auth routes
│   │   │   ├── reports.ts       # Noise reports routes
│   │   │   ├── zones.ts         # Quiet zones routes
│   │   │   └── analytics.ts     # Analytics routes
│   │   └── server.ts            # Express server
│   ├── data/                    # SQLite database
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/          # Layout components
│   │   │   ├── map/             # Map components
│   │   │   ├── noise/           # Noise-related components
│   │   │   └── ui/              # shadcn/ui components
│   │   ├── pages/
│   │   │   ├── Index.tsx        # Landing page
│   │   │   ├── NoiseMap.tsx     # Interactive map
│   │   │   ├── ReportNoise.tsx  # Report submission
│   │   │   ├── QuietZones.tsx   # Browse quiet zones
│   │   │   ├── Analytics.tsx    # Analytics dashboard
│   │   │   ├── Login.tsx        # Login page
│   │   │   └── Register.tsx     # Registration page
│   │   ├── services/
│   │   │   └── api.ts           # API service layer
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---

## 🎨 Features in Detail

### 1. Interactive Noise Map
- Real-time visualization using Leaflet
- Color-coded markers based on noise levels
- Click markers to view detailed information
- Filter by time period and noise level

### 2. Noise Reporting
- Select location on map
- Choose noise category (Quiet, Moderate, Loud, Very Loud)
- Adjust decibel level with slider
- Select noise source (Traffic, Construction, Events, etc.)
- Add optional description

### 3. Quiet Zones
- Browse curated quiet locations
- Filter by type (Park, Library, Café, Workspace, Nature)
- Sort by distance, rating, or quietness
- Rate and review zones
- View amenities and best times to visit

### 4. Analytics Dashboard
- Hourly noise patterns (area chart)
- Weekly statistics (bar chart)
- Noise source distribution (pie chart)
- Top noisy locations
- City-wide statistics

### 5. Real-time Updates
- WebSocket connection for live noise reports
- Automatic map updates when new reports are submitted
- Connection status indicator

---

## 🔒 Security

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: express-validator for all endpoints
- **CORS**: Configured for frontend-backend communication
- **SQL Injection Prevention**: Parameterized queries with better-sqlite3

---

## 🚧 Future Enhancements

- [ ] User profiles and dashboards
- [ ] Photo uploads for noise reports
- [ ] Push notifications for nearby noise events
- [ ] Heat map visualization
- [ ] Marker clustering for dense areas
- [ ] Export data functionality (CSV, PDF)
- [ ] PWA capabilities for mobile app-like experience
- [ ] Social features (comments, sharing)
- [ ] Admin dashboard for moderation
- [ ] Multi-language support

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📞 Support

For support, please open an issue in the GitHub repository.

---

**Built with ❤️ for creating quieter, more livable cities**
