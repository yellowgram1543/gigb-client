import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TaskList() {
  const navigate = useNavigate();

  // 1. Mock Data for all statuses
  const [tasks] = useState([
    { id: 1, title: "Deliver groceries", budget: "20", status: "open", address: "Downtown" },
    { id: 2, title: "Fix kitchen sink", budget: "50", status: "ongoing", address: "North Side" },
    { id: 3, title: "Walk the dog", budget: "15", status: "completed", address: "Park Ave" },
    { id: 4, title: "Assembling Ikea bed", budget: "40", status: "open", address: "East Side" },
    { id: 5, title: "Clean front yard", budget: "30", status: "ongoing", address: "West Side" },
  ]);

  // Filtering Logic
  const openTasks = tasks.filter(t => t.status === "open");
  const ongoingTasks = tasks.filter(t => t.status === "ongoing");
  const completedTasks = tasks.filter(t => t.status === "completed");

  const TaskSection = ({ title, taskList, color }) => (
    <section style={{ marginBottom: "2.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
        <h2 style={{ marginBottom: 0 }}>{title}</h2>
        <span style={{ 
          background: color, 
          padding: "2px 12px", 
          borderRadius: "var(--radius-pill)", 
          border: "var(--border-thick)",
          fontWeight: 800,
          fontSize: "0.8rem"
        }}>
          {taskList.length}
        </span>
      </div>

      {taskList.length === 0 ? (
        <div className="card" style={{ borderStyle: "dashed", opacity: 0.6, textAlign: "center", padding: "1.5rem" }}>
          <p className="text-small">No tasks in this category.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {taskList.map(task => (
            <div 
              key={task.id} 
              className="card" 
              onClick={() => navigate(`/task/${task.id}`)}
              style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <div>
                <h3 style={{ fontSize: "1.1rem", marginBottom: "4px" }}>{task.title}</h3>
                <p className="text-small" style={{ opacity: 0.7 }}>Address: {task.address}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontWeight: 800, fontSize: "1.2rem", color: "var(--color-primary)" }}>${task.budget}</p>
                <p className="text-small" style={{ fontWeight: 700 }}>VIEW DETAILS</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );

  return (
    <main style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", height: "100vh", overflowY: "auto" }}>
      
      {/* Navigation Header */}
      <header style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button 
          onClick={() => navigate("/")} 
          style={{ background: "none", border: "none", fontWeight: 700, cursor: "pointer" }}
        >
          Back
        </button>
        <button 
          className="btn btn-primary" 
          onClick={() => navigate("/post-task")}
        >
          + New Task
        </button>
      </header>

      <h1>All Tasks</h1>
      <p style={{ fontWeight: 600, color: "#666", marginBottom: "2.5rem" }}>
        Track your workflow from open to completed.
      </p>

      {/* Task Groups */}
      <TaskSection title="Open" taskList={openTasks} color="var(--color-soft-accent)" />
      <TaskSection title="Ongoing" taskList={ongoingTasks} color="var(--color-lavender)" />
      <TaskSection title="Completed" taskList={completedTasks} color="var(--color-mint)" />

      {/* Bottom Padding for scroll */}
      <div style={{ height: "40px" }}></div>
    </main>
  );
}
