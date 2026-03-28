import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import useTaskStore from "../store/taskStore";
import LocationPicker from "../components/LocationPicker";
import { supabase } from "../supabaseClient";

export default function PostTask() {
  const navigate = useNavigate();
  const addTask = useTaskStore((state) => state.addTask);
  
  // Form State
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    budget: "",
    lat: 12.9716,
    lng: 77.5946
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handlers
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleLocationSelect = (lat, lng) => {
    setFormData({ ...formData, lat, lng });
  };

  const nextStep = () => {
    if (step === 1 && (!formData.title || !formData.description)) {
      setError("Please fill in the title and description first!");
      return;
    }
    if (step === 2 && !formData.address) {
      setError("Please provide an address for the task.");
      return;
    }
    setError("");
    setStep(step + 1);
  };

  const prevStep = () => {
    setError("");
    setStep(step - 1);
  };

  const uploadImage = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `task-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('task-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('task-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.budget) {
      setError("Please set a budget for your task.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const response = await api.post("/tasks", {
        ...formData,
        budget: parseFloat(formData.budget),
        imageUrl: imageUrl,
        location: { lat: formData.lat, lng: formData.lng }
      });
      
      addTask(response.data);
      navigate("/");
    } catch (err) {
      console.error("Error saving task:", err);
      setError("Failed to save task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Helpers
  const renderProgressBar = () => (
    <div style={{ display: "flex", gap: "10px", marginBottom: "2rem", justifyContent: "center" }}>
      {[1, 2, 3].map((s) => (
        <div 
          key={s} 
          style={{ 
            height: "12px", 
            width: "60px", 
            borderRadius: "10px", 
            background: step >= s ? "var(--color-text)" : "var(--color-white)",
            border: "var(--border-thick)",
            boxShadow: "2px 2px 0px 0px var(--color-text)",
            transition: "all 0.3s ease"
          }} 
        />
      ))}
    </div>
  );

  return (
    <main style={{ padding: "0 20px 20px", maxWidth: "600px", margin: "0 auto" }}>
      <div className="card" style={{ minHeight: "450px", display: "flex", flexDirection: "column" }}>
        
        {renderProgressBar()}

        <h1 style={{ textAlign: "center", fontSize: "1.8rem" }}>
          {step === 1 && "What do you need help with?"}
          {step === 2 && "Where and When?"}
          {step === 3 && "Set your Budget"}
        </h1>
        
        <div className="dashed-divider"></div>

        <div style={{ flex: 1, marginTop: "1rem" }}>
          {/* STEP 1: BASICS */}
          {step === 1 && (
            <div className="fade-in">
              <div style={{ marginBottom: "1.5rem" }}>
                <label className="text-small" style={{ display: "block", marginBottom: "0.5rem" }}>TASK TITLE</label>
                <input name="title" placeholder="e.g., Fix my leaking sink" value={formData.title} onChange={handleChange} />
              </div>
              <div>
                <label className="text-small" style={{ display: "block", marginBottom: "0.5rem" }}>DESCRIPTION</label>
                <textarea name="description" placeholder="Describe the job in detail..." value={formData.description} onChange={handleChange} style={{ height: "150px" }} />
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION & IMAGE */}
          {step === 2 && (
            <div className="fade-in">
              <div style={{ marginBottom: "1.5rem" }}>
                <label className="text-small" style={{ display: "block", marginBottom: "0.5rem" }}>PICK LOCATION ON MAP</label>
                <div style={{ border: "var(--border-thick)", borderRadius: "var(--radius-soft)", overflow: "hidden", boxShadow: "4px 4px 0px 0px var(--color-text)" }}>
                  <LocationPicker onLocationSelect={handleLocationSelect} />
                </div>
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <label className="text-small" style={{ display: "block", marginBottom: "0.5rem" }}>FULL ADDRESS</label>
                <input name="address" placeholder="House/Flat No, Street Name" value={formData.address} onChange={handleChange} />
              </div>
              <div>
                <label className="text-small" style={{ display: "block", marginBottom: "0.5rem" }}>ADD A PHOTO (OPTIONAL)</label>
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ background: "var(--color-bg-light)", border: "2px dashed var(--color-text)", padding: "15px", borderRadius: "10px", width: "100%", cursor: "pointer" }} />
                {imageFile && <p className="text-small" style={{ color: "var(--color-text)", background: "var(--color-mint)", display: "inline-block", padding: "4px 10px", borderRadius: "10px", border: "2px solid var(--color-text)", marginTop: "10px" }}>✓ {imageFile.name} selected</p>}
              </div>
            </div>
          )}

          {/* STEP 3: BUDGET */}
          {step === 3 && (
            <div className="fade-in" style={{ textAlign: "center" }}>
              <div style={{ margin: "2rem 0" }}>
                <p style={{ fontWeight: 700, marginBottom: "1rem" }}>How much are you willing to pay?</p>
                <div style={{ position: "relative", maxWidth: "200px", margin: "0 auto" }}>
                  <span style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", fontWeight: 800, fontSize: "1.5rem", color: "var(--color-text)" }}>₹</span>
                  <input 
                    name="budget" 
                    type="number" 
                    placeholder="0.00" 
                    value={formData.budget} 
                    onChange={handleChange} 
                    style={{ paddingLeft: "45px", fontSize: "1.5rem", fontWeight: 800, textAlign: "center", background: "var(--color-yellow)", boxShadow: "4px 4px 0px 0px var(--color-text)" }} 
                  />
                </div>
              </div>
              
              <div className="card" style={{ background: "var(--color-accent-purple)", textAlign: "left", padding: "1.5rem", marginBottom: "2rem", boxShadow: "4px 4px 0px 0px var(--color-text)" }}>
                <p className="text-small" style={{ marginBottom: "10px", display: "inline-block", background: "var(--color-white)", padding: "2px 8px", borderRadius: "8px", border: "2px solid var(--color-text)" }}>SUMMARY</p>
                <p style={{ fontWeight: 900, fontSize: "1.2rem", marginBottom: "5px" }}>{formData.title || "No Title"}</p>
                <p className="text-small" style={{ opacity: 0.9, fontWeight: 700 }}>📍 {formData.address || "No Address Provided"}</p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div style={{ background: "var(--color-peach)", border: "var(--border-thick)", borderRadius: "10px", padding: "10px", marginBottom: "1.5rem", marginTop: "1rem" }}>
            <p style={{ color: "var(--color-text)", fontWeight: 800, textAlign: "center", margin: 0 }}>{error}</p>
          </div>
        )}

        {/* NAVIGATION BUTTONS */}
        <div style={{ display: "flex", gap: "15px", marginTop: "2rem" }}>
          {step > 1 && (
            <button className="btn btn-peach" onClick={prevStep} style={{ flex: 1, padding: "1rem" }} disabled={isSubmitting}>
              ← Back
            </button>
          )}
          
          {step < 3 ? (
            <button className="btn btn-primary" onClick={nextStep} style={{ flex: 2, padding: "1rem" }}>
              Next Step →
            </button>
          ) : (
            <button className="btn btn-secondary" onClick={handleSubmit} style={{ flex: 2, padding: "1rem" }} disabled={isSubmitting}>
              {isSubmitting ? "Posting..." : "Confirm & Post 🚀"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
