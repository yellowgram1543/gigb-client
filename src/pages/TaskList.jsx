import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import useTaskStore from "../store/taskStore";
import TaskMap from "../components/TaskMap";
import Card from "../components/Card";

export default function TaskList() {
  const navigate = useNavigate();
  const { tasks, loading, fetchTasks } = useTaskStore();
  const [viewMode, setViewMode] = useState("list"); // "list" or "map"

  useEffect(() => {
    if (tasks.length === 0) {
      fetchTasks();
    }
  }, [tasks.length, fetchTasks]);

  const openTasks = tasks.filter(t => (t.status === "OPEN" || t.status === "open"));
  const ongoingTasks = tasks.filter(t => (t.status === "ASSIGNED" || t.status === "ongoing"));
  const completedTasks = tasks.filter(t => (t.status === "COMPLETED" || t.status === "completed"));

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
          {taskList.map((task, index) => (
            <Card key={task._id} onClick={() => navigate(`/task/${task._id}`)} delay={index * 0.05}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <div>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "4px" }}>{task.title}</h3>
                  <p className="text-small" style={{ opacity: 0.7 }}>Address: {task.address}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontWeight: 800, fontSize: "1.2rem", color: "var(--color-primary)" }}>₹{task.budget}</p>
                  <p className="text-small" style={{ fontWeight: 700 }}>VIEW DETAILS</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );

  return (
    <main style={{ padding: "0 20px 20px", maxWidth: "800px", margin: "0 auto", height: "100vh", overflowY: "auto" }}>
      <h1>All Tasks</h1>
      <p style={{ fontWeight: 600, color: "#666", marginBottom: "1rem" }}>Track your workflow from open to completed.</p>

      <div style={{ display: "flex", gap: "10px", marginBottom: "2.5rem" }}>
        <button 
          className={`btn ${viewMode === 'list' ? 'btn-primary' : ''}`} 
          onClick={() => setViewMode("list")}
          style={{ flex: 1 }}
        >
          List View
        </button>
        <button 
          className={`btn ${viewMode === 'map' ? 'btn-primary' : ''}`} 
          onClick={() => setViewMode("map")}
          style={{ flex: 1 }}
        >
          Map View
        </button>
      </div>

      {loading ? (
        <p>Loading tasks...</p>
      ) : viewMode === "map" ? (
        <TaskMap tasks={tasks.filter(t => t.location && t.location.lat)} />
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
