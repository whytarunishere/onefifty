import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Top Navigation remains fixed */}
      <Navbar />

      {/* The 3-Column Dashboard Grid */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-6 pt-8">
        
        {/* SECTION 1: Left Navigation / User Profile (Takes up 3 columns) */}
        <aside className="hidden md:block md:col-span-3 border-r border-white/10 pr-6">
           <nav className="space-y-4">
             {/* Add your dashboard links here: My Prints, Drafts, Settings */}
             <button className="w-full text-left font-black uppercase text-amber-500 tracking-widest text-xs">My Feed</button>
             <button className="w-full text-left font-bold uppercase text-zinc-500 tracking-widest text-xs hover:text-white">Drafts</button>
           </nav>
        </aside>

        {/* SECTION 2: The Main Stage (Takes up 6 columns) */}
        <main className="col-span-1 md:col-span-6">
           {/* The <Outlet /> renders whatever child route is active (e.g., Mainfeed or Createpost) */}
           <Outlet />
        </main>

        {/* SECTION 3: Context / Trending / Stats (Takes up 3 columns) */}
        <aside className="hidden lg:block lg:col-span-3 border-l border-white/10 pl-6">
           {/* You can drop your <Trending /> and <Topcorrespondents /> components here */}
           <div className="text-[10px] font-black uppercase tracking-[3px] text-zinc-500 mb-6">
             Live Intelligence
           </div>
        </aside>

      </div>
    </div>
  );
};