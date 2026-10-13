import React, { useState, useMemo } from 'react';
import { useBrandGuard } from '../context/BrandGuardContext';
import { FilterBar, FilterState } from '../components/findings/FilterBar';
import { FindingRow } from '../components/findings/FindingRow';
import { FindingCard } from '../components/findings/FindingCard';
import { EmptyState } from '../components/common/EmptyState';
import { DetectionFeedbackPanel } from '../components/findings/DetectionFeedbackPanel';
import { Finding } from '../types';
import { 
  ShieldAlert, 
  LayoutGrid, 
  List, 
  Search, 
  Radar, 
  FileCheck2, 
  FileX2, 
  Clock, 
  Share2, 
  Smartphone,
  ChevronLeft,
  ChevronRight,
  Download,
  Terminal,
  Crosshair,
  Filter,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Cpu
} from 'lucide-react';

type TabType = 'all' | 'social' | 'app' | 'confirmed' | 'dismissed' | 'resolved';

export const FindingsPage: React.FC = () => {
  const { 
    findings, 
    company,
    brandProfile,
    isDemoMode,
    setSelectedFinding, 
    openReportModal, 
    runNewScan, 
    isScanning,
    searchQuery,
    findingsActiveTab,
    setFindingsActiveTab,
    findingsSeverityFilter,
    setActivePage,
    showToast
  } = useBrandGuard();

  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [localSearch, setLocalSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFeedbackPanel, setShowFeedbackPanel] = useState(true);
  const itemsPerPage = 8;

  const [filters, setFilters] = useState<FilterState>({
    severity: 'all',
    confidence: 'all',
    type: 'all',
    platform: 'all',
    status: 'all',
    source: 'all',
  });

  React.useEffect(() => {
    if (findingsActiveTab) {
      setActiveTab(findingsActiveTab as TabType);
    }
  }, [findingsActiveTab]);

  React.useEffect(() => {
    if (findingsSeverityFilter && findingsSeverityFilter !== 'all') {
      setFilters((prev: FilterState) => ({ ...prev, severity: findingsSeverityFilter }));
    }
  }, [findingsSeverityFilter]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev: FilterState) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      severity: 'all',
      confidence: 'all',
      type: 'all',
      platform: 'all',
      status: 'all',
      source: 'all',
    });
    setLocalSearch('');
    setActiveTab('all');
    setCurrentPage(1);
  };

  // Tab counts
  const tabCounts = useMemo(() => ({
    all: findings.length,
    social: findings.filter((f: Finding) => f.type === 'social').length,
    app: findings.filter((f: Finding) => f.type === 'app').length,
    confirmed: findings.filter((f: Finding) => f.status === 'Confirmed fake').length,
    dismissed: findings.filter((f: Finding) => f.status === 'Dismissed').length,
    resolved: findings.filter((f: Finding) => f.status === 'Resolved').length,
  }), [findings]);

  // Filtered findings
  const filteredFindings = useMemo(() => {
    const activeSearch = (localSearch || searchQuery).toLowerCase().trim();

    return findings.filter((f: Finding) => {
      // Tab matching
      if (activeTab === 'social' && f.type !== 'social') return false;
      if (activeTab === 'app' && f.type !== 'app') return false;
      if (activeTab === 'confirmed' && f.status !== 'Confirmed fake') return false;
      if (activeTab === 'dismissed' && f.status !== 'Dismissed') return false;
      if (activeTab === 'resolved' && f.status !== 'Resolved') return false;

      // Filter bar matching
      if (filters.severity !== 'all' && f.riskSeverity !== filters.severity) return false;
      if (filters.confidence !== 'all' && f.confidence !== filters.confidence) return false;
      if (filters.type !== 'all' && f.type !== filters.type) return false;
      if (filters.platform !== 'all' && f.platform !== filters.platform) return false;
      if (filters.status !== 'all' && f.status !== filters.status) return false;

      // Detection source filter
      if (filters.source === 'live' && f.id.startsWith('finding-')) return false;
      if (filters.source === 'simulated' && !f.id.startsWith('finding-')) return false;

      // Search matching
      if (activeSearch) {
        const matchesTitle = f.title.toLowerCase().includes(activeSearch);
        const matchesHandle = f.usernameOrPackage.toLowerCase().includes(activeSearch);
        const matchesReason = f.mainReason.toLowerCase().includes(activeSearch);
        const matchesDomain = f.candidateWebsite ? f.candidateWebsite.toLowerCase().includes(activeSearch) : false;
        if (!matchesTitle && !matchesHandle && !matchesReason && !matchesDomain) return false;
      }

      return true;
    });
  }, [findings, activeTab, filters, localSearch, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredFindings.length / itemsPerPage) || 1;
  const paginatedFindings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredFindings.slice(start, start + itemsPerPage);
  }, [filteredFindings, currentPage]);

  const tabs: Array<{ id: TabType; label: string; count: number }> = [
    { id: 'all', label: 'All Signals', count: tabCounts.all },
    { id: 'social', label: 'Social Profiles', count: tabCounts.social },
    { id: 'app', label: 'Mobile Apps', count: tabCounts.app },
    { id: 'confirmed', label: 'Confirmed Fake', count: tabCounts.confirmed },
    { id: 'dismissed', label: 'Dismissed', count: tabCounts.dismissed },
    { id: 'resolved', label: 'Resolved / Neutralized', count: tabCounts.resolved },
  ];

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Title,Platform,Handle,Severity,RiskScore,Confidence,Status,DetectedTime"]
      .concat(filteredFindings.map((f: Finding) => `"${f.title}","${f.platform}","${f.usernameOrPackage}","${f.riskSeverity}",${f.riskScore},"${f.confidence}","${f.status}","${f.detectedTime}"`))
      .join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `brandguard_threat_feed_${brandProfile.brandName || 'report'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Threat intelligence feed exported to CSV', 'success');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      
      {/* 1. Threat Investigation Explorer Command Header */}
      <div className="p-6 sm:p-8 rounded-3xl unlumen-card border border-cyan-500/25 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-red-950/60 text-red-300 border border-red-500/30 flex items-center gap-1.5 shadow-sm">
                <Flame className="w-3.5 h-3.5 text-red-400" />
                <span>[DEFCON 1] • INVESTIGATION WORKSPACE</span>
              </span>
              <span className="text-[11px] font-mono text-cyan-300 px-2.5 py-0.5 rounded-md bg-cyan-950/40 border border-cyan-500/30">
                TARGET: {brandProfile.brandName || company?.name}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>Threat Investigation Explorer</span>
              <span className="text-sm font-mono text-cyan-400/80 font-normal">
                ({filteredFindings.length} Active Records)
              </span>
            </h1>

            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Triage, analyze, and escalate suspicious profiles, domain lookalikes, and unauthorized APK mirrors targeting {brandProfile.brandName || company?.name || 'your enterprise'}.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
            <button
              onClick={() => setShowFeedbackPanel(!showFeedbackPanel)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold btn-smooth transition-all flex items-center gap-1.5 shadow-sm border ${
                showFeedbackPanel
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-700/80'
              }`}
              title="Toggle Analyst Detection Feedback Loop Panel"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Feedback Loop ({tabCounts.confirmed} confirmed)</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold btn-smooth bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all flex items-center gap-1.5 shadow-sm"
              title="Export filtered IOCs and findings as CSV"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export CSV</span>
            </button>

            <div className="relative group p-px rounded-xl overflow-hidden shadow-lg shadow-cyan-500/20">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500" />
              <button
                onClick={() => runNewScan('all')}
                disabled={isScanning}
                className="relative px-4 py-2.5 rounded-[11px] text-xs font-bold bg-slate-950 hover:bg-slate-900 text-cyan-300 transition-all flex items-center gap-2 disabled:opacity-50 btn-smooth"
              >
                <Radar className={`w-4 h-4 text-cyan-400 ${isScanning ? 'animate-spin' : ''}`} />
                <span className="bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent">
                  {isScanning ? 'Scanning Feeds...' : 'Rescan Perimeter'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feature 6: Analyst Feedback Loop Panel */}
      {showFeedbackPanel && (
        <DetectionFeedbackPanel />
      )}

      {/* 2. Interactive Threat Search & Filter Matrix */}
      <section className="space-y-3">
        {/* Search Bar with Terminal Syntax Hint */}
        <div className="relative group">
          <Search className="w-4 h-4 text-cyan-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-cyan-300 transition-colors" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by suspicious handle (@nike_deals), package name, candidate domain, or flagged reason..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-950/80 border border-cyan-500/25 text-xs font-mono text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 shadow-xl backdrop-blur-md transition-all"
          />
        </div>

        {/* Filter Bar with Enterprise Selector and Source Filter */}
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />
      </section>

      {/* 3. Status Category Tabs & View Mode Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold py-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap btn-smooth ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-850'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                  isActive ? 'bg-slate-950/30 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* View Switcher: Table vs Cards */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-navy-950 border border-slate-800 self-end sm:self-auto flex-shrink-0">
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'table' ? 'bg-cyan-500 text-navy-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="Dense SOC Table View"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'cards' ? 'bg-cyan-500 text-navy-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="Visual Evidence Grid"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. Threat Findings Display: Table or Grid */}
      {filteredFindings.length === 0 ? (
        <EmptyState
          title="No Threat Signals Match Current Query"
          description="Try broadening your filter criteria or search keyword to reveal additional detected signals."
          actionText="Reset All Filters"
          onAction={handleResetFilters}
        />
      ) : viewMode === 'table' ? (
        /* High-Density SOC Table View */
        <div className="rounded-2xl cyber-panel border border-slate-800/90 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-navy-950/80 border-b border-slate-800 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4 font-bold">Threat Target / Impersonator</th>
                  <th className="py-3 px-4 font-bold">Platform</th>
                  <th className="py-3 px-4 font-bold">Risk Score</th>
                  <th className="py-3 px-4 font-bold">Confidence</th>
                  <th className="py-3 px-4 font-bold">Flagged Reason</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold">Detected</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {paginatedFindings.map((finding: Finding) => (
                  <FindingRow
                    key={finding.id}
                    finding={finding}
                    onSelect={setSelectedFinding}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Visual Evidence Card Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedFindings.map((finding: Finding) => (
            <FindingCard
              key={finding.id}
              finding={finding}
              onSelect={setSelectedFinding}
            />
          ))}
        </div>
      )}

      {/* 5. Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-400 font-mono">
          <div>
            Showing <strong className="text-white">{(currentPage - 1) * itemsPerPage + 1}</strong> to{' '}
            <strong className="text-white">{Math.min(currentPage * itemsPerPage, filteredFindings.length)}</strong> of{' '}
            <strong className="text-white">{filteredFindings.length}</strong> findings
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-navy-950 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 rounded-xl bg-navy-900 border border-slate-800 text-cyan-400 font-bold">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-navy-950 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
