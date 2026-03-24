import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../api";
import useTaskStore from "../store/taskStore";

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const updateTask = useTaskStore((state) => state.updateTask);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Review States
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isReviewed, setIsReviewed] = useState(false);

  // Get the task data passed from TaskDetail.jsx
  const task = location.state?.task || {
    _id: id,
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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return alert("Please select a rating!");
    
    setIsSubmittingReview(true);
    try {
      const response = await api.patch(`/tasks/${id}`, {
        status: "PAID",
        rating,
        reviewText
      });
      updateTask(response.data);
      setIsReviewed(true);
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Failed to save review. Please try again.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isReviewed) {
    return (
      <main style={{ padding: "20px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div className="card" style={{ maxWidth: "400px", textAlign: "center", background: "var(--color-mint)" }}>
          <h2 style={{ fontSize: "3rem", marginBottom: "1rem" }}>✨</h2>
          <h2>Thank You!</h2>
          <p style={{ fontWeight: 600, margin: "1rem 0 2rem" }}>
            Your feedback helps <strong>{task.helper?.name}</strong> grow and helps other users find great help.
          </p>
          <button className="btn btn-primary" onClick={() => navigate("/")} style={{ width: "100%" }}>
            Return to Dashboard
          </button>
        </div>
      </main>
    );
  }

  if (isSuccess) {
    return (
      <main style={{ padding: "20px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div className="card" style={{ maxWidth: "450px", width: "100%", textAlign: "center" }}>
          <h2 style={{ color: "var(--color-mint)", fontSize: "2.5rem" }}>✓</h2>
          <h1>Payment Successful!</h1>
          <p style={{ fontWeight: 600, color: "#666", marginBottom: "2rem" }}>
            Now, please take a moment to rate your experience with <strong>{task.helper?.name}</strong>.
          </p>

          <form onSubmit={handleReviewSubmit}>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "2rem" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "2.5rem",
                    cursor: "pointer",
                    color: star <= rating ? "var(--color-primary)" : "#ddd",
                    transition: "transform 0.1s"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              placeholder="Write a short review (optional)..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              style={{
                width: "100%",
                height: "100px",
                padding: "15px",
                borderRadius: "var(--radius-md)",
                border: "var(--border-thick)",
                marginBottom: "2rem",
                fontSize: "1rem"
              }}
            />

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: "100%" }}
              disabled={isSubmittingReview || rating === 0}
            >
              {isSubmittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </form>
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
          <p style={{ fontWeight: 800, fontSize: "1.5rem", color: "var(--color-primary)" }}>₹{task.budget}</p>
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
        {isProcessing ? "Processing..." : `Confirm & Pay ₹${task.budget}`}
      </button>

      <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.8rem", opacity: 0.6 }}>
        Secure payment powered by GigB
      </p>
    </main>
  );
}
