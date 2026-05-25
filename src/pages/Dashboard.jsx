import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus } from 'lucide-react';
import Navbar from '../components/Navbar';
import { Mainfeed } from '../components/Mainfeed';
import { Createpost } from '../components/Createpost';
import { getCurrentUser, logout, updateProfile } from '../lib/auth';

const tabs = ['Corroborations', 'Latest', 'Investigations', 'Impact'];

export default function Dashboard() {
  const navigate = useNavigate();
  const [isWriting, setIsWriting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(() => getCurrentUser());
  const [centerPanel, setCenterPanel] = useState('feed');
  const [profileName, setProfileName] = useState(() => getCurrentUser()?.name || '');
  const [profilePhoto, setProfilePhoto] = useState(() => getCurrentUser()?.profile_photo || '');
  const [profileStatus, setProfileStatus] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileVersion, setProfileVersion] = useState(0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleOpenSettings = () => {
    const current = getCurrentUser();
    setCenterPanel('settings');
    setIsWriting(false);
    setProfileName(current?.name || '');
    setProfilePhoto(current?.profile_photo || '');
    setProfileStatus('');
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (file.size > 1_500_000) {
      setProfileStatus('Photo too large. Please choose a file under 1.5MB.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProfilePhoto(typeof reader.result === 'string' ? reader.result : '');
      setProfileStatus('');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    const trimmedName = profileName.trim();
    if (!trimmedName) {
      setProfileStatus('Username is required.');
      return;
    }

    setIsSavingProfile(true);
    setProfileStatus('');

    try {
      const updatedUser = await updateProfile({
        name: trimmedName,
        profilePhoto,
      });

      setUser(updatedUser);
      setProfileName(updatedUser.name || '');
      setProfilePhoto(updatedUser.profile_photo || '');
      setProfileStatus('Profile updated successfully.');
      setProfileVersion((value) => value + 1);
    } catch (error) {
      setProfileStatus(error instanceof Error ? error.message : 'Failed to update profile.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111]">
      <Navbar
        isWriting={isWriting}
        setIsWriting={setIsWriting}
        logoTo="/dashboard"
        userName={user?.name}
        userPhoto={user?.profile_photo}
        onLogout={handleLogout}
      />

      <main className="px-4 md:px-8 py-6 md:py-8">
        <div className="mx-auto" style={{ maxWidth: '1380px' }}>
          <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)_340px] items-start">
            <aside className="border border-[#ECECEC] bg-white p-5 md:p-6 lg:sticky lg:top-24">
              <h2 className="text-[10px] font-black uppercase tracking-[0.35em] text-[#D92D20] mb-4">
                Profile Related Settings
              </h2>

              <div className="space-y-4">
                <div className="border border-[#ECECEC] bg-[#FAFAFA] p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#8f8f8f] mb-2">User</p>
                  <div className="flex items-center gap-3">
                    {user?.profile_photo ? (
                      <img
                        src={user.profile_photo}
                        alt={user?.name || 'Contributor'}
                        className="w-12 h-12 rounded-full object-cover border border-[#ECECEC]"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[#111111] text-white flex items-center justify-center font-serif text-lg">
                        {String(user?.name || 'Contributor').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <p className="font-serif text-xl font-bold text-[#111111]">{user?.name || 'Contributor'}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <button
                    onClick={handleOpenSettings}
                    className="w-full border border-[#ECECEC] bg-white px-4 py-3 text-left font-medium hover:border-[#111111] transition-colors"
                  >
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
                ) : centerPanel === 'settings' ? (
                  <div className="max-w-2xl mx-auto border border-[#ECECEC] bg-[#FAFAFA] p-6 md:p-8 space-y-6">
                    <div>
                      <h2 className="text-[10px] font-black uppercase tracking-[0.35em] text-[#D92D20] mb-3">Account Settings</h2>
                      <p className="text-sm text-[#6b6b6b]">Update your username and profile photo. This photo appears beside your name in the dashboard and feed.</p>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.25em] text-[#8f8f8f]">Username</label>
                      <input
                        value={profileName}
                        onChange={(event) => setProfileName(event.target.value)}
                        maxLength={60}
                        className="w-full border border-[#ECECEC] bg-white px-4 py-3 text-sm text-[#111111] outline-none focus:border-[#111111]"
                        placeholder="Enter username"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.25em] text-[#8f8f8f]">Profile Photo</label>
                      <div className="flex items-center gap-4">
                        {profilePhoto ? (
                          <img src={profilePhoto} alt="Profile preview" className="w-16 h-16 rounded-full object-cover border border-[#ECECEC]" />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-[#111111] text-white flex items-center justify-center font-serif text-2xl">
                            {String(profileName || user?.name || 'U').charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex flex-col gap-2">
                          <input type="file" accept="image/*" onChange={handlePhotoChange} className="text-xs" />
                          {profilePhoto ? (
                            <button
                              type="button"
                              onClick={() => setProfilePhoto('')}
                              className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6b6b6b] hover:text-[#111111]"
                            >
                              Remove Photo
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    {profileStatus ? (
                      <p className={`text-sm ${profileStatus.includes('success') ? 'text-green-700' : 'text-[#D92D20]'}`}>
                        {profileStatus}
                      </p>
                    ) : null}

                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSavingProfile}
                        className="bg-[#111111] text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-[#D92D20] transition-colors disabled:opacity-50"
                      >
                        {isSavingProfile ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={() => setCenterPanel('feed')}
                        className="border border-[#ECECEC] bg-white px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:border-[#111111] transition-colors"
                      >
                        Back to Feed
                      </button>
                    </div>
                  </div>
                ) : (
                  <Mainfeed showFilter={false} profileVersion={profileVersion} />
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
