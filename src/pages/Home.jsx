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
      <header style={{ marginBottom: "2.5rem", background: "var(--color-white)", padding: "2rem", borderRadius: "16px", border: "var(--border-thick)", boxShadow: "var(--shadow-soft)", marginTop: "20px" }}>
        <h1 style={{ marginBottom: "0.5rem", color: "var(--color-text)" }}>Welcome Back 👋</h1>
        <p style={{ fontWeight: 700, color: "var(--color-text)", margin: 0 }}>
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
            <h2 style={{ fontSize: "3rem", marginBottom: "0", color: "var(--color-text)" }}>{tasks.length}</h2>
            <p className="text-small" style={{ letterSpacing: "1px" }}>TOTAL TASKS</p>
          </div>
          <div className="card" style={{ background: "var(--color-accent-purple)", textAlign: "center", padding: "2rem" }}>
            <h2 style={{ fontSize: "3rem", marginBottom: "0", color: "var(--color-text)" }}>{activeCount}</h2>
            <p className="text-small" style={{ letterSpacing: "1px", color: "var(--color-text)" }}>ACTIVE NOW</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate("/post-task")} style={{ width: "100%", padding: "1.2rem", fontSize: "1.1rem" }}>
            + Create New Task
          </button>
        </aside>

        {/* RIGHT CONTENT: GALLERY */}
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", background: "var(--color-white)", padding: "1rem", borderRadius: "var(--radius-pill)", border: "var(--border-thick)", boxShadow: "var(--shadow-soft)" }}>
            <h2 style={{ margin: 0, paddingLeft: "1rem", color: "var(--color-text)", fontSize: "1.4rem" }}>Recent Open Tasks</h2>
            <button className="btn btn-secondary" style={{ padding: "0.5rem 1.2rem", fontSize: "0.85rem", borderRadius: "10px" }} onClick={() => navigate("/tasks")}>View All</button>
          </div>

          {loading ? (
            <div className="loader" style={{ margin: "40px auto", display: "block" }}></div>
          ) : recentTasks.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "5rem", background: "var(--color-yellow)", borderStyle: "dashed", opacity: 0.9 }}>
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
                    background: "var(--color-cream)"
                  }}
                  onClick={() => navigate(`/task/${task._id}`)}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem" }}>
                      <span className={`badge ${task.status === "OPEN" ? "badge-mint" : "badge-yellow"}`}>
                        {task.status}
                      </span>
                      <div style={{ fontWeight: 800, color: "var(--color-text)", background: "var(--color-white)", padding: "4px 10px", borderRadius: "20px", border: "var(--border-thick)", boxShadow: "2px 2px 0px 0px var(--color-text)", fontSize: "0.9rem" }}>₹{task.budget}</div>
                    </div>
                    <h3 style={{ marginBottom: "0.5rem", fontSize: "1.2rem", lineHeight: "1.2", color: "var(--color-text)" }}>{task.title}</h3>
                    <p className="text-small" style={{ opacity: 0.8, color: "var(--color-text)", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {task.description}
                    </p>
                  </div>
                  
                  <div>
                    <div className="dashed-divider"></div>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <p className="text-small" style={{ fontWeight: 800, color: "var(--color-text)", background: "var(--color-peach)", padding: "4px 12px", borderRadius: "10px", border: "var(--border-thick)" }}>DETAILS →</p>
                    </div>
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
