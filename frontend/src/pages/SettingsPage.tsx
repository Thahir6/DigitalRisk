import React, { useState } from 'react';
import { useBrandGuard } from '../context/BrandGuardContext';
import { 
  Settings, 
  RotateCcw, 
  BellRing, 
  ShieldCheck, 
  Sliders, 
  Key, 
  Sparkles,
  Save,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { resetDemoData, showToast } = useBrandGuard();

  const [scanFrequency, setScanFrequency] = useState('15m');
  const [minConfidenceThreshold, setMinConfidenceThreshold] = useState('Medium');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slackAlerts, setSlackAlerts] = useState(false);
  const [autoTriageCritical, setAutoTriageCritical] = useState(true);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Platform configuration saved successfully', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 text-xs">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2 mb-1.5">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Settings & Detection Parameters
          </h2>
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-cyan-400 px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30">
            <Settings className="w-3 h-3" />
            [ENGINE_CONFIG]
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Fine-tune automated scanning cadences, alert notification thresholds, and demo environment settings.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Section 1: Ingestion & Scan Frequency */}
        <section className="p-6 rounded-2xl unlumen-card border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800/80">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Detection Engine Cadence</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1.5 font-mono text-[11px]">
                Registry & Stream Scan Frequency
              </label>
              <select
                value={scanFrequency}
                onChange={(e) => setScanFrequency(e.target.value)}
                className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl p-3 text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-400 cursor-pointer shadow-inner"
              >
                <option value="5m">Every 5 minutes (Real-time telemetry)</option>
                <option value="15m">Every 15 minutes (Standard recommendation)</option>
                <option value="1h">Every 1 hour (Low bandwidth)</option>
                <option value="24h">Daily batch audit</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5 font-mono text-[11px]">
                Minimum Alert Confidence Filter
              </label>
              <select
                value={minConfidenceThreshold}
                onChange={(e) => setMinConfidenceThreshold(e.target.value)}
                className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl p-3 text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-400 cursor-pointer shadow-inner"
              >
                <option value="Low">Low Confidence (Catch all potential signals)</option>
                <option value="Medium">Medium Confidence (Balanced precision)</option>
                <option value="High">High Confidence (Verified matches only)</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2.5 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={autoTriageCritical}
                onChange={(e) => setAutoTriageCritical(e.target.checked)}
                className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0 w-4 h-4 cursor-pointer"
              />
              <span className="font-sans text-xs">Automatically escalate Critical findings to priority triage queue</span>
            </label>
          </div>
        </section>

        {/* Section 2: Notification Dispatch */}
        <section className="p-6 rounded-2xl unlumen-card border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800/80">
            <BellRing className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Security Alerts & Webhooks</h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3 text-slate-300 cursor-pointer p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0 w-4 h-4 mt-0.5 cursor-pointer"
              />
              <div>
                <span className="font-semibold text-white block">Email Incident Dispatch</span>
                <span className="text-[11px] text-slate-400">
                  Notify alex.mercer@acmepay.com immediately when a High or Critical impersonation is flagged.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 text-slate-300 cursor-pointer p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors">
              <input
                type="checkbox"
                checked={slackAlerts}
                onChange={(e) => setSlackAlerts(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0 w-4 h-4 mt-0.5 cursor-pointer"
              />
              <div>
                <span className="font-semibold text-white block">Slack SecOps Channel Integration</span>
                <span className="text-[11px] text-slate-400">
                  Post instant JSON takedown cards to #brand-security-alerts.
                </span>
              </div>
            </label>
          </div>
        </section>

        {/* Section 3: Demo Mode Controls */}
        <section className="p-6 rounded-2xl unlumen-card border border-cyan-500/25 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Demo Mode Environment</h3>
            </div>
            <span className="text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-md bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
              ACTIVE SESSION
            </span>
          </div>

          <p className="text-slate-300 leading-relaxed text-xs">
            You are operating in AEGIS Demo Mode with preloaded synthetic threats targeting AcmePay. No external live network requests or takedown actions are sent to registrars.
          </p>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
            <div>
              <h4 className="font-bold text-white mb-0.5">Reset Demo Data</h4>
              <p className="text-[11px] text-slate-400">
                Restore all findings, analyst notes, and brand profile values to the initial presentation state.
              </p>
            </div>
            <button
              type="button"
              onClick={resetDemoData}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-700/80 transition-all flex items-center gap-1.5 self-start sm:self-auto btn-smooth shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Reset demo state</span>
            </button>
          </div>
        </section>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-2">
          <div className="relative group p-px rounded-xl overflow-hidden shadow-lg shadow-cyan-500/20">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500" />
            <button
              type="submit"
              className="relative px-5 py-2.5 rounded-[11px] text-xs font-bold bg-slate-950 hover:bg-slate-900 text-cyan-300 transition-all flex items-center gap-2 btn-smooth"
            >
              <Save className="w-4 h-4 text-cyan-400" />
              <span className="bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent">Save configuration</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
