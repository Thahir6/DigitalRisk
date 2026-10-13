import React, { useState, useMemo } from 'react';
import { useBrandGuard } from '../context/BrandGuardContext';
import { FilterBar, FilterState } from '../components/findings/FilterBar';
import { FindingRow } from '../components/findings/FindingRow';
import { FindingCard } from '../components/findings/FindingCard';
import { EmptyState } from '../components/common/EmptyState';
import { 
  Share2, 
  Radar, 
  LayoutGrid, 
  List, 
  Search,
  ShieldAlert,
  AlertOctagon,
  CheckCircle2,
  Users
} from 'lucide-react';
import { PlatformType } from '../types';

export const SocialMonitoringPage: React.FC = () => {
  const { 
    findings, 
    company,
    isDemoMode,
    openReportModal, 
    runNewScan, 
    isScanning,
    searchQuery 
  } = useBrandGuard();

  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [localSearch, setLocalSearch] = useState('');

  const [filters, setFilters] = useState<FilterState>({
    severity: 'all',
    confidence: 'all',
    type: 'social',
    platform: 'all',
    status: 'all',
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      severity: 'all',
      confidence: 'all',
      type: 'social',
      platform: 'all',
      status: 'all',
    });
    setLocalSearch('');
  };

  const socialPlatforms: PlatformType[] = ['Instagram', 'LinkedIn', 'X', 'Facebook', 'Telegram'];

  // Filter findings: only social items + filter matching + search matching
  const filteredSocialFindings = useMemo(() => {
    const activeSearch = (localSearch || searchQuery).toLowerCase().trim();

    return findings.filter((f) => {
      if (f.type !== 'social') return false;

      // Filter bar
      if (filters.severity !== 'all' && f.riskSeverity !== filters.severity) return false;
      if (filters.confidence !== 'all' && f.confidence !== filters.confidence) return false;
      if (filters.platform !== 'all' && f.platform !== filters.platform) return false;
      if (filters.status !== 'all' && f.status !== filters.status) return false;

      // Search matching
      if (activeSearch) {
        const matchesTitle = f.title.toLowerCase().includes(activeSearch);
        const matchesHandle = f.usernameOrPackage.toLowerCase().includes(activeSearch);
        const matchesReason = f.mainReason.toLowerCase().includes(activeSearch);
        if (!matchesTitle && !matchesHandle && !matchesReason) return false;
      }

      return true;
    });
  }, [findings, filters, localSearch, searchQuery]);

  // Section 10 Summary metrics
  const socialMetrics = useMemo(() => {
    const socialItems = findings.filter((f) => f.type === 'social');
    return {
      profilesChecked: 184,
      potentialImpersonations: socialItems.filter((f) => f.status !== 'Dismissed').length,
      highRiskProfiles: socialItems.filter((f) => (f.riskSeverity === 'critical' || f.riskSeverity === 'high') && f.status !== 'Dismissed').length,
      confirmedFindings: socialItems.filter((f) => f.status === 'Confirmed fake').length,
    };
  }, [findings]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h2 className="text-2xl font-black text-white tracking-tight">
              Social Profiles
            </h2>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/25">
              <Share2 className="w-3 h-3" />
              {company?.name || '5 Networks Ingested'}
            </span>
            {isDemoMode && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 uppercase tracking-wider">
                Demo Dataset
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            Review profiles that may be impersonating <span className="text-slate-200 font-semibold">{company?.name || 'your brand'}</span> across Instagram, X, Facebook, and Telegram.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center p-1 rounded-xl bg-navy-850 border border-slate-800">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'table' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
              aria-label="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'cards' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Card Grid View"
              aria-label="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => runNewScan('social')}
            disabled={isScanning}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-950/50 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Radar className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Auditing Feeds...' : 'Run social scan'}</span>
          </button>
        </div>
      </div>

      {/* Section 10 Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-navy-850 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Profiles checked</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">{socialMetrics.profilesChecked}</div>
          <span className="text-[10px] text-slate-500">Across 5 networks</span>
        </div>

        <div className="p-4 rounded-xl bg-navy-850 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Potential impersonations</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">{socialMetrics.potentialImpersonations}</div>
          <span className="text-[10px] text-amber-400/80">Pending analyst review</span>
        </div>

        <div className="p-4 rounded-xl bg-navy-850 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>High-risk profiles</span>
            <AlertOctagon className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-xl font-bold text-red-400 font-mono">{socialMetrics.highRiskProfiles}</div>
          <span className="text-[10px] text-red-400/80">Immediate attention</span>
        </div>

        <div className="p-4 rounded-xl bg-navy-850 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Confirmed findings</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono">{socialMetrics.confirmedFindings}</div>
          <span className="text-[10px] text-emerald-400/80">Marked as confirmed fake</span>
        </div>
      </div>

      {/* Filter and In-Page Search Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Filter profiles by name, handle, or flagged reason..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-navy-900 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
          />
        </div>

        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          availablePlatforms={socialPlatforms}
          hideTypeFilter
        />
      </div>

      {/* Results View: Table or Cards */}
      {filteredSocialFindings.length === 0 ? (
        <EmptyState
          title={`No social impersonations found for ${company?.name || 'this company'}`}
          description="None of the ingested social profiles match current threat filters. Run a scan to check for new candidates."
          actionLabel="Run social scan"
          onAction={() => runNewScan('social')}
        />
      ) : viewMode === 'table' ? (
        <div className="bg-navy-850 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-900/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Profile or app being checked</th>
                  <th className="py-3 px-4">Platform</th>
                  <th className="py-3 px-4">Risk score</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-4">Why this was flagged</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last seen</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredSocialFindings.map((finding) => (
                  <FindingRow
                    key={finding.id}
                    finding={finding}
                    onSelect={(f) => openReportModal(f)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSocialFindings.map((finding) => (
            <FindingCard
              key={finding.id}
              finding={finding}
              onSelect={(f) => openReportModal(f)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
