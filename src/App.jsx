import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import PostTask from "./pages/PostTask";
import TaskList from "./pages/TaskList";
import TaskDetail from "./pages/TaskDetail";
import Payment from "./pages/Payment";

export default function App() {
  // Persistence: Check localStorage on first load
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  }); 

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isLoggedIn");
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/auth" 
          element={isAuthenticated ? <Navigate to="/" /> : <Auth onLogin={handleLogin} />} 
        />
        
        <Route 
          path="/" 
          element={isAuthenticated ? <Home onLogout={handleLogout} /> : <Navigate to="/auth" />} 
        />

        <Route 
          path="/post-task" 
          element={isAuthenticated ? <PostTask /> : <Navigate to="/auth" />} 
        />

        <Route 
          path="/tasks" 
          element={isAuthenticated ? <TaskList /> : <Navigate to="/auth" />} 
        />

        <Route 
          path="/task/:id" 
          element={isAuthenticated ? <TaskDetail /> : <Navigate to="/auth" />} 
        />

        <Route 
          path="/payment/:id" 
          element={isAuthenticated ? <Payment /> : <Navigate to="/auth" />} 
        />

        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
}
