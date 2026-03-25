import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../api";
import useAuthStore from "../store/authStore";

// Connect to the backend socket
const socket = io("http://localhost:5000");

export default function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const task = location.state?.task || {
    title: "Chat",
    helper: { name: "Helper" }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    console.log("DEBUG: Attempting to join room:", id);
    socket.emit("join_room", id);

    const fetchHistory = async () => {
      try {
        const response = await api.get(`/messages/${id}`);
        setMessages(response.data);
      } catch (err) {
        console.error("DEBUG ERROR: Fetching history failed:", err);
      }
    };
    fetchHistory();

    socket.on("receive_message", (data) => {
      console.log("DEBUG: New message received from socket:", data);
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const messageData = {
      taskId: id,
      sender: user?._id || "anonymous",
      senderName: user?.name || "User",
      text: inputText
    };

    console.log("DEBUG: Sending message data:", messageData);
    socket.emit("send_message", messageData);
    setInputText("");
  };

  return (
    <main style={{ 
      display: "flex", 
      flexDirection: "column", 
      height: "100vh", 
      maxWidth: "600px", 
      margin: "0 auto",
      background: "white"
    }}>
      <header style={{ 
        padding: "15px 20px", 
        background: "white", 
        borderBottom: "var(--border-thick)",
        display: "flex",
        alignItems: "center",
        gap: "15px",
        zIndex: 10
      }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ background: "none", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "1.2rem" }}
        >
          ←
        </button>
        <div>
          <h2 style={{ marginBottom: 0, fontSize: "1.2rem" }}>{task.helper?.name || "Task Chat"}</h2>
          <p className="text-small" style={{ opacity: 0.6 }}>{task.title}</p>
        </div>
      </header>

      <section style={{ 
        flex: 1, 
        overflowY: "auto", 
        padding: "20px", 
        display: "flex", 
        flexDirection: "column", 
        gap: "15px",
        background: "#f9f9f9"
      }}>
        {messages.map((msg, index) => {
          const isMe = msg.sender === user?._id;
          return (
            <div 
              key={msg._id || index} 
              style={{ 
                maxWidth: "80%",
                alignSelf: isMe ? "flex-end" : "flex-start",
                background: isMe ? "var(--color-lavender)" : "white",
                padding: "12px 18px",
                borderRadius: "var(--radius-soft)",
                border: "var(--border-thick)",
                boxShadow: "var(--shadow-soft)",
                position: "relative"
              }}
            >
              {!isMe && <p style={{ fontSize: "0.7rem", fontWeight: 800, marginBottom: "4px", color: "var(--color-primary)" }}>{msg.senderName}</p>}
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
          );
        })}
        <div ref={messagesEndRef} />
      </section>

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
            style={{ borderRadius: "var(--radius-pill)", flex: 1, padding: "12px 20px", border: "var(--border-thick)" }}
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
