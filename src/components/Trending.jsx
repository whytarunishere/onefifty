import React from 'react'

export const Trending = () => {
  return (
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
  )
}
