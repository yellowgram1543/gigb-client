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
      updateTask(response.data);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-40">
        <div className="loader border-[6px] border-on-surface border-b-transparent rounded-full w-16 h-16 animate-spin"></div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <h1 className="text-4xl uppercase opacity-40">Gig Not Found</h1>
        <button className="btn-neo-primary mt-8" onClick={() => navigate("/")}>RETURN TO BASE</button>
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
    <div className="max-w-3xl mx-auto space-y-12 pb-20">
      <div className="card-neo bg-surface-container-lowest relative overflow-visible">
        <div className={`absolute -top-4 -right-4 badge-neo ${statusColors[task.status]} px-6 py-2 text-sm shadow-[4px_4px_0px_0px_rgba(48,52,44,1)]`}>
          {task.status}
        </div>
        
        <header className="mb-8 pb-8 border-b-[3px] border-on-surface border-dashed">
          <h1 className="text-5xl md:text-6xl uppercase leading-none mb-4">{task.title}</h1>
          <div className="flex items-center gap-4">
             <span className="font-headline font-black text-xs uppercase opacity-50 tracking-widest">Operation ID: {task._id.slice(-8)}</span>
             <div className="neo-border bg-primary-container px-3 py-0.5 font-headline font-black text-xl shadow-[2px_2px_0px_0px_rgba(48,52,44,1)]">
                ₹{task.budget}
             </div>
          </div>
        </header>
        
        <div className="space-y-8">
          <p className="font-body text-xl leading-relaxed text-on-surface">
            {task.description}
          </p>
          
          {task.imageUrl && (
            <div className="neo-border shadow-[8px_8px_0px_0px_rgba(48,52,44,1)] overflow-hidden bg-surface-container">
              <img src={task.imageUrl} alt={task.title} className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-500" />
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t-[3px] border-on-surface border-dashed">
            <div>
              <label className="font-headline font-black text-[10px] uppercase tracking-[0.3em] opacity-50 mb-2 block">Deployment Zone</label>
              <p className="font-headline font-black text-lg uppercase leading-tight">{task.address}</p>
            </div>
            <div className="flex flex-col items-end">
              <label className="font-headline font-black text-[10px] uppercase tracking-[0.3em] opacity-50 mb-2 block">Economic Value</label>
              <p className="text-4xl font-black">₹{task.budget}</p>
            </div>
          </div>
        </div>
      </div>

      {/* APPLICANTS SECTION */}
      {task.status === "OPEN" && (
        <section className="space-y-6">
          <h2 className="text-3xl uppercase italic tracking-tighter">Field Operatives (Applicants)</h2>
          <div className="grid grid-cols-1 gap-6">
            {applicants.map(app => (
              <div key={app.id} className="card-neo flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container-lowest hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-6">
                   <div className="w-12 h-12 neo-border bg-primary-container flex items-center justify-center font-black text-xl">
                      {app.name[0]}
                   </div>
                   <div>
                     <h3 className="text-2xl uppercase m-0 leading-none mb-1">{app.name}</h3>
                     <p className="font-headline font-black text-[10px] uppercase tracking-widest opacity-60">Rating: {app.rating} / {app.reviews} Reviews</p>
                   </div>
                </div>
                <button 
                  className="btn-neo-secondary w-full md:w-auto bg-secondary-container" 
                  onClick={() => handleUpdateStatus("ASSIGNED", app)}
                >
                  ASSIGN MISSION →
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ASSIGNED SECTION */}
      {task.status === "ASSIGNED" && task.helper && (
        <section className="space-y-6">
          <h2 className="text-3xl uppercase italic tracking-tighter">Active Operative</h2>
          <div className="card-neo bg-tertiary-container flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
               <h3 className="text-4xl uppercase mb-1">{task.helper.name}</h3>
               <p className="font-headline font-black text-xs uppercase tracking-widest opacity-70">En-route to destination</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <button 
                className="btn-neo bg-surface-container-lowest flex-1 sm:flex-none" 
                onClick={() => navigate(`/chat/${task._id}`, { state: { task } })}
              >
                OPEN COMMS
              </button>
              <button 
                className="btn-neo-primary flex-1 sm:flex-none" 
                onClick={() => handleUpdateStatus("COMPLETED")}
              >
                CLOSE OPERATION
              </button>
            </div>
          </div>
        </section>
      )}

      {/* COMPLETED SECTION */}
      {task.status === "COMPLETED" && (
        <section className="animate-bounce-in">
          <div className="card-neo bg-secondary-container text-center py-16 space-y-8">
            <h2 className="text-6xl uppercase leading-none">Operation Successful!</h2>
            <button 
              className="btn-neo-primary text-2xl py-6 px-12 shadow-[10px_10px_0px_0px_rgba(48,52,44,1)] active:shadow-none" 
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
          <div className="card-neo bg-secondary-container text-center py-16 space-y-8">
            <h2 className="text-6xl uppercase leading-none">✓ Account Settled</h2>
            <p className="font-headline font-black uppercase text-xl opacity-80">This engagement is officially archived.</p>
            {task.rating && (
              <div className="pt-12 border-t-[3px] border-on-surface border-dashed">
                <label className="font-headline font-black text-xs uppercase tracking-[0.5em] mb-4 block">DEBRIEFING REPORT</label>
                <div className="text-4xl mb-4 tracking-widest">
                  {"★".repeat(task.rating)}{"☆".repeat(5 - task.rating)}
                </div>
                <p className="text-2xl italic font-headline font-black uppercase">"{task.reviewText || "NO ADDITIONAL COMMENTS."}"</p>
              </div>
            )}
            <button className="btn-neo bg-surface-container-lowest" onClick={() => navigate("/")}>RETURN TO DASHBOARD</button>
          </div>
        </section>
      )}
    </div>
  );
}
