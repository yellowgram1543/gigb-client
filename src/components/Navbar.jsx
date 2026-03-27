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
    <nav className="navbar">
      <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => navigate("/")}>
        <img src="/logo.png" alt="GigB Logo" className="navbar-logo" />
      </div>

      <div className="navbar-links">
        <Link to="/" className={`navbar-link ${location.pathname === "/" ? "active" : ""}`}>
          Dashboard
        </Link>
        <Link to="/tasks" className={`navbar-link ${location.pathname === "/tasks" ? "active" : ""}`}>
          Tasks
        </Link>
        <Link to="/post-task" className={`navbar-link ${location.pathname === "/post-task" ? "active" : ""}`}>
          Post
        </Link>
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
