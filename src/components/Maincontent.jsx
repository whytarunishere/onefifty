import React from "react";
import { Mainfeed } from "./Mainfeed";
import { Createpost } from "./Createpost";
import { Trending } from "./Trending";
import { Topcorrespondents } from "./Topcorrespondents";

export default function Maincontent({ isWriting, setIsWriting }) {
  return (
    <section className="w-full bg-[#FAFAFA] text-[#111111] px-4 md:px-8 py-6 md:py-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="border border-[#ECECEC] bg-white p-6 md:p-8 grid gap-6 lg:grid-cols-[1.5fr_1fr] items-end">
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#D92D20]">Dashboard / Editorial Control Room</p>
            <h1 className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-tight text-[#111111] max-w-3xl">
              Track the story, shape the record, and publish with context.
            </h1>
            <p className="text-[#555555] text-base md:text-lg leading-relaxed max-w-2xl">
              Your dashboard brings the feed, the writing surface, and the live context panels into one reading space so the hierarchy feels obvious at a glance.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="border border-[#ECECEC] bg-[#FAFAFA] p-4">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#8f8f8f] mb-2">Live</p>
              <p className="font-serif text-3xl font-bold text-[#111111]">24</p>
            </div>
            <div className="border border-[#ECECEC] bg-[#FAFAFA] p-4">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#8f8f8f] mb-2">Drafts</p>
              <p className="font-serif text-3xl font-bold text-[#111111]">08</p>
            </div>
            <div className="border border-[#ECECEC] bg-[#FAFAFA] p-4">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#8f8f8f] mb-2">Alerts</p>
              <p className="font-serif text-3xl font-bold text-[#111111]">03</p>
            </div>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.9fr)] items-start">
          <div className="border border-[#ECECEC] bg-white p-5 md:p-8 shadow-[0_1px_0_rgba(17,17,17,0.02)]">
            {isWriting ? (
              <Createpost onCancel={() => setIsWriting(false)} />
            ) : (
              <div className="space-y-12">
                <Mainfeed />
              </div>
            )}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24">
            <div className="border border-[#ECECEC] bg-white p-6">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#D92D20] mb-3">Context Stack</p>
              <p className="text-sm leading-relaxed text-[#555555]">
                Side intelligence sits in a fixed column so it supports the feed instead of competing with it.
              </p>
            </div>
            <Trending />
            <Topcorrespondents />
          </aside>
        </div>
      </div>
    </section>
  );
}

