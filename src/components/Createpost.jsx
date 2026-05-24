import React, { useState } from 'react';
import { getAuthHeaders } from '../lib/auth';

export const Createpost = ({ onCancel }) => {
  // 1. State to store the input
  const [headline, setHeadline] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. Function to send data to the server
  const MAX_HEADLINE = 100;
  const MAX_CONTENT = 2000;

  const handlePrint = async () => {
    if (!headline.trim()) return; // Don't print empty headline
    if (headline.trim().length > MAX_HEADLINE) {
      alert(`Headline must be ${MAX_HEADLINE} characters or fewer`);
      return;
    }
    if (content.trim().length > MAX_CONTENT) {
      alert(`Content must be ${MAX_CONTENT} characters or fewer`);
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Send data to your Vercel API
      const response = await fetch('/api/create-print', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ headline: headline.trim(), content: content.trim() })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Printed successfully!"); // Replace with a toast notification later if you want
        setHeadline(""); // Clear the boxes
        setContent("");
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
      <div className="bg-white border border-[#ECECEC] p-8 rounded-sm">
        <h3 className="text-[10px] font-black uppercase tracking-[3px] text-[#D92D20] mb-6">Dispatch from the field</h3>
        
        <textarea
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          disabled={isSubmitting}
          className="w-full bg-transparent border border-[#111111] p-6 text-3xl md:text-5xl font-serif placeholder-[#8f8f8f] focus:ring-0 resize-none min-h-[120px] text-[#111111]"
          placeholder="What's the headline?"
          maxLength={100}
          rows={3}
          autoFocus
        />

        <div className="flex justify-between items-center mt-2">
          <div className="text-[11px] text-[#8f8f8f]">{headline.length}/{MAX_HEADLINE}</div>
          <div className="text-[11px] text-[#8f8f8f]">{content.length}/{MAX_CONTENT}</div>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
          className="w-full bg-transparent border-none mt-6 text-sm md:text-base font-sans placeholder-[#8f8f8f] focus:ring-0 resize-none min-h-30 text-[#444444]"
          placeholder="Write the full dispatch (max 2000 characters)"
          maxLength={2000}
        />

        
        
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-[#ECECEC]">
          <div className="flex gap-6 text-[#666666]">
            <button className="hover:text-[#111111] transition-colors text-[10px] font-bold">ADD SOURCE</button>
            <button className="hover:text-[#111111] transition-colors text-[10px] font-bold">ATTACH MEDIA</button>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={onCancel}
              disabled={isSubmitting}
              className="text-[#666666] hover:text-[#111111] text-[10px] font-black uppercase tracking-widest px-4 disabled:opacity-50"
            >
              Discard
            </button>
            
            <button 
              onClick={handlePrint}
              disabled={isSubmitting || !headline.trim()}
              className="bg-[#111111] text-white px-8 py-3 text-xs font-black uppercase tracking-widest hover:bg-[#D92D20] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "PRINTING..." : "PRINT"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
