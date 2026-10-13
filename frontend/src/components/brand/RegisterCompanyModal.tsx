import React, { useState } from 'react';
import { useBrandGuard } from '../../context/BrandGuardContext';
import { 
  Building2, 
  Globe, 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  Sparkles, 
  CheckCircle2, 
  X,
  Briefcase,
  ArrowRight
} from 'lucide-react';

interface RegisterCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegisterCompanyModal: React.FC<RegisterCompanyModalProps> = ({ isOpen, onClose }) => {
  const { register, showToast, refreshAvailableCompanies } = useBrandGuard();

  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('Fintech & Payments');
  const [adminName, setAdminName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !email.trim() || !password.trim()) {
      showToast('Please fill in enterprise name, admin email, and password.', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      await register({
        name: adminName.trim() || `${companyName.trim()} Security Officer`,
        email: email.trim(),
        password: password.trim(),
        companyName: companyName.trim(),
        website: website.trim() || `https://${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        industry: industry,
      });

      await refreshAvailableCompanies();
      showToast(`Enterprise '${companyName}' registered successfully. Perimeter activated!`, 'success');
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Failed to register enterprise', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl p-6 rounded-3xl cyber-panel-glow border border-cyan-500/40 shadow-2xl overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <span>Register New Enterprise</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">
                  NEW PERIMETER
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Establish an official brand identity to monitor and defend against impersonations.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Enterprise / Brand Name *
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Tesla, Stripe, Puma"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Official Website Domain
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Industry Sector
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500 font-semibold"
                >
                  <option value="Fintech & Payments">Fintech & Payments</option>
                  <option value="Sportswear & Apparel">Sportswear & Apparel</option>
                  <option value="Automotive & Mobility">Automotive & Mobility</option>
                  <option value="Consumer Electronics">Consumer Electronics</option>
                  <option value="Healthcare & Pharma">Healthcare & Pharma</option>
                  <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Security Admin Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="Security Lead Name"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Admin Work Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@enterprise.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Whitelist Preview Banner */}
          <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 flex items-start gap-2.5 text-[11px] text-slate-300">
            <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-cyan-300 block mb-0.5">Automated Perimeter Activation</span>
              Upon registration, BrandGuard will automatically construct the legitimate asset whitelist and initialize threat feeds for {companyName || 'your enterprise'}.
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/30 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Registering...' : 'Activate Enterprise'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
