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
      const response = await api.patch(`/tasks/${id}/review`, {
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
      <div className="min-h-screen flex items-center justify-center p-4 bg-surface">
        <motion.div 
          className="card-neo bg-secondary-container max-w-xs w-full text-center space-y-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <h2 className="text-6xl mb-2 italic">✨</h2>
          <h2 className="text-2xl uppercase leading-none">Archived</h2>
          <p className="font-headline font-black text-[10px] uppercase tracking-tight opacity-80">
            Evaluation logged. Base updated.
          </p>
          <button 
            className="btn-neo bg-surface-container-lowest w-full py-3 text-sm" 
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
      <div className="min-h-screen flex items-center justify-center p-4 bg-surface">
        <motion.div 
          className="card-neo bg-surface-container-lowest max-w-sm w-full text-center p-6"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h2 className="text-secondary text-5xl mb-2 italic leading-none">✓</h2>
          <h1 className="text-2xl uppercase mb-2">Transfer Complete</h1>
          <p className="font-headline font-black text-[9px] uppercase tracking-widest opacity-60 mb-6">
            Rate performance: <strong>{task.helper?.name}</strong>
          </p>

          <form onSubmit={handleReviewSubmit} className="space-y-6">
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-3xl transition-colors ${star <= rating ? "text-primary" : "text-surface-variant opacity-30"}`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ★
                </motion.button>
              ))}
            </div>

            <textarea
              placeholder="DEBRIEFING NOTES..."
              className="input-neo w-full h-24 uppercase font-medium text-[10px]"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />

            <button 
              type="submit"
              className="btn-neo-primary w-full py-3 text-lg shadow-[4px_4px_0px_0px_rgba(48,52,44,1)] active:shadow-none"
              disabled={isSubmittingReview || rating === 0}
            >
              {isSubmittingReview ? "LOGGING..." : "SUBMIT →"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-8 space-y-6">
      <header className="flex justify-between items-center">
        <button 
          onClick={() => navigate(-1)} 
          className="font-headline font-black uppercase text-[9px] opacity-60 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-xs">arrow_back</span> BACK
        </button>
        <span className="badge-neo bg-tertiary-container px-3 py-0.5 text-[8px]">PAYMENT GATEWAY</span>
      </header>

      <h1 className="text-4xl uppercase leading-none italic tracking-tighter">Settle Accounts</h1>
      <p className="font-headline font-black text-[10px] uppercase tracking-widest opacity-60">Authorize release of funds.</p>

      {/* Payment Summary */}
      <div className="card-neo bg-surface-container relative overflow-visible border-dashed border-[3px]">
        <div className="absolute -top-2.5 -left-2.5 badge-neo bg-surface-container-lowest text-[8px]">INVOICE</div>
        <div className="space-y-3">
          <div className="flex justify-between items-end border-b border-on-surface border-dashed pb-1">
            <span className="font-headline font-black text-[8px] uppercase opacity-50">Task</span>
            <span className="font-headline font-black text-[10px] uppercase">{task.title}</span>
          </div>
          <div className="flex justify-between items-end border-b border-on-surface border-dashed pb-1">
            <span className="font-headline font-black text-[8px] uppercase opacity-50">Operative</span>
            <span className="font-headline font-black text-[10px] uppercase">{task.helper?.name || "HELPER"}</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-xl font-black uppercase italic tracking-tighter">Total Release</span>
            <span className="text-3xl font-black text-primary">₹{task.budget}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg uppercase font-black italic">Select Protocol</h2>
        <div className="grid grid-cols-1 gap-3">
          <button className="btn-neo bg-surface-container-lowest justify-start text-[9px] font-black uppercase tracking-widest px-4 py-3 shadow-[3px_3px_0px_0px_rgba(48,52,44,1)]">
             <span className="material-symbols-outlined text-sm mr-3">credit_card</span> Credit / Debit Card
          </button>
          <button className="btn-neo bg-surface-container-lowest justify-start text-[9px] font-black uppercase tracking-widest px-4 py-3 shadow-[3px_3px_0px_0px_rgba(48,52,44,1)]">
             <span className="material-symbols-outlined text-sm mr-3">payments</span> UPI / Digital Wallets
          </button>
        </div>
      </div>

      <button 
        className="btn-neo-primary w-full py-4 text-xl shadow-[6px_6px_0px_0px_rgba(48,52,44,1)] active:shadow-none bg-primary-container"
        onClick={handlePay}
        disabled={isProcessing}
      >
        {isProcessing ? "TRANSMITTING..." : `RELEASE ₹${task.budget} →`}
      </button>

      <p className="text-center font-headline font-black text-[7px] uppercase tracking-[0.3em] opacity-40">
        SECURE PROTOCOL POWERED BY GIGB
      </p>
    </div>
  );
}
