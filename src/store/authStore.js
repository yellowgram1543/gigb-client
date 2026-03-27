import { create } from "zustand";
import { supabase } from "../supabaseClient";

const useAuthStore = create((set) => ({
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,

  setSession: (session) => {
    set({ 
      session, 
      user: session?.user || null, 
      isAuthenticated: !!session,
      isLoading: false 
    });
    
    if (session?.access_token) {
      localStorage.setItem("token", session.access_token);
    } else {
      localStorage.removeItem("token");
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("token");
    set({ user: null, session: null, isAuthenticated: false });
  },

  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      set({ 
        session, 
        user: session.user, 
        isAuthenticated: true,
        isLoading: false
      });
      localStorage.setItem("token", session.access_token);
    } else {
      set({ isLoading: false });
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        set({ session, user: session.user, isAuthenticated: true });
        localStorage.setItem("token", session.access_token);
      } else {
        set({ session: null, user: null, isAuthenticated: false });
        localStorage.removeItem("token");
      }
    });
  }
}));

export default useAuthStore;
