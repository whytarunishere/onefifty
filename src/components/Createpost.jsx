import React, { useState } from 'react';

export const Createpost = ({ onCancel }) => {
  // 1. State to store the input
  const [headline, setHeadline] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. Function to send data to the server
  const handlePrint = async () => {
    if (!headline.trim()) return; // Don't print empty space
    
    setIsSubmitting(true);

    try {
      // Send data to your Vercel API
      const response = await fetch('/api/create-print', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ headline: headline })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Printed successfully!"); // Replace with a toast notification later if you want
        setHeadline(""); // Clear the box
        onCancel(); // Close the "Printing Press" and go back to feed
      } else {
        const errorMessage = data.detail ? `${data.error}: ${data.detail}` : data.error;
        console.error("Print API error:", data);
        alert("Error: " + errorMessage);
      }
    } catch (error) {
      console.error("Error printing:", error);
      alert("Failed to connect to the press.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-zinc-900/40 border border-white/10 p-8 rounded-sm">
        <h3 className="text-[10px] font-black uppercase tracking-[3px] text-amber-500 mb-6">Dispatch from the field</h3>
        
        <textarea
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          disabled={isSubmitting}
          className="w-full bg-transparent border-none text-2xl md:text-4xl font-serif placeholder-zinc-800 focus:ring-0 resize-none min-h-[200px] text-white"
          placeholder="What's the headline?"
          autoFocus
        />
        
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/5">
          <div className="flex gap-6 text-zinc-500">
            <button className="hover:text-white transition-colors text-[10px] font-bold">ADD SOURCE</button>
            <button className="hover:text-white transition-colors text-[10px] font-bold">ATTACH MEDIA</button>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={onCancel}
              disabled={isSubmitting}
              className="text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-widest px-4 disabled:opacity-50"
            >
              Discard
            </button>
            
            <button 
              onClick={handlePrint}
              disabled={isSubmitting || !headline.trim()}
              className="bg-white text-black px-8 py-3 text-xs font-black uppercase tracking-widest hover:bg-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "PRINTING..." : "PRINT"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
