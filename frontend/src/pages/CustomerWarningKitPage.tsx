import React, { useState } from 'react';
import { useBrandGuard } from '../context/BrandGuardContext';
import { 
  Megaphone, 
  Copy, 
  Check, 
  Printer, 
  ExternalLink, 
  QrCode, 
  Share2, 
  MessageSquare, 
  Mail, 
  ShieldCheck, 
  AlertTriangle,
  FileCheck2,
  Lock,
  X
} from 'lucide-react';

export const CustomerWarningKitPage: React.FC = () => {
  const { brandProfile, company, showToast } = useBrandGuard();

  const brand = brandProfile.brandName || company?.name || 'AcmePay';
  const website = brandProfile.website || 'acmepay.com';
  const cleanDomain = website.replace(/^https?:\/\//, '').split('/')[0];

  const [activeTab, setActiveTab] = useState<'social' | 'sms' | 'email' | 'poster'>('social');
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  // Warning Kit Texts
  const socialPost = `🚨 CUSTOMER SECURITY ALERT from ${brand}

We have detected fraudulent accounts and websites impersonating ${brand} to steal login credentials and OTPs.

⚠️ WHAT TO AVOID:
• Never share your One-Time Passwords (OTPs) or PINs with anyone — even if they claim to be ${brand} support.
• Never click links from unverified social accounts or SMS numbers.

✅ OFFICIAL CHANNELS ONLY:
• Official Website: https://${cleanDomain}
• Always verify the blue checkmark & exact handle.

If you suspect suspicious activity, contact our official security desk immediately at support@${cleanDomain}.

#CyberSecurity #BrandProtection #${brand} #PhishingAlert`;

  const smsWarning = `[${brand} SECURITY ALERT]: Fraudulent accounts are posing as ${brand} asking for OTPs. We will NEVER ask for your password or OTP. Only use https://${cleanDomain}.`;

  const emailSubject = `Important Security Notice: Beware of Unauthorized ${brand} Impersonation`;
  const emailBody = `Dear Valued ${brand} Customer,

We are writing to alert you about an active wave of fraudulent social media profiles, fake mobile apps, and unauthorized websites attempting to impersonate ${brand}.

WHAT HAPPENED:
Cybercriminals have created deceptive lookalike domains and social profiles mimicking our brand logo to solicit one-time passwords (OTPs) and private credentials.

WHAT YOU SHOULD DO:
1. Never disclose your passwords, PINs, or SMS OTP codes to anyone. ${brand} staff will NEVER ask for your security credentials.
2. Only transact through our verified official website: https://${cleanDomain}
3. Ignore unsolicited direct messages on Telegram, Instagram, or WhatsApp offering unexpected refunds, cashback rewards, or emergency account unlocks.

HOW TO VERIFY:
You can verify the authentic status of any ${brand} asset at our public registry:
https://verify.brandguard.io/${brand.toLowerCase().replace(/[^a-z0-9]/g, '')}

If you believe your credentials have been compromised, please reset your password immediately and contact our official 24/7 Security Operations Center at security@${cleanDomain}.

Sincerely,
The ${brand} Information Security & Brand Protection Team`;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedType(type);
    showToast(`${type} advisory copied to clipboard`, 'success');
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handlePrintPoster = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 sm:p-7 rounded-3xl unlumen-card border border-amber-500/25 shadow-2xl space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="p-2 rounded-xl bg-amber-950/70 text-amber-400 border border-amber-500/40 shadow-sm">
              <Megaphone className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Customer Warning & Incident Advisory Kit
            </h1>
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-950/60 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
              [INCIDENT_COMMS]
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsVerifyModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition-all shadow-sm btn-smooth"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Verify Page</span>
            </button>
          </div>
        </div>

        <p className="relative z-10 text-xs text-slate-400 max-w-2xl leading-relaxed">
          Instantly generate compliant, brand-aligned security advisories for cross-platform distribution whenever an impersonation wave or fake app outbreak is detected.
        </p>

        {/* Draft Notice Warning */}
        <div className="relative z-10 p-2.5 rounded-xl bg-amber-950/60 border border-amber-500/30 text-[11px] text-amber-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span className="font-mono">Draft only — review with communications and legal counsel prior to external transmission.</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3 overflow-x-auto text-xs">
        {[
          { id: 'social', label: 'Social Media Warning', icon: Share2 },
          { id: 'sms', label: 'SMS Blast Alert (160 char)', icon: MessageSquare },
          { id: 'email', label: 'Customer Email Advisory', icon: Mail },
          { id: 'poster', label: 'Printable Security Poster / QR', icon: QrCode },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold transition-all whitespace-nowrap btn-smooth ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-850 border border-slate-800/80'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Social Media Warning */}
      {activeTab === 'social' && (
        <div className="p-6 rounded-2xl unlumen-card border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              [FORMATTED SOCIAL MEDIA BROADCAST] (X / LinkedIn / Instagram)
            </span>
            <button
              onClick={() => handleCopy(socialPost, 'Social Post')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition-all shadow-sm btn-smooth"
            >
              {copiedType === 'Social Post' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{copiedType === 'Social Post' ? 'Copied Post!' : 'Copy Social Post'}</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-slate-200 font-sans whitespace-pre-wrap leading-relaxed shadow-inner">
            {socialPost}
          </div>
        </div>
      )}

      {/* Tab 2: SMS Warning */}
      {activeTab === 'sms' && (
        <div className="p-6 rounded-2xl unlumen-card border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                [SMS CELLULAR BROADCAST]
              </span>
              <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                Length: {smsWarning.length} chars (within standard 160-character cellular SMS segment limit)
              </p>
            </div>
            <button
              onClick={() => handleCopy(smsWarning, 'SMS Alert')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition-all shadow-sm btn-smooth"
            >
              {copiedType === 'SMS Alert' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{copiedType === 'SMS Alert' ? 'Copied SMS!' : 'Copy SMS'}</span>
            </button>
          </div>

          <div className="max-w-md p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs text-slate-100 font-mono shadow-inner">
            <div className="text-[10px] text-slate-500 mb-2 uppercase font-mono font-bold">
              SMS Preview &bull; Carrier Network
            </div>
            {smsWarning}
          </div>
        </div>
      )}

      {/* Tab 3: Email Warning */}
      {activeTab === 'email' && (
        <div className="p-6 rounded-2xl unlumen-card border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              [CUSTOMER ADVISORY BULLETIN] (Email)
            </span>
            <button
              onClick={() => handleCopy(`Subject: ${emailSubject}\n\n${emailBody}`, 'Email Advisory')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition-all shadow-sm btn-smooth"
            >
              {copiedType === 'Email Advisory' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{copiedType === 'Email Advisory' ? 'Copied Email!' : 'Copy Email'}</span>
            </button>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-xs shadow-inner">
              <span className="text-slate-400 font-mono font-semibold">Subject: </span>
              <span className="text-white font-medium">{emailSubject}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-slate-200 font-sans whitespace-pre-wrap leading-relaxed shadow-inner">
              {emailBody}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: QR Poster Preview */}
      {activeTab === 'poster' && (
        <div className="p-6 rounded-2xl bg-navy-850 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Printable In-Branch / Office Security Poster (8.5 &times; 11 / A4)
              </span>
              <p className="text-[11px] text-slate-500">
                Display near physical locations or download for compliance PDF distribution.
              </p>
            </div>
            <button
              onClick={handlePrintPoster}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Download / Print QR Poster</span>
            </button>
          </div>

          {/* Printable Poster Mockup */}
          <div className="max-w-xl mx-auto p-8 rounded-2xl bg-slate-950 border-4 border-cyan-500/40 text-slate-100 shadow-2xl space-y-6 text-center">
            {/* Header */}
            <div className="space-y-1">
              <div className="w-12 h-12 mx-auto rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-black text-lg">
                {brandProfile.logoText || 'AP'}
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight uppercase">
                {brand} Official Security Advisory
              </h2>
              <p className="text-xs text-cyan-300 font-semibold tracking-wider uppercase">
                Protect Your Identity &bull; Verify Before You Transact
              </p>
            </div>

            {/* QR Centerpiece */}
            <div className="p-4 bg-white rounded-2xl inline-block shadow-lg mx-auto">
              {/* Simulated High-Res QR code */}
              <div className="w-40 h-40 bg-slate-900 rounded-lg p-2 flex flex-col items-center justify-center text-white relative">
                <QrCode className="w-32 h-32 text-slate-900" style={{ filter: 'invert(1)' }} />
              </div>
              <span className="text-[10px] text-slate-800 font-bold block mt-1 uppercase tracking-wider">
                Scan to Verify Official Assets
              </span>
            </div>

            {/* Key Safety Bulletins */}
            <div className="grid grid-cols-2 gap-3 text-left text-xs bg-navy-900/80 p-4 rounded-xl border border-slate-800">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-red-400 uppercase flex items-center gap-1">
                  &times; Never Share:
                </span>
                <p className="text-[11px] text-slate-300">
                  SMS One-Time Passcodes (OTPs), PIN numbers, or temporary passwords.
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase flex items-center gap-1">
                  &check; Official Website:
                </span>
                <p className="text-[11px] text-slate-300 font-mono font-semibold">
                  https://{cleanDomain}
                </p>
              </div>
            </div>

            {/* Verification URL Footer */}
            <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-500">
              <span>Official Verification Registry: </span>
              <strong className="text-cyan-400 font-mono">verify.brandguard.io/{brand.toLowerCase().replace(/[^a-z0-9]/g, '')}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Public Verify Link Interactive Modal */}
      {isVerifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-navy-900 border border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  Public Verification Registry Preview
                </h3>
              </div>
              <button
                onClick={() => setIsVerifyModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-navy-950 border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Public Verification URL:</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-bold">
                  LIVE REGISTRY
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-navy-900 font-mono text-cyan-300 break-all select-all border border-slate-800">
                https://verify.brandguard.io/{brand.toLowerCase().replace(/[^a-z0-9]/g, '')}
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-800 text-slate-300">
                <p className="font-semibold text-white">What users see on this page:</p>
                <div className="space-y-1 text-[11px] text-slate-400">
                  <p>&bull; List of all verified social media accounts with blue check verification.</p>
                  <p>&bull; Official Google Play and iOS App Store package IDs.</p>
                  <p>&bull; Verified corporate website and email domains.</p>
                  <p>&bull; 1-click authenticity tester for suspicious customer SMS or links.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(`https://verify.brandguard.io/${brand.toLowerCase().replace(/[^a-z0-9]/g, '')}`);
                  showToast('Public verify link copied to clipboard', 'success');
                  setIsVerifyModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors"
              >
                Copy Public URL
              </button>
              <button
                onClick={() => setIsVerifyModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
