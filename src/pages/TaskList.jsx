import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import useTaskStore from "../store/taskStore";

export default function TaskList() {
  const navigate = useNavigate();
  const { tasks, loading, fetchTasks } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const openTasks = tasks.filter(t => t.status === "OPEN");
  const ongoingTasks = tasks.filter(t => t.status === "ASSIGNED");
  const completedTasks = tasks.filter(t => t.status === "COMPLETED" || t.status === "PAID");

  const BoardColumn = ({ title, taskList, color, icon }) => (
    <div style={{ 
      flex: 1, 
      minWidth: "300px", 
      background: "var(--color-white)", 
      borderRadius: "var(--radius-soft)", 
      padding: "20px",
      border: "var(--border-thick)",
      boxShadow: "var(--shadow-soft)",
      display: "flex",
      flexDirection: "column",
      gap: "20px"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem", borderBottom: "var(--border-thick)", paddingBottom: "10px" }}>
        <h2 style={{ fontSize: "1.2rem", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
          {icon} {title}
        </h2>
        <span style={{ 
          background: color, 
          padding: "2px 10px", 
          borderRadius: "10px", 
          fontWeight: 800, 
          fontSize: "0.9rem",
          border: "var(--border-thick)",
          boxShadow: "2px 2px 0px 0px var(--color-text)"
        }}>
          {taskList.length}
        </span>
      </div>

      {taskList.length === 0 ? (
        <div style={{ padding: "40px 20px", textAlign: "center", border: "2px dashed var(--color-text)", borderRadius: "var(--radius-soft)", background: "var(--color-bg-light)" }}>
          <p className="text-small" style={{ fontWeight: 700 }}>No tasks here yet.</p>
        </div>
      ) : (
        taskList.map(task => (
          <div 
            key={task._id} 
            className="card" 
            style={{ padding: "15px", cursor: "pointer", background: "var(--color-cream)" }}
            onClick={() => navigate(`/task/${task._id}`)}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <p className="text-small" style={{ fontWeight: 800, background: "var(--color-white)", padding: "2px 8px", borderRadius: "10px", border: "var(--border-thick)", boxShadow: "2px 2px 0px 0px var(--color-text)" }}>₹{task.budget}</p>
              <p className="text-small" style={{ opacity: 0.8, fontWeight: 700 }}>#{task._id.slice(-4)}</p>
            </div>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "8px", lineHeight: "1.3" }}>{task.title}</h3>
            <p className="text-small" style={{ 
              opacity: 0.8, 
              display: "-webkit-box", 
              WebkitLineClamp: 2, 
              WebkitBoxOrient: "vertical", 
              overflow: "hidden",
            }}>
              {task.description}
            </p>
            <div className="dashed-divider" style={{ margin: "12px 0" }}></div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
               <span className="text-small" style={{ fontSize: "0.75rem", fontWeight: 800, background: color, padding: "4px 8px", borderRadius: "8px", border: "2px solid var(--color-text)" }}>DETAILS →</span>
               {task.imageUrl && <span style={{ fontSize: "1.2rem", filter: "drop-shadow(2px 2px 0px var(--color-text))" }}>🖼️</span>}
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <main style={{ padding: "0 20px 40px", maxWidth: "1200px", margin: "0 auto" }}>
      <header style={{ marginBottom: "2.5rem", background: "var(--color-white)", padding: "2rem", borderRadius: "var(--radius-soft)", border: "var(--border-thick)", boxShadow: "var(--shadow-soft)", marginTop: "20px" }}>
        <h1 style={{ marginBottom: "0.5rem" }}>Task Board 📌</h1>
        <p style={{ fontWeight: 700, margin: 0 }}>Track and manage the progress of your neighborhood gigs.</p>
      </header>

      {loading ? (
        <div className="loader" style={{ margin: "100px auto", display: "block" }}></div>
      ) : (
        <div style={{ 
          display: "flex", 
          gap: "30px", 
          overflowX: "auto", 
          paddingBottom: "20px",
          alignItems: "flex-start"
        }}>
          <BoardColumn title="Open" taskList={openTasks} color="var(--color-peach)"/>
          <BoardColumn title="Ongoing" taskList={ongoingTasks} color="var(--color-yellow)" />
          <BoardColumn title="Completed" taskList={completedTasks} color="var(--color-mint)" />
        </div>
      )}
    </main>
  );
}
