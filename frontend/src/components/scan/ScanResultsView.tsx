import React, { useState, useMemo } from 'react';
import { useBrandGuard } from '../../context/BrandGuardContext';
import { Finding, ScanStageId } from '../../types';
import { DonutChart } from '../charts/DonutChart';
import { SourceBarChart } from '../charts/SourceBarChart';
import { TrendLineChart } from '../charts/TrendLineChart';
import { OfficialAssetsChart } from '../charts/OfficialAssetsChart';
import { 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  ShieldAlert, 
  AlertOctagon, 
  AlertTriangle, 
  Info, 
  ArrowRight,
  Radar,
  Share2,
  Smartphone,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Check
} from 'lucide-react';

export const ScanResultsView: React.FC = () => {
  const { 
    findings, 
    linkChecks,
    openReportModal, 
    updateFindingStatus, 
    runNewScan,
    isScanning,
    setActivePage,
    navigateToFindings,
    selectedScanStage,
    setSelectedScanStage,
    stageProfileIndex,
    setStageProfileIndex,
    showToast
  } = useBrandGuard();

  // Skipped IDs for the current session (skipped items preserved for later review)
  const [skippedIds, setSkippedIds] = useState<Set<string>>(new Set());

  // Stages configuration
  const stages: Array<{
    id: ScanStageId;
    stepNumber: number;
    title: string;
    subtitle: string;
    color: string;
    badgeBg: string;
    badgeText: string;
    borderColor: string;
  }> = [
    {
      id: 'critical',
      stepNumber: 1,
      title: 'Critical risks',
      subtitle: 'Profiles with immediate credential theft or malicious APK signals.',
      color: '#FF5878',
      badgeBg: 'bg-[#FF5878]/15',
      badgeText: 'text-[#FF5878]',
      borderColor: 'border-[#FF5878]/30',
    },
    {
      id: 'high',
      stepNumber: 2,
      title: 'High risks',
      subtitle: 'Look-alike accounts mimicking support channels with external links.',
      color: '#f97316',
      badgeBg: 'bg-orange-500/15',
      badgeText: 'text-orange-400',
      borderColor: 'border-orange-500/30',
    },
    {
      id: 'medium',
      stepNumber: 3,
      title: 'Medium risks',
      subtitle: 'Typosquatting variations and unauthorized brand name usage.',
      color: '#FFBD69',
      badgeBg: 'bg-[#FFBD69]/15',
      badgeText: 'text-[#FFBD69]',
      borderColor: 'border-[#FFBD69]/30',
    },
    {
      id: 'low',
      stepNumber: 4,
      title: 'Low risks',
      subtitle: 'Generic bots, community groups, and redirect test links.',
      color: '#94a3b8',
      badgeBg: 'bg-slate-500/15',
      badgeText: 'text-slate-400',
      borderColor: 'border-slate-500/30',
    },
  ];

  // Group findings by severity
  const findingsByStage = useMemo(() => {
    return {
      critical: findings.filter((f) => f.riskSeverity === 'critical'),
      high: findings.filter((f) => f.riskSeverity === 'high'),
      medium: findings.filter((f) => f.riskSeverity === 'medium'),
      low: findings.filter((f) => f.riskSeverity === 'low'),
    };
  }, [findings]);

  // Current stage findings
  const currentStageFindings = findingsByStage[selectedScanStage] || [];
  const currentFinding: Finding | undefined = currentStageFindings[stageProfileIndex] || currentStageFindings[0];

  // Counts
  const totalFindings = findings.length;
  const criticalCount = findingsByStage.critical.length;
  const highCount = findingsByStage.high.length;
  const mediumCount = findingsByStage.medium.length;
  const lowCount = findingsByStage.low.length;

  const socialCount = findings.filter((f) => f.type === 'social').length;
  const appCount = findings.filter((f) => f.type === 'app').length;
  const linkCount = linkChecks.filter((l) => l.verdict !== 'Approved').length || 3;

  // Donut chart data
  const severityDonutSegments = useMemo(() => {
    const total = totalFindings || 1;
    return [
      { label: 'Critical Risk', count: criticalCount, pct: Math.round((criticalCount / total) * 100), color: '#FF5878' },
      { label: 'High Risk', count: highCount, pct: Math.round((highCount / total) * 100), color: '#f97316' },
      { label: 'Medium Risk', count: mediumCount, pct: Math.round((mediumCount / total) * 100), color: '#FFBD69' },
      { label: 'Low Risk', count: lowCount, pct: Math.round((lowCount / total) * 100), color: '#94a3b8' },
    ];
  }, [totalFindings, criticalCount, highCount, mediumCount, lowCount]);

  // Stage navigation
  const handleNextProfile = () => {
    if (stageProfileIndex < currentStageFindings.length - 1) {
      setStageProfileIndex(stageProfileIndex + 1);
    } else {
      // Reached end of current stage -> suggest next stage
      const currentIndex = stages.findIndex((s) => s.id === selectedScanStage);
      if (currentIndex < stages.length - 1) {
        const nextStage = stages[currentIndex + 1].id;
        setSelectedScanStage(nextStage);
        setStageProfileIndex(0);
        showToast(`Moving to Stage ${currentIndex + 2}: ${stages[currentIndex + 1].title}`, 'info');
      }
    }
  };

  const handlePrevProfile = () => {
    if (stageProfileIndex > 0) {
      setStageProfileIndex(stageProfileIndex - 1);
    }
  };

  const handleConfirmImpersonation = async (finding: Finding) => {
    await updateFindingStatus(finding.id, 'Confirmed fake', 'Confirmed fake via scan-results triage review.');
    showToast(`Marked "${finding.title}" as Confirmed fake`, 'success');
    handleNextProfile();
  };

  const handleSkipFinding = (finding: Finding) => {
    setSkippedIds((prev) => new Set(prev).add(finding.id));
    showToast(`Skipped for now: Preserved in ${selectedScanStage} queue`, 'info');
    handleNextProfile();
  };

  const handleSelectStage = (stageId: ScanStageId) => {
    setSelectedScanStage(stageId);
    setStageProfileIndex(0);
  };

  // Check if all stages are reviewed
  const isAllStagesReviewed = useMemo(() => {
    // If every finding is either Confirmed fake, Resolved, or Dismissed
    const activeLeft = findings.filter((f) => f.status === 'New' || f.status === 'Investigating');
    return activeLeft.length === 0;
  }, [findings]);

  const currentStageConfig = stages.find((s) => s.id === selectedScanStage) || stages[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 text-xs animate-in fade-in duration-200">
      
      {/* SECTION 1: SCAN COMPLETION SUMMARY HEADER */}
      <div className="p-6 rounded-2xl bg-[#0D1425] border border-[#24324D] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#42DDF5] px-3 py-1 rounded-full bg-[#42DDF5]/10 border border-[#42DDF5]/30">
              <CheckCircle2 className="w-4 h-4 text-[#42DDF5]" />
              <span>Scan complete</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Target: AcmePay Brand Profile
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            We found possible risks across your digital brand.
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Review findings below in prioritized risk stages. Use the charts to inspect total telemetry, or review critical profiles one at a time.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => runNewScan('all')}
            disabled={isScanning}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#111B30] hover:bg-[#17223B] text-slate-200 border border-[#24324D] transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Run new scan</span>
          </button>

          <button
            onClick={() => navigateToFindings('all')}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-950/40 transition-all flex items-center gap-2"
          >
            <span>View all in Findings</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* SECTION 2: VISUAL SUMMARY DASHBOARD */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Visual Summary Dashboard
          </h3>
          <span className="text-[11px] text-slate-400">
            Click any chart segment or card to jump into that review stage
          </span>
        </div>

        {/* 5 Summary Cards with Large Display Number for Total */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          
          {/* Card 1: Total Findings */}
          <div 
            onClick={() => navigateToFindings('all')}
            className="p-4 rounded-xl bg-[#0D1425] border border-[#24324D] hover:border-[#8050FF]/60 transition-all cursor-pointer flex flex-col justify-between group shadow-sm"
          >
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="font-semibold text-[#A17AFF]">Total Findings</span>
              <span className="w-2 h-2 rounded-full bg-[#8050FF] animate-pulse" />
            </div>
            
            <div className="my-1">
              <span className="text-3xl font-black text-white group-hover:text-[#A17AFF] transition-colors tracking-tight font-display">
                {totalFindings}
              </span>
              <span className="text-[11px] text-slate-400 ml-1.5 font-medium">total findings</span>
            </div>

            <span className="text-[10px] text-[#A17AFF] font-semibold pt-1 border-t border-[#24324D] flex items-center gap-1">
              <span>View full audit repository</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>

          {/* Card 2: Critical findings */}
          <div 
            onClick={() => handleSelectStage('critical')}
            className={`p-4 rounded-xl bg-[#0D1425] border transition-all cursor-pointer flex flex-col justify-between group ${
              selectedScanStage === 'critical' ? 'border-[#FF5878] shadow-md shadow-[#FF5878]/15 ring-1 ring-[#FF5878]/30' : 'border-[#24324D] hover:border-[#FF5878]/50'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400 font-semibold">Critical findings</span>
              <span className="w-2 h-2 rounded-full bg-[#FF5878]" />
            </div>
            <div className="my-1">
              <span className="text-2xl font-black text-[#FF5878] font-mono">
                {criticalCount}
              </span>
              <span className="text-[11px] text-slate-400 ml-1.5">urgent</span>
            </div>
            <span className="text-[10px] text-[#FF5878] font-semibold pt-1 border-t border-[#24324D]">
              Immediate action needed
            </span>
          </div>

          {/* Card 3: High-risk findings */}
          <div 
            onClick={() => handleSelectStage('high')}
            className={`p-4 rounded-xl bg-[#0D1425] border transition-all cursor-pointer flex flex-col justify-between group ${
              selectedScanStage === 'high' ? 'border-orange-500 shadow-md shadow-orange-950/30 ring-1 ring-orange-500/30' : 'border-[#24324D] hover:border-orange-500/50'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400 font-semibold">High-risk findings</span>
              <span className="w-2 h-2 rounded-full bg-orange-500" />
            </div>
            <div className="my-1">
              <span className="text-2xl font-black text-orange-400 font-mono">
                {highCount}
              </span>
              <span className="text-[11px] text-slate-400 ml-1.5">profiles</span>
            </div>
            <span className="text-[10px] text-orange-400 font-semibold pt-1 border-t border-[#24324D]">
              Review support spoofs
            </span>
          </div>

          {/* Card 4: Medium-risk findings */}
          <div 
            onClick={() => handleSelectStage('medium')}
            className={`p-4 rounded-xl bg-[#0D1425] border transition-all cursor-pointer flex flex-col justify-between group ${
              selectedScanStage === 'medium' ? 'border-[#FFBD69] shadow-md shadow-[#FFBD69]/15 ring-1 ring-[#FFBD69]/30' : 'border-[#24324D] hover:border-[#FFBD69]/50'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400 font-semibold">Medium-risk findings</span>
              <span className="w-2 h-2 rounded-full bg-[#FFBD69]" />
            </div>
            <div className="my-1">
              <span className="text-2xl font-black text-[#FFBD69] font-mono">
                {mediumCount}
              </span>
              <span className="text-[11px] text-slate-400 ml-1.5">lookalikes</span>
            </div>
            <span className="text-[10px] text-[#FFBD69] font-semibold pt-1 border-t border-[#24324D]">
              Typosquatting variations
            </span>
          </div>

          {/* Card 5: Low-risk findings */}
          <div 
            onClick={() => handleSelectStage('low')}
            className={`p-4 rounded-xl bg-[#0D1425] border transition-all cursor-pointer flex flex-col justify-between group ${
              selectedScanStage === 'low' ? 'border-slate-400 shadow-md shadow-slate-950/30' : 'border-[#24324D] hover:border-slate-500'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400 font-semibold">Low-risk findings</span>
              <span className="w-2 h-2 rounded-full bg-slate-400" />
            </div>
            <div className="my-1">
              <span className="text-2xl font-black text-slate-300 font-mono">
                {lowCount}
              </span>
              <span className="text-[11px] text-slate-400 ml-1.5">items</span>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold pt-1 border-t border-[#24324D]">
              Low confidence mentions
            </span>
          </div>
        </div>

        {/* 4 Visual Charts Grid Required by Section 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Chart 1: Donut chart - Findings by risk level with center count */}
          <DonutChart
            title="Findings by risk level"
            total={totalFindings}
            segments={severityDonutSegments}
            textSummary="Distribution of findings by severity. Click any tier to jump directly into that stage."
            onSelectSegment={(seg) => {
              if (seg.label.includes('Critical')) handleSelectStage('critical');
              else if (seg.label.includes('High')) handleSelectStage('high');
              else if (seg.label.includes('Medium')) handleSelectStage('medium');
              else if (seg.label.includes('Low')) handleSelectStage('low');
            }}
          />

          {/* Chart 2: Bar chart - Findings by source */}
          <SourceBarChart
            socialCount={socialCount}
            appCount={appCount}
            linkCount={linkCount}
            onSelectSource={(source) => {
              if (source === 'social') navigateToFindings('social');
              else if (source === 'app') navigateToFindings('app');
              else setActivePage('check-link');
            }}
          />

          {/* Chart 3: Trend chart - Risk activity over time */}
          <TrendLineChart />

          {/* Chart 4: Verification chart - Official assets */}
          <OfficialAssetsChart />
        </div>
      </section>

      {/* SECTION 3 & 4: RISK-PRIORITY STAGES & STAGE REVIEW SECTION */}
      <section className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              <span>Prioritized Stage Review</span>
            </h3>
            <p className="text-xs text-slate-400">
              Review suspicious profiles one at a time. Progress from Critical down to Low risk.
            </p>
          </div>

          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {currentStageConfig.stepNumber} of 4 — {currentStageConfig.title}
          </span>
        </div>

        {/* Stage Selector Tabs (Section 3: Only the selected stage is expanded) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stages.map((st) => {
            const isSelected = selectedScanStage === st.id;
            const count = findingsByStage[st.id].length;

            return (
              <button
                key={st.id}
                type="button"
                onClick={() => handleSelectStage(st.id)}
                className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? `bg-[#0D1425] border-[#8050FF] shadow-lg ring-1 ring-[#8050FF]/30`
                    : 'bg-[#0A1020]/80 border-[#24324D]/80 hover:bg-[#0D1425] hover:border-[#8050FF]/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${st.badgeBg} ${st.badgeText}`}>
                    Stage {st.stepNumber} of 4
                  </span>
                  <span className="font-mono text-xs font-bold text-white">
                    {count} {count === 1 ? 'profile' : 'profiles'}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white mb-0.5">
                    {st.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    {st.subtitle}
                  </p>
                </div>

                {isSelected && (
                  <div 
                    className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                    style={{ backgroundColor: st.color }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* SECTION 4 & 5: STAGE REVIEW CARD (ONE PROFILE AT A TIME) */}
        {currentStageFindings.length === 0 ? (
          
          /* SECTION 10: EMPTY STATE FOR STAGE */
          <div className="p-8 rounded-2xl bg-[#0D1425] border border-[#24324D] text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">
              No {selectedScanStage} risks found.
            </h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Your next highest-priority stage is{' '}
              {selectedScanStage === 'critical'
                ? 'High risk'
                : selectedScanStage === 'high'
                ? 'Medium risk'
                : 'Low risk'}
              .
            </p>
            <button
              onClick={() => {
                const currentIndex = stages.findIndex((s) => s.id === selectedScanStage);
                if (currentIndex < stages.length - 1) {
                  handleSelectStage(stages[currentIndex + 1].id);
                } else {
                  navigateToFindings('all');
                }
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
            >
              <span>
                {selectedScanStage === 'low' ? 'View all findings' : 'Proceed to next stage'}
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        ) : currentFinding ? (

          /* SECTION 5: THE EXACT STAGE REVIEW CARD DESIGN */
          <div className="relative p-6 sm:p-7 rounded-2xl bg-[#0D1425] border border-[#24324D] shadow-2xl space-y-5 max-w-3xl mx-auto">
            
            {/* Stage Indicator Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-[#24324D]">
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${currentStageConfig.badgeBg} ${currentStageConfig.badgeText} ${currentStageConfig.borderColor}`}>
                  {currentStageConfig.title.replace(/s$/, '')}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Stage {currentStageConfig.stepNumber} of 4 · {currentStageFindings.length} {currentStageFindings.length === 1 ? 'profile' : 'profiles'} to review
                </span>
              </div>

              {/* Profile X of Y indicator */}
              <span className="text-xs font-mono font-bold text-[#42DDF5] px-2.5 py-0.5 rounded-md bg-[#070A14] border border-[#24324D]">
                Profile {stageProfileIndex + 1} of {currentStageFindings.length}
              </span>
            </div>

            {/* Profile or App Name & Platform */}
            <div>
              <h4 className="text-xl font-bold text-white tracking-tight mb-1">
                {currentFinding.title}
              </h4>
              <p className="text-xs text-slate-400 flex items-center gap-2 font-medium">
                {currentFinding.type === 'app' ? (
                  <>
                    <Smartphone className="w-3.5 h-3.5 text-[#A17AFF]" />
                    <span>Mobile app · {currentFinding.platform}</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-[#42DDF5]" />
                    <span>Social profile · {currentFinding.platform}</span>
                  </>
                )}
                <span className="text-slate-600">·</span>
                <span className="text-slate-400 font-mono">{currentFinding.usernameOrPackage}</span>
              </p>
            </div>

            {/* Risk Score & Confidence */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#070A14] border border-[#24324D]">
              <div>
                <span className="text-[11px] text-slate-400 block mb-0.5">Risk score:</span>
                <span className="text-lg font-black text-[#FF5878] font-mono">
                  {currentFinding.riskScore}/100
                </span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block mb-0.5">Confidence:</span>
                <span className={`inline-flex items-center text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  currentFinding.confidence === 'High'
                    ? 'bg-[#FF5878]/10 text-[#FF5878] border-[#FF5878]/20'
                    : 'bg-[#FFBD69]/10 text-[#FFBD69] border-[#FFBD69]/20'
                }`}>
                  {currentFinding.confidence}
                </span>
              </div>
            </div>

            {/* Why this was flagged */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Why this was flagged:
              </span>
              <p className="text-xs text-slate-200 leading-relaxed bg-[#070A14] p-3.5 rounded-lg border border-[#24324D]">
                {currentFinding.mainReason || currentFinding.detailedReason}
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => openReportModal(currentFinding)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-violet-950/40"
              >
                <span>Review details</span>
                <ExternalLink className="w-3.5 h-3.5 text-white" />
              </button>

              <button
                type="button"
                onClick={() => handleConfirmImpersonation(currentFinding)}
                className="px-4 py-2.5 rounded-xl bg-[#FF5878]/15 hover:bg-[#FF5878]/25 text-[#FF5878] border border-[#FF5878]/30 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Confirm impersonation</span>
              </button>

              <button
                type="button"
                onClick={() => handleSkipFinding(currentFinding)}
                className="px-4 py-2.5 rounded-xl bg-[#111B30] hover:bg-[#17223B] text-slate-300 hover:text-white border border-[#24324D] text-xs font-medium transition-colors"
              >
                <span>Skip for now</span>
              </button>
            </div>

            {/* Card Footer: Back / Next Profile Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-[#24324D] text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevProfile}
                  disabled={stageProfileIndex === 0}
                  className="px-3 py-1.5 rounded-lg bg-[#111B30] hover:bg-[#17223B] text-slate-300 border border-[#24324D] text-xs font-medium transition-colors flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextProfile}
                  disabled={stageProfileIndex >= currentStageFindings.length - 1}
                  className="px-3 py-1.5 rounded-lg bg-[#111B30] hover:bg-[#17223B] text-slate-300 border border-[#24324D] text-xs font-medium transition-colors flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span>Next profile</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Optional Action: View All Findings */}
              <button
                type="button"
                onClick={() => navigateToFindings('all', selectedScanStage)}
                className="text-xs text-[#42DDF5] hover:text-cyan-300 font-medium hover:underline flex items-center gap-1"
              >
                <span>View all {selectedScanStage} findings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        ) : null}

        {/* SECTION 10: COMPLETION STATE WHEN ALL STAGES REVIEWED */}
        {isAllStagesReviewed && (
          <div className="p-6 rounded-2xl bg-[#0D1425] border border-emerald-500/30 text-center space-y-3 mt-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Review complete</h4>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              You reviewed all scan stages. You can reopen any finding from Findings.
            </p>
            <button
              onClick={() => navigateToFindings('all')}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
            >
              <span>View all findings</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

    </div>
  );
};
