import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // 1. Basic Validation (Logic Behavior)
    if (!email || !password) {
      setError("Please fill in all fields!");
      return;
    }

    // 2. Call the Login handler from App.jsx
    onLogin();
    
    // 3. Success -> Redirect to Home
    navigate("/");
  };

  return (
    <main style={{ 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      minHeight: "100vh",
      padding: "20px"
    }}>
      <div className="card" style={{ maxWidth: "420px", width: "100%" }}>
        <h1 style={{ textAlign: "center", marginBottom: "0.5rem" }}>
          {isLogin ? "Welcome Back!" : "Join GigB"}
        </h1>
        <p style={{ textAlign: "center", marginBottom: "2rem", fontWeight: 600, color: "#666" }}>
          {isLogin ? "Login to your account" : "Create a new account to start"}
        </p>

        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div style={{ marginBottom: "1.2rem" }}>
            <label className="text-small" style={{ display: "block", marginBottom: "0.5rem" }}>EMAIL</label>
            <input 
              type="email" 
              placeholder="hello@gigb.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ borderColor: error && !email ? "var(--color-primary)" : "" }}
            />
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label className="text-small" style={{ display: "block", marginBottom: "0.5rem" }}>PASSWORD</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ borderColor: error && !password ? "var(--color-primary)" : "" }}
            />
          </div>

          {/* Error Message */}
          {error && (
            <p style={{ 
              color: "var(--color-primary)", 
              fontWeight: 700, 
              textAlign: "center", 
              marginBottom: "1rem" 
            }}>
              {error}
            </p>
          )}

          {/* Primary CTA */}
          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginBottom: "1rem" }}>
            {isLogin ? "Login Now" : "Sign Up"}
          </button>

          {/* Toggle Mode */}
          <p style={{ textAlign: "center", fontWeight: 600, fontSize: "0.9rem" }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <span 
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              style={{ color: "var(--color-primary)", cursor: "pointer", textDecoration: "underline" }}
            >
              {isLogin ? "Sign Up" : "Log In"}
            </span>
          </p>
        </form>
      </div>
    </main>
  );
}
