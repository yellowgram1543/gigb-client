import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import useAuthStore from "../store/authStore";

export default function Home() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
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

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  const activeCount = tasks.filter(t => t.status !== "COMPLETED" && t.status !== "PAID").length;
  
  // Filter for only OPEN and ASSIGNED tasks for the gallery
  const recentTasks = tasks
    .filter(t => t.status === "OPEN" || t.status === "ASSIGNED")
    .slice(0, 6);

  return (
    <main style={{ padding: "0 20px 40px", maxWidth: "1200px", margin: "0 auto" }}>
      <header style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ marginBottom: "0.2rem", color: "var(--color-primary)" }}>Welcome Back!</h1>
        <p style={{ fontWeight: 600, color: "var(--color-text)", opacity: 0.8 }}>
          {loading ? "Loading..." : `You have ${activeCount} active tasks to manage today.`}
        </p>
      </header>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "280px 1fr", 
        gap: "40px",
        alignItems: "start"
      }}>
        
        {/* LEFT PANE: STATS */}
        <aside style={{ display: "flex", flexDirection: "column", gap: "20px", position: "sticky", top: "100px" }}>
          <div className="card" style={{ background: "var(--color-peach)", textAlign: "center", padding: "2rem" }}>
            <h2 style={{ fontSize: "3rem", marginBottom: "0", color: "var(--color-primary)" }}>{tasks.length}</h2>
            <p className="text-small" style={{ letterSpacing: "1px" }}>TOTAL TASKS</p>
          </div>
          <div className="card" style={{ background: "var(--color-accent-pink)", textAlign: "center", padding: "2rem" }}>
            <h2 style={{ fontSize: "3rem", marginBottom: "0", color: "var(--color-white)" }}>{activeCount}</h2>
            <p className="text-small" style={{ letterSpacing: "1px", color: "var(--color-white)" }}>ACTIVE NOW</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate("/post-task")} style={{ width: "100%", padding: "1.2rem" }}>
            + Create New Task
          </button>
        </aside>

        {/* RIGHT CONTENT: GALLERY */}
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ margin: 0, color: "var(--color-primary)" }}>Recent Open Tasks</h2>
            <button className="btn btn-secondary" style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }} onClick={() => navigate("/tasks")}>View All</button>
          </div>

          {loading ? (
            <div className="loader" style={{ margin: "40px auto", display: "block" }}></div>
          ) : recentTasks.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "5rem", borderStyle: "dashed", opacity: 0.8, background: "var(--color-cream)" }}>
              <p style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1rem" }}>No active tasks. Start by posting one.</p>
              <button className="btn btn-primary" onClick={() => navigate("/post-task")}>Create My First Task</button>
            </div>
          ) : (
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
              gap: "20px" 
            }}>
              {recentTasks.map(task => (
                <div 
                  key={task._id} 
                  className="card" 
                  style={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    justifyContent: "space-between", 
                    cursor: "pointer",
                    minHeight: "220px",
                    background: "var(--color-white)"
                  }}
                  onClick={() => navigate(`/task/${task._id}`)}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem" }}>
                      <span className="text-small" style={{ 
                        background: task.status === "OPEN" ? "var(--color-peach)" : "var(--color-bg-light)",
                        padding: "2px 8px", borderRadius: "10px", border: "2px solid var(--color-text)", fontWeight: 700, fontSize: "0.7rem"
                      }}>
                        {task.status}
                      </span>
                      <div style={{ fontWeight: 800, color: "var(--color-accent-red)" }}>₹{task.budget}</div>
                    </div>
                    <h3 style={{ marginBottom: "0.5rem", fontSize: "1.2rem", lineHeight: "1.2", color: "var(--color-primary)" }}>{task.title}</h3>
                    <p className="text-small" style={{ opacity: 0.8, color: "var(--color-text)", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {task.description}
                    </p>
                  </div>
                  
                  <div style={{ marginTop: "1.5rem", borderTop: "2px solid var(--color-bg-light)", paddingTop: "1rem", display: "flex", justifyContent: "flex-end" }}>
                    <p className="text-small" style={{ fontWeight: 800, color: "var(--color-primary)" }}>DETAILS →</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
