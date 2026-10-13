import React, { useState } from 'react';
import { useBrandGuard } from '../../context/BrandGuardContext';
import { 
  Bell, 
  ChevronDown, 
  Check, 
  ExternalLink,
  Shield, 
  Activity,
  Bot,
  Sparkles
} from 'lucide-react';
import { SourceStatusBadge } from '../common/SourceStatusBadge';
import { AskBrandShieldModal } from '../assistant/AskBrandShieldModal';

export const Topbar: React.FC = () => {
  const { 
    activePage, 
    searchQuery, 
    setSearchQuery, 
    sources, 
    brandProfile,
    findings,
    setSelectedFinding,
    user,
    company,
    logout,
    availableCompanies,
    selectedCompanyId,
    switchCompany,
    isDemoMode,
    isLoadingData,
  } = useBrandGuard();

  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const brandDropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (brandDropdownRef.current && !brandDropdownRef.current.contains(e.target as Node)) {
        setIsBrandDropdownOpen(false);
      }
    };
    if (isBrandDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isBrandDropdownOpen]);

  const pageTitles: Record<string, string> = {
    home: 'Home Dashboard',
    'check-link': 'Check a Suspicious Link',
    social: 'Social Profiles',
    apps: 'Mobile Apps',
    findings: 'All Risk Findings',
    'scan-results': 'Scan Results & Staged Review',
    'brand-profile': 'Official Brand Profile',
    settings: 'Settings & Parameters',
    watchlist: 'Pre-emptive Watchlist Generator',
    'scam-analyzer': 'Scam Script Analyzer',
    'unicode-xray': 'Unicode X-Ray Laboratory',
    'warning-kit': 'Customer Warning & Advisory Kit',
    'board-report': 'Board-Ready Security Report',
    'alert-preview': 'Slack & Teams Alert Preview',
  };

  const liveSourcesCount = sources.filter((s) => s.status === 'live' || s.status === 'partially_available').length;
  const recentAlerts = findings.slice(0, 3);

  return (
    <header className="h-16 px-6 bg-[#070A14]/90 backdrop-blur-xl border-b border-[#24324D] flex items-center justify-between gap-4 sticky top-0 z-20 shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
      {/* Specular edge line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#8050FF]/30 to-transparent pointer-events-none" />

      {/* Left: Page Title with Retro indicator */}
      <div className="flex items-center gap-3 min-w-[200px]">
        <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded border border-[#8050FF]/40 bg-[#8050FF]/10 text-[10px] font-mono text-[#A17AFF]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#42DDF5] animate-pulse" />
          <span>AEGIS_SOC</span>
        </div>
        <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          {pageTitles[activePage] || 'AEGIS Dashboard'}
        </h1>
      </div>

      {/* Center: Ask AEGIS assistant button */}
      <div className="flex-1 max-w-lg flex items-center">
        {/* Feature 10: Ask AEGIS compact assistant button with Magic UI border beam */}
        <div className="relative group p-px rounded-xl overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#8050FF] via-[#A17AFF] to-[#42DDF5] opacity-70 group-hover:opacity-100 transition-opacity blur-[1px]" />
          <button
            onClick={() => setIsAssistantOpen(true)}
            className="relative flex items-center gap-1.5 px-3 py-2 rounded-[11px] bg-[#070A14] hover:bg-[#0D1425] text-white text-xs font-semibold shadow-md transition-all flex-shrink-0 group"
            title="Ask AEGIS AI Search & Assistant"
          >
            <Bot className="w-4 h-4 text-[#42DDF5] group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline bg-gradient-to-r from-[#A17AFF] to-[#42DDF5] bg-clip-text text-transparent font-bold">Ask AEGIS</span>
          </button>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Source status indicator pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800/90 text-xs shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
          <span className="text-slate-400 text-[11px] font-mono">SOURCES:</span>
          <span className="text-cyan-300 font-semibold text-[11px] font-mono">
            {liveSourcesCount}/{sources.length} LIVE
          </span>
          <div className="hidden xl:flex items-center gap-1.5 ml-2 border-l border-slate-800 pl-2">
            {sources.map((src) => (
              <SourceStatusBadge key={src.id} source={src} compact />
            ))}
          </div>
        </div>

        {/* Dynamic Brand / Company Selector */}
        <div className="relative" ref={brandDropdownRef}>
          <button
            id="company-switcher-button"
            data-testid="company-switcher-button"
            onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850 text-xs font-medium text-white transition-all shadow-md group"
            title="Click to switch active monitored company"
          >
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-cyan-500/30 to-blue-600/30 text-cyan-300 font-bold flex items-center justify-center text-[10px] border border-cyan-500/40 shadow-sm">
              {brandProfile.logoText || 'BG'}
            </div>
            <span className="max-w-[120px] sm:max-w-[150px] truncate font-medium">{brandProfile.brandName || company?.name || 'Company'}</span>
            {isDemoMode && (
              <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[9px] font-mono font-bold tracking-wider uppercase">
                DEMO
              </span>
            )}
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-all ${isBrandDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isBrandDropdownOpen && (
            <div 
              id="company-switcher-dropdown"
              className="absolute right-0 mt-2 w-72 p-2.5 rounded-2xl bg-slate-950/95 border border-cyan-500/25 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="flex items-center justify-between px-2 py-1 mb-1.5">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                  Select Monitored Brand
                </span>
                <span className="text-[10px] font-mono text-cyan-400 font-medium">
                  [{availableCompanies.length} ACTIVE]
                </span>
              </div>

              <div className="space-y-1 max-h-64 overflow-y-auto pr-0.5">
                {availableCompanies.map((c) => {
                  const isSelected = c.id === selectedCompanyId || c.id === company?.id;
                  return (
                    <button
                      key={c.id}
                      id={`company-option-${c.id}`}
                      data-testid={`company-option-${c.id}`}
                      onClick={() => {
                        switchCompany(c.id);
                        setIsBrandDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                        isSelected
                          ? 'bg-cyan-500/15 border border-cyan-500/40 text-white shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                          : 'bg-slate-900/40 hover:bg-slate-800/70 border border-slate-800/80 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                          isSelected ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 shadow-sm' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {c.logoText || c.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-xs font-semibold truncate ${isSelected ? 'text-cyan-300' : 'text-white'}`}>
                            {c.name}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {c.industry}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                        {c.findingsCount !== undefined && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/90 text-slate-300 font-mono border border-slate-700/60">
                            {c.findingsCount} threats
                          </span>
                        )}
                        {isSelected && <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-2 pt-2 border-t border-slate-800/80 px-2 py-1 text-[11px] text-slate-400 leading-snug">
                <span>Findings and dashboard statistics filter strictly to the active brand scope.</span>
              </div>
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-800 transition-all shadow-sm"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 p-3 rounded-2xl bg-slate-950/95 border border-cyan-500/20 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white">Recent Impersonation Alerts</span>
                <span className="text-[10px] font-mono text-cyan-400">LIVE FEED</span>
              </div>
              <div className="space-y-2">
                {recentAlerts.map((finding) => (
                  <button
                    key={finding.id}
                    onClick={() => {
                      setSelectedFinding(finding);
                      setIsNotificationsOpen(false);
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-850 border border-slate-800/80 hover:border-cyan-500/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-white truncate max-w-[170px]">
                        {finding.title}
                      </span>
                      <span className="text-[10px] text-red-400 font-mono font-bold uppercase">
                        {finding.riskSeverity}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      {finding.mainReason}
                    </p>
                    <span className="text-[9px] text-slate-500 mt-1 block font-mono">
                      {finding.detectedTime}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User avatar menu */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2.5 pl-2 pr-1.5 py-1 rounded-xl bg-slate-900/60 border border-transparent hover:border-slate-800 hover:bg-slate-850 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-semibold text-xs flex items-center justify-center ring-2 ring-cyan-500/20 shadow-md">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'AM'}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-medium text-white leading-tight">
                {user?.name || 'Alex Mercer'}
              </span>
              <span className="text-[10px] text-cyan-400/90 font-mono leading-tight">
                {user?.role || 'SecOps Lead'}
              </span>
            </div>
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 p-2 rounded-2xl bg-slate-950/95 border border-slate-800 shadow-2xl backdrop-blur-2xl z-50 text-xs text-slate-200 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-2 border-b border-slate-800 mb-1">
                <p className="font-semibold text-white">{user?.name || 'Alex Mercer'}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email || 'alex.mercer@acmepay.com'}</p>
              </div>
              <div className="p-2 text-[11px] text-slate-400">
                Company: <span className="text-white font-medium">{company?.name || brandProfile.brandName}</span>
              </div>
              <div className="p-2 text-[11px] text-slate-400 border-b border-slate-800">
                Role: <span className="text-cyan-400 font-mono">{user?.role || 'SecOps Lead'}</span>
              </div>
              <div className="pt-1">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left p-2 rounded-xl text-red-400 hover:bg-red-500/10 text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Feature 10: Ask BrandShield Modal */}
      <AskBrandShieldModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />
    </header>
  );
};
