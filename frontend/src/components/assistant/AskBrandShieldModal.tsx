import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useBrandGuard } from '../../context/BrandGuardContext';
import { Finding } from '../../types';
import { 
  Bot, 
  Send, 
  Search, 
  Sparkles, 
  X, 
  ShieldAlert, 
  Share2, 
  Smartphone, 
  ExternalLink, 
  ArrowRight,
  TrendingUp,
  BarChart3,
  HelpCircle,
  Clock
} from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';

interface QueryResult {
  shortAnswer: string;
  filteredFindings: Finding[];
  metricsSummary?: { label: string; value: string | number }[];
  filterTab?: 'all' | 'social' | 'app';
  filterSeverity?: string;
  isFallback?: boolean;
}

interface AskBrandShieldModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AskBrandShieldModal: React.FC<AskBrandShieldModalProps> = ({ isOpen, onClose }) => {
  const { 
    findings, 
    setSelectedFinding, 
    navigateToFindings, 
    brandProfile, 
    company,
    linkChecks 
  } = useBrandGuard();

  const [query, setQuery] = useState('');
  const [lastQuery, setLastQuery] = useState('');
  const [result, setResult] = useState<QueryResult | null>(null);

  if (!isOpen) return null;

  const quickQueries = [
    'Critical fake apps this week',
    'Show high-risk social profiles',
    'Which findings need review?',
    'Show dismissed findings',
    'Show suspicious links',
    'Which platform has the most findings?',
    'Show connected campaigns',
    'What changed today?',
  ];

  const handleExecuteQuery = (textToRun: string) => {
    const q = textToRun.trim().toLowerCase();
    setLastQuery(textToRun);

    // 1. Critical fake apps this week
    if (q.includes('critical') && q.includes('app')) {
      const matches = findings.filter(f => f.type === 'app' && (f.riskSeverity === 'critical' || f.riskScore >= 80));
      setResult({
        shortAnswer: `Detected ${matches.length} critical mobile apps attempting to impersonate official brand packages. Immediate review and storefront escalation recommended.`,
        filteredFindings: matches,
        metricsSummary: [
          { label: 'Critical Apps', value: matches.length },
          { label: 'Highest Risk Score', value: `${Math.max(...matches.map(m => m.riskScore), 0)}/100` },
          { label: 'Threat Vector', value: 'SMS / Overlay Droppers' },
        ],
        filterTab: 'app',
        filterSeverity: 'critical',
      });
      return;
    }

    // 2. Show high-risk social profiles
    if ((q.includes('high') || q.includes('risk')) && (q.includes('social') || q.includes('profile'))) {
      const matches = findings.filter(f => f.type === 'social' && (f.riskSeverity === 'critical' || f.riskSeverity === 'high'));
      setResult({
        shortAnswer: `Found ${matches.length} high-risk social media profiles on Instagram, Telegram, and X mimicking brand handles and bio links.`,
        filteredFindings: matches,
        metricsSummary: [
          { label: 'High-Risk Social', value: matches.length },
          { label: 'Platforms Flagged', value: 'Instagram, Telegram, X' },
          { label: 'Average Mimicry Score', value: '84.2%' },
        ],
        filterTab: 'social',
        filterSeverity: 'high',
      });
      return;
    }

    // 3. Which findings need review?
    if (q.includes('review') || q.includes('pending') || q.includes('need review')) {
      const matches = findings.filter(f => f.status === 'New' || f.status === 'Investigating');
      setResult({
        shortAnswer: `There are ${matches.length} active findings currently pending analyst triage and confirmation.`,
        filteredFindings: matches,
        metricsSummary: [
          { label: 'Pending Review', value: matches.length },
          { label: 'New Alerts', value: findings.filter(f => f.status === 'New').length },
          { label: 'Investigating', value: findings.filter(f => f.status === 'Investigating').length },
        ],
        filterTab: 'all',
      });
      return;
    }

    // 4. Show dismissed findings
    if (q.includes('dismissed') || q.includes('ignored')) {
      const matches = findings.filter(f => f.status === 'Dismissed');
      setResult({
        shortAnswer: `${matches.length} findings have been dismissed by analysts as benign fan communities or authorized brand distributors.`,
        filteredFindings: matches,
        metricsSummary: [
          { label: 'Dismissed Total', value: matches.length },
          { label: 'False Positive Ratio', value: '14.3%' },
          { label: 'Telemetry Status', value: 'Suppressed' },
        ],
        filterTab: 'all',
      });
      return;
    }

    // 5. Show suspicious links
    if (q.includes('suspicious link') || q.includes('link') || q.includes('url')) {
      const matches = findings.filter(f => f.candidateWebsite || f.candidateUrl);
      setResult({
        shortAnswer: `Identified ${matches.length} candidate domains and ${linkChecks.length} checked suspicious links mimicking authentic landing pages.`,
        filteredFindings: matches.slice(0, 4),
        metricsSummary: [
          { label: 'Suspicious Domains', value: matches.length },
          { label: 'Checked URLs', value: linkChecks.length },
          { label: 'Primary TLDs', value: '.xyz, .top, .app' },
        ],
        filterTab: 'all',
      });
      return;
    }

    // 6. Which platform has the most findings?
    if (q.includes('platform') || q.includes('most finding') || q.includes('where')) {
      const platformCounts: Record<string, number> = {};
      findings.forEach(f => {
        platformCounts[f.platform] = (platformCounts[f.platform] || 0) + 1;
      });
      const topPlatform = Object.entries(platformCounts).sort((a, b) => b[1] - a[1])[0] || ['Instagram', 0];
      const matches = findings.filter(f => f.platform === topPlatform[0]);

      setResult({
        shortAnswer: `${topPlatform[0]} currently accounts for the highest volume of impersonations with ${topPlatform[1]} detected threats.`,
        filteredFindings: matches,
        metricsSummary: [
          { label: 'Top Threat Source', value: topPlatform[0] },
          { label: 'Volume', value: `${topPlatform[1]} threats` },
          { label: 'Second Highest', value: 'Google Play / Telegram' },
        ],
        filterTab: 'all',
      });
      return;
    }

    // 7. Show connected campaigns
    if (q.includes('campaign') || q.includes('connected') || q.includes('syndicate') || q.includes('cluster')) {
      const matches = findings.filter(f => f.connectedCampaign);
      setResult({
        shortAnswer: `Correlated ${matches.length} findings linked to coordinated multi-channel impersonation campaigns sharing backend hosting infrastructure.`,
        filteredFindings: matches,
        metricsSummary: [
          { label: 'Campaign Clusters', value: 2 },
          { label: 'Linked Findings', value: matches.length },
          { label: 'Threat Syndicates', value: 'ApexPhish, ShadowMirror' },
        ],
        filterTab: 'all',
      });
      return;
    }

    // 8. What changed today?
    if (q.includes('today') || q.includes('change') || q.includes('recent') || q.includes('new')) {
      const matches = findings.filter(f => f.detectedTime.toLowerCase().includes('today') || f.detectedTime.toLowerCase().includes('hour') || f.status === 'New');
      setResult({
        shortAnswer: `Today 2 new candidate profiles were ingested, 1 critical APK dropper was flagged, and 3 findings were triaged by SecOps.`,
        filteredFindings: matches.slice(0, 4),
        metricsSummary: [
          { label: 'New Today', value: '3' },
          { label: 'Triaged Decisions', value: '2' },
          { label: 'Status Updates', value: '4' },
        ],
        filterTab: 'all',
      });
      return;
    }

    // Fallback response required by prompt:
    setResult({
      shortAnswer: 'I could not understand that request. Try asking about risk, source, status, or time.',
      filteredFindings: [],
      isFallback: true,
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      handleExecuteQuery(query);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#070A14]/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-2xl bg-[#0D1425] border border-[#24324D] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden text-slate-100 font-sans">
        {/* Header */}
        <div className="p-4 px-6 border-b border-[#24324D] bg-[#070A14]/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-600/20 text-[#A17AFF] border border-violet-500/40">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Ask AEGIS Intelligence Assistant
                </h3>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#8050FF]/20 text-[#A17AFF] border border-[#8050FF]/30">
                  NLP Telemetry
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Analytical assistant for querying brand threat vectors, sources, and investigation status.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#17223B] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Query Input Bar */}
        <form onSubmit={handleFormSubmit} className="p-4 border-b border-[#24324D] bg-[#0A1020] flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask: 'Critical fake apps this week', 'Which findings need review?'..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#070A14] border border-[#24324D] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#8050FF]"
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm flex-shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ask</span>
          </button>
        </form>

        {/* Quick Query Preset Chips */}
        <div className="px-6 py-2.5 bg-[#070A14]/70 border-b border-[#24324D]/80 overflow-x-auto flex items-center gap-1.5 text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-500 whitespace-nowrap mr-1">
            Suggested:
          </span>
          {quickQueries.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setQuery(preset);
                handleExecuteQuery(preset);
              }}
              className="px-2.5 py-1 rounded-lg bg-[#0D1425] hover:bg-[#17223B] border border-[#24324D] text-[11px] text-slate-300 font-medium transition-colors whitespace-nowrap"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Body Content / Results Stage */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {result ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Short Answer Card */}
              <div className={`p-4 rounded-xl border space-y-1.5 ${
                result.isFallback
                  ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                  : 'bg-violet-950/20 border-[#8050FF]/40 text-slate-100'
              }`}>
                <div className="flex items-center gap-2">
                  <Sparkles className={`w-4 h-4 ${result.isFallback ? 'text-amber-400' : 'text-[#42DDF5]'}`} />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    AEGIS Analysis:
                  </span>
                </div>
                <p className="text-xs leading-relaxed font-sans">
                  {result.shortAnswer}
                </p>
              </div>

              {/* Metrics Summary Strip */}
              {result.metricsSummary && (
                <div className="grid grid-cols-3 gap-3">
                  {result.metricsSummary.map((m, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#070A14] border border-[#24324D] text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        {m.label}
                      </span>
                      <div className="text-base font-extrabold text-[#42DDF5] mt-0.5">
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Filtered Findings List */}
              {result.filteredFindings && result.filteredFindings.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300">
                      Matching Findings ({result.filteredFindings.length})
                    </span>
                    <button
                      onClick={() => {
                        navigateToFindings(result.filterTab, result.filterSeverity);
                        onClose();
                      }}
                      className="text-[#42DDF5] hover:text-cyan-300 text-xs font-semibold flex items-center gap-1"
                    >
                      <span>View findings in table</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {result.filteredFindings.map((f) => (
                      <div
                        key={f.id}
                        onClick={() => {
                          setSelectedFinding(f);
                          onClose();
                        }}
                        className="p-3 rounded-xl bg-[#070A14] hover:bg-[#17223B] border border-[#24324D] cursor-pointer flex items-center justify-between gap-3 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <RiskBadge severity={f.riskSeverity} size="sm" />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white truncate">
                              {f.title}
                            </h4>
                            <p className="text-[10px] text-slate-400 truncate">
                              {f.platform} &bull; {f.mainReason}
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#17223B] text-slate-300 flex-shrink-0">
                          {f.riskScore}/100
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center space-y-3 text-slate-400">
              <Bot className="w-12 h-12 mx-auto text-slate-600 animate-pulse" />
              <div>
                <p className="text-sm font-semibold text-white">Ask anything about your brand threat posture</p>
                <p className="text-xs text-slate-500 mt-1">
                  Click a suggested query above or type a natural question about risk, source, status, or time.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 px-6 bg-[#070A14] border-t border-[#24324D] flex items-center justify-between text-[11px] text-slate-400">
          <span>AEGIS Threat Engine &bull; Local Rule-Based Telemetry</span>
          {result && !result.isFallback && (
            <button
              onClick={() => {
                navigateToFindings(result.filterTab, result.filterSeverity);
                onClose();
              }}
              className="px-3 py-1 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold transition-colors flex items-center gap-1"
            >
              <span>View Findings</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
