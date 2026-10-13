import React from 'react';
import { useBrandGuard } from '../../context/BrandGuardContext';
import { PageId } from '../../types';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Link2,
  Building2, 
  Share2, 
  Smartphone, 
  ShieldAlert, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  RotateCcw,
  Home,
  LogOut,
  Wrench,
  FileText,
  ChevronDown,
  ChevronUp,
  Code2,
  Megaphone,
  FileSearch,
  Bell,
  Eye,
  Radio,
  Radar
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    activePage, 
    setActivePage, 
    counts, 
    isSidebarCollapsed, 
    toggleSidebar,
    resetDemoData,
    brandProfile,
    setViewMode,
    logout,
    company,
    isDemoMode
  } = useBrandGuard();

  const [isToolsOpen, setIsToolsOpen] = React.useState(true);
  const [isReportsOpen, setIsReportsOpen] = React.useState(true);

  const mainNavItems = [
    { id: 'home' as PageId, label: 'Home', icon: Home },
    { 
      id: 'scan-results' as PageId, 
      label: 'Scan Results', 
      icon: Radar, 
      badge: 'Staged', 
      badgeColor: 'bg-[#8050FF]/20 text-[#A17AFF] border-[#8050FF]/40' 
    },
    { 
      id: 'findings' as PageId, 
      label: 'Findings', 
      icon: ShieldAlert, 
      badge: counts.open, 
      badgeColor: 'bg-[#FF5878]/15 text-[#FF5878] border-[#FF5878]/30' 
    },
    { id: 'check-link' as PageId, label: 'Check a Link', icon: Link2 },
    { 
      id: 'brand-profile' as PageId, 
      label: 'Brand Profile', 
      icon: Building2, 
      badge: `${brandProfile.completenessPercent}%`, 
      badgeColor: 'bg-[#43D9B0]/15 text-[#43D9B0] border-[#43D9B0]/30' 
    },
  ];

  const toolsItems = [
    { id: 'watchlist' as PageId, label: 'Pre-emptive Watchlist', icon: ShieldCheck },
    { id: 'scam-analyzer' as PageId, label: 'Scam Script Analyzer', icon: FileSearch },
    { id: 'unicode-xray' as PageId, label: 'Unicode X-ray', icon: Code2 },
    { id: 'warning-kit' as PageId, label: 'Customer Warning Kit', icon: Megaphone },
  ];

  const reportsItems = [
    { id: 'board-report' as PageId, label: 'Board Report', icon: FileText },
    { id: 'alert-preview' as PageId, label: 'Alert Preview', icon: Bell },
  ];

  return (
    <aside 
      className={`relative flex flex-col h-screen bg-[#070A14] border-r border-[#24324D] transition-all duration-300 z-30 select-none ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#24324D] bg-[#0A1020]/80 backdrop-blur-md">
        <div 
          onClick={() => setViewMode('landing')}
          className="flex items-center gap-3 overflow-hidden cursor-pointer group"
          title="Return to AEGIS landing page"
        >
          <div className="p-2 rounded-xl bg-gradient-to-br from-[#8050FF]/25 to-[#42DDF5]/15 border border-[#8050FF]/50 text-[#A17AFF] shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5 text-[#42DDF5]" />
          </div>
          {!isSidebarCollapsed && (
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-display-3d text-lg font-black text-white tracking-tight truncate group-hover:text-[#A17AFF] transition-colors">
                  AEGIS
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider rounded bg-[#8050FF]/15 text-[#A17AFF] border border-[#8050FF]/30">
                  SecOps
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#A6B3CD] truncate tracking-wide">
                Digital Risk Protection
              </span>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg text-[#A6B3CD] hover:text-white hover:bg-[#111B30] transition-all btn-smooth"
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Active Selected Company badge */}
      {!isSidebarCollapsed && company && (
        <div className="px-3 pt-3 pb-1">
          <div className="px-3 py-2 rounded-xl bg-[#0D1425] border border-[#24324D] flex items-center justify-between shadow-inner backdrop-blur-sm">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#8050FF]/20 to-[#42DDF5]/20 text-[#A17AFF] border border-[#8050FF]/40 flex items-center justify-center font-black text-[10px] flex-shrink-0">
                {company.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-white truncate leading-tight">
                  {company.name}
                </p>
                <p className="text-[9px] text-[#A6B3CD] font-mono truncate">
                  {company.website || 'Protected Brand'}
                </p>
              </div>
            </div>
            {isDemoMode && (
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#FFBD69]/15 text-[#FFBD69] border border-[#FFBD69]/30 uppercase tracking-wider">
                SIM
              </span>
            )}
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 py-4 px-3 space-y-3.5 overflow-y-auto">
        {/* Core items */}
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id || (item.id === 'findings' && (activePage === 'social' || activePage === 'apps'));

            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all duration-200 btn-smooth ${
                  isActive
                    ? 'bg-gradient-to-r from-[#8050FF]/25 to-[#42DDF5]/15 text-white border border-[#8050FF]/50 shadow-sm shadow-[#8050FF]/20 font-semibold'
                    : 'text-[#A6B3CD] hover:text-white hover:bg-[#111B30] border border-transparent'
                } ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? 'text-[#42DDF5]' : 'text-[#A6B3CD]'}`} />
                  {!isSidebarCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </div>

                {!isSidebarCollapsed && item.badge !== undefined && (
                  <span className={`px-2 py-0.5 text-[10px] font-mono rounded-full border ${item.badgeColor || 'bg-[#111B30] text-[#A6B3CD]'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tools Group */}
        <div className="space-y-1">
          {!isSidebarCollapsed && (
            <button
              onClick={() => setIsToolsOpen(!isToolsOpen)}
              className="w-full flex items-center justify-between px-3 py-1 text-[10px] font-mono uppercase font-bold text-[#A6B3CD] tracking-wider hover:text-[#A17AFF] transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Wrench className="w-3 h-3 text-[#A17AFF]" />
                <span>Forensics</span>
              </span>
              {isToolsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}

          {(isToolsOpen || isSidebarCollapsed) && (
            <div className="space-y-1">
              {toolsItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-all duration-200 btn-smooth ${
                      isActive
                        ? 'bg-[#8050FF]/20 text-[#A17AFF] border border-[#8050FF]/40 font-semibold shadow-sm'
                        : 'text-[#A6B3CD] hover:text-white hover:bg-[#111B30] border border-transparent'
                    } ${isSidebarCollapsed ? 'justify-center' : 'justify-start'}`}
                    title={isSidebarCollapsed ? item.label : undefined}
                  >
                    <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-[#A17AFF]' : 'text-[#A6B3CD]'}`} />
                    {!isSidebarCollapsed && (
                      <span className="truncate text-[11px]">{item.label}</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Reports Group */}
        <div className="space-y-1">
          {!isSidebarCollapsed && (
            <button
              onClick={() => setIsReportsOpen(!isReportsOpen)}
              className="w-full flex items-center justify-between px-3 py-1 text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider hover:text-cyan-300 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <FileText className="w-3 h-3 text-cyan-400" />
                <span>Intelligence</span>
              </span>
              {isReportsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}

          {(isReportsOpen || isSidebarCollapsed) && (
            <div className="space-y-1">
              {reportsItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-all duration-200 btn-smooth ${
                      isActive
                        ? 'bg-[#8050FF]/20 text-[#A17AFF] border border-[#8050FF]/40 font-semibold shadow-sm'
                        : 'text-[#A6B3CD] hover:text-white hover:bg-[#111B30] border border-transparent'
                    } ${isSidebarCollapsed ? 'justify-center' : 'justify-start'}`}
                    title={isSidebarCollapsed ? item.label : undefined}
                  >
                    <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-[#42DDF5]' : 'text-[#A6B3CD]'}`} />
                    {!isSidebarCollapsed && (
                      <span className="truncate text-[11px]">{item.label}</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Footer controls: Settings, Reset Demo, Sign out */}
      <div className="p-3 border-t border-[#24324D] bg-[#0A1020]/80 space-y-1">
        <button
          onClick={() => setActivePage('settings')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-colors btn-smooth ${
            activePage === 'settings'
              ? 'bg-[#8050FF]/20 text-[#A17AFF] border border-[#8050FF]/30 font-semibold'
              : 'text-[#A6B3CD] hover:text-white hover:bg-[#111B30]'
          } ${isSidebarCollapsed ? 'justify-center' : 'justify-start'}`}
          title={isSidebarCollapsed ? 'Settings' : undefined}
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          {!isSidebarCollapsed && <span>Settings</span>}
        </button>

        {isDemoMode && (
          <button
            onClick={resetDemoData}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-[#FFBD69] hover:text-white hover:bg-[#FFBD69]/10 transition-colors btn-smooth ${
              isSidebarCollapsed ? 'justify-center' : 'justify-start'
            }`}
            title={isSidebarCollapsed ? 'Reset Demo Data' : undefined}
          >
            <RotateCcw className="w-4 h-4 flex-shrink-0 text-[#FFBD69]" />
            {!isSidebarCollapsed && <span className="font-mono text-[11px]">Reset Demo State</span>}
          </button>
        )}

        <button
          onClick={logout}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-[#A6B3CD] hover:text-[#FF5878] hover:bg-[#FF5878]/10 transition-colors btn-smooth ${
            isSidebarCollapsed ? 'justify-center' : 'justify-start'
          }`}
          title={isSidebarCollapsed ? 'Sign out' : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!isSidebarCollapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
};
