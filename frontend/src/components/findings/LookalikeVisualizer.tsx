import React from 'react';
import { LookalikeDetail } from '../../types';
import { CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface LookalikeVisualizerProps {
  lookalike: LookalikeDetail;
}

export const LookalikeVisualizer: React.FC<LookalikeVisualizerProps> = ({ lookalike }) => {
  return (
    <div className="p-4 rounded-xl bg-navy-850 border border-slate-800 space-y-3">
      <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
        <span className="font-semibold text-slate-300">Name Match & Anomaly Analysis</span>
        <span className="text-[11px] text-cyan-400 capitalize">
          {lookalike.differenceType.replace('_', ' ')}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Official reference */}
        <div className="p-3 rounded-lg bg-navy-900 border border-emerald-500/30">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Official Brand Asset</span>
          </div>
          <div className="text-sm font-mono font-bold text-white tracking-wide">
            {lookalike.official}
          </div>
        </div>

        {/* Candidate analyzed */}
        <div className="p-3 rounded-lg bg-navy-900 border border-red-500/30">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-red-400 mb-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Candidate Name (Flagged)</span>
          </div>
          <div className="text-sm font-mono font-bold text-white flex flex-wrap items-center gap-0.5">
            {lookalike.highlightedParts.map((part, idx) => (
              <span
                key={idx}
                className={
                  part.isDifferent
                    ? 'bg-red-500/25 text-red-300 px-1 py-0.5 rounded border border-red-500/40 font-extrabold'
                    : 'text-slate-200'
                }
                title={part.differenceLabel || undefined}
              >
                {part.text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Explanation note */}
      <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-2">
        <ArrowRight className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
        <p>{lookalike.explanation}</p>
      </div>
    </div>
  );
};
