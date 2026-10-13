import React from 'react';
import { Finding } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { Share2, Smartphone, ChevronRight, Fingerprint, ExternalLink, ShieldAlert } from 'lucide-react';

interface FindingRowProps {
  finding: Finding;
  onSelect: (finding: Finding) => void;
}

export const FindingRow: React.FC<FindingRowProps> = ({ finding, onSelect }) => {
  const isCritical = finding.riskSeverity === 'critical';

  return (
    <tr 
      onClick={() => onSelect(finding)}
      className="group hover:bg-slate-900/80 border-b border-slate-800/80 transition-colors cursor-pointer text-xs font-sans"
    >
      {/* Target & Impersonator Dossier */}
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${finding.avatarColor} text-white font-black flex items-center justify-center text-xs shadow-md ring-2 ring-slate-800 group-hover:ring-cyan-500/40 flex-shrink-0 transition-all`}>
            {finding.avatarInitials}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 truncate">
              <span className="font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                {finding.title}
              </span>
              {finding.isDemo && (
                <span className="px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[9px] font-mono font-bold uppercase tracking-wider flex-shrink-0">
                  DEMO
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 truncate">
              <span className="text-pink-400 font-semibold truncate">{finding.usernameOrPackage}</span>
              {finding.candidateWebsite && (
                <>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-500 truncate">{finding.candidateWebsite}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </td>

      {/* Platform & Vector */}
      <td className="py-3.5 px-4 text-slate-300">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-navy-950 border border-slate-800 flex items-center justify-center text-slate-300">
            {finding.type === 'social' ? (
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            ) : (
              <Smartphone className="w-3.5 h-3.5 text-purple-400" />
            )}
          </div>
          <span className="font-mono text-[11px] font-semibold text-slate-200">{finding.platform}</span>
        </div>
      </td>

      {/* Threat Severity & Risk Metric Bar */}
      <td className="py-3.5 px-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <RiskBadge severity={finding.riskSeverity} size="sm" />
            <span className="font-mono font-bold text-[11px] text-white">
              {finding.riskScore}/100
            </span>
          </div>
          <div className="w-20 bg-slate-800 h-1 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                isCritical ? 'bg-red-500' : finding.riskSeverity === 'high' ? 'bg-amber-500' : 'bg-cyan-500'
              }`}
              style={{ width: `${finding.riskScore}%` }}
            />
          </div>
        </div>
      </td>

      {/* Confidence Level */}
      <td className="py-3.5 px-4">
        <ConfidenceBadge confidence={finding.confidence} size="sm" />
      </td>

      {/* Threat Rationale */}
      <td className="py-3.5 px-4 max-w-xs text-slate-300">
        <p className="truncate text-[11px] leading-relaxed">
          {finding.mainReason}
        </p>
      </td>

      {/* Incident Status */}
      <td className="py-3.5 px-4">
        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
          finding.status === 'Confirmed fake'
            ? 'bg-red-500/15 text-red-400 border-red-500/30'
            : finding.status === 'Dismissed'
            ? 'bg-slate-800/80 text-slate-400 border-slate-700'
            : finding.status === 'Investigating'
            ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
            : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
        }`}>
          {finding.status}
        </span>
      </td>

      {/* Detection Timecode */}
      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap font-mono text-[11px]">
        {finding.detectedTime}
      </td>

      {/* Action CTA */}
      <td className="py-3.5 px-4 text-right">
        <button
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy-950 text-cyan-400 hover:text-navy-950 hover:bg-cyan-400 border border-cyan-500/30 font-bold transition-all text-[11px]"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(finding);
          }}
        >
          <span>Examine</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </td>
    </tr>
  );
};
