import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. Expanded Mock Data to handle different initial states based on ID
  const allTasks = [
    { 
      id: "1", 
      title: "Deliver groceries", 
      description: "Please pick up the following items: milk, eggs, bread.", 
      address: "Downtown", 
      budget: "20", 
      status: "OPEN", 
      helper: null 
    },
    { 
      id: "2", 
      title: "Fix kitchen sink", 
      description: "The sink is leaking. Need someone to fix the pipe.", 
      address: "North Side", 
      budget: "50", 
      status: "ASSIGNED", 
      helper: { name: "John Doe", rating: "4.8", reviews: 25 } 
    },
    { 
      id: "3", 
      title: "Walk the dog", 
      description: "Walk my Golden Retriever for 30 minutes.", 
      address: "Park Ave", 
      budget: "15", 
      status: "COMPLETED", 
      helper: { name: "Sarah Smith", rating: "4.9", reviews: 42 } 
    },
    { 
      id: "4", 
      title: "Assembling Ikea bed", 
      description: "Need help with a new MALM bed frame.", 
      address: "East Side", 
      budget: "40", 
      status: "OPEN", 
      helper: null 
    },
    { 
      id: "5", 
      title: "Clean front yard", 
      description: "Sweep leaves and tidy up the garden path.", 
      address: "West Side", 
      budget: "30", 
      status: "ASSIGNED", 
      helper: { name: "Mike Ross", rating: "4.7", reviews: 12 } 
    },
  ];

  const [task, setTask] = useState(null);

  // 2. Initialize the task based on the ID from the URL
  useEffect(() => {
    const foundTask = allTasks.find(t => t.id === id);
    if (foundTask) {
      setTask(foundTask);
    }
  }, [id]);

  // 3. Mock Applicants (Only relevant for OPEN tasks)
  const [applicants] = useState([
    { id: 101, name: "John Doe", rating: "4.8", reviews: 25 },
    { id: 102, name: "Sarah Smith", rating: "4.9", reviews: 42 }
  ]);

  const handleAcceptHelper = (helper) => {
    setTask({ ...task, status: "ASSIGNED", helper: helper });
  };

  const handleCompleteTask = () => {
    setTask({ ...task, status: "COMPLETED" });
  };

  if (!task) return <p style={{ padding: "20px" }}>Loading task details...</p>;

  return (
    <main style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
      
      {/* Navigation Header */}
      <header style={{ marginBottom: "2rem" }}>
        <button 
          onClick={() => navigate("/tasks")} 
          style={{ background: "none", border: "none", fontWeight: 700, cursor: "pointer" }}
        >
          ← Back to All Tasks
        </button>
      </header>

      {/* Main Task Header Card */}
      <div className="card" style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
          <h1 style={{ marginBottom: 0 }}>{task.title}</h1>
          <span style={{ 
            background: task.status === "OPEN" ? "var(--color-secondary)" : 
                       task.status === "ASSIGNED" ? "var(--color-lavender)" : "var(--color-mint)",
            padding: "4px 12px",
            borderRadius: "var(--radius-pill)",
            border: "var(--border-thick)",
            fontWeight: 800,
            fontSize: "0.8rem"
          }}>
            {task.status}
          </span>
        </div>
        
        <p style={{ fontWeight: 600, marginBottom: "1.5rem" }}>{task.description}</p>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ flex: 1 }}>
            <p className="text-small">ADDRESS</p>
            <p style={{ fontWeight: 800, lineHeight: "1.4" }}>📍 {task.address}</p>
          </div>
          <div>
            <p className="text-small">BUDGET</p>
            <p style={{ fontWeight: 800, color: "var(--color-primary)", fontSize: "1.2rem" }}>${task.budget}</p>
          </div>
        </div>
      </div>

      {/* --- Conditional Bottom Section --- */}

      {/* 🟡 Case 1: Task = OPEN - Show Applicants */}
      {task.status === "OPEN" && (
        <section>
          <h2>Applicants 👥</h2>
          <p className="text-small" style={{ marginBottom: "1.5rem" }}>Who wants to help you with this task?</p>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {applicants.map(app => (
              <div key={app.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ marginBottom: "2px" }}>{app.name}</h3>
                  <p className="text-small">⭐ {app.rating} ({app.reviews} reviews)</p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button 
                    className="btn btn-primary" 
                    style={{ padding: "0.5rem 1rem" }}
                    onClick={() => handleAcceptHelper(app)}
                  >
                    Accept
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 🔵 Case 2: Task = ASSIGNED / ONGOING - Show Selected Helper */}
      {task.status === "ASSIGNED" && task.helper && (
        <section>
          <h2>Selected Helper ✅</h2>
          <div className="card" style={{ background: "var(--color-lavender)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3>{task.helper.name}</h3>
              <p className="text-small">Helper is ready for action!</p>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button className="btn btn-secondary">Chat</button>
              <button 
                className="btn btn-primary" 
                onClick={handleCompleteTask}
              >
                Complete
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 🟢 Case 3: Task = COMPLETED - Show Completion Message */}
      {task.status === "COMPLETED" && (
        <section>
          <div className="card" style={{ background: "var(--color-mint)", textAlign: "center", padding: "2.5rem" }}>
            <h2 style={{ marginBottom: "0.5rem" }}>Task Completed! 🎉</h2>
            <p style={{ fontWeight: 600, marginBottom: "2rem" }}>Everything is done. Time to finalize the payment.</p>
            <button className="btn btn-primary">Proceed to Payment →</button>
          </div>
        </section>
      )}

    </main>
  );
}
