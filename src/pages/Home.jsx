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

  return (
    <main style={{ padding: "0 20px 40px", maxWidth: "1200px", margin: "0 auto" }}>
      <header style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ marginBottom: "0.2rem" }}>Welcome Back!</h1>
        <p style={{ fontWeight: 600, color: "#666" }}>
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
          <div className="card" style={{ background: "var(--color-lavender)", textAlign: "center", padding: "2rem" }}>
            <h2 style={{ fontSize: "3rem", marginBottom: "0" }}>{tasks.length}</h2>
            <p className="text-small" style={{ letterSpacing: "1px" }}>TOTAL TASKS</p>
          </div>
          <div className="card" style={{ background: "var(--color-soft-pink)", textAlign: "center", padding: "2rem" }}>
            <h2 style={{ fontSize: "3rem", marginBottom: "0" }}>{activeCount}</h2>
            <p className="text-small" style={{ letterSpacing: "1px" }}>ACTIVE NOW</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate("/post-task")} style={{ width: "100%", padding: "1.2rem" }}>
            + Create New Task
          </button>
        </aside>

        {/* RIGHT CONTENT: GALLERY */}
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ margin: 0 }}>Recent Tasks</h2>
            <button className="btn btn-secondary" style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }} onClick={() => navigate("/tasks")}>View All</button>
          </div>

          {loading ? (
            <div className="loader" style={{ margin: "40px auto", display: "block" }}></div>
          ) : tasks.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "5rem", borderStyle: "dashed", opacity: 0.8 }}>
              <p style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1rem" }}>No tasks yet. Start by posting one.</p>
              <button className="btn btn-primary" onClick={() => navigate("/post-task")}>Create My First Task</button>
            </div>
          ) : (
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
              gap: "20px" 
            }}>
              {tasks.slice(0, 6).map(task => (
                <div 
                  key={task._id} 
                  className="card" 
                  style={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    justifyContent: "space-between", 
                    cursor: "pointer",
                    minHeight: "220px",
                    transition: "transform 0.2s"
                  }}
                  onClick={() => navigate(`/task/${task._id}`)}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem" }}>
                      <span className="text-small" style={{ 
                        background: task.status === "OPEN" ? "var(--color-secondary)" : 
                                   task.status === "ASSIGNED" ? "var(--color-lavender)" : 
                                   task.status === "PAID" ? "#eee" : "var(--color-mint)",
                        padding: "2px 8px", borderRadius: "10px", border: "2px solid #1a1a1a", fontWeight: 700, fontSize: "0.7rem"
                      }}>
                        {task.status}
                      </span>
                      <div style={{ fontWeight: 800, color: "var(--color-primary)" }}>₹{task.budget}</div>
                    </div>
                    <h3 style={{ marginBottom: "0.5rem", fontSize: "1.2rem", lineHeight: "1.2" }}>{task.title}</h3>
                    <p className="text-small" style={{ opacity: 0.7, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {task.description}
                    </p>
                  </div>
                  
                  <div style={{ marginTop: "1rem", borderTop: "2px solid #eee", paddingTop: "1rem", display: "flex", justifyContent: "flex-end" }}>
                    <p className="text-small" style={{ fontWeight: 800, color: "var(--color-secondary)" }}>DETAILS →</p>
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
