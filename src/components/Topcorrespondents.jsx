import React from 'react'

export const Topcorrespondents = () => {
  return (
    <div className="border border-[#ECECEC] bg-white p-6">
            <h3 className="text-[10px] font-black uppercase tracking-[3px] text-[#111111] mb-6">Top Correspondents</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-[#ECECEC] pb-3">
                <div className="w-8 h-8 bg-[#111111] rounded-full border border-[#111111]" />
                <span className="text-xs font-bold text-[#111111]">@sana_iyer</span>
                <span className="text-[10px] text-[#6b6b6b]">82 Prints</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#111111] rounded-full border border-[#111111]" />
                <span className="text-xs font-bold text-[#111111]">@rahul_investigates</span>
                <span className="text-[10px] text-[#6b6b6b]">65 Prints</span>
              </div>
            </div>
          </div>
  )
}
