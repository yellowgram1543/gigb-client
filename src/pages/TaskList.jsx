import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function TaskList() {
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

  const openTasks = tasks.filter(t => t.status === "OPEN" || t.status === "open");
  const ongoingTasks = tasks.filter(t => t.status === "ASSIGNED" || t.status === "ongoing");
  const completedTasks = tasks.filter(t => t.status === "COMPLETED" || t.status === "completed");

  const TaskSection = ({ title, taskList, color }) => (
    <section style={{ marginBottom: "2.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
        <h2 style={{ marginBottom: 0 }}>{title}</h2>
        <span style={{ background: color, padding: "2px 12px", borderRadius: "var(--radius-pill)", border: "var(--border-thick)", fontWeight: 800, fontSize: "0.8rem" }}>
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
            <div key={task._id} className="card" onClick={() => navigate(`/task/${task._id}`)} style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ fontSize: "1.1rem", marginBottom: "4px" }}>{task.title}</h3>
                <p className="text-small" style={{ opacity: 0.7 }}>Address: {task.address}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontWeight: 800, fontSize: "1.2rem", color: "var(--color-primary)" }}>₹{task.budget}</p>
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
      <header style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => navigate("/")} style={{ background: "none", border: "none", fontWeight: 700, cursor: "pointer" }}>Back</button>
        <button className="btn btn-primary" onClick={() => navigate("/post-task")}>+ New Task</button>
      </header>

      <h1>All Tasks</h1>
      <p style={{ fontWeight: 600, color: "#666", marginBottom: "2.5rem" }}>Track your workflow from open to completed.</p>

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <>
          <TaskSection title="Open" taskList={openTasks} color="var(--color-soft-accent)" />
          <TaskSection title="Ongoing" taskList={ongoingTasks} color="var(--color-lavender)" />
          <TaskSection title="Completed" taskList={completedTasks} color="var(--color-mint)" />
        </>
      )}
      <div style={{ height: "40px" }}></div>
    </main>
  );
}
