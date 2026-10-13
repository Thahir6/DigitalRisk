import React from 'react';
import { useBrandGuard } from '../../context/BrandGuardContext';
import { Radar, CheckCircle2, Loader2, Shield } from 'lucide-react';

export const LoadingScanModal: React.FC = () => {
  const { isScanning, scanProgress, scanStepIndex } = useBrandGuard();

  if (!isScanning) return null;

  const steps = [
    { id: 1, label: 'Checking profile names' },
    { id: 2, label: 'Comparing logos' },
    { id: 3, label: 'Checking suspicious domains' },
    { id: 4, label: 'Reviewing app publishers' },
    { id: 5, label: 'Grouping related threats' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dim backdrop */}
      <div className="fixed inset-0 bg-navy-950/85 backdrop-blur-md" />

      {/* Center scan card */}
      <div className="relative w-full max-w-md p-6 rounded-2xl bg-navy-900 border border-cyan-500/30 shadow-2xl z-10 text-center animate-in zoom-in-95 duration-200">
        <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          {/* Circular progress radar rings */}
          <div className="absolute inset-0 rounded-full border border-cyan-500/40 animate-ping opacity-50" />
          <div className="absolute -inset-2 rounded-full border border-cyan-400/20 animate-pulse" />
          <div className="relative z-10 p-4 rounded-full bg-cyan-500/10 border border-cyan-500/40 text-cyan-400">
            <Radar className="w-8 h-8 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
        </div>

        <h3 className="text-base font-bold text-white tracking-tight mb-1">
          Scanning Brand Assets
        </h3>
        <p className="text-xs text-slate-400 mb-5">
          Inspecting public platforms for possible brand impersonations.
        </p>

        {/* 5 Ordered Scan Steps */}
        <div className="p-3.5 rounded-xl bg-navy-950 border border-slate-800 text-left mb-5 space-y-2.5">
          {steps.map((st) => {
            const isDone = scanStepIndex > st.id;
            const isCurrent = scanStepIndex === st.id;
            const isPending = scanStepIndex < st.id;

            return (
              <div 
                key={st.id} 
                className={`flex items-center justify-between text-xs transition-colors ${
                  isDone 
                    ? 'text-emerald-400 font-medium' 
                    : isCurrent 
                    ? 'text-cyan-300 font-semibold' 
                    : 'text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px] text-slate-600 font-mono shrink-0">
                      {st.id}
                    </div>
                  )}
                  <span>{st.label}</span>
                </div>

                <span className="text-[10px] font-mono">
                  {isDone ? 'Done' : isCurrent ? 'Checking...' : 'Pending'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Smooth Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden mb-2">
          <div 
            className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 h-2.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${scanProgress}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono">
          <span className="flex items-center gap-1 text-slate-400">
            <Shield className="w-3 h-3 text-cyan-400" />
            <span>Target: AcmePay</span>
          </span>
          <span className="text-cyan-400 font-bold">{scanProgress}%</span>
        </div>
      </div>
    </div>
  );
};
