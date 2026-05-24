import React, { useState, useEffect } from 'react';
import { MessageSquare, RotateCcw, Shield, Link } from "lucide-react";
import { Contextualfilter } from './Contextualfilter';

export const Mainfeed = ({ showFilter = true }) => {
  const [prints, setPrints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Run this the moment the feed loads
  useEffect(() => {
    const fetchPrints = async () => {
      try {
        const response = await fetch('/api/get-prints');
        const data = await response.json();
        
        if (response.ok) {
          setPrints(data);
        } else {
          console.error("Failed to fetch prints:", data.error);
        }
      } catch (error) {
        console.error("Network error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrints();
  }, []);

  if (isLoading) {
    return <div className="text-[#D92D20] font-serif italic text-xl animate-pulse">Running the presses...</div>;
  }

  return (
    <div className="space-y-10">
      {showFilter ? <Contextualfilter /> : null}
      
      {/* Map through the LIVE MongoDB data */}
      {prints.map((print) => (
        <article key={print._id} className="group border border-[#ECECEC] bg-[#FAFAFA] p-6 md:p-7 hover:border-[#111111] transition-colors overflow-hidden">
          
          {/* Header Section */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#111111] border border-[#111111] flex items-center justify-center font-serif italic text-lg text-white shrink-0">
              {print.author_name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#111111]">{print.author_name}</span>
                {print.is_verified && (
                  <Shield size={12} className="text-[#D92D20]" title="Verified Correspondent" />
                )}
              </div>
              <span className="text-[10px] text-[#6b6b6b] uppercase tracking-tighter">
                Field Report • {new Date(print.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          {/* Content Section */}
          <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4 text-[#111111] group-hover:text-[#D92D20] cursor-pointer leading-tight transition-colors break-words max-w-full">
            {/* Generate a headline from the first 8 words */}
            {print.content.split(' ').slice(0, 8).join(' ')}...
          </h2>
          <p className="text-[#444444] leading-relaxed mb-6 max-w-2xl whitespace-pre-wrap break-words">
            {print.content}
          </p>

          {/* Action Footer */}
          <div className="flex flex-wrap items-center gap-6 text-[10px] font-black tracking-widest text-[#6b6b6b] pt-1">
            <button className="flex items-center gap-2 hover:text-[#111111] transition-colors">
              <RotateCcw size={15} /> RE-PRINT ({print.reprints})
            </button>
            <button className="flex items-center gap-2 hover:text-[#111111] transition-colors">
              <MessageSquare size={15} /> VIEWPOINTS ({print.viewpoints})
            </button>
            <button className="flex items-center gap-2 hover:text-[#111111] transition-colors">
              <Link size={15}/> SHARE
            </button>
          </div>
        </article>
      ))}
    </div>
  );
};