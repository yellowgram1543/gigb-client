import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PostTask() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    budget: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // 1. Validation Logic
    if (!formData.title || !formData.description || !formData.address || !formData.budget) {
      setError("Oops! All fields are required. 🛑");
      return;
    }

    if (isNaN(formData.budget) || parseFloat(formData.budget) <= 0) {
      setError("Please enter a valid budget amount. 💰");
      return;
    }

    // 2. Create Task Object (Concept)
    const newTask = {
      ...formData,
      status: "open",
      createdAt: new Date().toISOString()
    };

    console.log("Saving Task:", newTask);

    // 3. Mock Success -> Go back to Home
    navigate("/");
  };

  return (
    <main style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      
      {/* Back Button */}
      <button 
        onClick={() => navigate("/")} 
        style={{ 
          background: "none", 
          border: "none", 
          fontWeight: 700, 
          cursor: "pointer", 
          marginBottom: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "5px"
        }}
      >
        ← Back to Dashboard
      </button>

      <div className="card">
        <h1>Post a Task ➕</h1>
        <p style={{ fontWeight: 600, color: "#666", marginBottom: "2rem" }}>
          Fill in the details to find someone to help you.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div style={{ marginBottom: "1.2rem" }}>
            <label className="text-small" style={{ display: "block", marginBottom: "0.5rem" }}>TASK TITLE</label>
            <input 
              name="title"
              placeholder="e.g., Deliver groceries" 
              value={formData.title}
              onChange={handleChange}
              style={{ borderColor: error && !formData.title ? "var(--color-primary)" : "" }}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: "1.2rem" }}>
            <label className="text-small" style={{ display: "block", marginBottom: "0.5rem" }}>DESCRIPTION</label>
            <textarea 
              name="description"
              placeholder="Describe what needs to be done..." 
              value={formData.description}
              onChange={handleChange}
              style={{ 
                height: "100px",
                borderColor: error && !formData.description ? "var(--color-primary)" : "" 
              }}
            />
          </div>

          {/* Address - Made into a bigger box (textarea) */}
          <div style={{ marginBottom: "2rem" }}>
            <label className="text-small" style={{ display: "block", marginBottom: "0.5rem" }}>ADDRESS</label>
            <textarea 
              name="address"
              placeholder="Enter your full address here..." 
              value={formData.address}
              onChange={handleChange}
              style={{ 
                height: "100px",
                borderColor: error && !formData.address ? "var(--color-primary)" : "" 
              }}
            />
          </div>

          {/* Budget Row */}
          <div style={{ marginBottom: "2.5rem" }}>
            <label className="text-small" style={{ display: "block", marginBottom: "0.5rem" }}>BUDGET ($)</label>
            <input 
              name="budget"
              type="number"
              placeholder="Amount" 
              value={formData.budget}
              onChange={handleChange}
              style={{ borderColor: error && !formData.budget ? "var(--color-primary)" : "" }}
            />
          </div>

          {/* Error Message */}
          {error && (
            <p style={{ color: "var(--color-primary)", fontWeight: 700, textAlign: "center", marginBottom: "1.5rem" }}>
              {error}
            </p>
          )}

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
            Post This Task 🚀
          </button>
        </form>
      </div>
    </main>
  );
}
