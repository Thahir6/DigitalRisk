import React, { useEffect } from 'react';
import { useBrandGuard } from '../../context/BrandGuardContext';
import { Finding, FindingStatus } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { SignalCard } from './SignalCard';
import { LookalikeVisualizer } from './LookalikeVisualizer';
import { ConnectedThreatsPanel } from './ConnectedThreatsPanel';
import { ActivityTimeline } from './ActivityTimeline';
import { LogoForensicsPanel } from './LogoForensicsPanel';
import { UnicodeXRayInspector } from './UnicodeXRayInspector';
import { AppPermissionXRayPanel } from './AppPermissionXRayPanel';
import { CampaignReplayPanel } from './CampaignReplayPanel';
import { PlatformPolicyMatchPanel } from './PlatformPolicyMatchPanel';
import { 
  X, 
  ExternalLink, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  FileCheck2, 
  FileX2, 
  Copy, 
  Clock, 
  Database,
  Camera,
  Share2,
  Smartphone,
  ChevronDown
} from 'lucide-react';

interface FindingDetailDrawerProps {
  finding: Finding | null;
  onClose: () => void;
}

export const FindingDetailDrawer: React.FC<FindingDetailDrawerProps> = ({ finding, onClose }) => {
  const { 
    updateFindingStatus, 
    confirmImpersonation, 
    dismissFinding, 
    addFindingNote,
    brandProfile,
    showToast
  } = useBrandGuard();

  const [decisionModal, setDecisionModal] = React.useState<{
    isOpen: boolean;
    action: 'Confirmed fake' | 'Dismissed';
    reason: string;
  }>({
    isOpen: false,
    action: 'Confirmed fake',
    reason: 'Verified exact visual trademark and logo spoofing',
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && finding) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [finding, onClose]);

  if (!finding) return null;

  // Retrieve official counterpart for side-by-side comparison
  const officialAsset = finding.type === 'app'
    ? brandProfile?.officialApps?.[0] || {
        name: `${brandProfile?.brandName || 'Official'} Mobile`,
        packageId: `com.${(brandProfile?.brandName || 'brand').toLowerCase().replace(/[^a-z0-9]/g, '')}.mobile`,
        publisher: `${brandProfile?.brandName || 'Official Brand'} Technologies`,
        storeUrl: 'https://play.google.com/store/apps',
      }
    : (brandProfile?.officialSocials || []).find((s) => s.platform.toLowerCase().includes(finding.platform.toLowerCase())) || brandProfile?.officialSocials?.[0];

  const handleCopyUrl = () => {
    navigator.clipboard?.writeText(finding.candidateUrl);
    showToast('Candidate URL copied to clipboard', 'info');
  };

  const statusOptions: FindingStatus[] = [
    'New',
    'Investigating',
    'Likely impersonation',
    'Confirmed fake',
    'Dismissed',
    'Resolved',
  ];

  const handleOpenConfirm = () => {
    setDecisionModal({
      isOpen: true,
      action: 'Confirmed fake',
      reason: 'Verified exact visual trademark and logo spoofing',
    });
  };

  const handleOpenDismiss = () => {
    setDecisionModal({
      isOpen: true,
      action: 'Dismissed',
      reason: 'Verified legitimate community / authorized distributor activity',
    });
  };

  const handleApplyDecision = () => {
    updateFindingStatus(finding.id, decisionModal.action, decisionModal.reason);
    setDecisionModal({ ...decisionModal, isOpen: false });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-navy-950/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-3xl bg-navy-900/95 border-l border-cyan-500/30 shadow-[0_0_60px_rgba(0,0,0,0.85)] flex flex-col text-slate-100 overflow-hidden animate-in slide-in-from-right duration-300 backdrop-blur-xl">
          
          {/* Header Bar */}
          <div className="p-6 border-b border-cyan-500/20 bg-gradient-to-b from-navy-950/95 to-navy-900/90 backdrop-blur-md flex items-start justify-between gap-4 sticky top-0 z-20">
            <div className="flex-1 min-w-0 space-y-2.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <RiskBadge severity={finding.riskSeverity} size="lg" />
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-navy-800/80 text-slate-200 border border-slate-700/80 shadow-sm">
                  {finding.type === 'social' ? (
                    <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                  ) : (
                    <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span>{finding.type === 'social' ? 'Social Profile' : 'Mobile App'}</span>
                </span>
                <span className="text-[11px] text-cyan-400/80 font-mono tracking-wider bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">
                  [{finding.platform.toUpperCase()}] &bull; ID: {finding.id}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight break-words drop-shadow-sm">
                {finding.title}
              </h2>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-mono text-cyan-400 bg-navy-950/80 px-2.5 py-1 rounded-lg border border-slate-800 truncate max-w-md shadow-inner">
                  {finding.candidateUrl}
                </span>
                <button
                  onClick={handleCopyUrl}
                  className="btn-smooth p-1.5 rounded-lg bg-navy-800/80 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-500/40 transition-colors shadow-sm"
                  title="Copy candidate URL"
                  aria-label="Copy candidate URL"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Close X Button */}
            <button
              onClick={onClose}
              className="btn-smooth p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700 transition-colors flex-shrink-0"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Actions Bar */}
          <div className="px-6 py-3.5 bg-navy-850/90 border-b border-slate-800/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 sticky top-[105px] z-10">
            {/* Status Dropdown */}
            <div className="flex items-center gap-2.5">
              <span className="text-xs text-slate-400 font-semibold tracking-wide uppercase">Status:</span>
              <div className="relative">
                <select
                  value={finding.status}
                  onChange={(e) => updateFindingStatus(finding.id, e.target.value as FindingStatus)}
                  className="appearance-none bg-navy-950 border border-cyan-500/30 rounded-xl pl-3.5 pr-8 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/30 cursor-pointer shadow-inner"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-cyan-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleOpenConfirm}
                disabled={finding.status === 'Confirmed fake'}
                className="btn-smooth inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30 hover:border-red-500/60 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-red-950/30"
              >
                <FileCheck2 className="w-3.5 h-3.5 text-red-400" />
                <span>Confirm impersonation</span>
              </button>

              <button
                onClick={handleOpenDismiss}
                disabled={finding.status === 'Dismissed'}
                className="btn-smooth inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800/80 text-slate-300 border border-slate-700/80 hover:bg-slate-700/80 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <FileX2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Dismiss finding</span>
              </button>
            </div>
          </div>

          {/* Drawer Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* 1. Risk and Confidence Assessment Card */}
            <section className="unlumen-card p-5 space-y-4 bg-navy-850/70 border border-slate-800 hover:border-cyan-500/30 transition-all shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">
                      [HEURISTIC_MATRIX]
                    </span>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Risk Assessment & Confidence
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Multi-factor automated heuristic telemetry score
                  </p>
                </div>
                <ConfidenceBadge confidence={finding.confidence} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div className="p-4 rounded-xl bg-navy-950/90 border border-cyan-500/20 text-center shadow-inner">
                  <div className="text-3xl font-black text-white tracking-tight">
                    {finding.riskScore}
                    <span className="text-sm font-normal text-slate-400">/100</span>
                  </div>
                  <span className="text-[11px] text-cyan-400 font-mono uppercase tracking-wider font-semibold">
                    Risk Score
                  </span>
                </div>

                <div className="sm:col-span-2 space-y-2.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Severity Metric</span>
                    <span className="font-bold text-white capitalize">{finding.riskSeverity} Risk ({finding.riskScore}%)</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-800">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        finding.riskScore >= 85 ? 'bg-gradient-to-r from-orange-500 to-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : finding.riskScore >= 70 ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-cyan-500 to-amber-500'
                      }`}
                      style={{ width: `${finding.riskScore}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed italic">
                    &ldquo;This score supports review. It is not proof that the profile is fake.&rdquo;
                  </p>
                </div>
              </div>
            </section>

            {/* 2. Side-by-Side Comparison Panel */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">
                  [BENCHMARK_COMPARE]
                </span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Side-by-Side Verification Comparison
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Left: Verified Official Asset */}
                <div className="unlumen-card p-5 bg-gradient-to-b from-emerald-950/20 to-navy-900/80 border border-emerald-500/40 relative space-y-3.5 shadow-lg shadow-emerald-950/20">
                  <div className="flex items-center justify-between pb-2.5 border-b border-emerald-500/20">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verified official asset</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      Authoritative
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-black flex items-center justify-center text-sm shadow-inner">
                      AP
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {officialAsset && 'name' in officialAsset ? officialAsset.name : brandProfile?.brandName || 'AcmePay'}
                      </h4>
                      <p className="text-xs text-emerald-400/90 font-mono">
                        {officialAsset && 'handle' in officialAsset ? officialAsset.handle : officialAsset && 'packageId' in officialAsset ? officialAsset.packageId : brandProfile?.website || 'acmepay.com'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs pt-2 border-t border-slate-800/80">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Official Website / Domain</span>
                      <span className="text-emerald-300 font-mono font-medium">{brandProfile?.website || 'acmepay.com'}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Registered Owner / Publisher</span>
                      <span className="text-slate-200 font-medium">AcmePay Technologies Inc. (Verified)</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Official Asset Description</span>
                      <p className="text-slate-300 leading-relaxed text-xs">
                        Official verified product and entity for AcmePay commercial operations.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: Profile or app being checked */}
                <div className="unlumen-card p-5 bg-gradient-to-b from-red-950/25 to-navy-900/80 border border-red-500/40 relative space-y-3.5 shadow-lg shadow-red-950/20">
                  <div className="flex items-center justify-between pb-2.5 border-b border-red-500/20">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-red-400">
                      <AlertTriangle className="w-4 h-4 animate-pulse" />
                      <span>Profile or app being checked</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/15 text-red-300 border border-red-500/30">
                      Unverified
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${finding.avatarColor} text-white font-bold flex items-center justify-center text-sm shadow-md`}>
                      {finding.avatarInitials}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">
                        {finding.title}
                      </h4>
                      <p className="text-xs text-red-400 font-mono truncate">
                        {finding.usernameOrPackage}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs pt-2 border-t border-slate-800/80">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Candidate Website / Link</span>
                      <span className="text-red-300 font-mono font-medium">{finding.candidateWebsite}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Detected Owner / Publisher</span>
                      <span className="text-slate-200 font-medium">{finding.publisherOrOwner}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Candidate Description</span>
                      <p className="text-slate-300 leading-relaxed text-xs">
                        {finding.description}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* Feature 2: Logo Forensics Heatmap */}
            <LogoForensicsPanel
              finding={finding}
              officialLogoText={brandProfile?.logoText || 'AP'}
              officialBrandName={brandProfile?.brandName || 'AcmePay'}
            />

            {/* 3. Look-alike character/word visual explanation & Feature 3: Unicode X-ray */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">
                  [HOMOGLYPH_ANOMALY]
                </span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Look-alike Anomaly Breakdown
                </h3>
              </div>
              <LookalikeVisualizer lookalike={finding.lookalike} />
              
              {/* Feature 3: Unicode X-ray Inspection */}
              <div className="pt-2">
                <UnicodeXRayInspector
                  candidateString={finding.lookalike?.candidate || finding.usernameOrPackage || finding.title}
                  onAddEvidence={() => {
                    addFindingNote(finding.id, `Attached Unicode X-Ray codepoint telemetry for "${finding.lookalike?.candidate || finding.usernameOrPackage}".`);
                    showToast('Unicode telemetry attached to finding evidence', 'success');
                  }}
                  showCardHeader={true}
                />
              </div>
            </section>

            {/* Feature 7: App Permission X-Ray (for mobile app findings) */}
            {finding.type === 'app' && (
              <AppPermissionXRayPanel finding={finding} />
            )}

            {/* 4. Why This Was Flagged: Clear Signal Cards */}
            <section className="space-y-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">
                    [DETECTION_SIGNALS]
                  </span>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Why this was flagged
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Clear signals detected by cross-referencing against verified official brand assets.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {finding.signals.map((sig) => (
                  <SignalCard key={sig.id} signal={sig} />
                ))}
              </div>
            </section>

            {/* Feature 8: Campaign Replay */}
            <CampaignReplayPanel finding={finding} />

            {/* 5. Connected Threats Panel */}
            <section className="space-y-2">
              <ConnectedThreatsPanel campaign={finding.connectedCampaign} />
            </section>

            {/* Feature 9: Platform Policy Match */}
            <PlatformPolicyMatchPanel finding={finding} />

            {/* 6. Supporting Evidence */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">
                    [EVIDENCE_VAULT]
                  </span>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Supporting evidence ({finding.evidence.evidenceCount} artifacts)
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Cryptographically Validated
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                {/* Simulated screenshot thumbnail card */}
                <div className="unlumen-card p-4 bg-navy-850/80 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-cyan-400" />
                      Visual Snapshot
                    </span>
                    <span className="text-[10px] text-cyan-400/80 font-mono bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">SHA-256 Verified</span>
                  </div>
                  <div className="h-28 rounded-xl bg-navy-950 border border-slate-800/80 flex flex-col items-center justify-center p-3 text-center shadow-inner">
                    <Camera className="w-6 h-6 text-slate-500 mb-1" />
                    <span className="text-[11px] text-slate-300 font-mono leading-tight">
                      {finding.evidence.screenshotLabel}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate bg-navy-950/60 p-1.5 rounded border border-slate-800/60">
                    Hash: {finding.evidence.sha256Hash.slice(0, 24)}...
                  </div>
                </div>

                {/* Technical details card */}
                <div className="unlumen-card p-4 bg-navy-850/80 border border-slate-800 space-y-2.5">
                  <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-cyan-400" />
                    Technical details
                  </div>
                  <div className="space-y-2 text-slate-300 text-[11px]">
                    <div className="flex justify-between py-0.5 border-b border-slate-800/60">
                      <span className="text-slate-400">Source:</span>
                      <span className="font-bold text-white">{finding.evidence.source}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-800/60">
                      <span className="text-slate-400">Detected:</span>
                      <span className="font-mono text-slate-200">{finding.evidence.detectedAt}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-800/60">
                      <span className="text-slate-400">First Seen:</span>
                      <span className="font-mono text-slate-200">{finding.evidence.firstSeen}</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-400">Last Seen:</span>
                      <span className="font-mono text-slate-200">{finding.evidence.lastSeen}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 7. Analyst Notes & Activity Timeline */}
            <section className="space-y-3 pt-4 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">
                  [AUDIT_TRAIL]
                </span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Analyst Notes & Activity Timeline
                </h3>
              </div>
              <ActivityTimeline 
                timeline={finding.timeline} 
                onAddNote={(note) => addFindingNote(finding.id, note)}
              />
            </section>

          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-cyan-500/20 bg-navy-950/90 backdrop-blur-md flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-slate-500">DOSSIER_ID: {finding.id}</span>
            <button
              onClick={onClose}
              className="btn-smooth px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors border border-slate-700 shadow-sm"
            >
              Close Details
            </button>
          </div>

        </div>
      </div>

      {/* Feature 6: Analyst Feedback Decision Modal */}
      {decisionModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="unlumen-card border-beam w-full max-w-md rounded-2xl bg-navy-900/95 border border-cyan-500/40 shadow-2xl p-6 space-y-4 text-slate-100 text-xs backdrop-blur-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                {decisionModal.action === 'Confirmed fake' ? (
                  <>
                    <FileCheck2 className="w-4 h-4 text-red-400" />
                    <span>Confirm Brand Impersonation</span>
                  </>
                ) : (
                  <>
                    <FileX2 className="w-4 h-4 text-slate-400" />
                    <span>Dismiss Finding from Threat Scope</span>
                  </>
                )}
              </h3>
              <button
                onClick={() => setDecisionModal({ ...decisionModal, isOpen: false })}
                className="btn-smooth p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Decision Meta */}
            <div className="p-3.5 rounded-xl bg-navy-950 border border-slate-800 space-y-2 text-[11px] shadow-inner">
              <div className="flex justify-between">
                <span className="text-slate-400">Reviewer:</span>
                <span className="font-semibold text-white">Alex Mercer (SecOps Lead)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Target Entity:</span>
                <span className="font-mono text-cyan-300">{finding.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Action:</span>
                <span className={`font-bold ${decisionModal.action === 'Confirmed fake' ? 'text-red-400' : 'text-slate-300'}`}>
                  {decisionModal.action}
                </span>
              </div>
            </div>

            {/* Select Reason */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 block">
                Verification / Dismissal Reason:
              </label>
              <select
                value={decisionModal.reason}
                onChange={(e) => setDecisionModal({ ...decisionModal, reason: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-navy-950 border border-cyan-500/30 text-xs text-white focus:outline-none focus:border-cyan-400 shadow-inner cursor-pointer"
              >
                {decisionModal.action === 'Confirmed fake' ? (
                  <>
                    <option value="Verified exact visual trademark and logo spoofing">
                      Verified exact visual trademark and logo spoofing
                    </option>
                    <option value="Credential phishing form active in bio redirect link">
                      Credential phishing form active in bio redirect link
                    </option>
                    <option value="Unsigned malware dropper payload targeting mobile users">
                      Unsigned malware dropper payload targeting mobile users
                    </option>
                    <option value="Unauthorized commercial brand impersonation without license">
                      Unauthorized commercial brand impersonation without license
                    </option>
                  </>
                ) : (
                  <>
                    <option value="Verified legitimate community / fan account (no commercial intent)">
                      Verified legitimate community / fan account (no commercial intent)
                    </option>
                    <option value="Authorized regional commercial distributor / partner">
                      Authorized regional commercial distributor / partner
                    </option>
                    <option value="Inactive parked domain / no deceptive content found">
                      Inactive parked domain / no deceptive content found
                    </option>
                    <option value="False positive homoglyph match / coincidental string name">
                      False positive homoglyph match / coincidental string name
                    </option>
                  </>
                )}
              </select>
            </div>

            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-[10px] text-cyan-300">
              * Analyst feedback decision will be logged to activity timeline and update the heuristic tuning metrics.
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setDecisionModal({ ...decisionModal, isOpen: false })}
                className="btn-smooth px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyDecision}
                className={`btn-smooth px-4.5 py-2 rounded-xl text-white font-bold shadow-md ${
                  decisionModal.action === 'Confirmed fake'
                    ? 'bg-red-600 hover:bg-red-500 shadow-red-950/40'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                Log Decision
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
