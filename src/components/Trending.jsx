import React from 'react'

export const Trending = () => {
  return (
    <div className="border border-[#ECECEC] bg-white p-6">
            <h3 className="text-[10px] font-black uppercase tracking-[3px] text-[#D92D20] mb-6">Trending Investigations</h3>
            <ul className="space-y-6">
              {[
                { tag: "#CottonScam", prints: "14.2k", trend: "up" },
                { tag: "#DigitalPrivacyIndia", prints: "8.1k", trend: "stable" },
                { tag: "#VaranasiWeavers", prints: "5.4k", trend: "up" }
              ].map((item, index) => (
                <li key={index} className="cursor-pointer group border-b border-[#ECECEC] pb-4 last:border-b-0 last:pb-0">
                  <p className="font-serif text-lg font-bold text-[#111111] group-hover:text-[#D92D20] transition-colors">{item.tag}</p>
                  <div className="flex justify-between items-center text-[10px] text-[#6b6b6b] mt-1">
                    <span>{item.prints} PRINTS</span>
                    <span className="text-[#8f8f8f] tracking-tighter">ACTIVE NOW</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
  )
}
