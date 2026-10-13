import React, { useState } from 'react';
import { useBrandGuard } from '../context/BrandGuardContext';
import { Shield, Lock, Mail, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2, ShieldCheck, KeyRound } from 'lucide-react';
import { SpotlightCard } from '../components/common/SpotlightCard';

export const LoginPage: React.FC = () => {
  const { login, setViewMode } = useBrandGuard();
  const [email, setEmail] = useState('alex.mercer@acmepay.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'The email or password is incorrect. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#040711] text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 haikei-mesh-bg relative overflow-hidden">
      {/* Background Cyber Ambient Overlays */}
      <div className="pointer-events-none fixed inset-0 cyber-grid-pattern opacity-25" />

      {/* Top bar with Unlumen UI Glass Polish */}
      <header className="h-20 px-6 max-w-7xl mx-auto w-full flex items-center justify-between relative z-10">
        <button
          onClick={() => setViewMode('landing')}
          className="flex items-center gap-3 text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform border border-violet-400/30">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-xl block leading-tight text-white tracking-wider">AEGIS</span>
            <span className="text-[10px] text-[#42DDF5] font-mono font-medium tracking-wider uppercase block">
              Enterprise Risk Gateway
            </span>
          </div>
        </button>

        <button
          onClick={() => setViewMode('landing')}
          className="text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-800/60"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>
      </header>

      {/* Main 3D Spotlight Card Container */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md border-beam-container">
          <div className="border-beam-glow opacity-80" />

          <SpotlightCard className="p-8 shadow-2xl relative" showCornerAccents={true}>
            <div className="mb-7 text-center">
              <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-3 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <KeyRound className="w-6 h-6 text-cyan-400" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight mb-1.5 font-display-3d">
                Authenticate Session
              </h1>
              <p className="text-xs text-slate-400">
                Enter your verified credentials to enter the SecOps threat intelligence portal.
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-xs text-red-300 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setViewMode('forgot-password')}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-3 py-3 rounded-xl btn-smooth btn-smooth-cyan text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying session handshake...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in to Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Fill Pill with Monospace Retro Indicator */}
            <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-cyan-500/20 text-[11px] text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Demo Analyst:</span>
                <code className="text-cyan-300 font-mono">alex.mercer@acmepay.com</code>
              </div>
            </div>

            <div className="mt-5 text-center text-xs text-slate-400">
              <span>Don't have an enterprise account? </span>
              <button
                onClick={() => setViewMode('onboarding')}
                className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
              >
                Register your company
              </button>
            </div>
          </SpotlightCard>
        </div>
      </main>

      {/* Footer note */}
      <footer className="py-6 text-center text-[11px] font-mono text-slate-500 relative z-10">
        AEGIS Security Cloud &bull; TLS 1.3 &bull; AES-256 Encrypted Session Handshake
      </footer>
    </div>
  );
};
