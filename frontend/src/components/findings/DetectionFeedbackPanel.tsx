import React, { useMemo } from 'react';
import { useBrandGuard } from '../../context/BrandGuardContext';
import { 
  SlidersHorizontal, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Activity, 
  Cpu, 
  AlertCircle, 
  Info,
  Layers,
  Sparkles
} from 'lucide-react';

export const DetectionFeedbackPanel: React.FC = () => {
  const { findings, counts } = useBrandGuard();

  // Calculate metrics based on current findings state
  const metrics = useMemo(() => {
    const confirmed = findings.filter((f) => f.status === 'Confirmed fake').length;
    const dismissed = findings.filter((f) => f.status === 'Dismissed').length;
    const resolved = findings.filter((f) => f.status === 'Resolved').length;
    const investigating = findings.filter((f) => f.status === 'Investigating' || f.status === 'Likely impersonation').length;
    const reviewed = confirmed + dismissed + resolved;
    const pending = findings.filter((f) => f.status === 'New').length;
    
    // False positive rate = dismissed / total reviewed
    const fpRate = reviewed > 0 ? ((dismissed / reviewed) * 100).toFixed(1) : '12.5';

    return {
      confirmed,
      dismissed,
      reviewed,
      pending,
      investigating,
      fpRate,
    };
  }, [findings]);

  // Simulated feedback weight adjustments
  const weights = [
    { name: 'Homoglyph Severity Multiplier', current: '1.25x', delta: '+0.15x', status: 'Tuned higher' },
    { name: 'Bio Link Phishing Threshold', current: '82%', delta: '-4%', status: 'Sensitivity boosted' },
    { name: 'Unverified Handle Penalty', current: '1.10x', delta: '+0.05x', status: 'Adjusted' },
    { name: 'APK Storefront Trust Floor', current: '0.85x', delta: '-0.10x', status: 'Demoted' },
  ];

  // Feedback Trend bars for past 6 weeks (Simulated)
  const trendWeeks = [
    { week: 'W1', confirmed: 8, dismissed: 2 },
    { week: 'W2', confirmed: 12, dismissed: 3 },
    { week: 'W3', confirmed: 15, dismissed: 1 },
    { week: 'W4', confirmed: 10, dismissed: 2 },
    { week: 'W5', confirmed: 18, dismissed: 4 },
    { week: 'W6 (Now)', confirmed: metrics.confirmed + 4, dismissed: metrics.dismissed + 1 },
  ];

  return (
    <div className="p-5 rounded-2xl bg-navy-850/90 border border-slate-800 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <SlidersHorizontal className="w-4 h-4" />
            </span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Analyst Feedback Loop & Heuristic Tuning Panel
            </h3>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
              Demo data
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tracks analyst Confirm / Dismiss decisions to tune heuristic sensitivity and reduce false positives.
          </p>
        </div>

        <div className="p-1.5 px-2.5 rounded-xl bg-navy-950 border border-slate-800 text-[11px] text-cyan-300 font-medium">
          Simulated weight adjustment active
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-xl bg-navy-950 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Confirmed Fake
          </span>
          <div className="text-2xl font-black text-red-400 mt-1">
            {metrics.confirmed}
          </div>
          <span className="text-[10px] text-slate-500">True impersonations</span>
        </div>

        <div className="p-3.5 rounded-xl bg-navy-950 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Dismissed
          </span>
          <div className="text-2xl font-black text-slate-300 mt-1">
            {metrics.dismissed}
          </div>
          <span className="text-[10px] text-slate-500">Benign / authorized</span>
        </div>

        <div className="p-3.5 rounded-xl bg-navy-950 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Reviewed Total
          </span>
          <div className="text-2xl font-black text-cyan-400 mt-1">
            {metrics.reviewed}
          </div>
          <span className="text-[10px] text-slate-500">Decisions logged</span>
        </div>

        <div className="p-3.5 rounded-xl bg-navy-950 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            False Positive Rate
          </span>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {metrics.fpRate}%
          </div>
          <span className="text-[10px] text-slate-500">Benchmark target &lt;15%</span>
        </div>

        <div className="p-3.5 rounded-xl bg-navy-950 border border-slate-800 col-span-2 sm:col-span-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Pending Review
          </span>
          <div className="text-2xl font-black text-white mt-1">
            {metrics.pending}
          </div>
          <span className="text-[10px] text-slate-500">Needs analyst review</span>
        </div>
      </div>

      {/* Grid: Feedback Trend Chart & Weight Adjustments */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Feedback Trend Visual Chart */}
        <div className="md:col-span-7 p-4 rounded-xl bg-navy-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-white">Analyst Decision Velocity (Past 6 Weeks)</span>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1 text-red-400">
                <span className="w-2 h-2 rounded bg-red-500" /> Confirmed
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-2 h-2 rounded bg-slate-600" /> Dismissed
              </span>
            </div>
          </div>

          <div className="h-32 flex items-end justify-between gap-2 pt-4 px-2">
            {trendWeeks.map((w, idx) => {
              const maxVal = 25;
              const confHeight = Math.round((w.confirmed / maxVal) * 100);
              const dismHeight = Math.round((w.dismissed / maxVal) * 100);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div className="w-full flex items-end justify-center gap-1 h-24">
                    <div
                      className="w-3 bg-red-500/80 hover:bg-red-400 rounded-t transition-all"
                      style={{ height: `${confHeight}%` }}
                      title={`${w.week}: ${w.confirmed} Confirmed`}
                    />
                    <div
                      className="w-3 bg-slate-600 hover:bg-slate-500 rounded-t transition-all"
                      style={{ height: `${dismHeight}%` }}
                      title={`${w.week}: ${w.dismissed} Dismissed`}
                    />
                  </div>
                  <span className="text-[9px] font-mono text-slate-400">{w.week}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Simulated Weight Multipliers */}
        <div className="md:col-span-5 p-4 rounded-xl bg-navy-950 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white">Simulated Weight Adjustment</span>
            <span className="text-[10px] text-cyan-400 font-mono">v4.2 Heuristic</span>
          </div>

          <div className="space-y-2 text-xs">
            {weights.map((wt, idx) => (
              <div key={idx} className="p-2 rounded-lg bg-navy-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-medium text-slate-200">{wt.name}</p>
                  <span className="text-[9px] text-cyan-400">{wt.status}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-white text-xs">{wt.current}</span>
                  <span className="text-[10px] text-emerald-400 block font-mono">{wt.delta}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-slate-500 italic leading-tight pt-1">
            * Note: Simulated feedback weights tune live rule thresholds. Neural model retraining is simulated for demo clarity.
          </p>
        </div>
      </div>
    </div>
  );
};
