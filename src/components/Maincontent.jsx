import React from "react";
import { MessageSquare, RotateCcw, Share, Globe, Shield } from "lucide-react";

export default function SocialNewsFeed() {
  return (
    <section className="w-full bg-black text-white px-4 md:px-12 py-10">
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* LEFT COLUMN: THE PRINTING PRESS & FEED (70%) */}
        <div className="lg:w-[70%] space-y-10">
          
          {/* 1. THE PRINTING PRESS (The Post Box) */}
          <div className="bg-zinc-900/40 border border-white/10 p-6 rounded-sm">
            <h3 className="text-[10px] font-black uppercase tracking-[3px] text-amber-500 mb-4">Start a New Print</h3>
            <textarea 
              className="w-full bg-transparent border-none text-xl font-serif placeholder-zinc-700 focus:ring-0 resize-none"
              placeholder="What's the headline from the field?"
              rows="2"
            />
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
              <div className="flex gap-4 text-zinc-500">
                <button className="hover:text-white transition-colors text-[10px] font-bold">ADD SOURCE</button>
                <button className="hover:text-white transition-colors text-[10px] font-bold">UPLOAD IMAGE</button>
              </div>
              <button className="bg-white text-black px-6 py-2 text-xs font-black uppercase tracking-widest hover:bg-amber-500 transition-colors">
                PRINT IT
              </button>
            </div>
          </div>

          {/* 2. THE MAIN FEED */}
          <div className="space-y-12">
             {/* Feed Item */}
             <div className="group border-b border-white/10 pb-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-zinc-800 border border-white/10 flex items-center justify-center font-serif italic text-lg">A</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">Arjun Mehta</span>
                      <Shield size={12} className="text-amber-500" title="Verified Correspondent" />
                    </div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">Field Report • 12m ago</span>
                  </div>
                </div>
                
                <h2 className="text-3xl font-serif font-bold mb-4 group-hover:text-zinc-300 cursor-pointer leading-tight">
                  Water Shortage in Marathwada reaches critical levels as private tankers seize control.
                </h2>
                <p className="text-zinc-400 leading-relaxed mb-6 max-w-2xl">
                  Local sources report that tanker syndicates are now patrolling village wells, 
                  claiming ownership over public resources. Authorities remain silent...
                </p>

                <div className="flex items-center gap-8 text-[10px] font-black tracking-widest text-zinc-500">
                  <button className="flex items-center gap-2 hover:text-white transition-colors">
                    <RotateCcw size={14} /> RE-PRINT (1.2k)
                  </button>
                  <button className="flex items-center gap-2 hover:text-white transition-colors">
                    <MessageSquare size={14} /> CORROBORATE (42)
                  </button>
                  <button className="flex items-center gap-2 hover:text-white transition-colors">
                    <Share size={14} /> SHARE
                  </button>
                </div>
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: THE INTELLIGENCE DESK (30%) */}
        <div className="lg:w-[30%] space-y-10">
          
          {/* TRENDING TOPICS */}
          <div className="border-l border-white/10 pl-6">
            <h3 className="text-[10px] font-black uppercase tracking-[3px] text-amber-500 mb-6">Trending Investigations</h3>
            <ul className="space-y-6">
              {[
                { tag: "#CottonScam", prints: "14.2k", trend: "up" },
                { tag: "#DigitalPrivacyIndia", prints: "8.1k", trend: "stable" },
                { tag: "#VaranasiWeavers", prints: "5.4k", trend: "up" }
              ].map((item, index) => (
                <li key={index} className="cursor-pointer group">
                  <p className="font-serif text-lg font-bold group-hover:text-amber-500 transition-colors">{item.tag}</p>
                  <div className="flex justify-between items-center text-[10px] text-zinc-500 mt-1">
                    <span>{item.prints} PRINTS</span>
                    <span className="text-zinc-700 tracking-tighter">ACTIVE NOW</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* TOP CORRESPONDENTS */}
          <div className="border-l border-white/10 pl-6">
            <h3 className="text-[10px] font-black uppercase tracking-[3px] text-zinc-500 mb-6">Top Correspondents</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-zinc-900 rounded-full border border-white/10" />
                <span className="text-xs font-bold">@sana_iyer</span>
                <span className="text-[10px] text-zinc-600">82 Prints</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-zinc-900 rounded-full border border-white/10" />
                <span className="text-xs font-bold">@rahul_investigates</span>
                <span className="text-[10px] text-zinc-600">65 Prints</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
