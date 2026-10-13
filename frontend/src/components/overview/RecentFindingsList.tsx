import React from 'react';
import { useBrandGuard } from '../../context/BrandGuardContext';
import { RiskBadge } from '../common/RiskBadge';
import { 
  Share2, 
  Smartphone, 
  ChevronRight, 
  Clock, 
  ArrowRight,
  ShieldAlert 
} from 'lucide-react';

export const RecentFindingsList: React.FC = () => {
  const { findings, openReportModal, setActivePage } = useBrandGuard();

  // Pick top 4 recent findings (first 4 items in findings)
  const recentItems = findings.slice(0, 4);

  return (
    <div className="p-5 rounded-2xl bg-navy-850 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Recent Impersonation Findings
            </h3>
            <p className="text-xs text-slate-400">
              Latest candidate threats flagged for review
            </p>
          </div>
        </div>

        <button
          onClick={() => setActivePage('findings')}
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 transition-colors"
        >
          <span>View all findings</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="divide-y divide-slate-800/80">
        {recentItems.map((finding) => (
          <div
            key={finding.id}
            onClick={() => openReportModal(finding)}
            className="group py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/30 px-3 -mx-3 rounded-xl transition-colors cursor-pointer"
          >
            {/* Left: Avatar + Title + Type */}
            <div className="flex items-center gap-3.5 min-w-0">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${finding.avatarColor} text-white font-bold flex items-center justify-center text-sm shadow-md flex-shrink-0`}>
                {finding.avatarInitials}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors truncate">
                    {finding.title}
                  </h4>
                  <span className="hidden md:inline-flex items-center gap-1 text-[10px] text-slate-400 px-2 py-0.5 rounded bg-navy-950 border border-slate-800">
                    {finding.type === 'social' ? (
                      <Share2 className="w-2.5 h-2.5 text-cyan-400" />
                    ) : (
                      <Smartphone className="w-2.5 h-2.5 text-amber-400" />
                    )}
                    <span>{finding.type === 'social' ? 'Social Profile' : 'Mobile App'}</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 truncate max-w-md">
                  {finding.mainReason}
                </p>
              </div>
            </div>

            {/* Right: Risk Badge + Timestamp + Arrow */}
            <div className="flex items-center gap-4 self-end sm:self-auto flex-shrink-0">
              <RiskBadge severity={finding.riskSeverity} size="sm" />

              <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3 text-slate-500" />
                {finding.detectedTime}
              </span>

              <div className="p-1 rounded-lg text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
