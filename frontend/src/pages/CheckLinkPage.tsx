import React, { useState } from 'react';
import { useBrandGuard } from '../context/BrandGuardContext';
import { LinkCheckRecord } from '../types';
import { SpotlightCard } from '../components/common/SpotlightCard';
import { 
  Link2, 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  CheckCircle2, 
  ArrowRight, 
  Camera, 
  Plus, 
  Trash2, 
  RotateCcw,
  Globe,
  Sparkles,
  Zap
} from 'lucide-react';

export const CheckLinkPage: React.FC = () => {
  const { 
    linkChecks, 
    checkSuspiciousLink, 
    isCheckingLink, 
    dismissLinkCheck, 
    addLinkCheckToFindings,
    brandProfile 
  } = useBrandGuard();

  const [inputUrl, setInputUrl] = useState('');
  const [activeResult, setActiveResult] = useState<LinkCheckRecord | null>(null);

  const brandSlug = (brandProfile.brandName || 'brand').toLowerCase().replace(/[^a-z0-9]/g, '');
  const exampleUrls = [
    `https://${brandSlug}-help-resolution.xyz/login?ref=support`,
    `https://${brandSlug}y-direct.com/auth/verify`,
    brandProfile.website || `https://${brandSlug}.com/merchants`,
  ];

  const handleCheck = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputUrl.trim()) return;

    const result = await checkSuspiciousLink(inputUrl.trim());
    setActiveResult(result);
  };

  const handleUseExample = (url: string) => {
    setInputUrl(url);
  };

  const getVerdictBadge = (verdict: LinkCheckRecord['verdict']) => {
    switch (verdict) {
      case 'Approved':
        return {
          bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          icon: CheckCircle2,
          label: 'Approved Domain',
        };
      case 'Suspicious':
        return {
          bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          icon: AlertTriangle,
          label: 'Suspicious Domain',
        };
      case 'Likely phishing':
        return {
          bg: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
          icon: AlertTriangle,
          label: 'Likely Phishing',
        };
      case 'Confirmed malicious':
        return {
          bg: 'bg-red-500/15 text-red-300 border-red-500/30 shadow-[0_0_12px_rgba(239,68,68,0.2)]',
          icon: AlertOctagon,
          label: 'Confirmed Malicious',
        };
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 text-xs">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2 mb-1.5">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Check a suspicious link
          </h2>
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-cyan-400 px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30">
            <Link2 className="w-3 h-3" />
            [DEEP_SCAN]
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Paste a link from an email, SMS message, website, or social profile for instant heuristic and DNS spoofing analysis.
        </p>
      </div>

      {/* URL Input Form with SpotlightCard */}
      <SpotlightCard
        spotlightColor="rgba(6, 182, 212, 0.18)"
        className="p-6 sm:p-7 rounded-2xl unlumen-card border border-cyan-500/25 space-y-4 shadow-xl"
      >
        <form onSubmit={handleCheck} className="space-y-3">
          <label htmlFor="suspicious-link-input" className="block text-slate-200 font-semibold text-xs font-mono uppercase tracking-wider">
            Target URL or Suspicious Hostname
          </label>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1 group">
              <Link2 className="w-4 h-4 text-slate-400 group-focus-within:text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors" />
              <input
                id="suspicious-link-input"
                type="url"
                required
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://acmepay-help-resolution.xyz/login"
                className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-950/90 border border-slate-700/80 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 font-mono text-xs shadow-inner transition-all"
              />
            </div>

            <div className="relative group p-px rounded-xl overflow-hidden flex-shrink-0 shadow-lg shadow-cyan-500/20">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500" />
              <button
                type="submit"
                disabled={isCheckingLink || !inputUrl.trim()}
                className="relative px-6 py-3 rounded-[11px] font-bold bg-slate-950 hover:bg-slate-900 text-cyan-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50 flex-shrink-0 btn-smooth"
              >
                <Search className={`w-4 h-4 text-cyan-400 ${isCheckingLink ? 'animate-spin' : ''}`} />
                <span className="bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent">
                  {isCheckingLink ? 'Analyzing Vectors...' : 'Check Link'}
                </span>
              </button>
            </div>
          </div>
        </form>

        {/* Quick Example URLs */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800/80 text-[11px]">
          <span className="text-slate-400 font-mono text-[10px]">PRESET SAMPLES:</span>
          {exampleUrls.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => handleUseExample(ex)}
              className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/30 transition-all font-mono truncate max-w-xs btn-smooth"
            >
              {ex}
            </button>
          ))}
        </div>
      </SpotlightCard>

      {/* Active Check Result Card (If just checked or selected) */}
      {activeResult && (
        <SpotlightCard
          spotlightColor="rgba(6, 182, 212, 0.2)"
          className="p-6 sm:p-7 rounded-2xl unlumen-card border border-cyan-500/35 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider block">
                [INSPECTION_DOSSIER]
              </span>
              <h3 className="text-base font-bold text-white font-mono mt-0.5 break-all">
                {activeResult.url}
              </h3>
            </div>

            {/* Verdict Badge */}
            {(() => {
              const badge = getVerdictBadge(activeResult.verdict);
              const Icon = badge.icon;
              return (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border ${badge.bg} self-start sm:self-auto`}>
                  <Icon className="w-3.5 h-3.5" />
                  <span>{badge.label}</span>
                </span>
              );
            })()}
          </div>

          {/* Metric Comparison Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono font-semibold block mb-0.5">
                Official Domain
              </span>
              <span className="font-mono text-emerald-400 font-bold block truncate">
                {activeResult.officialDomain}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono font-semibold block mb-0.5">
                Checked Domain
              </span>
              <span className={`font-mono font-bold block truncate ${
                activeResult.verdict === 'Approved' ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {activeResult.checkedDomain}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono font-semibold block mb-0.5">
                Risk Score
              </span>
              <span className="text-white font-mono font-bold block">
                {activeResult.riskScore} / 100
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono font-semibold block mb-0.5">
                Confidence
              </span>
              <span className="text-cyan-400 font-mono font-semibold block">
                {activeResult.confidence} Confidence
              </span>
            </div>
          </div>

          {/* Screenshot placeholder & redirect info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div className="h-28 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-col items-center justify-center p-3 text-center shadow-inner">
              <Camera className="w-6 h-6 text-cyan-400/60 mb-1" />
              <span className="text-[10px] text-slate-400 font-mono leading-tight">
                {activeResult.screenshotLabel}
              </span>
            </div>

            <div className="sm:col-span-2 space-y-2">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">
                  Redirect information
                </span>
                <p className="text-slate-300 font-mono text-[11px] mt-0.5">
                  {activeResult.redirectInfo}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">
                  Recommended action
                </span>
                <p className="text-white font-semibold text-xs mt-0.5">
                  {activeResult.recommendedAction}
                </p>
              </div>
            </div>
          </div>

          {/* Why this was flagged */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-1">
            <span className="text-xs font-bold text-white block">
              Why this was flagged
            </span>
            <p className="text-slate-300 leading-relaxed text-xs">
              {activeResult.whyFlagged}
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80">
            <button
              onClick={() => setActiveResult(null)}
              className="text-xs text-slate-400 hover:text-white transition-colors btn-smooth"
            >
              Check another link
            </button>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => {
                  dismissLinkCheck(activeResult.id);
                  setActiveResult(null);
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-750 transition-all btn-smooth"
              >
                Dismiss
              </button>

              <button
                onClick={() => {
                  addLinkCheckToFindings(activeResult);
                  setActiveResult(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition-all flex items-center gap-1.5 btn-smooth shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add to findings</span>
              </button>
            </div>
          </div>
        </SpotlightCard>
      )}

      {/* Recent Checks Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <span>Recent link checks</span>
            <span className="text-xs font-mono text-cyan-400">({linkChecks.length})</span>
          </h3>
          <span className="text-[11px] font-mono text-slate-500">[LOCAL_CACHE]</span>
        </div>

        <div className="space-y-2.5">
          {linkChecks.map((item) => {
            const badge = getVerdictBadge(item.verdict);
            const Icon = badge.icon;

            return (
              <div
                key={item.id}
                onClick={() => setActiveResult(item)}
                className="p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-850 border border-slate-800/80 hover:border-cyan-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer group shadow-sm"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-white group-hover:text-cyan-300 font-semibold truncate block max-w-md">
                      {item.url}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 flex-shrink-0">
                      {item.checkedAt}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate max-w-xl">
                    {item.whyFlagged}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto flex-shrink-0">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${badge.bg}`}>
                    <Icon className="w-3 h-3" />
                    <span>{item.verdict}</span>
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dismissLinkCheck(item.id);
                    }}
                    className="p-1 text-slate-500 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
                    title="Remove from history"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
