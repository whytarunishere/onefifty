import React from 'react'

export const Contextualfilter = () => {
    return (
        <div className="flex items-center gap-8 border-b border-white/10 pb-4 overflow-x-auto no-scrollbar">
            {["Latest", "Investigations", "Impact", "Corroborations"].map((tab) => (
                <button
                    key={tab}
                    className="text-[10px] font-black uppercase tracking-[2px] text-zinc-500  hover:text-amber-500 focus:border-b-2 focus:border-amber-500 pb-4 -mb-4"
                >
                    {tab}
                </button>
            ))}
        </div>
    )
}
