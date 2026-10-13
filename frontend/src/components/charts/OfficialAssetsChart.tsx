import React from 'react';
import { ShieldCheck, Clock, AlertCircle } from 'lucide-react';

interface OfficialAssetsChartProps {
  verifiedCount?: number;
  pendingCount?: number;
  needsUpdateCount?: number;
}

export const OfficialAssetsChart: React.FC<OfficialAssetsChartProps> = ({
  verifiedCount = 5,
  pendingCount = 1,
  needsUpdateCount = 0,
}) => {
  const total = verifiedCount + pendingCount + needsUpdateCount || 1;
  const verifiedPct = Math.round((verifiedCount / total) * 100);
  const pendingPct = Math.round((pendingCount / total) * 100);
  const needsUpdatePct = Math.round((needsUpdateCount / total) * 100);

  const items = [
    {
      label: 'Verified',
      count: verifiedCount,
      pct: verifiedPct,
      color: '#10b981', // green
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      icon: ShieldCheck,
    },
    {
      label: 'Pending verification',
      count: pendingCount,
      pct: pendingPct,
      color: '#eab308', // yellow
      badgeColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      icon: Clock,
    },
    {
      label: 'Needs update',
      count: needsUpdateCount,
      pct: needsUpdatePct,
      color: '#94a3b8', // blue/gray
      badgeColor: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
      icon: AlertCircle,
    },
  ];

  return (
    <div className="p-4 rounded-xl bg-[#0D1425] border border-[#24324D] hover:border-[#8050FF]/40 transition-colors flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold text-white tracking-tight">Official assets</h4>
        <span className="text-[10px] text-emerald-400 font-mono font-semibold">
          {verifiedCount} of {total} Verified
        </span>
      </div>

      {/* Segmented Horizontal Stacked Bar */}
      <div className="my-2">
        <div className="w-full h-3 bg-navy-950 rounded-full overflow-hidden flex p-0.5 border border-slate-800 mb-3">
          <div
            className="h-full bg-emerald-500 rounded-l-full transition-all duration-500"
            style={{ width: `${verifiedPct}%` }}
            title={`Verified: ${verifiedCount} (${verifiedPct}%)`}
          />
          {pendingCount > 0 && (
            <div
              className="h-full bg-yellow-500 transition-all duration-500"
              style={{ width: `${pendingPct}%` }}
              title={`Pending verification: ${pendingCount} (${pendingPct}%)`}
            />
          )}
          {needsUpdateCount > 0 && (
            <div
              className="h-full bg-slate-500 rounded-r-full transition-all duration-500"
              style={{ width: `${needsUpdatePct}%` }}
              title={`Needs update: ${needsUpdateCount} (${needsUpdatePct}%)`}
            />
          )}
        </div>

        {/* Legend */}
        <div className="space-y-1.5 text-xs">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <div
                key={it.label}
                className="flex items-center justify-between p-1 rounded-md text-[11px]"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: it.color }}
                  />
                  <span className="text-slate-300">{it.label}</span>
                </div>
                <span className="font-mono text-slate-400 font-semibold">
                  {it.count} ({it.pct}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Accessible Text Summary */}
      <p className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800/80 leading-relaxed">
        Verified official assets are protected references and excluded from risk scoring.
      </p>
    </div>
  );
};
