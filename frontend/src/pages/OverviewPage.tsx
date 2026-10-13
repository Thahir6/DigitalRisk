import React, { useMemo } from 'react';
import { useBrandGuard } from '../context/BrandGuardContext';
import { GlobalThreatMap } from '../components/overview/GlobalThreatMap';
import { CompactTelemetryHUD } from '../components/overview/CompactTelemetryHUD';
import { LiveThreatStream } from '../components/overview/LiveThreatStream';
import { DonutChart } from '../components/charts/DonutChart';
import { ComparisonBarChart } from '../components/charts/ComparisonBarChart';
import { TrendLineChart } from '../components/charts/TrendLineChart';
import { SourceStatusPanel } from '../components/overview/SourceStatusPanel';
import { SpotlightCard } from '../components/common/SpotlightCard';
import { 
  Link2, 
  Share2, 
  Smartphone, 
  ArrowRight, 
  ShieldAlert, 
  AlertOctagon, 
  Radar, 
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  Crosshair,
  ExternalLink,
  Zap,
  Globe2,
  FileText,
  Megaphone,
  FileSearch,
  Code2
} from 'lucide-react';

export const OverviewPage: React.FC = () => {
  const { 
    user, 
    company,
    counts, 
    runNewScan, 
    isScanning, 
    setActivePage, 
    findings, 
    brandProfile, 
    openReportModal,
    navigateToFindings,
    isDemoMode,
    isLoadingData,
  } = useBrandGuard();

  // Compute severity breakdown for DonutChart
  const severityDonutData = useMemo(() => {
    const openFindings = findings.filter((f) => f.status !== 'Dismissed' && f.status !== 'Resolved');
    const total = openFindings.length || 1;

    const critical = openFindings.filter((f) => f.riskSeverity === 'critical').length;
    const high = openFindings.filter((f) => f.riskSeverity === 'high').length;
    const medium = openFindings.filter((f) => f.riskSeverity === 'medium').length;
    const low = openFindings.filter((f) => f.riskSeverity === 'low').length;

    return {
      total: openFindings.length,
      segments: [
        { label: 'Critical Risk', count: critical, pct: Math.round((critical / total) * 100), color: '#FF5878' },
        { label: 'High Risk', count: high, pct: Math.round((high / total) * 100), color: '#f97316' },
        { label: 'Medium Risk', count: medium, pct: Math.round((medium / total) * 100), color: '#FFBD69' },
        { label: 'Low Risk', count: low, pct: Math.round((low / total) * 100), color: '#94a3b8' },
      ],
    };
  }, [findings]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 text-xs font-sans">
      {/* 1. Cinematic Command Center Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0D1425] border border-[#24324D] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-violet-600/15 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#8050FF]/40 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-[#070A14] text-[#42DDF5] border border-[#42DDF5]/40 flex items-center gap-1.5 shadow-[0_0_10px_rgba(66,221,245,0.15)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#42DDF5] animate-ping" />
                [DEFCON 2] • AEGIS RADAR ACTIVE
              </span>
              
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 px-2.5 py-0.5 rounded-md bg-emerald-950/40 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                {brandProfile.brandName || company?.name || 'Company'} Perimeter Secured
              </span>

              {isDemoMode && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-amber-300 px-2.5 py-0.5 rounded-md bg-amber-950/40 border border-amber-500/30">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  SIMULATED THREAT LAB
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span>Security Operations Center</span>
              <span className="text-sm font-mono font-normal text-[#A17AFF]">
                // {brandProfile.brandName || company?.name}
              </span>
            </h1>

            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Real-time cyber threat intelligence, executive impersonation surveillance, and rogue digital asset neutralization for modern enterprises.
            </p>
          </div>

          {/* Quick Command Actions with Smooth UI buttons */}
          <div className="flex items-center gap-3 self-start lg:self-center flex-wrap">
            <button
              onClick={() => setActivePage('check-link')}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#111B30] hover:bg-[#17223B] text-[#42DDF5] border border-[#24324D] hover:border-[#42DDF5]/50 transition-all flex items-center gap-2 shadow-md"
            >
              <Link2 className="w-4 h-4 text-[#42DDF5]" />
              <span>Inspect Link</span>
            </button>

            <button
              onClick={() => setActivePage('scan-results')}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#111B30] hover:bg-[#17223B] text-slate-200 border border-[#24324D] hover:border-[#8050FF]/50 transition-all flex items-center gap-1.5 shadow-sm"
              title="Review Staged Scan Results & Visual Summary"
            >
              <Radar className="w-3.5 h-3.5 text-[#A17AFF]" />
              <span>Scan Summary</span>
            </button>

            <button
              onClick={() => runNewScan('all')}
              disabled={isScanning}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-violet-950/40"
            >
              <Zap className={`w-4 h-4 text-white ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Executing Radar Scan...' : 'Run Global Scan'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Compact Floating Telemetry HUD (Replaces generic card grid) */}
      <section>
        <CompactTelemetryHUD />
      </section>

      {/* 3. Main Visual Anchor: Interactive Global Threat Operations Map */}
      <section>
        <GlobalThreatMap />
      </section>

      {/* 4. Operations Command Grid: Live Feed (Left) & Threat Intelligence Radar (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Live Threat Activity Stream */}
        <div className="lg:col-span-2 space-y-6">
          <LiveThreatStream />

          {/* Quick-Strike Security Investigation Panels */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* 1. Check Suspicious Link */}
            <SpotlightCard
              onClick={() => setActivePage('check-link')}
              spotlightColor="rgba(6, 182, 212, 0.2)"
              className="p-4 rounded-2xl unlumen-card border border-cyan-500/30 hover:border-cyan-400 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-105 transition-transform shadow-sm">
                  <Link2 className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                  Check a Link
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Analyze spoofed domains, phishing links, and deceptive redirects.
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-bold text-cyan-400">
                <span>Analyze link</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </SpotlightCard>

            {/* 2. Check Social Impersonators */}
            <SpotlightCard
              onClick={() => navigateToFindings('social')}
              spotlightColor="rgba(59, 130, 246, 0.2)"
              className="p-4 rounded-2xl unlumen-card border border-blue-500/25 hover:border-blue-400 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3 group-hover:scale-105 transition-transform shadow-sm">
                  <Share2 className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                  Social Clones
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Discover unauthorized brand handles across Instagram, X, and Telegram.
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-bold text-blue-400">
                <span>View {counts.social} profiles</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </SpotlightCard>

            {/* 3. Check Mobile App Clones */}
            <SpotlightCard
              onClick={() => navigateToFindings('app')}
              spotlightColor="rgba(245, 158, 11, 0.2)"
              className="p-4 rounded-2xl unlumen-card border border-amber-500/25 hover:border-amber-400 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-105 transition-transform shadow-sm">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white mb-1 group-hover:text-amber-300 transition-colors">
                  Mobile Clones
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Flag malicious APK packages and unauthorized app store clones.
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-bold text-amber-400">
                <span>View {counts.app} apps</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </SpotlightCard>

          </div>

          {/* New Threat Intelligence Tools & Executive Reports Quick-Launch */}
          <div className="p-5 rounded-2xl unlumen-card border border-slate-800/80 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-mono">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Threat Defense Tools & Executive Reports</span>
              </span>
              <span className="text-[10px] text-cyan-400 font-semibold font-mono uppercase tracking-wider">
                [INSTANT LAUNCH]
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                onClick={() => setActivePage('watchlist')}
                className="p-3 rounded-xl bg-slate-950/70 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group btn-smooth shadow-sm"
              >
                <div className="flex items-center gap-1.5 text-cyan-400 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold text-white group-hover:text-cyan-300">Watchlist</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">Predictive namespace risks</p>
              </button>

              <button
                onClick={() => setActivePage('scam-analyzer')}
                className="p-3 rounded-xl bg-slate-950/70 hover:bg-slate-900 border border-slate-800 hover:border-red-500/40 text-left transition-all group btn-smooth shadow-sm"
              >
                <div className="flex items-center gap-1.5 text-red-400 mb-1">
                  <FileSearch className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold text-white group-hover:text-red-300">Scam Script</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">13-heuristic vector analyzer</p>
              </button>

              <button
                onClick={() => setActivePage('warning-kit')}
                className="p-3 rounded-xl bg-slate-950/70 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-left transition-all group btn-smooth shadow-sm"
              >
                <div className="flex items-center gap-1.5 text-amber-400 mb-1">
                  <Megaphone className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold text-white group-hover:text-amber-300">Warning Kit</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">Social, SMS & QR poster</p>
              </button>

              <button
                onClick={() => setActivePage('board-report')}
                className="p-3 rounded-xl bg-slate-950/70 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-left transition-all group btn-smooth shadow-sm"
              >
                <div className="flex items-center gap-1.5 text-indigo-400 mb-1">
                  <FileText className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold text-white group-hover:text-indigo-300">Board Report</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">Print & PDF ready audit</p>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Risk Telemetry Visualizations */}
        <div className="space-y-6">
          {/* Severity Donut */}
          <DonutChart
            title="Severity Matrix"
            total={severityDonutData.total}
            segments={severityDonutData.segments}
            textSummary="Active threat profile distributed by risk tier."
          />

          {/* Comparison Bar */}
          <ComparisonBarChart
            socialCount={counts.social}
            appCount={counts.app}
          />

          {/* Trend Line */}
          <TrendLineChart />
        </div>
      </div>

      {/* 5. Surveillance Source Status Panel */}
      <section>
        <SourceStatusPanel />
      </section>
    </div>
  );
};
