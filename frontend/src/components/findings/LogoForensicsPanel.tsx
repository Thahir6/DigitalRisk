import React, { useState } from 'react';
import { Finding } from '../../types';
import { 
  Eye, 
  Layers, 
  Sliders, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  Maximize2
} from 'lucide-react';

interface LogoForensicsPanelProps {
  finding: Finding;
  officialLogoText?: string;
  officialBrandName?: string;
}

export const LogoForensicsPanel: React.FC<LogoForensicsPanelProps> = ({
  finding,
  officialLogoText = 'AP',
  officialBrandName = 'AcmePay Official',
}) => {
  const [overlayOpacity, setOverlayOpacity] = useState<number>(55);
  const [viewMode, setViewMode] = useState<'heatmap' | 'side-by-side' | 'contour'>('heatmap');

  const similarityScore = finding.riskScore > 85 ? 89.4 : finding.riskScore > 70 ? 76.2 : 62.5;
  const confidenceScore = finding.confidence === 'High' ? 95 : finding.confidence === 'Medium' ? 82 : 68;

  return (
    <section className="p-5 rounded-2xl bg-navy-850/90 border border-slate-800 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/30">
              <Eye className="w-4 h-4" />
            </span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Logo Forensics & Visual Difference Heatmap
            </h3>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
              Demo data
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pixel-level comparison & structural vector delta analysis against verified brand mark.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-navy-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          {[
            { id: 'heatmap', label: 'Heatmap' },
            { id: 'side-by-side', label: 'Side-by-Side' },
            { id: 'contour', label: 'Contour Delta' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id as any)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                viewMode === mode.id
                  ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Visual Heatmap Canvas Display */}
        <div className="md:col-span-7 bg-navy-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Badge indicator */}
          <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] text-pink-400 border border-pink-500/30 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping" />
            <span>Delta variance highlighted</span>
          </div>

          {viewMode === 'side-by-side' ? (
            /* Side-by-side view */
            <div className="grid grid-cols-2 gap-4 w-full py-4 items-center justify-items-center">
              <div className="text-center space-y-2">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg border-2 border-emerald-500/50">
                  {officialLogoText}
                </div>
                <div className="text-[11px] font-semibold text-emerald-400">
                  Verified Official Logo
                </div>
              </div>

              <div className="text-center space-y-2">
                <div className={`w-24 h-24 rounded-2xl bg-gradient-to-tr ${finding.avatarColor} text-white font-extrabold text-2xl flex items-center justify-center shadow-lg border-2 border-red-500/60 relative`}>
                  {finding.avatarInitials}
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-bold">
                    !
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-red-400">
                  Suspect Scraped Icon
                </div>
              </div>
            </div>
          ) : viewMode === 'contour' ? (
            /* Contour Delta Wireframe View */
            <div className="py-6 flex flex-col items-center justify-center space-y-3">
              <div className="relative w-32 h-32 rounded-2xl border-2 border-dashed border-cyan-400 bg-cyan-950/20 flex items-center justify-center">
                <div className="absolute inset-2 border-2 border-pink-500/80 rounded-xl flex items-center justify-center bg-pink-950/30 animate-pulse">
                  <span className="font-mono text-xs text-pink-300 font-bold">
                    &Delta; +14.2% Offset
                  </span>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 text-center">
                Vector stroke contour mismatch detected along glyph perimeter
              </span>
            </div>
          ) : (
            /* Heatmap Overlay with Slider Blend */
            <div className="py-3 flex flex-col items-center justify-center w-full">
              <div className="relative w-36 h-36 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-900 flex items-center justify-center">
                {/* Official Base Layer */}
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-700 to-blue-800 text-cyan-100 font-black text-3xl flex items-center justify-center select-none">
                  {officialLogoText}
                </div>

                {/* Heatmap Delta Mesh Overlay */}
                <div 
                  className="absolute inset-0 bg-gradient-to-tr from-rose-600 via-amber-500 to-red-600 mix-blend-color-dodge transition-opacity pointer-events-none flex items-center justify-center text-white font-black text-3xl"
                  style={{ opacity: overlayOpacity / 100 }}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(#ec4899_1px,transparent_1px)] [background-size:12px_12px] opacity-70" />
                  <span className="opacity-90">{finding.avatarInitials}</span>
                </div>

                {/* Simulated Heatmap Hotspot circles */}
                <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-red-500/80 blur-xs animate-ping" />
                <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-amber-400/80 blur-xs" />
              </div>

              {/* Opacity Slider */}
              <div className="w-full max-w-xs mt-3 space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Official Layer</span>
                  <span className="font-mono text-cyan-300 font-semibold">{overlayOpacity}% Heatmap Blend</span>
                  <span>Suspect Layer</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={overlayOpacity}
                  onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                  className="w-full accent-pink-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Color bar legend */}
          <div className="w-full flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800/80">
            <span className="flex items-center gap-1 text-cyan-400">
              <span className="w-2 h-2 rounded bg-cyan-400" /> Identical (0% Diff)
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <span className="w-2 h-2 rounded bg-amber-400" /> Color Shift (20-40%)
            </span>
            <span className="flex items-center gap-1 text-red-400">
              <span className="w-2 h-2 rounded bg-red-500" /> Structural Swap (60-90%)
            </span>
          </div>
        </div>

        {/* Forensic Metrics & Observations */}
        <div className="md:col-span-5 space-y-3">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-navy-950 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Visual Similarity
              </span>
              <div className="text-xl font-extrabold text-white mt-0.5">
                {similarityScore}%
              </div>
              <span className="text-[10px] text-red-400 font-medium">
                High mimicry threshold
              </span>
            </div>

            <div className="p-3 rounded-xl bg-navy-950 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Forensics Confidence
              </span>
              <div className="text-xl font-extrabold text-cyan-400 mt-0.5">
                {confidenceScore}%
              </div>
              <span className="text-[10px] text-slate-400 font-medium">
                Deep neural vision check
              </span>
            </div>
          </div>

          {/* Forensic Breakdown Observations */}
          <div className="p-3 rounded-xl bg-navy-950 border border-slate-800 space-y-2 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Detected Structural Alterations
            </span>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-start gap-1.5 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                <span>
                  <strong className="text-white">Color palette alteration:</strong> Background hue shifted from verified Cyan (#0ea5e9) to saturated Crimson/Orange gradient to bypass automated hash check.
                </span>
              </div>

              <div className="flex items-start gap-1.5 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                <span>
                  <strong className="text-white">Emblem & typography:</strong> Lettering weight amplified by +18% with altered kerning to resemble an "Authorized Agency" seal.
                </span>
              </div>

              <div className="flex items-start gap-1.5 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5 flex-shrink-0" />
                <span>
                  <strong className="text-white">Artifact distortion:</strong> Minor JPEG compression noise indicates manual download and re-upload from marketing collateral.
                </span>
              </div>
            </div>
          </div>

          {/* Explanation Footer */}
          <p className="text-[11px] text-slate-400 italic leading-snug">
            &ldquo;Suspect icon exhibits clear intentional visual mimicry of {officialBrandName}&rsquo;s trademarked mark while making micro-adjustments to defeat cryptographic hash matching.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
};
