import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAuthenticated) return null;

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  return (
    <nav className="navbar" style={{ marginBottom: "40px" }}>
      <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => navigate("/")}>
        <img src="/logo.png" alt="GigB Logo" className="navbar-logo" />
      </div>

      <div className="navbar-links">
        {location.pathname !== "/" && (
          <Link to="/" className="navbar-link">Dashboard</Link>
        )}
        {location.pathname !== "/tasks" && (
          <Link to="/tasks" className="navbar-link">Tasks</Link>
        )}
        {location.pathname !== "/post-task" && (
          <Link to="/post-task" className="navbar-link">Post</Link>
        )}
        <button 
          onClick={handleLogout} 
          style={{ 
            background: "none", 
            border: "none", 
            cursor: "pointer", 
            fontWeight: 700, 
            color: "var(--color-primary)",
            padding: "5px 10px",
            borderLeft: "2px solid #eee",
            marginLeft: "5px"
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
