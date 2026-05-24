import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus } from 'lucide-react';
import Navbar from '../components/Navbar';
import { Mainfeed } from '../components/Mainfeed';
import { Createpost } from '../components/Createpost';
import { getCurrentUser, logout } from '../lib/auth';

const tabs = ['Corroborations', 'Latest', 'Investigations', 'Impact'];

export default function Dashboard() {
  const navigate = useNavigate();
  const [isWriting, setIsWriting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111]">
      <Navbar
        isWriting={isWriting}
        setIsWriting={setIsWriting}
        logoTo="/dashboard"
        userName={user?.name}
        onLogout={handleLogout}
      />

      <main className="px-4 md:px-8 py-6 md:py-8">
        <div className="mx-auto max-w-[1380px]">
          <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)_340px] items-start">
            <aside className="border border-[#ECECEC] bg-white p-5 md:p-6 lg:sticky lg:top-24">
              <h2 className="text-[10px] font-black uppercase tracking-[0.35em] text-[#D92D20] mb-4">
                Profile Related Settings
              </h2>

              <div className="space-y-4">
                <div className="border border-[#ECECEC] bg-[#FAFAFA] p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#8f8f8f] mb-2">User</p>
                  <p className="font-serif text-xl font-bold text-[#111111]">{user?.name || 'Contributor'}</p>
                </div>

                <div className="space-y-2 text-sm">
                  <button className="w-full border border-[#ECECEC] bg-white px-4 py-3 text-left font-medium hover:border-[#111111] transition-colors">
                    Account Settings
                  </button>
                  <button className="w-full border border-[#ECECEC] bg-white px-4 py-3 text-left font-medium hover:border-[#111111] transition-colors">
                    Saved Drafts
                  </button>
                  <button className="w-full border border-[#ECECEC] bg-white px-4 py-3 text-left font-medium hover:border-[#111111] transition-colors">
                    Notifications
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full border border-[#111111] bg-white px-4 py-3 text-left font-medium hover:bg-[#111111] hover:text-white transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </aside>

            <section className="space-y-4 min-w-0">
              <div className="border border-[#ECECEC] bg-white px-4 md:px-6 py-3">
                <div className="flex items-center gap-4 overflow-x-auto no-scrollbar whitespace-nowrap">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      className="text-[10px] font-black uppercase tracking-[0.3em] text-[#6b6b6b] hover:text-[#111111] transition-colors"
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border border-[#ECECEC] bg-white p-4 md:p-6 min-h-[60vh]">
                {isWriting ? (
                  <Createpost onCancel={() => setIsWriting(false)} />
                ) : (
                  <Mainfeed showFilter={false} />
                )}
              </div>
            </section>

            <aside className="space-y-4 lg:sticky lg:top-24">
              <div className="border border-[#ECECEC] bg-white p-4 md:p-5">
                <div className="flex items-center gap-3 border border-[#ECECEC] bg-[#FAFAFA] px-4 py-3">
                  <Search size={16} className="shrink-0 text-[#6b6b6b]" />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="search bar"
                    className="w-full bg-transparent outline-none text-sm text-[#111111] placeholder:text-[#8f8f8f]"
                  />
                </div>
              </div>

              <div className="border border-[#ECECEC] bg-white p-5">
                <h2 className="text-[10px] font-black uppercase tracking-[0.35em] text-[#D92D20] mb-4">
                  Trending
                </h2>
                <div className="space-y-4">
                  {['#CottonScam', '#DigitalPrivacyIndia', '#VaranasiWeavers'].map((tag) => (
                    <div key={tag} className="border-b border-[#ECECEC] pb-3 last:border-b-0 last:pb-0">
                      <p className="font-serif text-lg font-bold text-[#111111]">{tag}</p>
                      <p className="text-[10px] uppercase tracking-[0.25em] text-[#8f8f8f] mt-1">Active now</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-[#ECECEC] bg-white p-5">
                <h2 className="text-[10px] font-black uppercase tracking-[0.35em] text-[#D92D20] mb-4">
                  Relevant
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[#ECECEC] pb-2 text-sm">
                    <span className="font-medium">@sana_iyer</span>
                    <span className="text-[#6b6b6b]">82 Prints</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#ECECEC] pb-2 text-sm">
                    <span className="font-medium">@rahul_investigates</span>
                    <span className="text-[#6b6b6b]">65 Prints</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">@citydesk</span>
                    <span className="text-[#6b6b6b]">41 Prints</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
