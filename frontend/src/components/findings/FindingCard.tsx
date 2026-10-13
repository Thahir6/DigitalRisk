import React from 'react';
import { Finding } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { 
  Share2, 
  Smartphone, 
  ChevronRight, 
  Clock, 
  ExternalLink,
  ShieldAlert,
  Fingerprint,
  Radio
} from 'lucide-react';
import { SpotlightCard } from '../common/SpotlightCard';

interface FindingCardProps {
  finding: Finding;
  onSelect: (finding: Finding) => void;
}

export const FindingCard: React.FC<FindingCardProps> = ({ finding, onSelect }) => {
  const isCritical = finding.riskSeverity === 'critical';

  return (
    <div className={`relative rounded-xl ${isCritical ? 'border-beam-container' : ''}`}>
      {isCritical && <div className="border-beam-glow opacity-80" />}

      <SpotlightCard 
        onClick={() => onSelect(finding)}
        spotlightColor={isCritical ? 'rgba(239, 68, 68, 0.2)' : 'rgba(6, 182, 212, 0.2)'}
        showCornerAccents={isCritical}
        className="p-5 cursor-pointer flex flex-col justify-between group transition-all duration-300"
      >
        <div>
          {/* Header row with avatar and severity */}
          <div className="flex items-start justify-between gap-3 mb-3.5">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${finding.avatarColor} text-white font-black flex items-center justify-center text-sm shadow-md ring-2 ring-slate-800 group-hover:ring-cyan-400/50 flex-shrink-0 transition-all`}>
                {finding.avatarInitials}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 truncate">
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                    {finding.title}
                  </h4>
                  {finding.isDemo && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[9px] font-mono font-bold uppercase tracking-wider flex-shrink-0">
                      SIM
                    </span>
                  )}
                </div>
                <p className="text-xs text-pink-400 font-mono font-semibold truncate">
                  {finding.usernameOrPackage}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <RiskBadge severity={finding.riskSeverity} size="sm" />
              <span className="text-[10px] font-mono font-bold text-slate-400">
                {finding.riskScore}/100
              </span>
            </div>
          </div>

          {/* Reason summary / Flagged Telemetry */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/90 mb-3.5 text-xs text-slate-300 leading-relaxed font-sans">
            <span className="text-cyan-400 font-mono text-[10px] uppercase font-bold block mb-1">
              Detection Vector:
            </span>
            {finding.mainReason}
          </div>
        </div>

        {/* Footer meta row */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-slate-300">
              {finding.type === 'social' ? (
                <Share2 className="w-3.5 h-3.5 text-cyan-400" />
              ) : (
                <Smartphone className="w-3.5 h-3.5 text-purple-400" />
              )}
              <span>{finding.platform}</span>
            </span>
            <span className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
              <Clock className="w-3 h-3" />
              {finding.detectedTime}
            </span>
          </div>

          <button 
            className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all"
            aria-label={`View details for ${finding.title}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(finding);
            }}
          >
            <span>Investigate</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </SpotlightCard>
    </div>
  );
};
