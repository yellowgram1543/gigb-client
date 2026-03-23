import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. Mock Data for the selected task
  const [task, setTask] = useState({
    id: id,
    title: "Deliver groceries",
    description: "Please pick up the following items from the store: milk, eggs, bread, and some apples. Need it delivered before 6 PM.",
    location: "Downtown",
    budget: "20",
    status: "OPEN", // Initial state
    helper: null
  });

  // 2. Mock Applicants (Only visible if status is OPEN)
  const [applicants] = useState([
    { id: 101, name: "John Doe", rating: "4.8", reviews: 25 },
    { id: 102, name: "Sarah Smith", rating: "4.9", reviews: 42 }
  ]);

  const handleAcceptHelper = (helper) => {
    // 3. Status logic: OPEN -> ASSIGNED
    setTask({ ...task, status: "ASSIGNED", helper: helper });
  };

  const handleCompleteTask = () => {
    // 4. Status logic: ASSIGNED -> COMPLETED
    setTask({ ...task, status: "COMPLETED" });
  };

  return (
    <main style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
      
      {/* Navigation Header */}
      <header style={{ marginBottom: "2rem" }}>
        <button 
          onClick={() => navigate("/tasks")} 
          style={{ background: "none", border: "none", fontWeight: 700, cursor: "pointer" }}
        >
          ← Back to All Tasks
        </button>
      </header>

      {/* Main Task Header Card */}
      <div className="card" style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
          <h1 style={{ marginBottom: 0 }}>{task.title}</h1>
          <span style={{ 
            background: task.status === "OPEN" ? "var(--color-secondary)" : 
                       task.status === "ASSIGNED" ? "var(--color-lavender)" : "var(--color-mint)",
            padding: "4px 12px",
            borderRadius: "var(--radius-pill)",
            border: "var(--border-thick)",
            fontWeight: 800,
            fontSize: "0.8rem"
          }}>
            {task.status}
          </span>
        </div>
        
        <p style={{ fontWeight: 600, marginBottom: "1.5rem" }}>{task.description}</p>
        
        <div style={{ display: "flex", gap: "20px" }}>
          <div>
            <p className="text-small">LOCATION</p>
            <p style={{ fontWeight: 800 }}>📍 {task.location}</p>
          </div>
          <div>
            <p className="text-small">BUDGET</p>
            <p style={{ fontWeight: 800, color: "var(--color-primary)" }}>${task.budget}</p>
          </div>
        </div>
      </div>

      {/* --- Conditional Bottom Section --- */}

      {/* 🟡 Case 1: Task = OPEN */}
      {task.status === "OPEN" && (
        <section>
          <h2>Applicants 👥</h2>
          <p className="text-small" style={{ marginBottom: "1.5rem" }}>Who wants to help you with this task?</p>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {applicants.map(app => (
              <div key={app.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ marginBottom: "2px" }}>{app.name}</h3>
                  <p className="text-small">⭐ {app.rating} ({app.reviews} reviews)</p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button 
                    className="btn btn-primary" 
                    style={{ padding: "0.5rem 1rem" }}
                    onClick={() => handleAcceptHelper(app)}
                  >
                    Accept
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 🔵 Case 2: Task = ASSIGNED */}
      {task.status === "ASSIGNED" && (
        <section>
          <h2>Selected Helper ✅</h2>
          <div className="card" style={{ background: "var(--color-lavender)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3>{task.helper.name}</h3>
              <p className="text-small">Helper is ready for action!</p>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button className="btn btn-secondary">Chat</button>
              <button 
                className="btn btn-primary" 
                onClick={handleCompleteTask}
              >
                Complete
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 🟢 Case 3: Task = COMPLETED */}
      {task.status === "COMPLETED" && (
        <section>
          <div className="card" style={{ background: "var(--color-mint)", textAlign: "center", padding: "2.5rem" }}>
            <h2 style={{ marginBottom: "0.5rem" }}>Task Completed! 🎉</h2>
            <p style={{ fontWeight: 600, marginBottom: "2rem" }}>Everything is done. Time to finalize the payment.</p>
            <button className="btn btn-primary">Proceed to Payment →</button>
          </div>
        </section>
      )}

    </main>
  );
}
