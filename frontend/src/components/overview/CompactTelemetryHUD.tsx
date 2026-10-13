import React from 'react';
import { useBrandGuard } from '../../context/BrandGuardContext';
import { 
  ShieldAlert, 
  AlertOctagon, 
  Share2, 
  Smartphone, 
  ShieldCheck, 
  Activity, 
  ArrowUpRight, 
  Radio, 
  Cpu 
} from 'lucide-react';
import { SpotlightCard } from '../common/SpotlightCard';

export const CompactTelemetryHUD: React.FC = () => {
  const { 
    counts, 
    setActivePage, 
    navigateToFindings, 
    isDemoMode,
    findings, 
    brandProfile, 
    company 
  } = useBrandGuard();

  const criticalCount = findings.filter(f => f.riskSeverity === 'critical').length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
      {/* 1. Active Threat Inbound */}
      <SpotlightCard
        onClick={() => setActivePage('findings')}
        spotlightColor="rgba(239, 68, 68, 0.25)"
        className="p-4 cursor-pointer group hover:border-red-500/60 transition-all shadow-lg hover:shadow-red-950/40"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 group-hover:text-red-300 transition-colors">
            Active Threats
          </span>
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black font-mono text-white tracking-tight">
            {counts.open}
          </span>
          <span className="text-[10px] font-mono font-bold text-red-400 bg-red-500/15 px-1.5 py-0.5 rounded border border-red-500/30">
            {criticalCount} CRIT
          </span>
        </div>
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
          <span className="font-mono text-[9px] uppercase">Inbound vectors</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-red-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </SpotlightCard>

      {/* 2. Social Perimeter */}
      <SpotlightCard
        onClick={() => navigateToFindings('social')}
        spotlightColor="rgba(6, 182, 212, 0.25)"
        className="p-4 cursor-pointer group hover:border-cyan-500/60 transition-all shadow-lg hover:shadow-cyan-950/40"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 group-hover:text-cyan-300 transition-colors">
            Social Clones
          </span>
          <Share2 className="w-3.5 h-3.5 text-cyan-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black font-mono text-white tracking-tight">
            {counts.social}
          </span>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/25">
            5 Channels
          </span>
        </div>
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
          <span className="font-mono text-[9px] uppercase">Profile impersonations</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </SpotlightCard>

      {/* 3. Mobile Store Surfacing */}
      <SpotlightCard
        onClick={() => navigateToFindings('app')}
        spotlightColor="rgba(168, 85, 247, 0.25)"
        className="p-4 cursor-pointer group hover:border-purple-500/60 transition-all shadow-lg hover:shadow-purple-950/40"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 group-hover:text-purple-300 transition-colors">
            Rogue APKs
          </span>
          <Smartphone className="w-3.5 h-3.5 text-purple-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black font-mono text-white tracking-tight">
            {counts.app}
          </span>
          <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/25">
            Store & APK
          </span>
        </div>
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
          <span className="font-mono text-[9px] uppercase">Counterfeit packages</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </SpotlightCard>

      {/* 4. Verified Brand Footprint */}
      <SpotlightCard
        onClick={() => setActivePage('brand-profile')}
        spotlightColor="rgba(16, 185, 129, 0.25)"
        className="p-4 cursor-pointer group hover:border-emerald-500/60 transition-all shadow-lg hover:shadow-emerald-950/40"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 group-hover:text-emerald-300 transition-colors">
            Brand Assets
          </span>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black font-mono text-white tracking-tight">
            {counts.verifiedAssets}
          </span>
          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/25">
            {brandProfile.completenessPercent}% SECURED
          </span>
        </div>
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
          <span className="font-mono text-[9px] uppercase">Identity Whitelist</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </SpotlightCard>

      {/* 5. Defense Telemetry Engine State */}
      <SpotlightCard
        spotlightColor="rgba(6, 182, 212, 0.2)"
        className="p-4 col-span-2 md:col-span-1 flex flex-col justify-between shadow-lg"
      >
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1">
              <Cpu className="w-3 h-3 text-cyan-400" />
              Sensor State
            </span>
            <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
          </div>
          <div className="text-[11px] font-mono font-bold text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>{isDemoMode ? 'SIMULATED HYBRID' : 'LIVE API SENSOR'}</span>
          </div>
        </div>
        <p className="text-[10px] font-mono text-slate-400 leading-tight mt-2 pt-2 border-t border-slate-800/80 truncate">
          Target: <span className="text-cyan-300 font-semibold">{brandProfile.brandName || company?.name || 'AcmePay'}</span>
        </p>
      </SpotlightCard>
    </div>
  );
};
