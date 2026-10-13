import React, { useState } from 'react';
import { useBrandGuard } from '../context/BrandGuardContext';
import { api } from '../services/api';
import { Shield, Mail, ArrowLeft, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';
import { SpotlightCard } from '../components/common/SpotlightCard';

export const ForgotPasswordPage: React.FC = () => {
  const { setViewMode } = useBrandGuard();
  const [email, setEmail] = useState('alex.mercer@acmepay.com');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await api.forgotPassword(email);
      setSuccessMessage(res.message);
    } catch (err: any) {
      setError(err.message || 'Unable to process reset request. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#040711] text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 haikei-mesh-bg relative overflow-hidden">
      {/* Background Cyber Ambient Overlays */}
      <div className="pointer-events-none fixed inset-0 cyber-grid-pattern opacity-25" />

      {/* Top bar */}
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
              Digital Risk Protection
            </span>
          </div>
        </button>

        <button
          onClick={() => setViewMode('login')}
          className="text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-800/60"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign in</span>
        </button>
      </header>

      {/* Main card */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md border-beam-container">
          <div className="border-beam-glow opacity-80" />

          <SpotlightCard className="p-8 shadow-2xl relative" showCornerAccents={true}>
            <div className="mb-7 text-center">
              <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-3 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <KeyRound className="w-6 h-6 text-cyan-400" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight mb-1.5 font-display-3d">
                Credential Recovery
              </h1>
              <p className="text-xs text-slate-400">
                Enter your corporate email address to receive secure session restoration instructions.
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMessage ? (
              <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <CheckCircle2 className="w-9 h-9 text-emerald-400 mx-auto" />
                <h3 className="text-sm font-bold text-white font-mono">DISPATCH CONFIRMED</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-mono">
                  {successMessage}
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setViewMode('login')}
                    className="px-5 py-2.5 rounded-xl btn-smooth btn-smooth-dark text-xs font-semibold text-white"
                  >
                    Return to Sign in
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Registered Work Email
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-3 py-3 rounded-xl btn-smooth btn-smooth-cyan text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending instructions...</span>
                    </>
                  ) : (
                    <span>Send recovery instructions</span>
                  )}
                </button>
              </form>
            )}

            <div className="mt-6 text-center text-xs text-slate-400">
              <span>Remembered your password? </span>
              <button
                onClick={() => setViewMode('login')}
                className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
              >
                Sign in
              </button>
            </div>
          </SpotlightCard>
        </div>
      </main>

      <footer className="py-6 text-center text-[11px] font-mono text-slate-500 relative z-10">
        AEGIS Security Cloud &bull; Encrypted Token Handshake
      </footer>
    </div>
  );
};
