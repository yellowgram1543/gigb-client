# GigB - Neighborhood Gig Platform 🚀

**GigB** is a modern, full-stack gig-economy application (similar to TaskRabbit) that connects people who need help with local "Helpers" in their neighborhood. It features real-time communication, location-based task discovery, and secure authentication.

---

## ✨ Features

- 🔐 **Secure Authentication**: Production-ready auth via **Supabase** (Email verification, password resets).
- 📍 **Location-Aware**: Integrated **Leaflet Maps** for picking task locations and browsing nearby gigs.
- 💬 **Real-time Chat**: Dedicated chat rooms for every task powered by **Socket.io**.
- 📋 **Task Lifecycle**: Post tasks, browse listings, and track progress from "OPEN" to "COMPLETED".
- 💳 **Payments Flow**: Integrated prototype for handling gig transactions.
- 🎨 **Modern UI**: Smooth animations with **Framer Motion** and a responsive, card-based design.

---

## 🛠️ Tech Stack

### **Frontend**
- **React 19** (Vite)
- **Zustand** (Global State Management)
- **Supabase SDK** (Identity Provider)
- **Leaflet / React-Leaflet** (Maps & Geolocation)
- **Socket.io-client** (Real-time Messaging)
- **Framer Motion** (Animations)
- **Axios** (API Requests)

### **Backend**
- **Node.js & Express**
- **MongoDB & Mongoose** (Persistent Data)
- **Socket.io** (WebSocket Server)
- **JWT (JsonWebToken)** (Supabase Token Verification)

---

## 🚀 Getting Started

### **1. Clone & Install**
```bash
# Clone the repository
git clone https://github.com/yourusername/gigb-client.git
cd gigb-client

# Install Frontend dependencies
npm install

# Install Backend dependencies
cd server
npm install
```

### **2. Environment Setup**
Create a `.env` file in the **root** folder:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:5000/api
```

Create a `.env` file in the **server/** folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
SUPABASE_JWT_SECRET=your_supabase_jwt_secret
```

### **3. Run Locally**
**Terminal 1 (Frontend):**
```bash
npm run dev
```

**Terminal 2 (Backend):**
```bash
cd server
npm run dev
```

---

## 🌐 Deployment

### **Frontend (Vercel)**
- Ensure `vercel.json` is present for SPA routing.
- Add `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_API_URL` to Vercel Environment Variables.
- **Note:** `VITE_API_URL` must point to your live Render/Heroku backend URL.

### **Backend (Render)**
- Set the environment variables in the Render dashboard.
- Ensure the `Start Command` is set to `node index.js`.

---

## 📁 Project Structure

```text
├── server/             # Express API & Socket.io logic
│   ├── middleware/     # Supabase JWT Auth Middleware
│   ├── models/         # Mongoose User/Task/Message Schemas
│   └── routes/         # API Endpoints
├── src/                # React Frontend
│   ├── components/     # Reusable UI (Maps, Cards, Buttons)
│   ├── pages/          # Full-page views (Auth, Home, Chat)
│   ├── store/          # Zustand State (Auth/Tasks)
│   └── supabaseClient.js # Supabase configuration
└── vercel.json         # Vercel SPA Routing config
```

---

## 🛡️ License
Distributed under the ISC License. See `LICENSE` for more information.
