import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

export default function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [inputText, setInputText] = useState("");

  // Get the task data passed from TaskDetail.jsx
  const task = location.state?.task || {
    title: "Chat",
    helper: { name: "Helper" }
  };

  // Mock messages
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey! I'm ready to start the task.", sender: "helper", time: "10:30 AM" },
    { id: 2, text: "Great! Please let me know when you arrive.", sender: "user", time: "10:32 AM" },
    { id: 3, text: "I'm about 5 minutes away.", sender: "helper", time: "10:35 AM" }
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInputText("");
  };

  return (
    <main style={{ 
      display: "flex", 
      flexDirection: "column", 
      height: "100vh", 
      maxWidth: "600px", 
      margin: "0 auto",
      background: "transparent"
    }}>
      {/* Header */}
      <header style={{ 
        padding: "20px", 
        background: "white", 
        borderBottom: "var(--border-thick)",
        display: "flex",
        alignItems: "center",
        gap: "15px"
      }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ background: "none", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "1.2rem" }}
        >
          ←
        </button>
        <div>
          <h2 style={{ marginBottom: 0 }}>{task.helper?.name}</h2>
          <p className="text-small" style={{ opacity: 0.6 }}>{task.title}</p>
        </div>
      </header>

      {/* Message List */}
      <section style={{ 
        flex: 1, 
        overflowY: "auto", 
        padding: "20px", 
        display: "flex", 
        flexDirection: "column", 
        gap: "15px" 
      }}>
        {messages.map(msg => (
          <div 
            key={msg.id} 
            style={{ 
              maxWidth: "80%",
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              background: msg.sender === "user" ? "var(--color-lavender)" : "white",
              padding: "12px 18px",
              borderRadius: "var(--radius-soft)",
              border: "var(--border-thick)",
              boxShadow: "var(--shadow-soft)",
              position: "relative"
            }}
          >
            <p style={{ fontWeight: 600, fontSize: "1rem" }}>{msg.text}</p>
            <p style={{ 
              fontSize: "0.7rem", 
              fontWeight: 700, 
              opacity: 0.5, 
              textAlign: "right",
              marginTop: "5px"
            }}>
              {msg.time}
            </p>
          </div>
        ))}
      </section>

      {/* Input Bar */}
      <footer style={{ padding: "20px", background: "white", borderTop: "var(--border-thick)" }}>
        <form 
          onSubmit={handleSendMessage}
          style={{ display: "flex", gap: "10px" }}
        >
          <input 
            type="text" 
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{ borderRadius: "var(--radius-pill)" }}
          />
          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ padding: "0 1.5rem" }}
          >
            Send
          </button>
        </form>
      </footer>
    </main>
  );
}
