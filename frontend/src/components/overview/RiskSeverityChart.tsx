import React from 'react';
import { Finding } from '../../types';
import { AlertOctagon, AlertTriangle, AlertCircle, Shield } from 'lucide-react';

interface RiskSeverityChartProps {
  findings: Finding[];
}

export const RiskSeverityChart: React.FC<RiskSeverityChartProps> = ({ findings }) => {
  const openFindings = findings.filter((f) => f.status !== 'Dismissed' && f.status !== 'Resolved');
  const total = openFindings.length || 1;

  const counts = {
    critical: openFindings.filter((f) => f.riskSeverity === 'critical').length,
    high: openFindings.filter((f) => f.riskSeverity === 'high').length,
    medium: openFindings.filter((f) => f.riskSeverity === 'medium').length,
    low: openFindings.filter((f) => f.riskSeverity === 'low').length,
  };

  const percentages = {
    critical: Math.round((counts.critical / total) * 100),
    high: Math.round((counts.high / total) * 100),
    medium: Math.round((counts.medium / total) * 100),
    low: Math.round((counts.low / total) * 100),
  };

  const tiers = [
    {
      label: 'Critical Risk',
      count: counts.critical,
      pct: percentages.critical,
      color: 'bg-red-500',
      text: 'text-red-400',
      border: 'border-red-500/30',
      bgLight: 'bg-red-500/10',
      icon: AlertOctagon,
      actionNote: 'Immediate takedown recommended',
    },
    {
      label: 'High Risk',
      count: counts.high,
      pct: percentages.high,
      color: 'bg-orange-500',
      text: 'text-orange-400',
      border: 'border-orange-500/30',
      bgLight: 'bg-orange-500/10',
      icon: AlertTriangle,
      actionNote: 'Active brand deception detected',
    },
    {
      label: 'Medium Risk',
      count: counts.medium,
      pct: percentages.medium,
      color: 'bg-amber-500',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      bgLight: 'bg-amber-500/10',
      icon: AlertCircle,
      actionNote: 'Partial brand match & unverified domain',
    },
    {
      label: 'Low Risk',
      count: counts.low,
      pct: percentages.low,
      color: 'bg-slate-400',
      text: 'text-slate-300',
      border: 'border-slate-500/30',
      bgLight: 'bg-slate-500/10',
      icon: Shield,
      actionNote: 'Informational or fan community listing',
    },
  ];

  return (
    <div className="p-5 rounded-2xl bg-navy-850 border border-slate-800 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">
            Risk Severity Breakdown
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Distribution of {openFindings.length} open findings by threat severity
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-navy-900 border border-slate-700 text-slate-300 font-mono">
          {openFindings.length} Active Candidates
        </span>
      </div>

      {/* Proportional Segmented Progress Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-3.5 rounded-full bg-navy-950 flex overflow-hidden p-0.5 border border-slate-800">
          {tiers.map(
            (t) =>
              t.count > 0 && (
                <div
                  key={t.label}
                  className={`${t.color} h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full`}
                  style={{ width: `${t.pct}%` }}
                  title={`${t.label}: ${t.count} (${t.pct}%)`}
                />
              )
          )}
        </div>
        <div className="flex justify-between text-[11px] text-slate-500 font-mono">
          <span>0%</span>
          <span>Cumulative Risk Distribution</span>
          <span>100%</span>
        </div>
      </div>

      {/* Severity Tiers Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {tiers.map((tier) => {
          const Icon = tier.icon;
          return (
            <div
              key={tier.label}
              className={`p-3.5 rounded-xl border ${tier.border} ${tier.bgLight} flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-semibold ${tier.text} flex items-center gap-1.5`}>
                  <Icon className="w-3.5 h-3.5" />
                  {tier.label}
                </span>
                <span className="text-[11px] font-mono font-medium text-slate-400">
                  {tier.pct}%
                </span>
              </div>
              <div className="text-2xl font-black text-white mb-1 tracking-tight">
                {tier.count}
              </div>
              <span className="text-[10px] text-slate-400 leading-tight">
                {tier.actionNote}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
