import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";

export default function App() {
  // 1. Change to State so it can be updated
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        {/* Redirect to Home if already logged in, else show Auth */}
        <Route 
          path="/auth" 
          element={isAuthenticated ? <Navigate to="/" /> : <Auth onLogin={handleLogin} />} 
        />
        
        {/* Protected Home Route */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Home onLogout={handleLogout} /> : <Navigate to="/auth" />} 
        />

        {/* Catch-all: Redirect to Auth */}
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
}
