import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <main style={{ 
      display: "flex", 
      flexDirection: "column",
      alignItems: "center", 
      justifyContent: "center", 
      minHeight: "100vh",
      padding: "20px"
    }}>
      <div className="card" style={{ maxWidth: "600px", width: "100%", textAlign: "center" }}>
        <h1>Welcome to GigB! 🏠</h1>
        <p style={{ fontWeight: 600, marginBottom: "2rem" }}>You are logged in successfully.</p>
        
        <button 
          className="btn btn-secondary" 
          onClick={() => navigate("/auth")}
        >
          Logout
        </button>
      </div>
    </main>
  );
}
