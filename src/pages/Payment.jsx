import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Get the task data passed from TaskDetail.jsx
  const task = location.state?.task || {
    title: "Unknown Task",
    budget: "0",
    helper: { name: "Unknown Helper" }
  };

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <main style={{ padding: "20px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div className="card" style={{ maxWidth: "400px", textAlign: "center", background: "var(--color-mint)" }}>
          <h2>Payment Successful!</h2>
          <p style={{ fontWeight: 600, margin: "1rem 0 2rem" }}>
            The payment for <strong>{task.title}</strong> has been sent to <strong>{task.helper?.name || "the helper"}</strong>.
          </p>
          <button className="btn btn-primary" onClick={() => navigate("/")} style={{ width: "100%" }}>
            Back to Dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <header style={{ marginBottom: "2rem" }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ background: "none", border: "none", fontWeight: 700, cursor: "pointer" }}
        >
          Back
        </button>
      </header>

      <h1>Final Payment</h1>
      <p style={{ fontWeight: 600, color: "#666", marginBottom: "2rem" }}>Complete the payment to close this task.</p>

      {/* Payment Summary */}
      <div className="card" style={{ marginBottom: "2rem", borderStyle: "dashed" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          <p style={{ fontWeight: 600 }}>Task:</p>
          <p style={{ fontWeight: 800 }}>{task.title}</p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          <p style={{ fontWeight: 600 }}>Helper:</p>
          <p style={{ fontWeight: 800 }}>{task.helper?.name || "Assigned Helper"}</p>
        </div>
        <hr style={{ margin: "1rem 0", border: "1px solid #eee" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontWeight: 800, fontSize: "1.2rem" }}>Total Amount:</p>
          <p style={{ fontWeight: 800, fontSize: "1.5rem", color: "var(--color-primary)" }}>${task.budget}</p>
        </div>
      </div>

      {/* Payment Methods */}
      <h2>Select Method</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "1.5rem 0 2.5rem" }}>
        <button className="btn" style={{ justifyContent: "flex-start", background: "white" }}>
          Credit or Debit Card
        </button>
        <button className="btn" style={{ justifyContent: "flex-start", background: "white" }}>
          Apple Pay
        </button>
        <button className="btn" style={{ justifyContent: "flex-start", background: "white" }}>
          Google Pay
        </button>
      </div>

      {/* Pay Button */}
      <button 
        className="btn btn-primary" 
        style={{ width: "100%", padding: "1.2rem" }}
        onClick={handlePay}
        disabled={isProcessing}
      >
        {isProcessing ? "Processing..." : `Confirm & Pay $${task.budget}`}
      </button>

      <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.8rem", opacity: 0.6 }}>
        Secure payment powered by GigB
      </p>
    </main>
  );
}
