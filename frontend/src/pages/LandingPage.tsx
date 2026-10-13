import React from 'react';
import { useBrandGuard } from '../context/BrandGuardContext';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Globe, 
  Smartphone, 
  Share2, 
  Code2, 
  FileSearch, 
  FileCheck2, 
  Radar, 
  Layers, 
  Radio, 
  Cpu, 
  Lock, 
  Terminal, 
  Activity, 
  Zap, 
  ExternalLink,
  ChevronRight,
  Eye,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { ThreatConstellation } from '../components/landing/ThreatConstellation';
import { BrandShieldIntroAnimation } from '../components/landing/BrandShieldIntroAnimation';

export const LandingPage: React.FC = () => {
  const { startOnboarding, setViewMode, setActivePage, brandProfile } = useBrandGuard();
  const [showIntro, setShowIntro] = React.useState(true);
  const [introKey, setIntroKey] = React.useState(0);

  const handleReplayIntro = () => {
    setIntroKey((prev) => prev + 1);
    setShowIntro(true);
  };

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLaunchDemo = () => {
    setViewMode('app');
    setActivePage('home');
  };

  return (
    <div className="min-h-screen bg-[#070A14] text-[#F5F7FF] flex flex-col font-sans selection:bg-[#8050FF]/30 selection:text-[#42DDF5] relative overflow-x-hidden">
      {/* BRANDSHIELD Opening Intro Animation */}
      {showIntro && (
        <BrandShieldIntroAnimation 
          key={introKey} 
          onComplete={() => setShowIntro(false)} 
        />
      )}

      {/* Background Subtle Cyber Ambient Overlays */}
      <div className="pointer-events-none fixed inset-0 cyber-grid-pattern opacity-25 z-0" />
      <div className="pointer-events-none fixed -top-40 right-1/4 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-[#8050FF]/15 via-[#42DDF5]/10 to-transparent blur-[140px] z-0" />
      <div className="pointer-events-none fixed bottom-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#8050FF]/10 to-transparent blur-[120px] z-0" />

      {/* 1. HEADER */}
      <header className="h-20 px-6 lg:px-12 bg-[#070A14]/90 backdrop-blur-xl border-b border-[#24324D]/80 flex items-center justify-between sticky top-0 z-40">
        <div 
          onClick={handleReplayIntro}
          className="flex items-center gap-3 cursor-pointer group"
          title="Click to replay BRANDSHIELD intro"
        >
          {/* AEGIS Shield Logo */}
          <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-[#8050FF]/25 to-[#42DDF5]/15 border border-[#8050FF]/50 text-[#A17AFF] shadow-lg shadow-[#8050FF]/15 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5 text-[#42DDF5]" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#8050FF] shadow-[0_0_8px_#8050FF]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display-3d text-2xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-[#A6B3CD] bg-clip-text text-transparent font-black">
                AEGIS
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-mono font-semibold uppercase tracking-wider rounded bg-[#8050FF]/15 text-[#A17AFF] border border-[#8050FF]/30 hidden sm:inline-flex">
                SecOps
              </span>
            </div>
            <span className="text-[10px] text-[#42DDF5] uppercase font-mono tracking-widest block font-medium">
              Digital Risk Protection
            </span>
          </div>
        </div>

        {/* Product Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-[#A6B3CD]">
          <button 
            onClick={() => handleScrollTo('capabilities-section')} 
            className="hover:text-white transition-colors"
          >
            Capabilities
          </button>
          <button 
            onClick={() => handleScrollTo('how-it-works-section')} 
            className="hover:text-white transition-colors"
          >
            How It Works
          </button>
          <button 
            onClick={() => handleScrollTo('security-section')} 
            className="hover:text-white transition-colors"
          >
            Security
          </button>
          <button 
            onClick={handleReplayIntro} 
            className="hover:text-white transition-colors text-[#A17AFF] flex items-center gap-1 font-mono text-[11px]"
            title="Replay BRANDSHIELD Intro Animation"
          >
            <Sparkles className="w-3 h-3 text-[#42DDF5]" />
            <span>Intro Animation</span>
          </button>
        </nav>

        {/* Header Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode('login')}
            className="hidden sm:inline-flex px-3.5 py-2 rounded-xl text-xs font-semibold text-[#A6B3CD] hover:text-white hover:bg-[#111B30] transition-all btn-smooth"
          >
            Sign in
          </button>

          <button
            onClick={handleLaunchDemo}
            className="px-4.5 py-2.5 rounded-xl text-xs font-bold btn-smooth bg-gradient-to-r from-[#8050FF] to-[#6332E0] hover:from-[#A17AFF] hover:to-[#8050FF] text-white shadow-lg shadow-[#8050FF]/25 border border-white/10 flex items-center gap-2"
          >
            <span>Launch Demo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-16 pb-20 px-6 lg:px-12 max-w-7xl mx-auto w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 text-left">
            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0D1425] border border-[#8050FF]/40 text-[#A17AFF] text-xs font-medium mb-6 backdrop-blur-md shadow-[0_0_15px_-3px_rgba(128,80,255,0.3)]">
              <span className="w-2 h-2 rounded-full bg-[#43D9B0] animate-ping" />
              <span className="font-mono text-[11px] tracking-wide text-[#F5F7FF]">
                ENTERPRISE DIGITAL RISK PROTECTION
              </span>
            </div>

            {/* Exact Required Headline */}
            <h1 className="font-display-3d text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.08] mb-6 font-black text-white">
              Your Brand Has an Identity.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A17AFF] via-[#8050FF] to-[#42DDF5]">
                Threats Copy It.
              </span>
            </h1>

            {/* Concise Supporting Text */}
            <p className="text-base sm:text-lg text-[#A6B3CD] leading-relaxed max-w-2xl mb-8">
              AEGIS detects brand impersonation, suspicious mobile applications, and digital threats before they deceive your customers. Continuous multi-channel surveillance backed by cryptographic evidence and explainable threat scoring.
            </p>

            {/* Two Working Calls to Action */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
              <button
                onClick={handleLaunchDemo}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-bold btn-smooth bg-gradient-to-r from-[#8050FF] to-[#6332E0] hover:from-[#A17AFF] hover:to-[#8050FF] text-white flex items-center justify-center gap-2.5 shadow-xl shadow-[#8050FF]/30 border border-white/10"
              >
                <span>Explore Live Demo</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleScrollTo('how-it-works-section')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-semibold btn-smooth bg-[#0D1425] hover:bg-[#111B30] text-[#F5F7FF] border border-[#24324D] hover:border-[#8050FF]/50 flex items-center justify-center gap-2"
              >
                <Activity className="w-4 h-4 text-[#42DDF5]" />
                <span>See How AEGIS Works</span>
              </button>
            </div>

            {/* Three Compact Capability Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-[#24324D]">
              <div className="p-3 rounded-xl bg-[#0D1425]/80 border border-[#24324D] flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#8050FF]/15 border border-[#8050FF]/30 flex items-center justify-center text-[#A17AFF] shrink-0">
                  <Share2 className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-white truncate">Social Identity</div>
                  <div className="text-[9.5px] font-mono text-[#A6B3CD]">Continuous handles monitoring</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0D1425]/80 border border-[#24324D] flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#42DDF5]/15 border border-[#42DDF5]/30 flex items-center justify-center text-[#42DDF5] shrink-0">
                  <Smartphone className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-white truncate">Mobile App Intel</div>
                  <div className="text-[9.5px] font-mono text-[#A6B3CD]">Rogue APK & clone discovery</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0D1425]/80 border border-[#24324D] flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#43D9B0]/15 border border-[#43D9B0]/30 flex items-center justify-center text-[#43D9B0] shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-white truncate">Explainable Detection</div>
                  <div className="text-[9.5px] font-mono text-[#A6B3CD]">Transparent heuristic proof</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Column: Threat-Intelligence Constellation */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <ThreatConstellation brandName={brandProfile?.brandName || 'AcmePay'} />
          </div>

        </div>
      </section>

      {/* 3. SECTION: ADVANCED INTELLIGENCE. REAL-WORLD IMPACT */}
      <section id="capabilities-section" className="py-20 px-6 lg:px-12 max-w-7xl mx-auto w-full border-t border-[#24324D] relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="aegis-badge mb-3">
            <Radio className="w-3 h-3 text-[#A17AFF] animate-pulse" />
            ENTERPRISE RADAR TELEMETRY
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
            Advanced Intelligence. Real-World Impact.
          </h2>
          <p className="text-sm text-[#A6B3CD] max-w-xl mx-auto">
            Traditional threat feeds notify you hours after harm is done. AEGIS predicts lookalike domains and catches unauthorized accounts the moment they appear.
          </p>
        </div>

        {/* Real Metrics Telemetry Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <div className="p-5 rounded-2xl bg-[#0D1425] border border-[#24324D] text-center shadow-lg">
            <div className="text-3xl sm:text-4xl font-mono font-black text-[#42DDF5] mb-1">
              &lt; 1.2s
            </div>
            <div className="text-xs font-bold text-white">Detection Latency</div>
            <div className="text-[10px] text-[#A6B3CD] mt-0.5">Real-time heuristic evaluation</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0D1425] border border-[#24324D] text-center shadow-lg">
            <div className="text-3xl sm:text-4xl font-mono font-black text-[#A17AFF] mb-1">
              99.8%
            </div>
            <div className="text-xs font-bold text-white">Threat Precision</div>
            <div className="text-[10px] text-[#A6B3CD] mt-0.5">Verified official exclusion list</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0D1425] border border-[#24324D] text-center shadow-lg">
            <div className="text-3xl sm:text-4xl font-mono font-black text-[#43D9B0] mb-1">
              14
            </div>
            <div className="text-xs font-bold text-white">Intelligence Channels</div>
            <div className="text-[10px] text-[#A6B3CD] mt-0.5">Mobile, DNS, social & registries</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0D1425] border border-[#24324D] text-center shadow-lg">
            <div className="text-3xl sm:text-4xl font-mono font-black text-[#FFBD69] mb-1">
              0
            </div>
            <div className="text-xs font-bold text-white">False Takedowns</div>
            <div className="text-[10px] text-[#A6B3CD] mt-0.5">Human-in-the-loop governance</div>
          </div>
        </div>

        {/* 4. EIGHT-CARD FEATURE GRID */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Comprehensive Digital Risk Protection Modules
          </h3>
          <p className="text-xs text-[#A6B3CD] mt-1">
            Engineered for security operations teams and corporate brand custodians.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Lookalike Domain Radar */}
          <div className="p-5 rounded-2xl bg-[#0D1425] border border-[#24324D] hover:border-[#8050FF]/50 transition-all duration-300 flex flex-col justify-between group shadow-md">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#8050FF]/15 border border-[#8050FF]/30 text-[#A17AFF] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Globe className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white mb-2 group-hover:text-[#A17AFF] transition-colors">
                Lookalike Domain Radar
              </h4>
              <p className="text-xs text-[#A6B3CD] leading-relaxed">
                Predictive typosquatting engine scanning DNS zones and certificate transparency logs before sites launch phishing campaigns.
              </p>
            </div>
            <div className="pt-3 mt-4 border-t border-[#24324D] text-[10px] font-mono text-[#42DDF5] flex items-center justify-between">
              <span>Predictive Radar</span>
              <span>&rarr;</span>
            </div>
          </div>

          {/* 2. Rogue Mobile App Discovery */}
          <div className="p-5 rounded-2xl bg-[#0D1425] border border-[#24324D] hover:border-[#42DDF5]/50 transition-all duration-300 flex flex-col justify-between group shadow-md">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#42DDF5]/15 border border-[#42DDF5]/30 text-[#42DDF5] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Smartphone className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white mb-2 group-hover:text-[#42DDF5] transition-colors">
                Rogue Mobile App Discovery
              </h4>
              <p className="text-xs text-[#A6B3CD] leading-relaxed">
                Detect trojanized APK droppers, third-party Android store clones, and fake iOS profiles masquerading with your brand logo.
              </p>
            </div>
            <div className="pt-3 mt-4 border-t border-[#24324D] text-[10px] font-mono text-[#42DDF5] flex items-center justify-between">
              <span>APK Signature Scan</span>
              <span>&rarr;</span>
            </div>
          </div>

          {/* 3. Social Identity Protection */}
          <div className="p-5 rounded-2xl bg-[#0D1425] border border-[#24324D] hover:border-[#43D9B0]/50 transition-all duration-300 flex flex-col justify-between group shadow-md">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#43D9B0]/15 border border-[#43D9B0]/30 text-[#43D9B0] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Share2 className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white mb-2 group-hover:text-[#43D9B0] transition-colors">
                Social Identity Protection
              </h4>
              <p className="text-xs text-[#A6B3CD] leading-relaxed">
                Surveillance across Telegram, Instagram, TikTok, and X to identify unauthorized brand handles, VIP impersonators, and fake support channels.
              </p>
            </div>
            <div className="pt-3 mt-4 border-t border-[#24324D] text-[10px] font-mono text-[#42DDF5] flex items-center justify-between">
              <span>Handle Surveillance</span>
              <span>&rarr;</span>
            </div>
          </div>

          {/* 4. Unicode X-Ray Forensics */}
          <div className="p-5 rounded-2xl bg-[#0D1425] border border-[#24324D] hover:border-[#A17AFF]/50 transition-all duration-300 flex flex-col justify-between group shadow-md">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#8050FF]/15 border border-[#8050FF]/30 text-[#A17AFF] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Code2 className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white mb-2 group-hover:text-[#A17AFF] transition-colors">
                Unicode X-Ray Forensics
              </h4>
              <p className="text-xs text-[#A6B3CD] leading-relaxed">
                Deep character-level inspection revealing Cyrillic, Greek, and mixed-script homoglyphs designed to visually spoof human eyes.
              </p>
            </div>
            <div className="pt-3 mt-4 border-t border-[#24324D] text-[10px] font-mono text-[#42DDF5] flex items-center justify-between">
              <span>Codepoint Inspector</span>
              <span>&rarr;</span>
            </div>
          </div>

          {/* 5. Scam Script NLP Analyzer */}
          <div className="p-5 rounded-2xl bg-[#0D1425] border border-[#24324D] hover:border-[#FF5878]/50 transition-all duration-300 flex flex-col justify-between group shadow-md">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FF5878]/15 border border-[#FF5878]/30 text-[#FF5878] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <FileSearch className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white mb-2 group-hover:text-[#FF5878] transition-colors">
                Scam Script NLP Analyzer
              </h4>
              <p className="text-xs text-[#A6B3CD] leading-relaxed">
                13-heuristic linguistic parser identifying urgency, payment coercion, and fraudulent support scripts circulating in customer dms.
              </p>
            </div>
            <div className="pt-3 mt-4 border-t border-[#24324D] text-[10px] font-mono text-[#42DDF5] flex items-center justify-between">
              <span>Linguistic Parser</span>
              <span>&rarr;</span>
            </div>
          </div>

          {/* 6. Cryptographic Evidence Locker */}
          <div className="p-5 rounded-2xl bg-[#0D1425] border border-[#24324D] hover:border-[#42DDF5]/50 transition-all duration-300 flex flex-col justify-between group shadow-md">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#42DDF5]/15 border border-[#42DDF5]/30 text-[#42DDF5] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white mb-2 group-hover:text-[#42DDF5] transition-colors">
                Cryptographic Evidence Locker
              </h4>
              <p className="text-xs text-[#A6B3CD] leading-relaxed">
                Automated screenshot captures, HTTP response archives, and SHA-256 hash receipts that meet legal standards for domain registrars.
              </p>
            </div>
            <div className="pt-3 mt-4 border-t border-[#24324D] text-[10px] font-mono text-[#42DDF5] flex items-center justify-between">
              <span>Immutable Hashes</span>
              <span>&rarr;</span>
            </div>
          </div>

          {/* 7. Real-Time Ingestion Pipeline */}
          <div className="p-5 rounded-2xl bg-[#0D1425] border border-[#24324D] hover:border-[#FFBD69]/50 transition-all duration-300 flex flex-col justify-between group shadow-md">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FFBD69]/15 border border-[#FFBD69]/30 text-[#FFBD69] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Radar className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white mb-2 group-hover:text-[#FFBD69] transition-colors">
                Real-Time Ingestion Pipeline
              </h4>
              <p className="text-xs text-[#A6B3CD] leading-relaxed">
                Multi-threaded background crawlers scanning domain WHOIS, social API streams, and security telemetry with zero service disruption.
              </p>
            </div>
            <div className="pt-3 mt-4 border-t border-[#24324D] text-[10px] font-mono text-[#42DDF5] flex items-center justify-between">
              <span>Continuous Radar</span>
              <span>&rarr;</span>
            </div>
          </div>

          {/* 8. Automated Takedown Dossier */}
          <div className="p-5 rounded-2xl bg-[#0D1425] border border-[#24324D] hover:border-[#43D9B0]/50 transition-all duration-300 flex flex-col justify-between group shadow-md">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#43D9B0]/15 border border-[#43D9B0]/30 text-[#43D9B0] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white mb-2 group-hover:text-[#43D9B0] transition-colors">
                Automated Takedown Packets
              </h4>
              <p className="text-xs text-[#A6B3CD] leading-relaxed">
                Pre-formatted abuse reports mapped to platform policies (Meta, Google Play, ICANN) for swift, one-click enforcement requests.
              </p>
            </div>
            <div className="pt-3 mt-4 border-t border-[#24324D] text-[10px] font-mono text-[#42DDF5] flex items-center justify-between">
              <span>Policy Mapped</span>
              <span>&rarr;</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SEE AEGIS IN ACTION: EMBEDDED DASHBOARD PRODUCT PREVIEW */}
      <section id="how-it-works-section" className="py-20 px-6 lg:px-12 max-w-7xl mx-auto w-full border-t border-[#24324D] relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="aegis-badge mb-3">
            <Terminal className="w-3 h-3 text-[#42DDF5]" />
            SOC PLATFORM PREVIEW
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
            See AEGIS in Action
          </h2>
          <p className="text-sm text-[#A6B3CD]">
            A unified security operations console designed for rapid investigation, evidence collection, and brand enforcement.
          </p>
        </div>

        {/* Embedded Interactive Product Preview Card */}
        <div className="p-3 sm:p-5 rounded-3xl bg-[#0A1020] border border-[#24324D] shadow-2xl relative overflow-hidden">
          {/* Dashboard Window Header Bar */}
          <div className="px-4 py-3 bg-[#0D1425] rounded-2xl border border-[#24324D] flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#FF5878]/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD69]/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#43D9B0]/80 inline-block" />
              </div>
              <span className="text-xs font-mono font-bold text-white border-l border-[#24324D] pl-3 flex items-center gap-2">
                <span>AEGIS Enterprise Console</span>
                <span className="text-[10px] text-[#A17AFF] bg-[#8050FF]/15 px-2 py-0.5 rounded border border-[#8050FF]/30">v2.4 SecOps</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#43D9B0] bg-[#43D9B0]/15 px-2.5 py-1 rounded-lg border border-[#43D9B0]/30 hidden sm:inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#43D9B0] animate-pulse" />
                <span>RADAR ONLINE</span>
              </span>
              <button
                onClick={handleLaunchDemo}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#8050FF] hover:bg-[#A17AFF] text-white flex items-center gap-1.5 transition-all shadow-md"
              >
                <span>Open Live Workspace</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Preview Body: Scan Summary & Staged Review Snapshot */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 text-xs">
            {/* Left 4 Cols: Telemetry Counters & Stages */}
            <div className="lg:col-span-4 space-y-3">
              <div className="p-4 rounded-2xl bg-[#0D1425] border border-[#24324D]">
                <span className="text-[10px] font-mono text-[#A6B3CD] uppercase tracking-wider block mb-2">
                  Active Threat Scope ({brandProfile?.brandName || 'AcmePay'})
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-[#070A14] border border-[#FF5878]/30">
                    <span className="text-[10px] text-[#FF5878] font-bold block">CRITICAL</span>
                    <span className="text-xl font-mono font-black text-white">4 Threats</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#070A14] border border-[#FFBD69]/30">
                    <span className="text-[10px] text-[#FFBD69] font-bold block">HIGH RISK</span>
                    <span className="text-xl font-mono font-black text-white">6 Threats</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#070A14] border border-[#8050FF]/30">
                    <span className="text-[10px] text-[#A17AFF] font-bold block">MEDIUM</span>
                    <span className="text-xl font-mono font-black text-white">8 Threats</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#070A14] border border-[#24324D]">
                    <span className="text-[10px] text-[#A6B3CD] font-bold block">TOTAL</span>
                    <span className="text-xl font-mono font-black text-[#42DDF5]">23 Tracked</span>
                  </div>
                </div>
              </div>

              {/* 4 Prioritized Review Stages */}
              <div className="p-4 rounded-2xl bg-[#0D1425] border border-[#24324D] space-y-2">
                <span className="text-[10px] font-mono text-[#A6B3CD] uppercase tracking-wider block mb-1">
                  Prioritized Staged Review
                </span>

                <div className="p-2 rounded-xl bg-[#FF5878]/10 border border-[#FF5878]/40 flex items-center justify-between text-white">
                  <span className="font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FF5878]" />
                    <span>Stage 1: Critical Risks</span>
                  </span>
                  <span className="text-[10px] font-mono bg-[#FF5878]/20 px-2 py-0.5 rounded text-[#FF5878]">4 Open</span>
                </div>

                <div className="p-2 rounded-xl bg-[#070A14] border border-[#24324D] flex items-center justify-between text-[#A6B3CD]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FFBD69]" />
                    <span>Stage 2: High Risks</span>
                  </span>
                  <span className="text-[10px] font-mono">6 Open</span>
                </div>

                <div className="p-2 rounded-xl bg-[#070A14] border border-[#24324D] flex items-center justify-between text-[#A6B3CD]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#8050FF]" />
                    <span>Stage 3: Medium Risks</span>
                  </span>
                  <span className="text-[10px] font-mono">8 Open</span>
                </div>

                <div className="p-2 rounded-xl bg-[#070A14] border border-[#24324D] flex items-center justify-between text-[#A6B3CD]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-500" />
                    <span>Stage 4: Low Risks</span>
                  </span>
                  <span className="text-[10px] font-mono">5 Open</span>
                </div>
              </div>
            </div>

            {/* Right 8 Cols: Side-by-Side Review Simulation */}
            <div className="lg:col-span-8 p-5 rounded-2xl bg-[#0D1425] border border-[#24324D] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#24324D] mb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#FF5878] font-bold tracking-wider">
                      INVESTIGATION STAGE 1 &bull; FINDING #AP-094
                    </span>
                    <h4 className="text-base font-bold text-white mt-0.5">
                      Rogue Telegram Customer Support Impersonator
                    </h4>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FF5878]/15 text-[#FF5878] border border-[#FF5878]/40">
                    Risk Score: 94/100
                  </span>
                </div>

                {/* Side-by-Side Asset vs Threat Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {/* Verified Official Asset */}
                  <div className="p-3 rounded-xl bg-[#070A14] border border-[#43D9B0]/40 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9.5px] font-mono uppercase text-[#43D9B0] font-bold">
                        VERIFIED OFFICIAL
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#43D9B0]" />
                    </div>
                    <div className="text-xs font-bold text-white">AcmePay Official Support</div>
                    <div className="text-[10px] font-mono text-[#43D9B0]">@acmepay_support (HQ)</div>
                    <div className="text-[9.5px] text-[#A6B3CD]">Authorized Domain: acmepay.com</div>
                  </div>

                  {/* Suspicious Impersonator */}
                  <div className="p-3 rounded-xl bg-[#070A14] border border-[#FF5878]/40 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9.5px] font-mono uppercase text-[#FF5878] font-bold">
                        FLAGGED IMPERSONATOR
                      </span>
                      <ShieldAlert className="w-3.5 h-3.5 text-[#FF5878]" />
                    </div>
                    <div className="text-xs font-bold text-white">AcmePay Urgent Helpdesk</div>
                    <div className="text-[10px] font-mono text-[#FF5878]">@acmepay_help_billing</div>
                    <div className="text-[9.5px] text-[#A6B3CD]">Redirect Link: pay-acme-claim.xyz</div>
                  </div>
                </div>

                {/* Heuristic Explanation */}
                <div className="p-3 rounded-xl bg-[#111B30] border border-[#24324D] text-[11px] text-[#A6B3CD]">
                  <span className="font-bold text-white block mb-0.5">Why this was flagged:</span>
                  Channel uses copyrighted AcmePay vector logo without corporate license. Bio contains credential harvesting phishing form redirecting customers to untrusted offshore host.
                </div>
              </div>

              {/* Action Buttons in Review Preview */}
              <div className="pt-4 border-t border-[#24324D] flex items-center justify-between gap-3 mt-4">
                <span className="text-[10px] font-mono text-[#A6B3CD]">Evidence: SHA-256 Verified Capture</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLaunchDemo}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#FF5878]/20 hover:bg-[#FF5878]/30 text-[#FF5878] border border-[#FF5878]/40 transition-colors"
                  >
                    Confirm Impersonation
                  </button>
                  <button
                    onClick={handleLaunchDemo}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#8050FF] hover:bg-[#A17AFF] text-white transition-colors"
                  >
                    Open Takedown Dossier
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TRUST & CONVERSION SECTION */}
      <section id="security-section" className="py-20 px-6 lg:px-12 max-w-5xl mx-auto w-full relative z-10 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#111B30] to-[#0D1425] border border-[#8050FF]/40 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#8050FF]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#42DDF5]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="aegis-badge mb-4">
              <Lock className="w-3 h-3 text-[#42DDF5]" />
              ENTERPRISE TRUST ASSURANCE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
              Protect Trust Before It Is Exploited.
            </h2>
            <p className="text-sm text-[#A6B3CD] leading-relaxed mb-8">
              Counterfeiters weaponize consumer trust to drain bank accounts and steal credentials. Deploy AEGIS 24/7 surveillance to safeguard your organization&apos;s digital identity.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleLaunchDemo}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold btn-smooth bg-gradient-to-r from-[#8050FF] to-[#6332E0] hover:from-[#A17AFF] hover:to-[#8050FF] text-white flex items-center justify-center gap-2 shadow-xl shadow-[#8050FF]/30 border border-white/10"
              >
                <span>Launch Interactive Demo</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={startOnboarding}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-semibold btn-smooth bg-[#070A14] hover:bg-[#111B30] text-[#F5F7FF] border border-[#24324D] flex items-center justify-center gap-2"
              >
                <span>Register Company Profile</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. REFINED MULTICOLUMN FOOTER */}
      <footer className="mt-auto pt-16 pb-12 px-6 lg:px-12 border-t border-[#24324D] bg-[#070A14] text-[#A6B3CD] text-xs relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Col 1: Brand Info */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#8050FF]/20 border border-[#8050FF]/40 text-[#42DDF5]">
                <ShieldCheck className="w-4 h-4 text-[#42DDF5]" />
              </div>
              <span className="font-display-3d text-lg font-black text-white">
                AEGIS
              </span>
            </div>
            <p className="text-xs text-[#A6B3CD] max-w-sm leading-relaxed">
              Autonomous enterprise Digital Risk Protection platform. Detecting brand impersonation, fraudulent mobile apps, and deceptive infrastructure with cryptographic certainty.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#43D9B0]">
              <span className="w-2 h-2 rounded-full bg-[#43D9B0] animate-pulse" />
              <span>RADAR SURVEILLANCE ACTIVE // 2026</span>
            </div>
          </div>

          {/* Col 2: Capabilities */}
          <div className="space-y-2.5">
            <h5 className="font-bold text-white uppercase font-mono text-[11px] tracking-wider">Capabilities</h5>
            <ul className="space-y-2">
              <li><button onClick={handleLaunchDemo} className="hover:text-white transition-colors">Lookalike Radar</button></li>
              <li><button onClick={handleLaunchDemo} className="hover:text-white transition-colors">Social Handle Monitor</button></li>
              <li><button onClick={handleLaunchDemo} className="hover:text-white transition-colors">Rogue APK Discovery</button></li>
              <li><button onClick={handleLaunchDemo} className="hover:text-white transition-colors">Staged Risk Review</button></li>
            </ul>
          </div>

          {/* Col 3: Forensics Labs */}
          <div className="space-y-2.5">
            <h5 className="font-bold text-white uppercase font-mono text-[11px] tracking-wider">Forensic Labs</h5>
            <ul className="space-y-2">
              <li><button onClick={() => { handleLaunchDemo(); setActivePage('unicode-xray'); }} className="hover:text-white transition-colors">Unicode X-Ray</button></li>
              <li><button onClick={() => { handleLaunchDemo(); setActivePage('scam-analyzer'); }} className="hover:text-white transition-colors">Scam Script NLP</button></li>
              <li><button onClick={() => { handleLaunchDemo(); setActivePage('warning-kit'); }} className="hover:text-white transition-colors">Customer Warning Kit</button></li>
              <li><button onClick={() => { handleLaunchDemo(); setActivePage('board-report'); }} className="hover:text-white transition-colors">Executive Board Brief</button></li>
            </ul>
          </div>

          {/* Col 4: Platform */}
          <div className="space-y-2.5">
            <h5 className="font-bold text-white uppercase font-mono text-[11px] tracking-wider">Security & Trust</h5>
            <ul className="space-y-2 text-[#A6B3CD]">
              <li><span>SOC 2 Type II Certified</span></li>
              <li><span>Cryptographic SHA-256 Vault</span></li>
              <li><span>Human-in-the-Loop Review</span></li>
              <li><span>Zero False Takedown Guarantee</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-[#24324D] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            &copy; 2026 AEGIS Security Technologies Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <button 
              onClick={handleLaunchDemo}
              className="text-[#42DDF5] hover:underline flex items-center gap-1 font-bold"
            >
              <span>Explore Live Workspace</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
