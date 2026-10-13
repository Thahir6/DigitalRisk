import React, { useState } from 'react';
import { useBrandGuard } from '../context/BrandGuardContext';
import { 
  Code2, 
  Sparkles, 
  Search, 
  Terminal, 
  AlertTriangle, 
  FileCheck2, 
  Copy, 
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { UnicodeXRayInspector } from '../components/findings/UnicodeXRayInspector';

export const UnicodeXRayPage: React.FC = () => {
  const { brandProfile, company, showToast } = useBrandGuard();

  const brandName = brandProfile.brandName || company?.name || 'AcmePay';
  const cleanBrand = brandName.toLowerCase().replace(/[^a-z0-9]/g, '');

  const [candidateInput, setCandidateInput] = useState(`\u0430${cleanBrand.slice(1)}-login.com`); // Defaults to Cyrillic 'а'

  const sampleAttacks = [
    { label: 'Cyrillic Small Letter "а" (U+0430)', value: `\u0430${cleanBrand.slice(1)}.com` },
    { label: 'Cyrillic "е" (U+0435) & "о" (U+043E)', value: `${cleanBrand.slice(0, 2)}\u0435${cleanBrand.slice(3, -1)}\u043E.net` },
    { label: 'Zero-Width Non-Joiner (Invisible \u200C)', value: `${cleanBrand.slice(0, 3)}\u200C${cleanBrand.slice(3)}-portal.com` },
    { label: 'Greek Small Letter "ο" (U+03BF)', value: `${cleanBrand.slice(0, -1)}\u03BF.org` },
    { label: 'Fullwidth Latin "ａ" (U+FF41)', value: `\uFF41${cleanBrand.slice(1)}.xyz` },
    { label: 'Digit "0" & "1" Homoglyph Sub', value: `${cleanBrand.replace(/o/gi, '0').replace(/l/gi, '1')}.com` },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 sm:p-7 rounded-3xl unlumen-card border border-purple-500/25 shadow-2xl space-y-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent pointer-events-none" />

        <div className="relative z-10 flex items-center gap-2.5 flex-wrap">
          <span className="p-2 rounded-xl bg-purple-950/70 text-purple-400 border border-purple-500/40 shadow-sm">
            <Code2 className="w-5 h-5" />
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Unicode X-Ray Laboratory
          </h1>
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-950/60 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
            [HOMOGLYPH_SPECTROMETER]
          </span>
        </div>
        <p className="relative z-10 text-xs text-slate-400 max-w-2xl leading-relaxed">
          Unmask internationalized domain spoofing (IDN homograph attacks), mixed Latin/Cyrillic scripts, full-width glyphs, and invisible zero-width characters that slip through standard ASCII filters.
        </p>
      </div>

      {/* Input / Control Field with SpotlightCard */}
      <div className="p-5 sm:p-6 rounded-2xl unlumen-card border border-slate-800 space-y-4 shadow-xl">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-200 font-mono uppercase tracking-wider block">
            Candidate String or Domain to Analyze:
          </label>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              value={candidateInput}
              onChange={(e) => setCandidateInput(e.target.value)}
              placeholder="e.g. аcmepay.com, bank-lоgin.net..."
              className="flex-1 px-4 py-3 rounded-xl bg-slate-950/90 border border-slate-700/80 font-mono text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all shadow-inner"
            />
            <div className="relative group p-px rounded-xl overflow-hidden flex-shrink-0 shadow-lg shadow-purple-500/20">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500" />
              <button
                onClick={() => {
                  showToast('Unicode character breakdown updated', 'success');
                }}
                className="relative px-5 py-3 rounded-[11px] bg-slate-950 hover:bg-slate-900 text-purple-300 text-xs font-bold flex items-center justify-center gap-2 transition-all flex-shrink-0 btn-smooth"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                  Inspect String
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Sample Presets */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <span className="text-[11px] font-mono font-semibold text-slate-400 block">
            [PRESET ATTACK VECTORS]:
          </span>
          <div className="flex flex-wrap gap-2">
            {sampleAttacks.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCandidateInput(s.value);
                  showToast(`Loaded ${s.label}`, 'info');
                }}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 hover:text-purple-300 border border-slate-700/80 hover:border-purple-500/40 text-[11px] text-slate-300 font-mono transition-all btn-smooth shadow-sm"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Unicode Inspector Display */}
      <UnicodeXRayInspector
        candidateString={candidateInput}
        onAddEvidence={() => {
          showToast(`Unicode telemetry for "${candidateInput}" saved to evidence docket`, 'success');
        }}
      />
    </div>
  );
};
