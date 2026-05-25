import React from 'react';
import { useQuery } from '@tanstack/react-query';

const fetchTrendingPrints = async () => {
  const response = await fetch('/api/get-prints');
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail ? `${data.error}: ${data.detail}` : (data.error || 'Failed to load trending prints'));
  }

  return data
    .slice()
    .sort((left, right) => Number(right.reprints || 0) - Number(left.reprints || 0))
    .slice(0, 5);
};

const formatCount = (value) => {
  const count = Number(value || 0);
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return String(count);
};

export const Trending = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['trending-prints'],
    queryFn: fetchTrendingPrints,
    staleTime: 30_000,
    refetchInterval: 30_000,
  });

  return (
    <div className="border border-[#ECECEC] bg-white p-6">
      <h3 className="text-[20px] font-semibold uppercase tracking-[0.3em] text-[#D92D20] mb-4">Trending </h3>

      {isLoading ? (
        <p className="text-sm text-[#8f8f8f] italic">Loading the most reprinted stories...</p>
      ) : null}

      {isError ? (
        <p className="text-sm text-[#D92D20]">{error instanceof Error ? error.message : 'Failed to load trending stories'}</p>
      ) : null}

      <ul className="space-y-3">
        {(data || []).map((item, index) => (
          <li key={item._id || index} className="cursor-pointer group border-b border-[#ECECEC] pb-4 last:border-b-0 last:pb-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#8f8f8f] mb-1">#{index + 1}</p>
                <p className="font-sans text-md font-bold text-[#111111] group-hover:text-[#D92D20] transition-colors line-clamp-2">
                  {item.headline || (item.content ? item.content.split(' ').slice(0, 7).join(' ') + '...' : 'Untitled print')}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center text-[10px] text-[#6b6b6b] mt-2">
              <span>{formatCount(item.reprints)} REPRINTS</span>
              <span className="text-[#8f8f8f] tracking-tighter">ACTIVE NOW</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
