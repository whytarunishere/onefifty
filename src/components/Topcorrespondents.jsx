import React from 'react'

export const Topcorrespondents = () => {
  return (
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
  )
}
