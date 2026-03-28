import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Auth() {
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
      if (isLogin) {
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (loginError) throw loginError;
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        });
        if (signUpError) throw signUpError;
        alert("Check your email for the confirmation link!");
      }
      
      navigate("/");
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
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
        <p style={{ textAlign: "center", marginBottom: "2rem", fontWeight: 700, opacity: 0.8 }}>
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
            <div style={{ 
              background: "var(--color-peach)", 
              border: "var(--border-thick)",
              borderRadius: "10px",
              padding: "10px",
              marginBottom: "1.5rem" 
            }}>
              <p style={{ color: "var(--color-text)", fontWeight: 800, textAlign: "center", margin: 0 }}>
                {error}
              </p>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={isLoading}>
            {isLoading ? "Processing..." : (isLogin ? "Login Now" : "Sign Up")}
          </button>
          
          <div className="dashed-divider" style={{ margin: "2rem 0" }}></div>

          <p style={{ textAlign: "center", fontWeight: 700, fontSize: "0.9rem" }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <span 
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              style={{ color: "var(--color-text)", background: "var(--color-yellow)", padding: "2px 8px", borderRadius: "8px", border: "2px solid var(--color-text)", cursor: "pointer" }}
            >
              {isLogin ? "Sign Up" : "Log In"}
            </span>
          </p>
        </form>
      </div>
    </main>
  );
}
