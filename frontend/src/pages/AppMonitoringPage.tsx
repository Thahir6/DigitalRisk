import React, { useState, useMemo } from 'react';
import { useBrandGuard } from '../context/BrandGuardContext';
import { FilterBar, FilterState } from '../components/findings/FilterBar';
import { FindingRow } from '../components/findings/FindingRow';
import { FindingCard } from '../components/findings/FindingCard';
import { EmptyState } from '../components/common/EmptyState';
import { 
  Smartphone, 
  Radar, 
  LayoutGrid, 
  List, 
  Search,
  ShieldAlert,
  AlertOctagon,
  CheckCircle2,
  PackageCheck
} from 'lucide-react';
import { PlatformType } from '../types';

export const AppMonitoringPage: React.FC = () => {
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
    type: 'app',
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
      type: 'app',
      platform: 'all',
      status: 'all',
    });
    setLocalSearch('');
  };

  const appPlatforms: PlatformType[] = ['Google Play', 'Apple App Store', 'Third-party APK'];

  // Filter findings: only app items + filters + search
  const filteredAppFindings = useMemo(() => {
    const activeSearch = (localSearch || searchQuery).toLowerCase().trim();

    return findings.filter((f) => {
      if (f.type !== 'app') return false;

      // Filter bar
      if (filters.severity !== 'all' && f.riskSeverity !== filters.severity) return false;
      if (filters.confidence !== 'all' && f.confidence !== filters.confidence) return false;
      if (filters.platform !== 'all' && f.platform !== filters.platform) return false;
      if (filters.status !== 'all' && f.status !== filters.status) return false;

      // Search matching
      if (activeSearch) {
        const matchesTitle = f.title.toLowerCase().includes(activeSearch);
        const matchesPkg = f.usernameOrPackage.toLowerCase().includes(activeSearch);
        const matchesReason = f.mainReason.toLowerCase().includes(activeSearch);
        if (!matchesTitle && !matchesPkg && !matchesReason) return false;
      }

      return true;
    });
  }, [findings, filters, localSearch, searchQuery]);

  // Section 11 Summary Metrics
  const appMetrics = useMemo(() => {
    const appItems = findings.filter((f) => f.type === 'app');
    return {
      appsChecked: 64,
      potentiallySuspicious: appItems.filter((f) => f.status !== 'Dismissed').length,
      highRiskApps: appItems.filter((f) => (f.riskSeverity === 'critical' || f.riskSeverity === 'high') && f.status !== 'Dismissed').length,
      confirmedFindings: appItems.filter((f) => f.status === 'Confirmed fake').length,
    };
  }, [findings]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h2 className="text-2xl font-black text-white tracking-tight">
              Mobile Apps
            </h2>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25">
              <Smartphone className="w-3 h-3" />
              {company?.name || 'Store & Mirror Scans Active'}
            </span>
            {isDemoMode && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 uppercase tracking-wider">
                Demo Dataset
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            Detect rogue APK packages and unauthorized mobile applications copying <span className="text-slate-200 font-semibold">{company?.name || 'your brand'}</span>.
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
            onClick={() => runNewScan('app')}
            disabled={isScanning}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-navy-950 shadow-lg shadow-amber-950/50 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Radar className={`w-4 h-4 text-navy-950 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning Stores...' : 'Check mobile apps'}</span>
          </button>
        </div>
      </div>

      {/* Section 11 Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-navy-850 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Apps checked</span>
            <PackageCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">{appMetrics.appsChecked}</div>
          <span className="text-[10px] text-slate-500">Google Play, App Store & Mirrors</span>
        </div>

        <div className="p-4 rounded-xl bg-navy-850 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Potentially suspicious</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">{appMetrics.potentiallySuspicious}</div>
          <span className="text-[10px] text-amber-400/80">Namespace collisions</span>
        </div>

        <div className="p-4 rounded-xl bg-navy-850 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>High-risk apps</span>
            <AlertOctagon className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-xl font-bold text-red-400 font-mono">{appMetrics.highRiskApps}</div>
          <span className="text-[10px] text-red-400/80">Dangerous permissions</span>
        </div>

        <div className="p-4 rounded-xl bg-navy-850 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Confirmed findings</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono">{appMetrics.confirmedFindings}</div>
          <span className="text-[10px] text-emerald-400/80">Marked as confirmed fake</span>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Filter apps by name, package ID, or store..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-navy-900 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all"
          />
        </div>

        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          availablePlatforms={appPlatforms}
          hideTypeFilter
        />
      </div>

      {/* Results View */}
      {filteredAppFindings.length === 0 ? (
        <EmptyState
          title={`No suspicious mobile applications found for ${company?.name || 'this company'}`}
          description="None of the indexed app listings match the current filters. Run a scan to query store catalogs."
          actionLabel="Check mobile apps"
          onAction={() => runNewScan('app')}
        />
      ) : viewMode === 'table' ? (
        <div className="bg-navy-850 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-900/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">App or package being checked</th>
                  <th className="py-3 px-4">Store / Mirror</th>
                  <th className="py-3 px-4">Risk score</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-4">Why this was flagged</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last seen</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredAppFindings.map((finding) => (
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
          {filteredAppFindings.map((finding) => (
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
