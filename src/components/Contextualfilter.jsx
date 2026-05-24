import React from 'react'

export const Contextualfilter = () => {
    return (
        <div className="flex items-center gap-8 border-b border-[#ECECEC] pb-4 overflow-x-auto no-scrollbar">
            {["Latest", "Investigations", "Impact", "Corroborations"].map((tab) => (
                <button
                    key={tab}
                    className="text-[10px] font-black uppercase tracking-[2px] text-[#6b6b6b] hover:text-[#D92D20] focus:border-b-2 focus:border-[#D92D20] pb-4 -mb-4"
                >
                    {tab}
                </button>
            ))}
        </div>
    )
}
