import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";

export default function App() {
  // Simple check for "logged in" state (mocking for now)
  const isAuthenticated = false; 

  return (
    <Router>
      <Routes>
        {/* Redirect to Home if already logged in, else show Auth */}
        <Route 
          path="/auth" 
          element={isAuthenticated ? <Navigate to="/" /> : <Auth />} 
        />
        
        {/* Protected Home Route */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Home /> : <Navigate to="/auth" />} 
        />

        {/* Catch-all: Redirect to Auth */}
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
}
