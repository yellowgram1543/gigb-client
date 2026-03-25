import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password || (!isLogin && !name)) {
      setError("Please fill in all fields!");
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const payload = isLogin ? { email, password } : { name, email, password };
      
      const response = await api.post(endpoint, payload);
      
      // Call the Login handler from App.jsx/authStore
      onLogin(response.data);
      
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
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
          {!isLogin && (
            <div style={{ marginBottom: "1.2rem" }}>
              <label className="text-small" style={{ display: "block", marginBottom: "0.5rem" }}>NAME</label>
              <input 
                type="text" 
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div style={{ marginBottom: "1.2rem" }}>
            <label className="text-small" style={{ display: "block", marginBottom: "0.5rem" }}>EMAIL</label>
            <input 
              type="email" 
              placeholder="hello@gigb.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label className="text-small" style={{ display: "block", marginBottom: "0.5rem" }}>PASSWORD</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

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

          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginBottom: "1rem" }} disabled={isLoading}>
            {isLoading ? "Processing..." : (isLogin ? "Login Now" : "Sign Up")}
          </button>

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
