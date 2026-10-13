import React, { useState } from 'react';
import { SourceStatusItem } from '../../types';
import { Info } from 'lucide-react';

interface SourceStatusBadgeProps {
  source: SourceStatusItem;
  compact?: boolean;
}

export const SourceStatusBadge: React.FC<SourceStatusBadgeProps> = ({ source, compact = false }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const statusStyles: Record<string, { badge: string; dot: string }> = {
    live: {
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
      dot: 'bg-emerald-400 animate-pulse',
    },
    partially_available: {
      badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25',
      dot: 'bg-cyan-400',
    },
    rate_limited: {
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
      dot: 'bg-amber-400',
    },
    unavailable: {
      badge: 'bg-red-500/10 text-red-400 border-red-500/25',
      dot: 'bg-red-400',
    },
    demo_data: {
      badge: 'bg-purple-500/10 text-purple-400 border-purple-500/25',
      dot: 'bg-purple-400',
    },
  };

  const currentStyle = statusStyles[source.status] || statusStyles.demo_data;

  return (
    <div className="relative inline-block">
      <div
        className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md border text-xs font-medium cursor-help transition-colors ${currentStyle.badge}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
      >
        <span className={`w-2 h-2 rounded-full ${currentStyle.dot}`} />
        {!compact && <span className="text-slate-300 font-normal">{source.name}:</span>}
        <span className="font-semibold">{source.statusLabel}</span>
        <Info className="w-3 h-3 opacity-60 hover:opacity-100 transition-opacity" />
      </div>

      {showTooltip && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-navy-800 border border-slate-700 rounded-lg shadow-xl text-xs text-slate-200 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
          <div className="font-semibold text-white mb-1 flex items-center justify-between">
            <span>{source.name}</span>
            <span className="text-[10px] text-slate-400">{source.lastSync}</span>
          </div>
          <p className="text-slate-300 leading-relaxed">{source.tooltipText}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-navy-800" />
        </div>
      )}
    </div>
  );
};
