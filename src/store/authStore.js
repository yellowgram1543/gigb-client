import { create } from "zustand";

const useAuthStore = create((set) => ({
  isAuthenticated: localStorage.getItem("isLoggedIn") === "true",

  login: () => {
    localStorage.setItem("isLoggedIn", "true");
    set({ isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("isLoggedIn");
    set({ isAuthenticated: false });
  },
}));

export default useAuthStore;
