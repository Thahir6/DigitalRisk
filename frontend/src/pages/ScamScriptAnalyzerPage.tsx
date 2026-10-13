import React, { useState, useMemo } from 'react';
import { useBrandGuard } from '../context/BrandGuardContext';
import { 
  FileSearch, 
  Sparkles, 
  AlertTriangle, 
  ShieldAlert, 
  Copy, 
  Trash2, 
  Plus, 
  Check, 
  MessageSquare, 
  HelpCircle,
  TrendingUp,
  BarChart2
} from 'lucide-react';
import { ConfidenceLevel, RiskSeverity } from '../types';

interface DetectedTactic {
  id: string;
  name: string;
  weight: number;
  severity: RiskSeverity;
  keywords: string[];
  matchedSnippets: string[];
  explanation: string;
}

const TACTIC_DEFINITIONS: Array<{
  name: string;
  weight: number;
  severity: RiskSeverity;
  regex: RegExp;
  explanation: string;
}> = [
  {
    name: 'OTP Request',
    weight: 25,
    severity: 'critical',
    regex: /(one[- ]time (passcode|password)|otp|verification code|6[- ]digit code|security code)/gi,
    explanation: 'Attempts to intercept multi-factor authentication tokens to hijack active sessions.',
  },
  {
    name: 'Password Request',
    weight: 25,
    severity: 'critical',
    regex: /(enter (your )?password|confirm pin|send credentials|master key|login details)/gi,
    explanation: 'Direct solicitation of primary authentication credentials.',
  },
  {
    name: 'Account Suspension',
    weight: 18,
    severity: 'critical',
    regex: /(suspended|deactivated|terminated|frozen|blacklisted|access locked)/gi,
    explanation: 'Coercive threat claiming the customer account has been disabled or blocked.',
  },
  {
    name: 'Payment Request',
    weight: 20,
    severity: 'critical',
    regex: /(wire transfer|gift card|crypto(currency)?|bitcoin|processing fee|send \$[0-9]+|immediate payment)/gi,
    explanation: 'Demands direct financial transfer via irreversible payment mechanisms.',
  },
  {
    name: 'Urgency',
    weight: 15,
    severity: 'high',
    regex: /(immediately|within (24|12|48|2) hours|act now|urgent(ly)?|right now|before it expires|time is running out)/gi,
    explanation: 'Artificial time compression designed to bypass rational skepticism.',
  },
  {
    name: 'Authority',
    weight: 14,
    severity: 'high',
    regex: /(fraud (department|team)|official support|compliance officer|federal reserve|legal division|executive team)/gi,
    explanation: 'False pretense of high corporate or regulatory power.',
  },
  {
    name: 'Fear',
    weight: 16,
    severity: 'high',
    regex: /(legal (action|prosecution)|police report|arrest|lawsuit|permanent ban|penalty fee)/gi,
    explanation: 'Threat of severe legal, criminal, or financial repercussions.',
  },
  {
    name: 'Suspicious Link',
    weight: 18,
    severity: 'high',
    regex: /(https?:\/\/[^\s]+|bit\.ly[^\s]*|tinyurl[^\s]*|\.xyz|\.top|\.click|\.vip)/gi,
    explanation: 'Directs the victim to external unverified infrastructure or credential harvest pages.',
  },
  {
    name: 'Fake Refund',
    weight: 16,
    severity: 'high',
    regex: /(refund|reimbursement|overcharged|claim (your )?refund|credited by mistake)/gi,
    explanation: 'Lures victims by promising compensation or reversal of phantom charges.',
  },
  {
    name: 'Fake Reward',
    weight: 15,
    severity: 'medium',
    regex: /(congratulations|you (have )?won|exclusive prize|cashback bonus|\$[0-9]+ voucher|reward claim)/gi,
    explanation: 'Exploits lottery or sweepstakes hooks to collect sensitive banking information.',
  },
  {
    name: 'Impersonation',
    weight: 14,
    severity: 'high',
    regex: /(this is [a-z0-9 ]+ (team|support|representative)|official acmepay|verified agent)/gi,
    explanation: 'Explicit impersonation of legitimate brand employees or support desks.',
  },
  {
    name: 'Secrecy',
    weight: 12,
    severity: 'high',
    regex: /(do not (share|disclose|tell)|keep confidential|private protocol|between us)/gi,
    explanation: 'Instructs victim not to consult family or bank personnel.',
  },
  {
    name: 'Emotional Pressure',
    weight: 12,
    severity: 'medium',
    regex: /(you will be (held )?responsible|failure to comply|last chance|disappoint)/gi,
    explanation: 'Psychological guilt or intimidation aimed at accelerating compliance.',
  },
];

export const ScamScriptAnalyzerPage: React.FC = () => {
  const { brandProfile, company, showToast, findings } = useBrandGuard();

  const brand = brandProfile.brandName || company?.name || 'AcmePay';

  const defaultSample = `URGENT NOTICE: This is the official ${brand} Fraud Prevention Department. Your account has been SUSPENDED due to unauthorized login attempts. To prevent permanent termination and legal action, you must verify your identity immediately within 24 hours. 

Please click the secure link below and submit your 6-digit OTP verification code:
https://${brand.toLowerCase().replace(/[^a-z0-9]/g, '')}-verify-auth.xyz/unlock

Do not share this message with anyone or visit a local branch. If you fail to comply, a $150 penalty fee will apply.`;

  const [messageText, setMessageText] = useState(defaultSample);
  const [analyzedText, setAnalyzedText] = useState(defaultSample);

  const samplePresets = [
    {
      title: 'SMS: Account Suspension & OTP Request',
      text: `[ALERT] ${brand}: Your mobile wallet is suspended! Verify your one-time password OTP immediately at http://bit.ly/${brand.toLowerCase()}-unlock within 12 hours or account funds will be frozen.`,
    },
    {
      title: 'DM: Fake Refund Overpayment',
      text: `Hello valued customer! This is ${brand} Customer Care. We detected an overpayment of $240 on your last transaction. To claim your refund reimbursement, send your banking PIN and account login details immediately.`,
    },
    {
      title: 'Telegram: VIP Reward & Gift Card',
      text: `CONGRATULATIONS! You won an exclusive $5,000 ${brand} Reward Cashback Voucher! To release funds, transfer an initial $35 crypto processing fee to the agent. Keep this confidential between us!`,
    },
    {
      title: 'Email: Compliance Legal Action Threat',
      text: `FINAL NOTICE: ${brand} Legal Compliance Division. Lawsuit and police report pending against your profile. You will be held responsible for fraud damages. Settle with wire transfer payment right now.`,
    },
  ];

  // Run rule-based analysis
  const analysisResults = useMemo(() => {
    const text = analyzedText || '';
    const detected: DetectedTactic[] = [];
    let cumulativeScore = 0;

    TACTIC_DEFINITIONS.forEach((def, idx) => {
      const matches = Array.from(text.matchAll(def.regex)).map(m => m[0]);
      if (matches.length > 0) {
        detected.push({
          id: `tac-${idx}`,
          name: def.name,
          weight: def.weight,
          severity: def.severity,
          keywords: Array.from(new Set(matches)),
          matchedSnippets: matches.slice(0, 3),
          explanation: def.explanation,
        });
        cumulativeScore += def.weight;
      }
    });

    // Score capping between 0 and 100
    const scamScore = Math.min(Math.round(cumulativeScore * 1.05), 100);
    const confidence: ConfidenceLevel = scamScore >= 75 ? 'High' : scamScore >= 45 ? 'Medium' : 'Low';

    return {
      scamScore,
      confidence,
      tactics: detected,
    };
  }, [analyzedText]);

  const handleAnalyze = () => {
    setAnalyzedText(messageText);
    showToast('Message analyzed against 13 social engineering vectors', 'success');
  };

  const handleCopyAnalysis = () => {
    const report = `SCAM SCRIPT ANALYSIS REPORT (Demo Data)
Scam Threat Score: ${analysisResults.scamScore}/100 (${analysisResults.confidence} Confidence)
Detected Vectors (${analysisResults.tactics.length}):
${analysisResults.tactics.map(t => `- ${t.name}: "${t.matchedSnippets.join(', ')}" (${t.explanation})`).join('\n')}

Original Message Snippet:
"${messageText.slice(0, 150)}..."`;

    navigator.clipboard?.writeText(report);
    showToast('Analysis report copied to clipboard', 'info');
  };

  const handleClear = () => {
    setMessageText('');
    setAnalyzedText('');
    showToast('Message cleared', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 sm:p-7 rounded-3xl unlumen-card border border-red-500/25 shadow-2xl space-y-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-400/30 to-transparent pointer-events-none" />

        <div className="relative z-10 flex items-center gap-2.5 flex-wrap">
          <span className="p-2 rounded-xl bg-red-950/70 text-red-400 border border-red-500/40 shadow-sm">
            <FileSearch className="w-5 h-5" />
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Scam Script & Social Engineering Analyzer
          </h1>
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-950/60 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
            [13_HEURISTIC_PARSER]
          </span>
        </div>
        <p className="relative z-10 text-xs text-slate-400 max-w-2xl leading-relaxed">
          Evaluate suspect direct messages, SMS blasts, phishing emails, or call scripts. Automatically scores urgency, emotional pressure, OTP interception, authority impersonation, and fraudulent payment prompts.
        </p>
        <div className="relative z-10 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-amber-300 flex items-center gap-2 mt-2">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
          <span className="font-mono">Real-time linguistic heuristics engine. Flags deceptive coercive patterns.</span>
        </div>
      </div>

      {/* Main Grid: Input Column & Results Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Text Input & Presets (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 sm:p-6 rounded-2xl unlumen-card border border-slate-800 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 font-mono uppercase tracking-wider">
                <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                <span>Suspect Message / Script Body:</span>
              </label>
              <span className="text-[10px] font-mono text-slate-400">
                {messageText.length} characters
              </span>
            </div>

            <textarea
              rows={8}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Paste suspicious SMS, Telegram message, direct message, or email text here..."
              className="w-full p-4 rounded-xl bg-slate-950/90 border border-slate-700/80 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 leading-relaxed font-sans shadow-inner transition-all"
            />

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              <div className="flex items-center gap-2">
                <div className="relative group p-px rounded-xl overflow-hidden shadow-lg shadow-red-500/20">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-rose-500 to-amber-500" />
                  <button
                    onClick={handleAnalyze}
                    className="relative px-4 py-2.5 rounded-[11px] bg-slate-950 hover:bg-slate-900 text-red-300 text-xs font-bold flex items-center gap-1.5 transition-all btn-smooth"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-red-400" />
                    <span>Analyze Message</span>
                  </button>
                </div>

                <button
                  onClick={handleClear}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-all border border-slate-700/80 btn-smooth"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              </div>

              <button
                onClick={handleCopyAnalysis}
                className="px-3.5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-all border border-slate-800 btn-smooth shadow-sm"
              >
                <Copy className="w-3.5 h-3.5 text-cyan-400" />
                <span>Copy Analysis</span>
              </button>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="p-4 rounded-2xl unlumen-card border border-slate-800 space-y-2 shadow-md">
            <span className="text-[11px] font-mono font-semibold text-slate-400 block">
              [ATTACK PRESET TEMPLATES]:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {samplePresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setMessageText(preset.text);
                    setAnalyzedText(preset.text);
                    showToast(`Loaded ${preset.title}`, 'info');
                  }}
                  className="p-3 rounded-xl bg-slate-950/70 hover:bg-slate-900 border border-slate-800/80 hover:border-red-500/40 text-left transition-all btn-smooth shadow-sm"
                >
                  <p className="text-xs font-semibold text-slate-200">{preset.title}</p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{preset.text}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Score, Tactics Cards, & Charts (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Scam Score Gauge Card */}
          <div className="p-5 rounded-2xl bg-navy-850 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Calculated Scam Threat
              </span>
              <span className="text-[11px] text-cyan-400 font-medium">
                {analysisResults.confidence} Confidence
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-navy-950 border border-slate-800 text-center min-w-[100px]">
                <div className={`text-4xl font-extrabold tracking-tight ${
                  analysisResults.scamScore >= 80 ? 'text-red-400' : analysisResults.scamScore >= 50 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {analysisResults.scamScore}
                </div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase">
                  Scam Score / 100
                </span>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Threat Verdict</span>
                  <span className={`font-bold ${
                    analysisResults.scamScore >= 80 ? 'text-red-400' : analysisResults.scamScore >= 50 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {analysisResults.scamScore >= 80 ? 'High-Risk Impersonation Scam' : analysisResults.scamScore >= 50 ? 'Suspicious Phishing Vector' : 'Low Suspicion'}
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      analysisResults.scamScore >= 80 ? 'bg-red-500' : analysisResults.scamScore >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${analysisResults.scamScore}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Detected {analysisResults.tactics.length} social engineering triggers in text.
                </p>
              </div>
            </div>

            {/* Add to Findings Button */}
            <button
              onClick={() => {
                showToast('Scam script artifact escalated to active threat findings', 'success');
              }}
              className="w-full py-2.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Threat Findings</span>
            </button>
          </div>

          {/* Tactic Contribution Visual Progress Breakdown */}
          <div className="p-4 rounded-xl bg-navy-850 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Tactic Contribution Weights</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Relative Influence</span>
            </div>

            <div className="space-y-2">
              {analysisResults.tactics.map((tactic) => (
                <div key={tactic.id} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300 font-medium">{tactic.name}</span>
                    <span className="font-mono text-slate-400">+{tactic.weight}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${
                        tactic.severity === 'critical' ? 'bg-red-500' : tactic.severity === 'high' ? 'bg-orange-400' : 'bg-amber-400'
                      }`}
                      style={{ width: `${Math.min(tactic.weight * 3.5, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detected Tactic Cards */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-1">
              Detected Tactic Evidence Cards ({analysisResults.tactics.length})
            </span>

            {analysisResults.tactics.map((tactic) => (
              <div
                key={tactic.id}
                className="p-3.5 rounded-xl bg-navy-850 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="text-xs font-bold text-white">{tactic.name}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    tactic.severity === 'critical'
                      ? 'bg-red-500/15 text-red-300 border border-red-500/30'
                      : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  }`}>
                    {tactic.severity}
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-navy-950 border border-slate-800/80 font-mono text-[11px] text-red-300">
                  Snippet: &ldquo;{tactic.matchedSnippets.join(', ')}&rdquo;
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {tactic.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
