import React from 'react';
import { useBrandGuard } from '../../context/BrandGuardContext';
import { 
  ShieldAlert, 
  ExternalLink, 
  Terminal, 
  Clock, 
  AlertTriangle, 
  Share2, 
  Smartphone, 
  CheckCircle2,
  ChevronRight,
  Flame,
  Radio
} from 'lucide-react';
import { Finding } from '../../types';

export const LiveThreatStream: React.FC = () => {
  const { 
    findings, 
    setSelectedFinding, 
    setActivePage, 
    isDemoMode,
    company,
    brandProfile
  } = useBrandGuard();

  // Active findings sorted by riskScore descending
  const streamFindings = findings
    .filter(f => f.status !== 'Dismissed' && f.status !== 'Resolved')
    .slice(0, 5);

  const getPlatformIcon = (platform: string, type: string) => {
    if (type === 'app') return <Smartphone className="w-3.5 h-3.5 text-purple-400" />;
    return <Share2 className="w-3.5 h-3.5 text-cyan-400" />;
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-500/15 text-red-400 border border-red-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            CRITICAL
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            HIGH
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-500/15 text-slate-300 border border-slate-500/30">
            MEDIUM
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl unlumen-card border border-cyan-500/25 overflow-hidden shadow-xl">
      {/* Stream Header */}
      <div className="px-5 py-3.5 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/70">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shadow-sm">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2 font-mono">
              <span>Live Threat Activity Feed</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            </h3>
            <p className="text-[10px] font-mono text-slate-400">
              Active incident telemetry for {brandProfile.brandName || company?.name || 'Protected Enterprise'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setActivePage('findings')}
          className="text-[11px] font-mono font-bold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 btn-smooth"
        >
          <span>All Findings ({findings.length})</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Threat List */}
      <div className="divide-y divide-slate-800/60">
        {streamFindings.length === 0 ? (
          <div className="p-8 text-center text-slate-400 font-mono text-xs">
            No active threat alerts detected for this brand perimeter.
          </div>
        ) : (
          streamFindings.map((finding) => (
            <div
              key={finding.id}
              onClick={() => setSelectedFinding(finding)}
              className="p-4 hover:bg-slate-900/50 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0 group-hover:border-cyan-500/50 group-hover:scale-105 transition-all mt-0.5 shadow-sm">
                  {getPlatformIcon(finding.platform, finding.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {finding.title}
                    </span>
                    {getSeverityBadge(finding.riskSeverity)}
                    <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700/50">
                      {finding.platform}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400">
                      Score: {finding.riskScore}/100
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 line-clamp-1 leading-relaxed">
                    {finding.mainReason}
                  </p>

                  <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500">
                    <span className="text-slate-400">
                      Handle: <span className="text-pink-400 font-semibold">{finding.usernameOrPackage}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {finding.detectedTime}
                    </span>
                    <span>•</span>
                    <span className={finding.id.startsWith('finding-') ? 'text-amber-400/80' : 'text-emerald-400/80'}>
                      {finding.id.startsWith('finding-') ? 'Simulated Heuristic' : 'Live Sensor'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-slate-950 hover:bg-slate-900 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 transition-all flex items-center gap-1 shadow-sm btn-smooth"
                >
                  <span>Investigate</span>
                  <ExternalLink className="w-3 h-3 text-cyan-400" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
