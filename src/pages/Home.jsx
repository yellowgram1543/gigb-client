import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  
  // 1. Mock Data: Change this to [] to see the "Empty State"
  const [tasks, setTasks] = useState([
    { id: 1, title: "Deliver groceries", status: "Active", price: "$20" },
    { id: 2, title: "Fix kitchen sink", status: "Completed", price: "$50" }
  ]);

  const activeCount = tasks.filter(t => t.status === "Active").length;

  return (
    <main style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      
      {/* Header Section */}
      <header style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "2rem",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <div>
          <h1>Dashboard 🏠</h1>
          <p style={{ fontWeight: 600, color: "#666" }}>
            You have <span style={{ color: "var(--color-primary)" }}>{activeCount} active tasks</span>
          </p>
        </div>
        
        {/* Primary CTA: Post Task */}
        <button 
          className="btn btn-primary"
          onClick={() => navigate("/post-task")}
        >
          + Post Task
        </button>
      </header>

      {/* Summary / Stats Bar */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "2rem" }}>
        <div className="card" style={{ background: "var(--color-lavender)", textAlign: "center", padding: "1rem" }}>
          <h3 style={{ marginBottom: "0" }}>{tasks.length}</h3>
          <p className="text-small">TOTAL TASKS</p>
        </div>
        <div className="card" style={{ background: "var(--color-soft-pink)", textAlign: "center", padding: "1rem" }}>
          <h3 style={{ marginBottom: "0" }}>{activeCount}</h3>
          <p className="text-small">ACTIVE NOW</p>
        </div>
      </section>

      {/* Recent Tasks List */}
      <section>
        <h2 style={{ marginBottom: "1.5rem" }}>Recent Tasks</h2>
        
        {tasks.length === 0 ? (
          /* ❗ Edge Case: Empty State */
          <div className="card" style={{ textAlign: "center", padding: "3rem", borderStyle: "dashed", opacity: 0.8 }}>
            <p style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1rem" }}>
              No tasks yet. Start by posting one. 📭
            </p>
            <button className="btn btn-primary" onClick={() => navigate("/post-task")}>
              Create My First Task
            </button>
          </div>
        ) : (
          /* Task List */
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {tasks.map(task => (
              <div 
                key={task.id} 
                className="card" 
                style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  cursor: "pointer"
                }}
                onClick={() => navigate(`/task/${task.id}`)}
              >
                <div>
                  <h3 style={{ marginBottom: "0.2rem" }}>{task.title}</h3>
                  <span className="text-small" style={{ 
                    background: task.status === "Active" ? "var(--color-mint)" : "#eee",
                    padding: "2px 8px",
                    borderRadius: "10px",
                    border: "2px solid #1a1a1a"
                  }}>
                    {task.status}
                  </span>
                </div>
                <div style={{ fontWeight: 800, fontSize: "1.2rem", color: "var(--color-primary)" }}>
                  {task.price}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Logout link */}
      <div style={{ marginTop: "3rem", textAlign: "center" }}>
        <span 
          style={{ cursor: "pointer", fontWeight: 700, textDecoration: "underline" }}
          onClick={() => navigate("/auth")}
        >
          Logout from account
        </span>
      </div>

    </main>
  );
}
