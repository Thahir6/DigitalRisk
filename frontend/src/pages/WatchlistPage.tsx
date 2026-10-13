import React, { useState, useMemo } from 'react';
import { useBrandGuard } from '../context/BrandGuardContext';
import { 
  ShieldAlert, 
  Search, 
  Plus, 
  Check, 
  ExternalLink, 
  Filter, 
  Sparkles, 
  Copy, 
  RefreshCw, 
  Globe, 
  AlertTriangle, 
  ShieldCheck, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { RiskBadge } from '../components/common/RiskBadge';
import { RiskSeverity } from '../types';

export interface WatchlistVariation {
  id: string;
  name: string;
  variationType: 'Character Swap' | 'Added Word' | 'Repeated Char' | 'Hyphen/Spacing' | 'Auth/Support Word' | 'Unicode Homoglyph';
  existsStatus: 'Active Phishing' | 'Registered Recently' | 'DNS Parked' | 'Unregistered / Available';
  riskSeverity: RiskSeverity;
  riskScore: number;
  reason: string;
  isWatched: boolean;
  relatedFindingId?: string;
}

export const WatchlistPage: React.FC = () => {
  const { brandProfile, company, findings, setSelectedFinding, setActivePage, showToast } = useBrandGuard();

  const brandName = brandProfile.brandName || company?.name || 'AcmePay';
  const cleanBrand = brandName.toLowerCase().replace(/[^a-z0-9]/g, '');

  const [inputBrand, setInputBrand] = useState(brandName);
  const [activeTypeFilter, setActiveTypeFilter] = useState<string>('all');
  const [activeRiskFilter, setActiveRiskFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [watchedList, setWatchedList] = useState<Record<string, boolean>>({
    'var-1': true,
    'var-5': true,
    'var-8': true,
  });

  // Generator function producing realistic lookalike namespace variations
  const generatedVariations = useMemo<WatchlistVariation[]>(() => {
    const base = inputBrand.toLowerCase().replace(/[^a-z0-9]/g, '') || cleanBrand;
    
    return [
      // 1. Support / Auth / Login / Security / Rewards Words
      {
        id: 'var-1',
        name: `${base}-login.com`,
        variationType: 'Auth/Support Word',
        existsStatus: 'Active Phishing',
        riskSeverity: 'critical',
        riskScore: 96,
        reason: 'High credential harvesting vector targeting customer sign-in portals.',
        isWatched: !!watchedList['var-1'],
        relatedFindingId: findings[0]?.id,
      },
      {
        id: 'var-2',
        name: `${base}-security.support`,
        variationType: 'Auth/Support Word',
        existsStatus: 'Registered Recently',
        riskSeverity: 'critical',
        riskScore: 92,
        reason: 'Uses security authority keyword to coerce victims into OTP disclosure.',
        isWatched: !!watchedList['var-2'],
      },
      {
        id: 'var-3',
        name: `${base}-rewards-bonus.net`,
        variationType: 'Auth/Support Word',
        existsStatus: 'Active Phishing',
        riskSeverity: 'high',
        riskScore: 84,
        reason: 'Exploits fake promotion & cashback scheme for financial fraud.',
        isWatched: !!watchedList['var-3'],
      },
      {
        id: 'var-4',
        name: `support-${base}.help`,
        variationType: 'Auth/Support Word',
        existsStatus: 'DNS Parked',
        riskSeverity: 'high',
        riskScore: 78,
        reason: 'Impersonates official customer care helpdesk.',
        isWatched: !!watchedList['var-4'],
      },

      // 2. Character Swaps
      {
        id: 'var-5',
        name: base.length > 3 ? `${base.slice(0, 2)}${base[3]}${base[2]}${base.slice(4)}.com` : `${base}x.com`,
        variationType: 'Character Swap',
        existsStatus: 'Registered Recently',
        riskSeverity: 'high',
        riskScore: 81,
        reason: 'Transposed adjacent letters designed to catch fast-typing users.',
        isWatched: !!watchedList['var-5'],
        relatedFindingId: findings[1]?.id,
      },
      {
        id: 'var-6',
        name: base.length > 4 ? `${base.slice(0, 1)}${base[2]}${base[1]}${base.slice(3)}.io` : `my${base}.io`,
        variationType: 'Character Swap',
        existsStatus: 'Unregistered / Available',
        riskSeverity: 'medium',
        riskScore: 65,
        reason: 'Typosquat candidate prone to speculative registration.',
        isWatched: !!watchedList['var-6'],
      },

      // 3. Added or Removed Words
      {
        id: 'var-7',
        name: `get-${base}-app.org`,
        variationType: 'Added Word',
        existsStatus: 'Active Phishing',
        riskSeverity: 'critical',
        riskScore: 91,
        reason: 'Distributes malicious APK downloader claiming to be the mobile client.',
        isWatched: !!watchedList['var-7'],
        relatedFindingId: findings.find(f => f.type === 'app')?.id,
      },
      {
        id: 'var-8',
        name: `official-${base}.com`,
        variationType: 'Added Word',
        existsStatus: 'Registered Recently',
        riskSeverity: 'high',
        riskScore: 87,
        reason: 'Pretends to be primary corporate brand authority site.',
        isWatched: !!watchedList['var-8'],
      },
      {
        id: 'var-9',
        name: `${base}-global-portal.net`,
        variationType: 'Added Word',
        existsStatus: 'DNS Parked',
        riskSeverity: 'medium',
        riskScore: 68,
        reason: 'Corporate prefix squatted by domain registrar speculator.',
        isWatched: !!watchedList['var-9'],
      },

      // 4. Repeated Characters
      {
        id: 'var-10',
        name: `${base.slice(0, 2)}${base[1] || 'a'}${base.slice(2)}.com`,
        variationType: 'Repeated Char',
        existsStatus: 'Registered Recently',
        riskSeverity: 'high',
        riskScore: 75,
        reason: 'Double character stutter typosquatting high mobile touch input variance.',
        isWatched: !!watchedList['var-10'],
      },
      {
        id: 'var-11',
        name: `${base}${base[base.length - 1] || 's'}.org`,
        variationType: 'Repeated Char',
        existsStatus: 'Unregistered / Available',
        riskSeverity: 'medium',
        riskScore: 59,
        reason: 'Trailing letter duplication variant.',
        isWatched: !!watchedList['var-11'],
      },

      // 5. Spacing and Hyphen Changes
      {
        id: 'var-12',
        name: base.length > 4 ? `${base.slice(0, 4)}-${base.slice(4)}.com` : `${base}-online.com`,
        variationType: 'Hyphen/Spacing',
        existsStatus: 'Active Phishing',
        riskSeverity: 'high',
        riskScore: 86,
        reason: 'Hyphenated brand name mimicking corporate sub-brand architecture.',
        isWatched: !!watchedList['var-12'],
      },
      {
        id: 'var-13',
        name: `${base}_portal.xyz`,
        variationType: 'Hyphen/Spacing',
        existsStatus: 'Unregistered / Available',
        riskSeverity: 'medium',
        riskScore: 62,
        reason: 'Underscore variation used in deceptive email sub-domains.',
        isWatched: !!watchedList['var-13'],
      },

      // 6. Similar Unicode Characters (Homoglyphs)
      {
        id: 'var-14',
        name: `\u0430${base.slice(1)}.com`, // Cyrillic 'а' (U+0430)
        variationType: 'Unicode Homoglyph',
        existsStatus: 'Active Phishing',
        riskSeverity: 'critical',
        riskScore: 98,
        reason: 'Cyrillic Small Letter A (U+0430) homoglyph spoofing authentic Latin visual rendering.',
        isWatched: !!watchedList['var-14'],
        relatedFindingId: findings.find(f => f.lookalike)?.id,
      },
      {
        id: 'var-15',
        name: `${base.slice(0, -1)}\u0443.net`, // Cyrillic 'у' (U+0443)
        variationType: 'Unicode Homoglyph',
        existsStatus: 'Registered Recently',
        riskSeverity: 'critical',
        riskScore: 94,
        reason: 'Greek or Cyrillic homoglyph substitution in internationalized domain (IDN).',
        isWatched: !!watchedList['var-15'],
      },
      {
        id: 'var-16',
        name: `${base.slice(0, 2)}\u0435${base.slice(3)}.com`, // Cyrillic 'е' (U+0435)
        variationType: 'Unicode Homoglyph',
        existsStatus: 'Unregistered / Available',
        riskSeverity: 'high',
        riskScore: 82,
        reason: 'Cyrillic "e" substitution. Extremely difficult for consumers to distinguish in address bars.',
        isWatched: !!watchedList['var-16'],
      },
    ];
  }, [inputBrand, cleanBrand, watchedList, findings]);

  const toggleWatch = (id: string, name: string) => {
    setWatchedList((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (next[id]) {
        showToast(`Added "${name}" to proactive defensive watchlist`, 'success');
      } else {
        showToast(`Removed "${name}" from watchlist`, 'info');
      }
      return next;
    });
  };

  const handleCopyWatchlist = () => {
    const list = generatedVariations
      .filter((v) => watchedList[v.id])
      .map((v) => `${v.name} [${v.variationType}] - Risk: ${v.riskSeverity.toUpperCase()}`)
      .join('\n');
    navigator.clipboard?.writeText(list || 'No watched items.');
    showToast('Watchlist copied to clipboard', 'info');
  };

  const filteredVariations = useMemo(() => {
    return generatedVariations.filter((v) => {
      const matchesType = activeTypeFilter === 'all' || v.variationType === activeTypeFilter;
      const matchesRisk = activeRiskFilter === 'all' || v.riskSeverity === activeRiskFilter;
      const matchesSearch = !searchQuery || 
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        v.reason.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesRisk && matchesSearch;
    });
  }, [generatedVariations, activeTypeFilter, activeRiskFilter, searchQuery]);

  const watchedCount = Object.values(watchedList).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 p-6 sm:p-7 rounded-3xl unlumen-card border border-cyan-500/25 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="p-2 rounded-xl bg-cyan-950/70 text-cyan-400 border border-cyan-500/40 shadow-sm">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Pre-emptive Watchlist Generator
            </h1>
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-950/60 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
              [HEURISTIC_PREDICT]
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Predictive domain and handle risk intelligence. Generates likely brand permutations across homoglyphs, auth keywords, character swaps, and typosquats before attackers deploy phishing infrastructure.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2.5 flex-wrap self-start md:self-auto">
          <div className="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono">
            <span className="text-slate-400">WATCHING: </span>
            <span className="text-cyan-400 font-bold">{watchedCount} TARGETS</span>
          </div>
          <button
            onClick={handleCopyWatchlist}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-xs font-semibold text-white border border-slate-700/80 transition-all btn-smooth shadow-sm"
          >
            <Copy className="w-3.5 h-3.5 text-cyan-400" />
            <span>Copy Watchlist</span>
          </button>
        </div>
      </div>

      {/* Brand Input & Control Bar */}
      <div className="p-4 sm:p-5 rounded-2xl unlumen-card border border-slate-800 flex flex-col md:flex-row items-center gap-3 justify-between shadow-lg">
        <div className="flex items-center gap-2 w-full md:w-auto flex-1 max-w-lg">
          <div className="relative flex-1 group">
            <Globe className="w-4 h-4 text-slate-400 group-focus-within:text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
            <input
              type="text"
              value={inputBrand}
              onChange={(e) => setInputBrand(e.target.value)}
              placeholder="Enter brand name to simulate..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950/90 border border-slate-700/80 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
          </div>
          <button
            onClick={() => {
              showToast(`Generated predictive namespace models for ${inputBrand}`, 'success');
            }}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 flex-shrink-0 btn-smooth"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span>Regenerate</span>
          </button>
        </div>

        {/* Search within variations */}
        <div className="relative w-full md:w-64 group">
          <Search className="w-3.5 h-3.5 text-slate-400 group-focus-within:text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter predicted names..."
            className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <span className="text-slate-400 text-[11px] font-semibold mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Type:
          </span>
          {[
            { id: 'all', label: 'All Types' },
            { id: 'Auth/Support Word', label: 'Auth & Support' },
            { id: 'Unicode Homoglyph', label: 'Unicode Homoglyphs' },
            { id: 'Character Swap', label: 'Character Swaps' },
            { id: 'Added Word', label: 'Added Words' },
            { id: 'Repeated Char', label: 'Repeated Chars' },
            { id: 'Hyphen/Spacing', label: 'Hyphens' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTypeFilter(tab.id)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTypeFilter === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-navy-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 text-[11px] font-semibold">Risk:</span>
          {['all', 'critical', 'high', 'medium'].map((risk) => (
            <button
              key={risk}
              onClick={() => setActiveRiskFilter(risk)}
              className={`px-2 py-0.5 rounded text-[11px] uppercase font-bold tracking-wider transition-colors ${
                activeRiskFilter === risk
                  ? 'bg-slate-700 text-white border border-slate-500'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {risk}
            </button>
          ))}
        </div>
      </div>

      {/* Variations Table / List */}
      <div className="rounded-2xl bg-navy-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950/80 border-b border-slate-800 text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              <tr>
                <th className="py-3 px-4">Predicted Candidate Name</th>
                <th className="py-3 px-4">Variation Type</th>
                <th className="py-3 px-4">Status & Availability (Demo)</th>
                <th className="py-3 px-4">Risk Severity</th>
                <th className="py-3 px-4">Reason / Threat Vector</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredVariations.map((v) => {
                const isWatched = !!watchedList[v.id];

                return (
                  <tr key={v.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white bg-navy-950 px-2 py-1 rounded-lg border border-slate-800">
                          {v.name}
                        </span>
                        {v.variationType === 'Unicode Homoglyph' && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                            X-RAY
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        {v.variationType}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                        v.existsStatus === 'Active Phishing'
                          ? 'bg-red-500/15 text-red-300 border-red-500/30 animate-pulse'
                          : v.existsStatus === 'Registered Recently'
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : v.existsStatus === 'DNS Parked'
                          ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {v.existsStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <RiskBadge severity={v.riskSeverity} size="sm" />
                        <span className="text-[11px] font-mono text-slate-400">
                          {v.riskScore}/100
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-slate-300 text-xs truncate" title={v.reason}>
                        {v.reason}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {v.relatedFindingId && (
                          <button
                            onClick={() => {
                              const f = findings.find((item) => item.id === v.relatedFindingId);
                              if (f) setSelectedFinding(f);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-navy-950 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 text-[11px] font-medium flex items-center gap-1 transition-colors"
                            title="View connected active finding"
                          >
                            <span>Finding</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}

                        <button
                          onClick={() => toggleWatch(v.id, v.name)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                            isWatched
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {isWatched ? (
                            <>
                              <Check className="w-3 h-3 text-cyan-400" />
                              <span>Watching</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3" />
                              <span>Watch</span>
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredVariations.length === 0 && (
          <div className="p-8 text-center text-slate-400">
            <p className="text-sm">No variations matched the selected filters.</p>
          </div>
        )}

        <div className="p-4 bg-navy-950/70 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Showing {filteredVariations.length} predicted namespaces</span>
          <span className="italic">
            Simulation based on WHOIS heuristics, IDN character dictionaries, and live DNS telemetry.
          </span>
        </div>
      </div>
    </div>
  );
};
