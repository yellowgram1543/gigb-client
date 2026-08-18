# GigB Client

GigB is a full-stack neighborhood gig platform. This repository contains the React frontend and an Express + Socket.io backend under `server/`.

## Features

- Supabase-based authentication
- Task posting and browsing workflow
- Real-time task chat with Socket.io
- Map/location UI with Leaflet

## Tech Stack

### Frontend

- React (Vite)
- React Router
- Zustand
- Supabase JS
- Axios
- Framer Motion
- React Leaflet
- Socket.io Client

### Backend (`server/`)

- Node.js + Express
- MongoDB + Mongoose
- Socket.io
- JSON Web Token verification with JWKS (`jwks-rsa`)

## Getting Started

### 1) Install dependencies

From the repository root:

```bash
npm install
cd server && npm install
```

### 2) Configure environment variables

Create `/home/runner/work/gigb-client/gigb-client/.env`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:5000/api
```

Create `/home/runner/work/gigb-client/gigb-client/server/.env` (or copy from `server/.env.example`):

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
SUPABASE_URL=your_supabase_project_url
SUPABASE_JWT_SECRET=your_supabase_jwt_secret
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```

### 3) Run locally

Start frontend (root):

```bash
npm run dev
```

Start backend (`server/`):

```bash
cd server
npm run dev
```

## Available Scripts

### Root

- `npm run dev` – start Vite dev server
- `npm run build` – create production build
- `npm run preview` – preview production build

### `server/`

- `npm run dev` – start server with nodemon
- `npm start` – start server with Node

## Deployment Notes

- Frontend is configured for SPA routing via `vercel.json`.
- Set matching frontend/backend environment variables on your hosting platforms.
- Backend start command is `node index.js`.
