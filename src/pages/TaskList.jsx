import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import useTaskStore from "../store/taskStore";

export default function TaskList() {
  const navigate = useNavigate();
  const { tasks, loading, fetchTasks } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const openTasks = tasks.filter(t => t.status === "OPEN");
  const ongoingTasks = tasks.filter(t => t.status === "ASSIGNED");
  const completedTasks = tasks.filter(t => t.status === "COMPLETED" || t.status === "PAID");

  const BoardColumn = ({ title, taskList, colorClass, icon }) => (
    <div className={`flex-1 min-w-[320px] bg-surface-container neo-border p-6 shadow-[8px_8px_0px_0px_rgba(48,52,44,1)] flex flex-col gap-6 h-full`}>
      <div className="flex justify-between items-center pb-4 border-b-[3px] border-on-surface border-dashed">
        <h2 className="text-2xl uppercase flex items-center gap-3 m-0">
          <span className="material-symbols-outlined">{icon}</span> {title}
        </h2>
        <span className={`badge-neo ${colorClass} text-base px-3 py-1 shadow-[2px_2px_0px_0px_rgba(48,52,44,1)]`}>
          {taskList.length}
        </span>
      </div>

      <div className="flex flex-col gap-6 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
        {taskList.length === 0 ? (
          <div className="py-12 text-center border-4 border-dashed border-on-surface opacity-30">
            <p className="font-headline font-black uppercase text-xs">Zero Signal</p>
          </div>
        ) : (
          taskList.map(task => (
            <div 
              key={task._id} 
              className="card-neo p-4 cursor-pointer hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(48,52,44,1)] transition-all bg-surface-container-lowest"
              onClick={() => navigate(`/task/${task._id}`)}
            >
              <div className="flex justify-between items-center mb-4">
                <span className="neo-border bg-surface-container-lowest px-2 py-0.5 font-headline font-black text-sm shadow-[2px_2px_0px_0px_rgba(48,52,44,1)]">
                  ₹{task.budget}
                </span>
                <span className="font-headline font-black text-[10px] uppercase opacity-40">#{task._id.slice(-4)}</span>
              </div>
              <h3 className="text-xl mb-3 leading-tight uppercase line-clamp-2">{task.title}</h3>
              <p className="font-body text-xs opacity-70 line-clamp-2 mb-4">
                {task.description}
              </p>
              <div className="flex justify-between items-center pt-4 border-t-[3px] border-on-surface border-dashed">
                 <span className={`badge-neo ${colorClass} text-[9px] px-2 py-0.5`}>DETAILS →</span>
                 {task.imageUrl && <span className="material-symbols-outlined text-sm">image</span>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <header className="card-neo bg-primary-container relative">
        <div className="absolute -top-4 -right-4 badge-neo bg-tertiary-container px-4 py-1 text-xs">
          COMMAND CENTER
        </div>
        <h1 className="text-5xl uppercase mb-2">Operation Control 📌</h1>
        <p className="font-headline font-bold text-lg uppercase tracking-tight opacity-80">Track and manage the progress of your active neighborhood engagements.</p>
      </header>

      {loading ? (
        <div className="flex justify-center py-40">
           <div className="loader border-[6px] border-on-surface border-b-transparent rounded-full w-16 h-16 animate-spin"></div>
        </div>
      ) : (
        <div className="flex gap-10 overflow-x-auto pb-10 items-start scrollbar-hide">
          <BoardColumn title="Pending" taskList={openTasks} colorClass="bg-tertiary-container" icon="pending_actions"/>
          <BoardColumn title="In-Progress" taskList={ongoingTasks} colorClass="bg-primary-container" icon="engineering" />
          <BoardColumn title="Completed" taskList={completedTasks} colorClass="bg-secondary-container" icon="check_circle" />
        </div>
      )}
    </div>
  );
}
