import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import useTaskStore from "../store/taskStore";

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const updateTask = useTaskStore((state) => state.updateTask);
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await api.get(`/tasks/${id}`);
        setTask(response.data);
        updateTask(response.data); // Update global store if fetched individually
      } catch (err) {
        console.error("Error fetching task:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id, updateTask]);

  const [applicants] = useState([
    { id: 101, name: "John Doe", rating: "4.8", reviews: 25 },
    { id: 102, name: "Sarah Smith", rating: "4.9", reviews: 42 }
  ]);

  const handleUpdateStatus = async (newStatus, helper = null) => {
    try {
      const response = await api.patch(`/tasks/${id}`, {
        status: newStatus,
        helper: helper
      });
      setTask(response.data);
      updateTask(response.data); // Update global store immediately
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading task details...</p>;
  if (!task) return <p style={{ padding: "20px" }}>Task not found.</p>;

  return (
    <main style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
      <header style={{ marginBottom: "2rem" }}>
        <button onClick={() => navigate("/tasks")} style={{ background: "none", border: "none", fontWeight: 700, cursor: "pointer" }}>Back to All Tasks</button>
      </header>

      <div className="card" style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
          <h1 style={{ marginBottom: 0 }}>{task.title}</h1>
          <span style={{ 
            background: task.status === "OPEN" ? "var(--color-secondary)" : 
                       task.status === "ASSIGNED" ? "var(--color-lavender)" : "var(--color-mint)",
            padding: "4px 12px", borderRadius: "var(--radius-pill)", border: "var(--border-thick)", fontWeight: 800, fontSize: "0.8rem"
          }}>
            {task.status}
          </span>
        </div>
        
        <p style={{ fontWeight: 600, marginBottom: "1.5rem" }}>{task.description}</p>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <p className="text-small">ADDRESS</p>
            <p style={{ fontWeight: 800, lineHeight: "1.4" }}>{task.address}</p>
          </div>
          <div>
            <p className="text-small">BUDGET</p>
            <p style={{ fontWeight: 800, color: "var(--color-primary)", fontSize: "1.2rem" }}>₹{task.budget}</p>
          </div>
        </div>
      </div>

      {task.status === "OPEN" && (
        <section>
          <h2>Applicants</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {applicants.map(app => (
              <div key={app.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ marginBottom: "2px" }}>{app.name}</h3>
                  <p className="text-small">{app.rating} ({app.reviews} reviews)</p>
                </div>
                <button className="btn btn-primary" onClick={() => handleUpdateStatus("ASSIGNED", app)}>Accept</button>
              </div>
            ))}
          </div>
        </section>
      )}

      {task.status === "ASSIGNED" && task.helper && (
        <section>
          <h2>Selected Helper</h2>
          <div className="card" style={{ background: "var(--color-lavender)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3>{task.helper.name}</h3>
            <div style={{ display: "flex", gap: "10px" }}>
              <button className="btn btn-secondary" onClick={() => navigate(`/chat/${task._id}`, { state: { task } })}>Chat</button>
              <button className="btn btn-primary" onClick={() => handleUpdateStatus("COMPLETED")}>Complete</button>
            </div>
          </div>
        </section>
      )}

      {task.status === "COMPLETED" && (
        <section>
          <div className="card" style={{ background: "var(--color-mint)", textAlign: "center", padding: "2.5rem" }}>
            <h2>Task Completed!</h2>
            <button className="btn btn-primary" onClick={() => navigate(`/payment/${task._id}`, { state: { task } })}>Proceed to Payment</button>
          </div>
        </section>
      )}
    </main>
  );
}
