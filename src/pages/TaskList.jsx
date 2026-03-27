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
      background: "rgba(255, 255, 255, 0.4)", 
      borderRadius: "var(--radius-soft)", 
      padding: "20px",
      border: "2px dashed rgba(0,0,0,0.1)",
      display: "flex",
      flexDirection: "column",
      gap: "15px"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2 style={{ fontSize: "1.2rem", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
          {icon} {title}
        </h2>
        <span style={{ 
          background: color, 
          padding: "2px 10px", 
          borderRadius: "10px", 
          fontWeight: 800, 
          fontSize: "0.8rem",
          border: "2px solid #1a1a1a"
        }}>
          {taskList.length}
        </span>
      </div>

      {taskList.length === 0 ? (
        <div style={{ padding: "40px 20px", textAlign: "center", opacity: 0.5 }}>
          <p className="text-small">No tasks yet.</p>
        </div>
      ) : (
        taskList.map(task => (
          <div 
            key={task._id} 
            className="card" 
            style={{ padding: "15px", cursor: "pointer", background: "white" }}
            onClick={() => navigate(`/task/${task._id}`)}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <p className="text-small" style={{ fontWeight: 800, color: "var(--color-primary)" }}>₹{task.budget}</p>
              <p className="text-small" style={{ opacity: 0.6 }}>#{task._id.slice(-4)}</p>
            </div>
            <h3 style={{ fontSize: "1rem", marginBottom: "8px", lineHeight: "1.3" }}>{task.title}</h3>
            <p className="text-small" style={{ 
              opacity: 0.7, 
              display: "-webkit-box", 
              WebkitLineClamp: 2, 
              WebkitBoxOrient: "vertical", 
              overflow: "hidden",
              marginBottom: "12px"
            }}>
              {task.description}
            </p>
            <div style={{ borderTop: "1px solid #eee", paddingTop: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
               <span className="text-small" style={{ fontSize: "0.7rem", fontWeight: 700 }}>VIEW DETAILS</span>
               {task.imageUrl && <span style={{ fontSize: "1rem" }}>🖼️</span>}
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <main style={{ padding: "0 20px 40px", maxWidth: "1200px", margin: "0 auto" }}>
      <header style={{ marginBottom: "2.5rem" }}>
        <h1>Task Board</h1>
        <p style={{ fontWeight: 600, color: "#666" }}>Track and manage the progress of your neighborhood gigs.</p>
      </header>

      {loading ? (
        <div className="loader" style={{ margin: "100px auto", display: "block" }}></div>
      ) : (
        <div style={{ 
          display: "flex", 
          gap: "20px", 
          overflowX: "auto", 
          paddingBottom: "20px",
          alignItems: "flex-start"
        }}>
          <BoardColumn title="Open" taskList={openTasks} color="var(--color-secondary)" icon="📢" />
          <BoardColumn title="Ongoing" taskList={ongoingTasks} color="var(--color-lavender)" icon="⚙️" />
          <BoardColumn title="Completed" taskList={completedTasks} color="var(--color-mint)" icon="✅" />
        </div>
      )}
    </main>
  );
}
