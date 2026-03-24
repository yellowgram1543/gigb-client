import { create } from "zustand";
import api from "../api";

const useTaskStore = create((set) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/tasks");
      set({ tasks: response.data, loading: false });
    } catch (err) {
      console.error("Error fetching tasks:", err);
      set({ error: "Failed to load tasks", loading: false });
    }
  },

  addTask: (newTask) => {
    set((state) => ({
      tasks: [newTask, ...state.tasks]
    }));
  }
}));

export default useTaskStore;
