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
        updateTask(response.data);
      } catch (err) {
        console.error("Error fetching task:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id, updateTask]);

  // Removed hardcoded applicants list to support real-world helper assignment

  const handleUpdateStatus = async (newStatus, helper = null) => {
    try {
      const response = await api.patch(`/tasks/${id}`, {
        status: newStatus,
        helper: helper
      });
      setTask(response.data);
      updateTask(response.data);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleConfirmPoster = async () => {
    try {
      const response = await api.patch(`/tasks/${id}/confirm-poster`);
      setTask(response.data);
      updateTask(response.data);
    } catch (err) {
      console.error("Confirmation failed:", err);
      alert("Failed to close operation. System error.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="loader border-[4px] border-on-surface border-b-transparent rounded-full w-10 h-10 animate-spin"></div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="max-w-xl mx-auto py-10 text-center">
        <h1 className="text-2xl uppercase opacity-40">Gig Not Found</h1>
        <button className="btn-neo-primary mt-4" onClick={() => navigate("/")}>RETURN TO BASE</button>
      </div>
    );
  }

  const statusColors = {
    OPEN: "bg-primary-container",
    ASSIGNED: "bg-tertiary-container",
    COMPLETED: "bg-secondary-container",
    PAID: "bg-secondary-container"
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-10">
      <div className="card-neo bg-surface-container-lowest relative overflow-visible">
        <div className={`absolute -top-3 -right-3 badge-neo ${statusColors[task.status]} px-4 py-1 text-[9px] shadow-[2px_2px_0px_0px_rgba(48,52,44,1)]`}>
          {task.status}
        </div>
        
        <header className="mb-6 pb-6 border-b-[2px] border-on-surface border-dashed">
          <h1 className="text-3xl md:text-4xl uppercase leading-none mb-3">{task.title}</h1>
          <div className="flex items-center gap-3">
             <span className="font-headline font-black text-[8px] uppercase opacity-50 tracking-widest">ID: {task._id.slice(-8)}</span>
             <div className="neo-border bg-primary-container px-2 py-0.5 font-headline font-black text-lg shadow-[2px_2px_0px_0px_rgba(48,52,44,1)]">
                ₹{task.budget}
             </div>
          </div>
        </header>
        
        <div className="space-y-6">
          <p className="font-body text-base leading-relaxed text-on-surface">
            {task.description}
          </p>
          
          {task.imageUrl && (
            <div className="neo-border shadow-[4px_4px_0px_0px_rgba(48,52,44,1)] overflow-hidden bg-surface-container">
              <img src={task.imageUrl} alt={task.title} className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-500" />
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t-[2px] border-on-surface border-dashed">
            <div>
              <label className="font-headline font-black text-[8px] uppercase tracking-[0.2em] opacity-50 mb-1 block">Deployment Zone</label>
              <p className="font-headline font-black text-sm uppercase leading-tight">{task.address}</p>
            </div>
            <div className="flex flex-col items-end">
              <label className="font-headline font-black text-[8px] uppercase tracking-[0.2em] opacity-50 mb-1 block">Economic Value</label>
              <p className="text-2xl font-black">₹{task.budget}</p>
            </div>
          </div>
        </div>
      </div>

      {/* WAITING FOR REAL HELPERS */}
      {task.status === "OPEN" && (
        <section className="space-y-4">
          <div className="card-neo bg-surface-container-low border-dashed py-12 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-[4px] border-on-surface border-b-transparent rounded-full animate-spin opacity-20"></div>
            <div>
              <h2 className="text-xl uppercase italic tracking-tighter opacity-50">Broadcasting Mission...</h2>
              <p className="font-headline font-black text-[9px] uppercase tracking-widest opacity-40">Waiting for a field operative to accept</p>
            </div>
          </div>
        </section>
      )}

      {/* ASSIGNED SECTION */}
      {task.status === "ASSIGNED" && task.helper && (
        <section className="space-y-4">
          <h2 className="text-xl uppercase italic tracking-tighter">Active Operative</h2>
          <div className="card-neo bg-tertiary-container flex flex-col md:flex-row justify-between items-center gap-4 p-4">
            <div className="text-center md:text-left">
               <h3 className="text-2xl uppercase mb-0.5">{task.helper.name}</h3>
               <p className="font-headline font-black text-[8px] uppercase tracking-widest opacity-70">En-route to destination</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button 
                className="btn-neo bg-surface-container-lowest flex-1 sm:flex-none text-[10px] py-2 px-4" 
                onClick={() => navigate(`/chat/${task._id}`, { state: { task } })}
              >
                OPEN COMMS
              </button>
              <button 
                className="btn-neo-primary flex-1 sm:flex-none text-[10px] py-2 px-4" 
                onClick={handleConfirmPoster}
              >
                CLOSE OPERATION
              </button>
            </div>
          </div>
        </section>
      )}

      {/* COMPLETED SECTION */}
      {task.status === "COMPLETED" && (
        <section>
          <div className="card-neo bg-secondary-container text-center py-10 space-y-6">
            <h2 className="text-4xl uppercase leading-none m-0">Operation Successful!</h2>
            <button 
              className="btn-neo-primary text-lg py-4 px-8 shadow-[6px_6px_0px_0px_rgba(48,52,44,1)] active:shadow-none" 
              onClick={() => navigate(`/payment/${task._id}`, { state: { task } })}
            >
              INITIALIZE WIRE TRANSFER →
            </button>
          </div>
        </section>
      )}

      {/* PAID SECTION */}
      {task.status === "PAID" && (
        <section>
          <div className="card-neo bg-secondary-container text-center py-10 space-y-6">
            <h2 className="text-4xl uppercase leading-none m-0">✓ Account Settled</h2>
            <p className="font-headline font-black uppercase text-sm opacity-80">This engagement is officially archived.</p>
            {task.rating && (
              <div className="pt-8 border-t-[2px] border-on-surface border-dashed">
                <label className="font-headline font-black text-[8px] uppercase tracking-[0.3em] mb-2 block">DEBRIEFING REPORT</label>
                <div className="text-2xl mb-2 tracking-widest">
                  {"★".repeat(task.rating)}{"☆".repeat(5 - task.rating)}
                </div>
                <p className="text-lg italic font-headline font-black uppercase">"{task.reviewText || "NO ADDITIONAL COMMENTS."}"</p>
              </div>
            )}
            <button className="btn-neo bg-surface-container-lowest text-[10px] py-2 px-4" onClick={() => navigate("/")}>RETURN TO DASHBOARD</button>
          </div>
        </section>
      )}
    </div>
  );
}
