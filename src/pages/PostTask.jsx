import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import useTaskStore from "../store/taskStore";
import LocationPicker from "../components/LocationPicker";
import { supabase } from "../supabaseClient";

export default function PostTask() {
  const navigate = useNavigate();
  const addTask = useTaskStore((state) => state.addTask);
  
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
      setError("Incomplete briefing. Provide title and description.");
      return;
    }
    if (step === 2 && !formData.address) {
      setError("Location coordinates missing. Provide an address.");
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
      setError("Budget not set. Assign a value.");
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
      setError("Launch failed. System error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderProgressBar = () => (
    <div className="flex gap-4 mb-12 justify-center">
      {[1, 2, 3].map((s) => (
        <div 
          key={s} 
          className={`h-4 w-16 neo-border transition-all duration-300 ${
            step >= s ? "bg-on-surface shadow-[2px_2px_0px_0px_rgba(243,227,145,1)]" : "bg-surface-container-lowest shadow-[2px_2px_0px_0px_rgba(48,52,44,1)]"
          }`} 
        />
      ))}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="card-neo bg-surface-container-lowest relative">
        <div className="absolute -top-4 -right-4 badge-neo bg-tertiary-container px-4 py-1 text-xs">
          STEP {step} OF 3
        </div>

        {renderProgressBar()}

        <header className="mb-8 text-center">
          <h1 className="text-4xl uppercase mb-2">
            {step === 1 && "The Briefing"}
            {step === 2 && "The Deployment"}
            {step === 3 && "The Investment"}
          </h1>
          <p className="font-headline font-black text-[10px] uppercase tracking-[0.2em] opacity-50">
            {step === 1 && "Specify the requirements for your task"}
            {step === 2 && "Where should the force be deployed?"}
            {step === 3 && "Set the value for this engagement"}
          </p>
        </header>
        
        <div className="border-t-[3px] border-on-surface border-dashed my-8"></div>

        <div className="min-h-[400px]">
          {/* STEP 1: BASICS */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <label className="font-headline font-black text-xs uppercase mb-2 block tracking-widest">GIG TITLE</label>
                <input 
                  name="title" 
                  placeholder="E.G., EMERGENCY PLUMBING FIX" 
                  className="input-neo w-full uppercase font-bold tracking-tighter"
                  value={formData.title} 
                  onChange={handleChange} 
                />
              </div>
              <div>
                <label className="font-headline font-black text-xs uppercase mb-2 block tracking-widest">MISSION PARAMETERS</label>
                <textarea 
                  name="description" 
                  placeholder="DESCRIBE THE OPERATION IN DETAIL..." 
                  className="input-neo w-full h-48 uppercase font-medium"
                  value={formData.description} 
                  onChange={handleChange} 
                />
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION & IMAGE */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <label className="font-headline font-black text-xs uppercase mb-2 block tracking-widest">COORDINATES</label>
                <div className="neo-border overflow-hidden shadow-[4px_4px_0px_0px_rgba(48,52,44,1)] mb-4 h-64">
                  <LocationPicker onLocationSelect={handleLocationSelect} />
                </div>
              </div>
              <div>
                <label className="font-headline font-black text-xs uppercase mb-2 block tracking-widest">STREET ADDRESS</label>
                <input 
                  name="address" 
                  placeholder="BUILDING, STREET, AREA" 
                  className="input-neo w-full uppercase font-bold tracking-tighter"
                  value={formData.address} 
                  onChange={handleChange} 
                />
              </div>
              <div>
                <label className="font-headline font-black text-xs uppercase mb-2 block tracking-widest">VISUAL INTEL (OPTIONAL)</label>
                <div className="relative group">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="neo-border border-dashed border-4 p-8 text-center group-hover:bg-surface-container transition-colors">
                     <span className="material-symbols-outlined text-4xl mb-2">add_a_photo</span>
                     <p className="font-headline font-black uppercase text-xs">Upload Mission Photos</p>
                  </div>
                </div>
                {imageFile && (
                  <div className="mt-4 flex items-center gap-2">
                    <span className="badge-neo bg-secondary-container">✓ {imageFile.name} READY</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: BUDGET */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in duration-300 py-10">
              <div className="text-center">
                <label className="font-headline font-black text-xs uppercase mb-6 block tracking-[0.5em]">SET THE VALUATION</label>
                <div className="relative inline-block mx-auto">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-4xl">₹</span>
                  <input 
                    name="budget" 
                    type="number" 
                    placeholder="0" 
                    className="input-neo text-center text-6xl font-black w-64 pl-12 bg-primary-container shadow-[8px_8px_0px_0px_rgba(48,52,44,1)] py-8"
                    value={formData.budget} 
                    onChange={handleChange} 
                  />
                </div>
              </div>
              
              <div className="card-neo bg-secondary-container relative overflow-visible mt-12">
                <div className="absolute -top-3 -left-3 badge-neo bg-surface-container-lowest">INTEL SUMMARY</div>
                <h3 className="text-2xl uppercase mb-2">{formData.title || "NO TITLE ASSIGNED"}</h3>
                <p className="font-headline font-black text-[10px] uppercase opacity-70">📍 {formData.address || "NO LOCATION SPECIFIED"}</p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-error-container neo-border p-4 shadow-[4px_4px_0px_0px_rgba(48,52,44,1)] my-6 animate-pulse">
            <p className="font-headline font-black text-xs uppercase text-center m-0">ALARM: {error}</p>
          </div>
        )}

        <footer className="flex gap-4 mt-12 border-t-[3px] border-on-surface border-dashed pt-8">
          {step > 1 && (
            <button 
              className="btn-neo bg-tertiary-container flex-1 py-4 text-lg" 
              onClick={prevStep} 
              disabled={isSubmitting}
            >
              ← RE-EVALUATE
            </button>
          )}
          
          {step < 3 ? (
            <button 
              className="btn-neo-primary flex-[2] py-4 text-xl" 
              onClick={nextStep}
            >
              PROCEED →
            </button>
          ) : (
            <button 
              className="btn-neo-secondary flex-[2] py-4 text-xl bg-secondary-container" 
              onClick={handleSubmit} 
              disabled={isSubmitting}
            >
              {isSubmitting ? "POSTING..." : "DEPLOY GIG 🚀"}
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}
