import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Home({ onLogout }) {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get("/tasks");
        setTasks(response.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const activeCount = tasks.filter(t => t.status !== "COMPLETED").length;

  return (
    <main style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <header style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "2rem",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <div>
          <h1>Dashboard</h1>
          <p style={{ fontWeight: 600, color: "#666" }}>
            {loading ? "Loading..." : `You have ${activeCount} tasks in progress`}
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn btn-secondary" onClick={() => navigate("/tasks")}>All Tasks</button>
          <button className="btn btn-primary" onClick={() => navigate("/post-task")}>+ Post Task</button>
        </div>
      </header>

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

      <section>
        <h2 style={{ marginBottom: "1.5rem" }}>Recent Tasks</h2>
        {loading ? (
          <p>Loading your tasks...</p>
        ) : tasks.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "3rem", borderStyle: "dashed", opacity: 0.8 }}>
            <p style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1rem" }}>No tasks yet. Start by posting one.</p>
            <button className="btn btn-primary" onClick={() => navigate("/post-task")}>Create My First Task</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {tasks.slice(0, 5).map(task => (
              <div 
                key={task._id} 
                className="card" 
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
                onClick={() => navigate(`/task/${task._id}`)}
              >
                <div>
                  <h3 style={{ marginBottom: "0.2rem" }}>{task.title}</h3>
                  <span className="text-small" style={{ 
                    background: task.status === "OPEN" ? "var(--color-secondary)" : 
                               task.status === "ASSIGNED" ? "var(--color-lavender)" : "var(--color-mint)",
                    padding: "2px 8px", borderRadius: "10px", border: "2px solid #1a1a1a", fontWeight: 700
                  }}>
                    {task.status === "COMPLETED" ? "PROCEED TO PAYMENT" : task.status}
                  </span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 800, fontSize: "1.2rem", color: "var(--color-primary)" }}>
                    ${task.budget}
                  </div>
                  {task.status === "COMPLETED" && (
                    <p className="text-small" style={{ fontWeight: 700, color: "var(--color-mint)" }}>READY!</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div style={{ marginTop: "3rem", textAlign: "center" }}>
        <span style={{ cursor: "pointer", fontWeight: 700, textDecoration: "underline" }} onClick={() => { onLogout(); navigate("/auth"); }}>
          Logout from account
        </span>
      </div>
    </main>
  );
}
