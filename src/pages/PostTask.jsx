import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function PostTask() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    budget: ""
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!formData.title || !formData.description || !formData.address || !formData.budget) {
      setError("Oops! All fields are required.");
      setIsSubmitting(false);
      return;
    }

    if (isNaN(formData.budget) || parseFloat(formData.budget) <= 0) {
      setError("Please enter a valid budget amount.");
      setIsSubmitting(false);
      return;
    }

    try {
      await api.post("/tasks", {
        ...formData,
        budget: parseFloat(formData.budget)
      });
      navigate("/");
    } catch (err) {
      console.error("Error saving task:", err);
      setError("Failed to save task. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <button 
        onClick={() => navigate("/")} 
        style={{ background: "none", border: "none", fontWeight: 700, cursor: "pointer", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "5px" }}
      >
        Back to Dashboard
      </button>

      <div className="card">
        <h1>Post a Task</h1>
        <p style={{ fontWeight: 600, color: "#666", marginBottom: "2rem" }}>Fill in the details to find someone to help you.</p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.2rem" }}>
            <label className="text-small" style={{ display: "block", marginBottom: "0.5rem" }}>TASK TITLE</label>
            <input name="title" placeholder="e.g., Deliver groceries" value={formData.title} onChange={handleChange} disabled={isSubmitting} style={{ borderColor: error && !formData.title ? "var(--color-primary)" : "" }} />
          </div>

          <div style={{ marginBottom: "1.2rem" }}>
            <label className="text-small" style={{ display: "block", marginBottom: "0.5rem" }}>DESCRIPTION</label>
            <textarea name="description" placeholder="Describe what needs to be done..." value={formData.description} onChange={handleChange} disabled={isSubmitting} style={{ height: "100px", borderColor: error && !formData.description ? "var(--color-primary)" : "" }} />
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <label className="text-small" style={{ display: "block", marginBottom: "0.5rem" }}>ADDRESS</label>
            <textarea name="address" placeholder="Enter your full address here..." value={formData.address} onChange={handleChange} disabled={isSubmitting} style={{ height: "100px", borderColor: error && !formData.address ? "var(--color-primary)" : "" }} />
          </div>

          <div style={{ marginBottom: "2.5rem" }}>
            <label className="text-small" style={{ display: "block", marginBottom: "0.5rem" }}>BUDGET ($)</label>
            <input name="budget" type="number" placeholder="Amount" value={formData.budget} onChange={handleChange} disabled={isSubmitting} style={{ borderColor: error && !formData.budget ? "var(--color-primary)" : "" }} />
          </div>

          {error && <p style={{ color: "var(--color-primary)", fontWeight: 700, textAlign: "center", marginBottom: "1.5rem" }}>{error}</p>}

          <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={isSubmitting}>
            {isSubmitting ? "Posting..." : "Post This Task"}
          </button>
        </form>
      </div>
    </main>
  );
}
