import React from 'react';
import { RiskSeverity, ConfidenceLevel, FindingStatus, PlatformType, FindingType } from '../../types';
import { useBrandGuard } from '../../context/BrandGuardContext';
import { 
  Filter, 
  RotateCcw, 
  Building2, 
  Cpu, 
  Calendar, 
  ShieldAlert, 
  Radio,
  Search,
  Check
} from 'lucide-react';

export interface FilterState {
  severity: string;
  confidence: string;
  type: string;
  platform: string;
  status: string;
  companyId?: string;
  source?: string; // 'all' | 'live' | 'simulated'
}

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onReset: () => void;
  availablePlatforms?: PlatformType[];
  hideTypeFilter?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
  availablePlatforms,
  hideTypeFilter = false,
}) => {
  const { availableCompanies, selectedCompanyId, switchCompany } = useBrandGuard();

  const isFiltered = 
    filters.severity !== 'all' || 
    filters.confidence !== 'all' || 
    filters.type !== 'all' || 
    filters.platform !== 'all' || 
    filters.status !== 'all' ||
    (filters.source && filters.source !== 'all');

  return (
    <div className="p-4 rounded-2xl unlumen-card border border-cyan-500/25 space-y-3 text-xs font-sans shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2 text-white font-bold">
          <Filter className="w-4 h-4 text-cyan-400" />
          <span className="tracking-tight uppercase text-[11px] font-mono">[SOC THREAT FILTER MATRIX]</span>
        </div>

        <div className="flex items-center gap-2">
          {isFiltered && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 font-bold px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all btn-smooth shadow-sm"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear Matrix</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Monitored Enterprise Filter */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-400 text-[11px] font-mono flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Target:</span>
          </label>
          <select
            value={selectedCompanyId}
            onChange={(e) => switchCompany(e.target.value)}
            className="bg-slate-950 border border-cyan-500/40 rounded-xl px-2.5 py-1.5 text-cyan-300 text-xs font-bold focus:outline-none focus:border-cyan-400 cursor-pointer shadow-sm"
          >
            {availableCompanies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.isDemo ? '(Demo)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-400 text-[11px] font-mono">Severity:</label>
          <select
            value={filters.severity}
            onChange={(e) => onFilterChange('severity', e.target.value)}
            className="bg-slate-950 border border-slate-700/80 hover:border-slate-600 rounded-xl px-2.5 py-1.5 text-slate-200 text-xs font-semibold focus:outline-none focus:border-cyan-500 cursor-pointer transition-colors"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical Risk (90-100)</option>
            <option value="high">High Risk (70-89)</option>
            <option value="medium">Medium Risk (40-69)</option>
            <option value="low">Low Risk (0-39)</option>
          </select>
        </div>

        {/* Detection Source Filter (Live Sensor vs Heuristic Engine) */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-400 text-[11px] font-mono flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>Source:</span>
          </label>
          <select
            value={filters.source || 'all'}
            onChange={(e) => onFilterChange('source', e.target.value)}
            className="bg-navy-950 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-slate-200 text-xs font-semibold focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="all">All Detection Sources</option>
            <option value="live">Verified Live Sensor</option>
            <option value="simulated">Simulated Heuristic Lab</option>
          </select>
        </div>

        {/* Platform Filter */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-400 text-[11px] font-mono">Platform:</label>
          <select
            value={filters.platform}
            onChange={(e) => onFilterChange('platform', e.target.value)}
            className="bg-navy-950 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-slate-200 text-xs font-semibold focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="all">All Platforms</option>
            <option value="Instagram">Instagram</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="X">X (Twitter)</option>
            <option value="Facebook">Facebook</option>
            <option value="Telegram">Telegram</option>
            <option value="Google Play">Google Play</option>
            <option value="Apple App Store">Apple App Store</option>
            <option value="Third-party APK">Third-party APK</option>
          </select>
        </div>

        {/* Confidence Filter */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-400 text-[11px] font-mono">Confidence:</label>
          <select
            value={filters.confidence}
            onChange={(e) => onFilterChange('confidence', e.target.value)}
            className="bg-navy-950 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-slate-200 text-xs font-semibold focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="all">All Confidence</option>
            <option value="High">High Confidence (≥85%)</option>
            <option value="Medium">Medium Confidence (60-84%)</option>
            <option value="Low">Low Confidence (&lt;60%)</option>
          </select>
        </div>

        {/* Incident Status */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-400 text-[11px] font-mono">Status:</label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="bg-navy-950 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-slate-200 text-xs font-semibold focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="New">New</option>
            <option value="Investigating">Investigating</option>
            <option value="Likely impersonation">Likely impersonation</option>
            <option value="Confirmed fake">Confirmed fake</option>
            <option value="Dismissed">Dismissed</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>
    </div>
  );
};
