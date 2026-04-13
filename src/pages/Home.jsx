import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import useAuthStore from "../store/authStore";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get("/tasks");
        setTasks(response.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const activeCount = tasks.filter(t => t.status !== "COMPLETED" && t.status !== "PAID").length;
  
  const recentTasks = tasks
    .filter(t => t.status === "OPEN" || t.status === "ASSIGNED")
    .slice(0, 6);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero / Welcome */}
      <header className="card-neo bg-primary-container relative overflow-visible py-8">
         <div className="absolute -top-3 -right-3 badge-neo bg-tertiary-container px-3 py-1 text-[10px]">
            POSTER DASHBOARD
         </div>
         <h1 className="text-4xl md:text-5xl mb-2 uppercase leading-tight">Welcome, {user?.name || 'Curator'} 👋</h1>
         <p className="font-headline font-bold text-sm uppercase tracking-tight opacity-80">
           {loading ? "Analyzing Marketplace..." : `You are currently managing ${activeCount} active engagements.`}
         </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* STATS PANE */}
        <aside className="lg:col-span-4 space-y-6 sticky top-8">
          <div className="card-neo bg-secondary-container text-center py-6">
            <h2 className="text-6xl mb-1">{tasks.length}</h2>
            <p className="font-headline font-black uppercase tracking-widest text-[10px]">Total Engagements</p>
          </div>
          
          <div className="card-neo bg-tertiary-container text-center py-6">
            <h2 className="text-6xl mb-1">{activeCount}</h2>
            <p className="font-headline font-black uppercase tracking-widest text-[10px]">Active Now</p>
          </div>

          <button 
            className="btn-neo-primary w-full py-4 text-lg shadow-[6px_6px_0px_0px_rgba(48,52,44,1)] active:shadow-none"
            onClick={() => navigate("/post-task")}
          >
            + POST NEW GIG
          </button>
        </aside>

        {/* RECENT TASKS */}
        <section className="lg:col-span-8 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container neo-border p-4 shadow-[4px_4px_0px_0px_rgba(48,52,44,1)]">
            <h2 className="text-xl uppercase m-0">Recent Open Market</h2>
            <button 
              className="btn-neo bg-surface-container-lowest text-[10px] px-3 py-1.5"
              onClick={() => navigate("/tasks")}
            >
              VIEW ALL GIGS
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
               <div className="loader border-[4px] border-on-surface border-b-transparent rounded-full w-10 h-10 animate-spin"></div>
            </div>
          ) : recentTasks.length === 0 ? (
            <div className="card-neo text-center py-12 bg-surface-container border-dashed border-2">
              <p className="text-lg font-headline font-black uppercase mb-6 opacity-60">The market is quiet. Time to innovate.</p>
              <button className="btn-neo-primary" onClick={() => navigate("/post-task")}>LAUNCH FIRST GIG</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentTasks.map(task => (
                <div 
                  key={task._id} 
                  className="card-neo flex flex-col justify-between cursor-pointer min-h-[220px] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(48,52,44,1)] neo-interactive"
                  onClick={() => navigate(`/task/${task._id}`)}
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className={`badge-neo ${task.status === "OPEN" ? "bg-secondary-container" : "bg-primary-container"}`}>
                        {task.status}
                      </span>
                      <div className="neo-border bg-surface-container-lowest px-2 py-0.5 font-headline font-black text-sm shadow-[2px_2px_0px_0px_rgba(48,52,44,1)]">
                        ₹{task.budget}
                      </div>
                    </div>
                    <h3 className="text-xl mb-2 leading-tight uppercase">{task.title}</h3>
                    <p className="font-body text-[11px] text-on-surface opacity-80 line-clamp-3">
                      {task.description}
                    </p>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t-[2px] border-on-surface border-dashed flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-50">Ref: {task._id.slice(-6)}</span>
                    <p className="font-headline font-black uppercase tracking-tighter text-[10px] bg-tertiary-container px-2 py-0.5 neo-border shadow-[2px_2px_0px_0px_rgba(48,52,44,1)]">
                      DETAILS →
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
