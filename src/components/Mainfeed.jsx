import React from 'react';
import { MessageSquare, RotateCcw, Shield, Link } from "lucide-react";
import { Contextualfilter } from './Contextualfilter';

//////////// 1. This would eventually come from an API/Database/////////////
const PRINTS_DATA = [{
    id: 1,
    author: "Arjun Mehta",
    initial: "A",
    isVerified: true,
    time: "12m ago",
    type: "Field Report",
    headline: "Water Shortage in Marathwada reaches critical levels as private tankers seize control.",
    excerpt: "Local sources report that tanker syndicates are now patrolling village wells, claiming ownership over public resources...",
    stats: { reprints: "1.2k", viewpoints: "42" }
  },
  {
    id: 2,
    author: "Sana Iyer",
    initial: "S",
    isVerified: false,
    time: "45m ago",
    type: "Investigation",
    headline: "The Paper Trail: Where the Mid-day Meal Funds actually go.",
    excerpt: "A three-month audit of primary schools in the district reveals a 40% discrepancy in procurement records...",
    stats: { reprints: "850", viewpoints: "12" }
  },
{
    id: 3,
    author: "Rahul Sharma",
    initial: "R",
    isVerified: true,
    time: "2h ago",
    type: "Opinion",
    headline: "The Future of Digital Journalism in India.",
    excerpt: "As traditional media faces challenges, independent journalists are exploring new ways to reach their audience...",
    stats: { reprints: "500", viewpoints: "25" }

},
{
    id: 4,
    author: "Priya Patel",
    initial: "P",
    isVerified: false,
    time: "5h ago",
    type: "Analysis",
    headline: "The Economics of Fake News: A Market Study.",
    excerpt: "An in-depth analysis of the financial incentives driving the spread of misinformation online...",
    stats: { reprints: "300", viewpoints: "18" }
}];

export const Mainfeed = () => {
  return (
    <div className="space-y-12">
      <Contextualfilter />
      {/* 2. Map through the array to create items dynamically */}
      {PRINTS_DATA.map((print) => (
        <div key={print.id} className="group border-b border-white/10 pb-10">
          
          {/* Header Section */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-zinc-800 border border-white/10 flex items-center justify-center font-serif italic text-lg text-white">
              {print.initial}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">{print.author}</span>
                {/* 3. Conditional Rendering: Only show shield if isVerified is true */}
                {print.isVerified && (
                  <Shield size={12} className="text-amber-500" title="Verified Correspondent" />
                )}
              </div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">
                {print.type} • {print.time}
              </span>
            </div>
          </div>
          
          {/* Content Section */}
          <h2 className="text-3xl font-serif font-bold mb-4 text-white group-hover:text-zinc-300 cursor-pointer leading-tight">
            {print.headline}
          </h2>
          <p className="text-zinc-400 leading-relaxed mb-6 max-w-2xl">
            {print.excerpt}
          </p>

          {/* Action Footer */}
          <div className="flex items-center gap-8 text-[10px] font-black tracking-widest text-zinc-500">
            <button className="flex items-center gap-2 hover:text-white transition-colors">
              <RotateCcw size={15} /> RE-PRINT ({print.stats.reprints})
            </button>
            <button className="flex items-center gap-2 hover:text-white transition-colors">
              <MessageSquare size={15} /> VIEWPOINTS ({print.stats.viewpoints})
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
