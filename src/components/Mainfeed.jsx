import React, { useState, useEffect } from 'react';
import { MessageSquare, RotateCcw, Shield, Link, Trash2, Send } from "lucide-react";
import { Contextualfilter } from './Contextualfilter';
import { getCurrentUser, getAuthHeaders } from '../lib/auth';

export const Mainfeed = ({ showFilter = true }) => {
  const [prints, setPrints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [expanded, setExpanded] = useState({});
  const [openViewpoints, setOpenViewpoints] = useState({});
  const [viewpointsByPrint, setViewpointsByPrint] = useState({});
  const [viewpointDrafts, setViewpointDrafts] = useState({});
  const [loadingViewpoints, setLoadingViewpoints] = useState({});
  const [submittingViewpoints, setSubmittingViewpoints] = useState({});
  const [viewpointErrors, setViewpointErrors] = useState({});

  // Run this the moment the feed loads
  useEffect(() => {
    const fetchPrints = async () => {
      try {
        const response = await fetch('/api/get-prints');
        const data = await response.json();
        
        if (response.ok) {
          setPrints(data);
        } else {
          console.error("Failed to fetch prints:", data.error);
        }
      } catch (error) {
        console.error("Network error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrints();
  }, []);

  if (isLoading) {
    return <div className="text-[#D92D20] font-serif italic text-xl animate-pulse">Running the presses...</div>;
  }

  const toggleExpand = (id) => {
    setExpanded((s) => ({ ...s, [id]: !s[id] }));
  };

  const getPrintId = (print) => {
    if (!print || !print._id) return '';
    return typeof print._id === 'object' && print._id.$oid ? print._id.$oid : String(print._id);
  };

  const ensureViewpointsLoaded = async (printId) => {
    if (!printId || viewpointsByPrint[printId] || loadingViewpoints[printId]) {
      return;
    }

    setLoadingViewpoints((state) => ({ ...state, [printId]: true }));
    setViewpointErrors((state) => ({ ...state, [printId]: '' }));

    try {
      const response = await fetch(`/api/get-viewpoints?printId=${encodeURIComponent(printId)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail ? `${data.error}: ${data.detail}` : (data.error || 'Failed to load viewpoints'));
      }

      setViewpointsByPrint((state) => ({ ...state, [printId]: data }));
    } catch (error) {
      console.error('Failed to load viewpoints', error);
      setViewpointErrors((state) => ({ ...state, [printId]: error instanceof Error ? error.message : 'Failed to load viewpoints' }));
    } finally {
      setLoadingViewpoints((state) => ({ ...state, [printId]: false }));
    }
  };

  const toggleViewpoints = async (print) => {
    const printId = getPrintId(print);
    if (!printId) return;

    setOpenViewpoints((state) => {
      const next = !state[printId];
      return { ...state, [printId]: next };
    });

    await ensureViewpointsLoaded(printId);
  };

  const submitViewpoint = async (print) => {
    const printId = getPrintId(print);
    if (!printId) return;

    const currentUser = getCurrentUser();
    if (!currentUser) {
      alert('Please sign in to add a viewpoint.');
      return;
    }

    const content = (viewpointDrafts[printId] || '').trim();
    if (!content) return;

    setSubmittingViewpoints((state) => ({ ...state, [printId]: true }));
    setViewpointErrors((state) => ({ ...state, [printId]: '' }));

    try {
      const response = await fetch('/api/create-viewpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ printId, content }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail ? `${data.error}: ${data.detail}` : (data.error || 'Failed to add viewpoint'));
      }

      setViewpointDrafts((state) => ({ ...state, [printId]: '' }));
      setViewpointsByPrint((state) => ({
        ...state,
        [printId]: [...(state[printId] || []), data.viewpoint],
      }));
      setPrints((state) => state.map((item) => {
        const itemId = getPrintId(item);
        if (itemId !== printId) return item;

        return {
          ...item,
          viewpoints: Number(item.viewpoints || 0) + 1,
        };
      }));
    } catch (error) {
      console.error('Failed to submit viewpoint', error);
      setViewpointErrors((state) => ({ ...state, [printId]: error instanceof Error ? error.message : 'Failed to add viewpoint' }));
    } finally {
      setSubmittingViewpoints((state) => ({ ...state, [printId]: false }));
    }
  };

  return (
    <div className="space-y-10">
      {showFilter ? <Contextualfilter /> : null}
      
      {/* Map through the LIVE MongoDB data */}
      {prints.map((print) => {
        const printId = getPrintId(print);
        const printViewpoints = viewpointsByPrint[printId] || [];
        const viewpointsCount = Number(print.viewpoints || 0);

        return (
        <article key={printId || print._id} className="group border border-[#ECECEC] bg-[#FAFAFA] p-6 md:p-7 hover:border-[#111111] transition-colors">
          
          {/* Header Section */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#111111] border border-[#111111] flex items-center justify-center font-serif italic text-lg text-white shrink-0">
              {print.author_name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#111111]">{print.author_name}</span>
                {print.is_verified && (
                  <Shield size={12} className="text-[#D92D20]" title="Verified Correspondent" />
                )}
              </div>
              <span className="text-[10px] text-[#6b6b6b] uppercase tracking-tighter">
                Field Report • {new Date(print.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          {/* Content Section */}
          <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4 text-[#111111] group-hover:text-[#D92D20] cursor-pointer leading-tight transition-colors wrap-break-word max-w-full">
            {print.headline || (print.content ? print.content.split(' ').slice(0, 8).join(' ') + '...' : '')}
          </h2>
          <p className="text-[#444444] leading-relaxed mb-6 whitespace-pre-wrap wrap-break-word text-base md:text-lg">
            {print.content && print.content.length > 350 && !expanded[print._id]
              ? print.content.slice(0, 350) + '...'
              : print.content}
          </p>

          {print.content && print.content.length > 350 && (
            <button
              onClick={() => toggleExpand(print._id)}
              className="text-sm text-[#111111] font-bold hover:text-[#D92D20]"
            >
              {expanded[print._id] ? 'Show less' : 'Read more'}
            </button>
          )}

          {/* Action Footer */}
          <div className="flex flex-wrap items-center gap-6 text-[10px] font-black tracking-widest text-[#6b6b6b] pt-1">
            <button className="flex items-center gap-2 hover:text-[#111111] transition-colors">
              <RotateCcw size={15} /> RE-PRINT ({print.reprints})
            </button>
            <button
              onClick={() => toggleViewpoints(print)}
              className="flex items-center gap-2 hover:text-[#111111] transition-colors"
            >
              <MessageSquare size={15} /> VIEWPOINTS ({viewpointsCount})
            </button>
            <button className="flex items-center gap-2 hover:text-[#111111] transition-colors">
              <Link size={15}/> SHARE
            </button>
            {/* Show Delete only for the print author */}
            {(() => {
              const current = getCurrentUser();
              if (current && String(current.id) === String(print.author_id)) {
                return (
                  <button
                    onClick={async () => {
                      const ok = window.confirm('Delete this print? This cannot be undone.');
                      if (!ok) return;

                      try {
                        const resp = await fetch('/api/delete-print', {
                          method: 'DELETE',
                          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                          body: JSON.stringify({ id: print._id }),
                        });

                        const data = await resp.json();
                        if (!resp.ok) {
                          alert(data.detail || data.error || 'Failed to delete');
                          return;
                        }

                        // Remove locally
                        setPrints((prev) => prev.filter((p) => {
                          const pid = p._id && p._id.$oid ? p._id.$oid : p._id;
                          return String(pid) !== String(print._id) && String(pid) !== String(print._id?.$oid);
                        }));
                      } catch (err) {
                        console.error('Delete failed', err);
                        alert('Network error while deleting print');
                      }
                    }}
                    className="flex items-center gap-2 hover:text-[#D92D20] text-[#D92D20] transition-colors"
                  >
                    <Trash2 size={15} /> DELETE
                  </button>
                )
              }

              return null
            })()}
          </div>

          {openViewpoints[printId] && (
            <div className="mt-6 border-t border-[#ECECEC] pt-5 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-[#D92D20]">Viewpoints</h3>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#8f8f8f]">
                  {loadingViewpoints[printId] ? 'Loading...' : `${printViewpoints.length} comment${printViewpoints.length === 1 ? '' : 's'}`}
                </span>
              </div>

              {viewpointErrors[printId] ? (
                <p className="text-sm text-[#D92D20]">{viewpointErrors[printId]}</p>
              ) : null}

              <div className="space-y-3">
                {printViewpoints.length > 0 ? printViewpoints.map((viewpoint) => (
                  <div key={viewpoint._id || `${viewpoint.print_id}-${viewpoint.created_at}`} className="bg-white border border-[#ECECEC] p-4">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-bold text-sm text-[#111111] truncate">{viewpoint.author_name || 'Anonymous Reader'}</span>
                        {viewpoint.is_verified && (
                          <Shield size={11} className="text-[#D92D20] shrink-0" title="Verified Correspondent" />
                        )}
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#8f8f8f] shrink-0">
                        {viewpoint.created_at ? new Date(viewpoint.created_at).toLocaleDateString() : ''}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-[#444444] whitespace-pre-wrap wrap-break-word">{viewpoint.content}</p>
                  </div>
                )) : (!loadingViewpoints[printId] && (
                  <p className="text-sm text-[#8f8f8f] italic">No viewpoints yet. Start the discussion.</p>
                ))}
              </div>

              <div className="bg-white border border-[#ECECEC] p-4 space-y-3">
                <textarea
                  value={viewpointDrafts[printId] || ''}
                  onChange={(e) => setViewpointDrafts((state) => ({ ...state, [printId]: e.target.value }))}
                  placeholder={getCurrentUser() ? 'Add your viewpoint...' : 'Sign in to add a viewpoint'}
                  disabled={submittingViewpoints[printId] || !getCurrentUser()}
                  className="w-full min-h-24 resize-none border border-[#ECECEC] bg-[#FAFAFA] p-3 text-sm text-[#111111] placeholder-[#8f8f8f] focus:border-[#111111] focus:ring-0 disabled:opacity-60"
                />
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#8f8f8f]">
                    {getCurrentUser() ? 'Be specific and keep it grounded in the print.' : 'Authentication required.'}
                  </p>
                  <button
                    onClick={() => submitViewpoint(print)}
                    disabled={submittingViewpoints[printId] || !getCurrentUser() || !(viewpointDrafts[printId] || '').trim()}
                    className="inline-flex items-center gap-2 bg-[#111111] text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-[#D92D20] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={13} /> {submittingViewpoints[printId] ? 'Posting...' : 'Post Viewpoint'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </article>
        );
      })}
    </div>
  );
};