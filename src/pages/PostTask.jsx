import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import useTaskStore from "../store/taskStore";
import LocationPicker from "../components/LocationPicker";

export default function PostTask() {
  const navigate = useNavigate();
  const addTask = useTaskStore((state) => state.addTask);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    budget: "",
    lat: 12.9716,
    lng: 77.5946
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocationSelect = (lat, lng) => {
    setFormData({ ...formData, lat, lng });
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

    try {
      const response = await api.post("/tasks", {
        title: formData.title,
        description: formData.description,
        address: formData.address,
        budget: parseFloat(formData.budget),
        location: {
          lat: formData.lat,
          lng: formData.lng
        }
      });
      addTask(response.data);
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
            <input name="title" placeholder="e.g., Deliver groceries" value={formData.title} onChange={handleChange} disabled={isSubmitting} />
          </div>

          <div style={{ marginBottom: "1.2rem" }}>
            <label className="text-small" style={{ display: "block", marginBottom: "0.5rem" }}>DESCRIPTION</label>
            <textarea name="description" placeholder="Describe what needs to be done..." value={formData.description} onChange={handleChange} disabled={isSubmitting} style={{ height: "100px" }} />
          </div>

          <div style={{ marginBottom: "1.2rem" }}>
            <label className="text-small" style={{ display: "block", marginBottom: "0.5rem" }}>SELECT LOCATION</label>
            <LocationPicker onLocationSelect={handleLocationSelect} />
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <label className="text-small" style={{ display: "block", marginBottom: "0.5rem" }}>ADDRESS (TEXT)</label>
            <textarea name="address" placeholder="Enter your full address here..." value={formData.address} onChange={handleChange} disabled={isSubmitting} style={{ height: "80px" }} />
          </div>

          <div style={{ marginBottom: "2.5rem" }}>
            <label className="text-small" style={{ display: "block", marginBottom: "0.5rem" }}>BUDGET (₹)</label>
            <input name="budget" type="number" placeholder="Amount" value={formData.budget} onChange={handleChange} disabled={isSubmitting} />
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
