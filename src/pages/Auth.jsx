import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password || (!isLogin && !name)) {
      setError("Incomplete data. Fill all fields.");
      setIsLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (loginError) throw loginError;
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        });
        if (signUpError) throw signUpError;
        alert("Verification required. Check your inbox.");
      }
      
      navigate("/");
    } catch (err) {
      setError(err.message || "System error. Retry.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-surface p-6">
      <div className="card-neo max-w-md w-full relative bg-surface-container-lowest">
        <div className="absolute -top-4 -left-4 badge-neo bg-primary-container px-4 py-1 text-xs">
          {isLogin ? "RETURNING CURATOR" : "NEW TALENT"}
        </div>
        
        <header className="mb-8 text-center">
          <h1 className="text-4xl uppercase mb-2">
            {isLogin ? "Curator Login" : "Join the Collective"}
          </h1>
          <p className="font-headline font-black text-[10px] uppercase tracking-[0.2em] opacity-50">
            {isLogin ? "GigB / Aggressive Curator" : "Access the Premium Marketplace"}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="font-headline font-black text-xs uppercase mb-2 block tracking-widest">Identify Yourself</label>
              <input 
                type="text" 
                placeholder="FULL NAME"
                className="input-neo w-full text-sm font-bold uppercase tracking-tighter"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="font-headline font-black text-xs uppercase mb-2 block tracking-widest">Digital Coordinates</label>
            <input 
              type="email" 
              placeholder="EMAIL ADDRESS"
              className="input-neo w-full text-sm font-bold uppercase tracking-tighter"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="font-headline font-black text-xs uppercase mb-2 block tracking-widest">Security Key</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="input-neo w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-error-container neo-border p-4 shadow-[4px_4px_0px_0px_rgba(48,52,44,1)]">
              <p className="font-headline font-black text-xs uppercase text-center m-0">
                ERROR: {error}
              </p>
            </div>
          )}

          <button 
            type="submit" 
            className="btn-neo-primary w-full text-xl py-4 shadow-[6px_6px_0px_0px_rgba(48,52,44,1)] active:shadow-none" 
            disabled={isLoading}
          >
            {isLoading ? "PROCESSING..." : (isLogin ? "ENTER SYSTEM →" : "CREATE IDENTITY →")}
          </button>
          
          <div className="border-t-[3px] border-on-surface border-dashed pt-6">
            <p className="text-center font-headline font-black text-xs uppercase">
              {isLogin ? "Identity missing?" : "Already verified?"}{" "}
              <button 
                type="button"
                onClick={() => { setIsLogin(!isLogin); setError(""); }}
                className="bg-primary-container px-3 py-1 neo-border shadow-[2px_2px_0px_0px_rgba(48,52,44,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                {isLogin ? "REGISTER" : "LOGIN"}
              </button>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
