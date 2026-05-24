import React, { useState, useEffect } from 'react';
import { MessageSquare, RotateCcw, Shield, Link } from "lucide-react";
import { Contextualfilter } from './Contextualfilter';

export const Mainfeed = () => {
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
    return <div className="text-amber-500 font-serif italic text-xl animate-pulse">Running the presses...</div>;
  }

  return (
    <div className="space-y-12">
      <Contextualfilter />
      
      {/* Map through the LIVE MongoDB data */}
      {prints.map((print) => (
        <div key={print._id} className="group border-b border-white/10 pb-10">
          
          {/* Header Section */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-zinc-800 border border-white/10 flex items-center justify-center font-serif italic text-lg text-white">
              {print.author_name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">{print.author_name}</span>
                {print.is_verified && (
                  <Shield size={12} className="text-amber-500" title="Verified Correspondent" />
                )}
              </div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">
                Field Report • {new Date(print.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          {/* Content Section */}
          <h2 className="text-3xl font-serif font-bold mb-4 text-white group-hover:text-zinc-300 cursor-pointer leading-tight">
            {/* Generate a headline from the first 8 words */}
            {print.content.split(' ').slice(0, 8).join(' ')}...
          </h2>
          <p className="text-zinc-400 leading-relaxed mb-6 max-w-2xl whitespace-pre-wrap">
            {print.content}
          </p>

          {/* Action Footer */}
          <div className="flex items-center gap-8 text-[10px] font-black tracking-widest text-zinc-500">
            <button className="flex items-center gap-2 hover:text-white transition-colors">
              <RotateCcw size={15} /> RE-PRINT ({print.reprints})
            </button>
            <button className="flex items-center gap-2 hover:text-white transition-colors">
              <MessageSquare size={15} /> VIEWPOINTS ({print.viewpoints})
            </button>
            <button className="flex items-center gap-2 hover:text-white transition-colors">
              <Link size={15}/> SHARE
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};