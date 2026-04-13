import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../api";
import useTaskStore from "../store/taskStore";
import { motion } from "framer-motion";

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const updateTask = useTaskStore((state) => state.updateTask);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isReviewed, setIsReviewed] = useState(false);

  const task = location.state?.task || {
    _id: id,
    title: "UNKNOWN OPERATION",
    budget: "0",
    helper: { name: "UNKNOWN OPERATIVE" }
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
    if (rating === 0) return alert("Select a rating value!");
    
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
      alert("Review transmission failed.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isReviewed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-surface">
        <motion.div 
          className="card-neo bg-secondary-container max-w-md w-full text-center space-y-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <h2 className="text-8xl mb-4 italic">✨</h2>
          <h2 className="text-4xl uppercase leading-none">Operation Archived</h2>
          <p className="font-headline font-black text-sm uppercase tracking-tight opacity-80">
            Your evaluation of <strong>{task.helper?.name}</strong> has been logged. The market appreciates your intel.
          </p>
          <button 
            className="btn-neo bg-surface-container-lowest w-full py-4 text-xl" 
            onClick={() => navigate("/")}
          >
            RETURN TO BASE →
          </button>
        </motion.div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-surface">
        <motion.div 
          className="card-neo bg-surface-container-lowest max-w-lg w-full text-center p-10"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h2 className="text-secondary text-7xl mb-4 italic leading-none">✓</h2>
          <h1 className="text-4xl uppercase mb-4">Transfer Complete</h1>
          <p className="font-headline font-black text-xs uppercase tracking-widest opacity-60 mb-10">
            Rate the performance of <strong>{task.helper?.name}</strong>
          </p>

          <form onSubmit={handleReviewSubmit} className="space-y-8">
            <div className="flex justify-center gap-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-5xl transition-colors ${star <= rating ? "text-primary opacity-100" : "text-surface-variant opacity-30"}`}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ★
                </motion.button>
              ))}
            </div>

            <textarea
              placeholder="OPTIONAL DEBRIEFING NOTES..."
              className="input-neo w-full h-32 uppercase font-medium text-sm"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />

            <button 
              type="submit"
              className="btn-neo-primary w-full py-5 text-2xl shadow-[8px_8px_0px_0px_rgba(48,52,44,1)] active:shadow-none"
              disabled={isSubmittingReview || rating === 0}
            >
              {isSubmittingReview ? "LOGGING..." : "SUBMIT EVALUATION →"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-12 space-y-10">
      <header className="flex justify-between items-center">
        <button 
          onClick={() => navigate(-1)} 
          className="font-headline font-black uppercase text-xs opacity-60 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span> BACK
        </button>
        <span className="badge-neo bg-tertiary-container px-4 py-1 text-[10px]">PAYMENT GATEWAY</span>
      </header>

      <h1 className="text-6xl uppercase leading-none italic tracking-tighter">Settle Accounts</h1>
      <p className="font-headline font-black text-xs uppercase tracking-widest opacity-60">Authorize the release of funds for this operation.</p>

      {/* Payment Summary */}
      <div className="card-neo bg-surface-container relative overflow-visible border-dashed border-4">
        <div className="absolute -top-3 -left-3 badge-neo bg-surface-container-lowest">INVOICE SUMMARY</div>
        <div className="space-y-4">
          <div className="flex justify-between items-end border-b-[2px] border-on-surface border-dashed pb-2">
            <span className="font-headline font-black text-[10px] uppercase opacity-50">Task Engagement</span>
            <span className="font-headline font-black text-sm uppercase">{task.title}</span>
          </div>
          <div className="flex justify-between items-end border-b-[2px] border-on-surface border-dashed pb-2">
            <span className="font-headline font-black text-[10px] uppercase opacity-50">Field Operative</span>
            <span className="font-headline font-black text-sm uppercase">{task.helper?.name || "ASSIGNED HELPER"}</span>
          </div>
          <div className="flex justify-between items-center pt-4">
            <span className="text-2xl font-black uppercase italic tracking-tighter">Total Release</span>
            <span className="text-5xl font-black text-primary">₹{task.budget}</span>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="space-y-4">
        <h2 className="text-xl uppercase font-black italic">Select Protocol</h2>
        <div className="grid grid-cols-1 gap-4">
          <button className="btn-neo bg-surface-container-lowest justify-start text-xs font-black uppercase tracking-widest px-6 py-4 shadow-[4px_4px_0px_0px_rgba(48,52,44,1)]">
             <span className="material-symbols-outlined mr-4">credit_card</span> Credit / Debit Card
          </button>
          <button className="btn-neo bg-surface-container-lowest justify-start text-xs font-black uppercase tracking-widest px-6 py-4 shadow-[4px_4px_0px_0px_rgba(48,52,44,1)]">
             <span className="material-symbols-outlined mr-4">payments</span> UPI / Digital Wallets
          </button>
        </div>
      </div>

      {/* Pay Button */}
      <button 
        className="btn-neo-primary w-full py-6 text-3xl shadow-[12px_12px_0px_0px_rgba(48,52,44,1)] active:shadow-none bg-primary-container"
        onClick={handlePay}
        disabled={isProcessing}
      >
        {isProcessing ? "TRANSMITTING..." : `RELEASE ₹${task.budget} →`}
      </button>

      <p className="text-center font-headline font-black text-[9px] uppercase tracking-[0.4em] opacity-40">
        SECURE PROTOCOL POWERED BY GIGB BLOCKCHAIN
      </p>
    </div>
  );
}
