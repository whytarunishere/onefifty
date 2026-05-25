import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, RotateCcw, Shield, Link, Trash2, Send, Pencil } from 'lucide-react';
import { Contextualfilter } from './Contextualfilter';
import { getAuthHeaders, getCurrentUser } from '../lib/auth';

const MAX_PRINT_HEADLINE = 100;
const MAX_PRINT_CONTENT = 2000;
const MAX_VIEWPOINT_CONTENT = 1000;

const getId = (value) => {
  if (!value) return '';
  if (typeof value === 'object' && value.$oid) return value.$oid;
  return String(value);
};

const formatDate = (value) => {
  if (!value) return '';
  return new Date(value).toLocaleDateString();
};

const Avatar = ({ name, photo, size = 'w-10 h-10', textSize = 'text-lg' }) => {
  if (photo) {
    return <img src={photo} alt={name || 'Contributor'} className={`${size} rounded-full object-cover border border-[#ECECEC] shrink-0`} />;
  }

  return (
    <div className={`${size} rounded-full bg-[#111111] border border-[#111111] text-white flex items-center justify-center font-serif italic ${textSize} shrink-0`}>
      {String(name || 'U').charAt(0).toUpperCase()}
    </div>
  );
};

export const Mainfeed = ({ showFilter = true, profileVersion = 0 }) => {
  const queryClient = useQueryClient();
  const [prints, setPrints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [openViewpoints, setOpenViewpoints] = useState({});
  const [viewpointDrafts, setViewpointDrafts] = useState({});
  const [submittingPrintId, setSubmittingPrintId] = useState('');

  const [editingPrintId, setEditingPrintId] = useState('');
  const [editingHeadline, setEditingHeadline] = useState('');
  const [editingContent, setEditingContent] = useState('');
  const [savingPrintId, setSavingPrintId] = useState('');

  const [editingViewpointId, setEditingViewpointId] = useState('');
  const [editingViewpointPrintId, setEditingViewpointPrintId] = useState('');
  const [editingViewpointContent, setEditingViewpointContent] = useState('');
  const [savingViewpointId, setSavingViewpointId] = useState('');

  useEffect(() => {
    const fetchPrints = async () => {
      try {
        const response = await fetch('/api/get-prints');
        const data = await response.json();

        if (response.ok) {
          setPrints(data);
        } else {
          console.error('Failed to fetch prints:', data.error);
        }
      } catch (error) {
        console.error('Network error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrints();
  }, [profileVersion]);

  const currentUser = getCurrentUser();

  const openPrintIds = useMemo(() => {
    return Object.entries(openViewpoints)
      .filter(([, isOpen]) => isOpen)
      .map(([printId]) => printId);
  }, [openViewpoints]);

  const viewpointQueries = useQueries({
    queries: openPrintIds.map((printId) => ({
      queryKey: ['viewpoints', printId],
      queryFn: async () => {
        const response = await fetch(`/api/get-viewpoints?printId=${encodeURIComponent(printId)}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail ? `${data.error}: ${data.detail}` : (data.error || 'Failed to load viewpoints'));
        }

        return data;
      },
      enabled: Boolean(printId),
      refetchInterval: 8000,
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: true,
      staleTime: 2000,
    })),
  });

  const viewpointsByPrint = {};
  const viewpointMetaByPrint = {};

  openPrintIds.forEach((printId, index) => {
    const query = viewpointQueries[index];
    viewpointsByPrint[printId] = query?.data || [];
    viewpointMetaByPrint[printId] = {
      isLoading: Boolean(query?.isLoading || query?.isFetching),
      error: query?.error instanceof Error ? query.error.message : '',
    };
  });

  const createViewpointMutation = useMutation({
    mutationFn: async ({ printId, content }) => {
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

      return data.viewpoint;
    },
    onSuccess: (newViewpoint, variables) => {
      setViewpointDrafts((state) => ({ ...state, [variables.printId]: '' }));

      queryClient.setQueryData(['viewpoints', variables.printId], (current = []) => [
        ...current,
        newViewpoint,
      ]);

      setPrints((state) => state.map((item) => {
        const itemId = getId(item._id);
        if (itemId !== variables.printId) return item;

        return {
          ...item,
          viewpoints: Number(item.viewpoints || 0) + 1,
        };
      }));
    },
  });

  const reprintMutation = useMutation({
    mutationFn: async (printId) => {
      const response = await fetch('/api/reprint-print', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ id: printId }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail ? `${data.error}: ${data.detail}` : (data.error || 'Failed to reprint'));
      }

      return data.reprints;
    },
  });

  const updatePrintMutation = useMutation({
    mutationFn: async ({ id, headline, content }) => {
      const response = await fetch('/api/update-print', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ id, headline, content }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail ? `${data.error}: ${data.detail}` : (data.error || 'Failed to update print'));
      }

      return data.print;
    },
  });

  const updateViewpointMutation = useMutation({
    mutationFn: async ({ id, content }) => {
      const response = await fetch('/api/update-viewpoint', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ id, content }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail ? `${data.error}: ${data.detail}` : (data.error || 'Failed to update viewpoint'));
      }

      return data.viewpoint;
    },
  });

  if (isLoading) {
    return <div className="text-[#D92D20] font-serif italic text-xl animate-pulse">Running the presses...</div>;
  }

  const toggleExpand = (id) => {
    setExpanded((state) => ({ ...state, [id]: !state[id] }));
  };

  const toggleViewpoints = (printId) => {
    setOpenViewpoints((state) => ({
      ...state,
      [printId]: !state[printId],
    }));
  };

  const submitViewpoint = async (printId) => {
    if (!currentUser) {
      alert('Please sign in to add a viewpoint.');
      return;
    }

    const content = (viewpointDrafts[printId] || '').trim();
    if (!content) return;

    if (content.length > MAX_VIEWPOINT_CONTENT) {
      alert(`Viewpoint must be ${MAX_VIEWPOINT_CONTENT} characters or fewer.`);
      return;
    }

    setSubmittingPrintId(printId);
    try {
      await createViewpointMutation.mutateAsync({ printId, content });
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to add viewpoint');
    } finally {
      setSubmittingPrintId('');
    }
  };

  const handleReprint = async (printId) => {
    if (!currentUser) {
      alert('Please sign in to reprint a story.');
      return;
    }

    try {
      const result = await reprintMutation.mutateAsync(printId);

      setPrints((state) => state.map((item) => {
        const itemId = getId(item._id);
        if (itemId !== printId) return item;

        const currentReprintedBy = Array.isArray(item.reprinted_by) ? item.reprinted_by : [];
        const userId = String(currentUser.id);

        return {
          ...item,
          reprints: result,
          reprinted_by: result > Number(item.reprints || 0)
            ? [...currentReprintedBy, userId]
            : currentReprintedBy.filter((value) => String(value) !== userId),
        };
      }));

      queryClient.invalidateQueries({ queryKey: ['trending-prints'] });
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to reprint');
    }
  };

  const beginEditPrint = (print) => {
    const printId = getId(print._id);
    setEditingPrintId(printId);
    setEditingHeadline(print.headline || '');
    setEditingContent(print.content || '');
  };

  const savePrintEdit = async (printId) => {
    const headline = editingHeadline.trim();
    const content = editingContent.trim();

    if (!headline) {
      alert('Headline is required.');
      return;
    }

    if (headline.length > MAX_PRINT_HEADLINE) {
      alert(`Headline must be ${MAX_PRINT_HEADLINE} characters or fewer.`);
      return;
    }

    if (content.length > MAX_PRINT_CONTENT) {
      alert(`Content must be ${MAX_PRINT_CONTENT} characters or fewer.`);
      return;
    }

    setSavingPrintId(printId);
    try {
      const updatedPrint = await updatePrintMutation.mutateAsync({
        id: printId,
        headline,
        content,
      });

      setPrints((state) => state.map((item) => {
        const itemId = getId(item._id);
        if (itemId !== printId) return item;

        return {
          ...item,
          ...updatedPrint,
          _id: item._id,
          headline,
          content,
        };
      }));

      setEditingPrintId('');
      setEditingHeadline('');
      setEditingContent('');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update print');
    } finally {
      setSavingPrintId('');
    }
  };

  const beginEditViewpoint = (printId, viewpoint) => {
    const viewpointId = getId(viewpoint._id);
    setEditingViewpointId(viewpointId);
    setEditingViewpointPrintId(printId);
    setEditingViewpointContent(viewpoint.content || '');
  };

  const saveViewpointEdit = async (printId, viewpointId) => {
    const content = editingViewpointContent.trim();
    if (!content) {
      alert('Viewpoint is required.');
      return;
    }

    if (content.length > MAX_VIEWPOINT_CONTENT) {
      alert(`Viewpoint must be ${MAX_VIEWPOINT_CONTENT} characters or fewer.`);
      return;
    }

    setSavingViewpointId(viewpointId);
    try {
      const updatedViewpoint = await updateViewpointMutation.mutateAsync({
        id: viewpointId,
        content,
      });

      queryClient.setQueryData(['viewpoints', printId], (current = []) => {
        return current.map((item) => {
          const itemId = getId(item._id);
          if (itemId !== viewpointId) return item;
          return {
            ...item,
            ...updatedViewpoint,
            content,
          };
        });
      });

      setEditingViewpointId('');
      setEditingViewpointPrintId('');
      setEditingViewpointContent('');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update viewpoint');
    } finally {
      setSavingViewpointId('');
    }
  };

  return (
    <div className="space-y-10">
      {showFilter ? <Contextualfilter /> : null}

      {prints.map((print) => {
        const printId = getId(print._id);
        const printViewpoints = viewpointsByPrint[printId] || [];
        const viewpointsCount = Number(print.viewpoints || 0);
        const viewpointMeta = viewpointMetaByPrint[printId] || { isLoading: false, error: '' };
        const canEditPrint = currentUser && String(currentUser.id) === String(print.author_id);
        const isEditingPrint = editingPrintId === printId;

        return (
          <article key={printId || `${print.author_id}-${print.created_at}`} className="group border border-[#ECECEC] bg-[#FAFAFA] p-6 md:p-7 hover:border-[#111111] transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <Avatar name={print.author_name} photo={print.author_profile_photo} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#111111]">{print.author_name}</span>
                  {print.is_verified ? (
                    <Shield size={12} className="text-[#D92D20]" title="Verified Correspondent" />
                  ) : null}
                </div>
                <span className="text-[10px] text-[#6b6b6b] uppercase tracking-tighter">
                  Field Report • {formatDate(print.created_at)}
                </span>
              </div>
            </div>

            {isEditingPrint ? (
              <div className="space-y-4">
                <textarea
                  value={editingHeadline}
                  onChange={(event) => setEditingHeadline(event.target.value)}
                  className="w-full bg-white border border-[#111111] p-4 text-2xl font-serif text-[#111111] resize-none"
                  maxLength={MAX_PRINT_HEADLINE}
                  rows={2}
                />
                <textarea
                  value={editingContent}
                  onChange={(event) => setEditingContent(event.target.value)}
                  className="w-full bg-white border border-[#ECECEC] p-4 text-base text-[#444444] resize-none min-h-28"
                  maxLength={MAX_PRINT_CONTENT}
                />
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[11px] text-[#8f8f8f]">
                    {editingHeadline.length}/{MAX_PRINT_HEADLINE} headline • {editingContent.length}/{MAX_PRINT_CONTENT} content
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setEditingPrintId('');
                        setEditingHeadline('');
                        setEditingContent('');
                      }}
                      className="border border-[#ECECEC] px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:border-[#111111]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => savePrintEdit(printId)}
                      disabled={savingPrintId === printId}
                      className="bg-[#111111] text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-[#D92D20] disabled:opacity-50"
                    >
                      {savingPrintId === printId ? 'Saving...' : 'Save Print'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4 text-[#111111] group-hover:text-[#D92D20] leading-tight transition-colors wrap-break-word max-w-full">
                  {print.headline || (print.content ? `${print.content.split(' ').slice(0, 8).join(' ')}...` : '')}
                </h2>
                <p className="text-[#444444] leading-relaxed mb-6 whitespace-pre-wrap wrap-break-word text-base md:text-lg">
                  {print.content && print.content.length > 350 && !expanded[printId]
                    ? `${print.content.slice(0, 350)}...`
                    : print.content}
                </p>
                {print.content && print.content.length > 350 ? (
                  <button
                    onClick={() => toggleExpand(printId)}
                    className="text-sm text-[#111111] font-bold hover:text-[#D92D20]"
                  >
                    {expanded[printId] ? 'Show less' : 'Read more'}
                  </button>
                ) : null}
              </>
            )}

            <div className="flex flex-wrap items-center gap-6 text-[10px] font-black tracking-widest text-[#6b6b6b] pt-1 mt-2">
              <button
                onClick={() => handleReprint(printId)}
                disabled={reprintMutation.isPending}
                className="flex items-center gap-2 hover:text-[#111111] transition-colors disabled:opacity-50"
              >
                <RotateCcw size={15} /> RE-PRINT ({print.reprints})
              </button>
              <button
                onClick={() => toggleViewpoints(printId)}
                className="flex items-center gap-2 hover:text-[#111111] transition-colors"
              >
                <MessageSquare size={15} /> VIEWPOINTS ({viewpointsCount})
              </button>
              <button className="flex items-center gap-2 hover:text-[#111111] transition-colors">
                <Link size={15} /> SHARE
              </button>

              {canEditPrint ? (
                <button
                  onClick={() => beginEditPrint(print)}
                  className="flex items-center gap-2 hover:text-[#111111] transition-colors"
                >
                  <Pencil size={15} /> EDIT
                </button>
              ) : null}

              {canEditPrint ? (
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

                      setPrints((prev) => prev.filter((item) => getId(item._id) !== printId));
                    } catch (error) {
                      console.error('Delete failed', error);
                      alert('Network error while deleting print');
                    }
                  }}
                  className="flex items-center gap-2 hover:text-[#D92D20] text-[#D92D20] transition-colors"
                >
                  <Trash2 size={15} /> DELETE
                </button>
              ) : null}
            </div>

            {openViewpoints[printId] ? (
              <div className="mt-6 border-t border-[#ECECEC] pt-5 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-[#D92D20]">Viewpoints</h3>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#8f8f8f]">
                    {viewpointMeta.isLoading ? 'Loading...' : `${printViewpoints.length} comment${printViewpoints.length === 1 ? '' : 's'}`}
                  </span>
                </div>

                {viewpointMeta.error ? (
                  <p className="text-sm text-[#D92D20]">{viewpointMeta.error}</p>
                ) : null}

                <div className="space-y-3">
                  {printViewpoints.length > 0 ? printViewpoints.map((viewpoint) => {
                    const viewpointId = getId(viewpoint._id);
                    const canEditViewpoint = currentUser && String(currentUser.id) === String(viewpoint.author_id);
                    const isEditingViewpoint = editingViewpointId === viewpointId && editingViewpointPrintId === printId;

                    return (
                      <div key={viewpointId || `${viewpoint.print_id}-${viewpoint.created_at}`} className="bg-white border border-[#ECECEC] p-4">
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <Avatar name={viewpoint.author_name} photo={viewpoint.author_profile_photo} size="w-8 h-8" textSize="text-sm" />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-[#111111] truncate">{viewpoint.author_name || 'Anonymous Reader'}</span>
                                {viewpoint.is_verified ? (
                                  <Shield size={11} className="text-[#D92D20] shrink-0" title="Verified Correspondent" />
                                ) : null}
                              </div>
                              {viewpoint.updated_at ? (
                                <span className="text-[10px] uppercase tracking-[0.15em] text-[#8f8f8f]">Edited</span>
                              ) : null}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-[#8f8f8f]">
                              {formatDate(viewpoint.created_at)}
                            </span>
                            {canEditViewpoint ? (
                              <button
                                onClick={() => beginEditViewpoint(printId, viewpoint)}
                                className="text-[10px] font-black uppercase tracking-[0.15em] text-[#6b6b6b] hover:text-[#111111]"
                              >
                                Edit
                              </button>
                            ) : null}
                          </div>
                        </div>

                        {isEditingViewpoint ? (
                          <div className="space-y-3">
                            <textarea
                              value={editingViewpointContent}
                              onChange={(event) => setEditingViewpointContent(event.target.value)}
                              maxLength={MAX_VIEWPOINT_CONTENT}
                              className="w-full min-h-24 resize-none border border-[#ECECEC] bg-[#FAFAFA] p-3 text-sm text-[#111111]"
                            />
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-[11px] text-[#8f8f8f]">{editingViewpointContent.length}/{MAX_VIEWPOINT_CONTENT}</span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setEditingViewpointId('');
                                    setEditingViewpointPrintId('');
                                    setEditingViewpointContent('');
                                  }}
                                  className="border border-[#ECECEC] px-3 py-1 text-[10px] font-black uppercase tracking-widest hover:border-[#111111]"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => saveViewpointEdit(printId, viewpointId)}
                                  disabled={savingViewpointId === viewpointId}
                                  className="bg-[#111111] text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest hover:bg-[#D92D20] disabled:opacity-50"
                                >
                                  {savingViewpointId === viewpointId ? 'Saving...' : 'Save'}
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm leading-relaxed text-[#444444] whitespace-pre-wrap wrap-break-word">{viewpoint.content}</p>
                        )}
                      </div>
                    );
                  }) : (!viewpointMeta.isLoading ? (
                    <p className="text-sm text-[#8f8f8f] italic">No viewpoints yet. Start the discussion.</p>
                  ) : null)}
                </div>

                <div className="bg-white border border-[#ECECEC] p-4 space-y-3">
                  <textarea
                    value={viewpointDrafts[printId] || ''}
                    onChange={(event) => setViewpointDrafts((state) => ({ ...state, [printId]: event.target.value }))}
                    placeholder={currentUser ? 'Add your viewpoint...' : 'Sign in to add a viewpoint'}
                    disabled={submittingPrintId === printId || !currentUser}
                    className="w-full min-h-24 resize-none border border-[#ECECEC] bg-[#FAFAFA] p-3 text-sm text-[#111111] placeholder-[#8f8f8f] focus:border-[#111111] focus:ring-0 disabled:opacity-60"
                  />
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#8f8f8f]">
                      {currentUser ? 'Be specific and keep it grounded in the print.' : 'Authentication required.'}
                    </p>
                    <button
                      onClick={() => submitViewpoint(printId)}
                      disabled={submittingPrintId === printId || !currentUser || !(viewpointDrafts[printId] || '').trim()}
                      className="inline-flex items-center gap-2 bg-[#111111] text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-[#D92D20] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={13} /> {submittingPrintId === printId ? 'Posting...' : 'Post Viewpoint'}
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
};

