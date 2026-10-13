import React, { useState, useEffect } from 'react';
import { Finding } from '../../types';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Film, 
  Globe, 
  Share2, 
  Smartphone, 
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Layers,
  FileCheck2
} from 'lucide-react';

interface ReplayEvent {
  step: number;
  stageName: string;
  relativeTime: string;
  exactDate: string;
  icon: React.ComponentType<{ className?: string }>;
  headline: string;
  narrative: string;
  connectedEntity: {
    type: 'domain' | 'profile' | 'branding' | 'link' | 'app' | 'review';
    label: string;
    value: string;
  };
  threatLevel: 'Critical' | 'High' | 'Medium' | 'Low';
}

interface CampaignReplayPanelProps {
  finding: Finding;
}

export const CampaignReplayPanel: React.FC<CampaignReplayPanelProps> = ({ finding }) => {
  const brandName = finding.lookalike?.official || 'AcmePay';
  const cleanBrand = brandName.toLowerCase().replace(/[^a-z0-9]/g, '');

  const events: ReplayEvent[] = [
    {
      step: 1,
      stageName: 'Similar Name Appeared',
      relativeTime: 'Day -14',
      exactDate: '14 days ago &bull; 04:12 UTC',
      icon: Globe,
      headline: `Typosquat Domain Registered: ${finding.candidateWebsite || `${cleanBrand}-auth.xyz`}`,
      narrative: 'Threat actor registered lookalike infrastructure using an anonymized registrar proxy. Name matching algorithm scored 92% similarity against official trademark.',
      connectedEntity: {
        type: 'domain',
        label: 'Domain Infrastructure',
        value: finding.candidateWebsite || `${cleanBrand}-auth.xyz`,
      },
      threatLevel: 'Medium',
    },
    {
      step: 2,
      stageName: 'Social Profile Created',
      relativeTime: 'Day -10',
      exactDate: '10 days ago &bull; 11:28 UTC',
      icon: Share2,
      headline: `Deceptive Handle Registered: @${finding.usernameOrPackage}`,
      narrative: `Profile initialized on ${finding.platform}. Bio text initially configured with empty placeholders before staging active brand assets.`,
      connectedEntity: {
        type: 'profile',
        label: 'Candidate Handle',
        value: `@${finding.usernameOrPackage}`,
      },
      threatLevel: 'High',
    },
    {
      step: 3,
      stageName: 'Logo & Description Copied',
      relativeTime: 'Day -8',
      exactDate: '8 days ago &bull; 17:45 UTC',
      icon: Sparkles,
      headline: 'Official Corporate Logo Scraped & Re-uploaded',
      narrative: `Official ${brandName} high-resolution brand mark uploaded to profile picture. Vector analysis shows minor 12-degree color shift applied to evade hash detection.`,
      connectedEntity: {
        type: 'branding',
        label: 'Altered Brand Mark',
        value: 'Official Logo Tint Shifted',
      },
      threatLevel: 'High',
    },
    {
      step: 4,
      stageName: 'Suspicious Link Added',
      relativeTime: 'Day -5',
      exactDate: '5 days ago &bull; 09:14 UTC',
      icon: AlertTriangle,
      headline: 'Credential Harvester Link Inserted in Bio',
      narrative: `Bio URL updated from blank to ${finding.candidateUrl}. Landing page renders a pixel-perfect replica of the customer sign-in portal.`,
      connectedEntity: {
        type: 'link',
        label: 'Phishing Redirect URL',
        value: finding.candidateUrl,
      },
      threatLevel: 'Critical',
    },
    {
      step: 5,
      stageName: 'Scam Message Published',
      relativeTime: 'Day -3',
      exactDate: '3 days ago &bull; 14:02 UTC',
      icon: Film,
      headline: 'Mass Outbound Direct Message Phishing Wave',
      narrative: 'Automated bot activity detected sending urgent security warning messages to 1,200+ followers, coercing them to submit mobile OTP verification codes.',
      connectedEntity: {
        type: 'profile',
        label: 'Bot Telemetry',
        value: '1,200+ Outbound DMs Detected',
      },
      threatLevel: 'Critical',
    },
    {
      step: 6,
      stageName: 'Related App Detected',
      relativeTime: 'Day -1',
      exactDate: 'Yesterday &bull; 21:50 UTC',
      icon: Smartphone,
      headline: 'Malicious Android APK Mirror Discovered',
      narrative: `Third-party APK repository indexed an unsigned package containing SMS interception capabilities tied to the same domain host IP.`,
      connectedEntity: {
        type: 'app',
        label: 'Connected Android APK',
        value: `com.${cleanBrand}.fastpay.apk`,
      },
      threatLevel: 'Critical',
    },
    {
      step: 7,
      stageName: 'Finding Reviewed',
      relativeTime: 'Today',
      exactDate: `${finding.detectedTime} &bull; Security Desk`,
      icon: FileCheck2,
      headline: `BrandGuard Automated Correlation Flagged Threat (Score ${finding.riskScore}/100)`,
      narrative: `Multi-signal engine aggregated domain, logo variance, and handle similarities into high-priority alert. Currently assigned to analyst review.`,
      connectedEntity: {
        type: 'review',
        label: 'Analyst Triage Status',
        value: `Status: ${finding.status}`,
      },
      threatLevel: 'Critical',
    },
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Auto-play timeline ticker
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= events.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, events.length]);

  const currentEvent = events[currentStepIndex];
  const EventIcon = currentEvent.icon;

  const handleNext = () => {
    if (currentStepIndex < events.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  return (
    <section className="p-5 rounded-2xl bg-navy-850/90 border border-slate-800 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Film className="w-4 h-4" />
            </span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Campaign Replay & Attack Evolution Timeline
            </h3>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
              Demo data
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Playable chronological reconstruction showing how this threat infrastructure was stood up step-by-step.
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Replay</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="p-1.5 rounded-lg bg-navy-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            title="Previous event"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleNext}
            disabled={currentStepIndex === events.length - 1}
            className="p-1.5 rounded-lg bg-navy-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            title="Next event"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-navy-950 border border-slate-800 text-slate-400 hover:text-cyan-300"
            title="Restart replay from beginning"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Stepper Scrubber Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] text-slate-400">
          <span>Step {currentStepIndex + 1} of {events.length}: <strong className="text-white">{currentEvent.stageName}</strong></span>
          <span className="font-mono text-cyan-400">{currentEvent.relativeTime}</span>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {events.map((ev, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <button
                key={ev.step}
                onClick={() => {
                  setCurrentStepIndex(idx);
                  setIsPlaying(false);
                }}
                className={`h-2 rounded-full transition-all ${
                  isCurrent
                    ? 'bg-cyan-400 ring-2 ring-cyan-500/50'
                    : isCompleted
                    ? 'bg-cyan-700 hover:bg-cyan-600'
                    : 'bg-slate-800 hover:bg-slate-700'
                }`}
                title={`Step ${ev.step}: ${ev.stageName}`}
              />
            );
          })}
        </div>
      </div>

      {/* Active Event Showcase Card */}
      <div className="p-4 rounded-xl bg-navy-950 border border-slate-800 space-y-3 animate-in fade-in duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              <EventIcon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 block">
                {currentEvent.exactDate}
              </span>
              <h4 className="text-sm font-bold text-white">
                {currentEvent.headline}
              </h4>
            </div>
          </div>

          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase self-start sm:self-auto ${
            currentEvent.threatLevel === 'Critical'
              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
              : currentEvent.threatLevel === 'High'
              ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
          }`}>
            {currentEvent.threatLevel} Event
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          {currentEvent.narrative}
        </p>

        {/* Connected Entity Badge */}
        <div className="p-2.5 rounded-lg bg-navy-900 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">
            Connected {currentEvent.connectedEntity.label}:
          </span>
          <span className="font-mono text-cyan-300 font-semibold bg-navy-950 px-2 py-0.5 rounded border border-slate-700/80">
            {currentEvent.connectedEntity.value}
          </span>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-navy-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Timeline reconstructed from DNS passive history, social scraper telemetry, and APK manifests.</span>
        <span className="italic">Demo timestamps &bull; Replay based on available evidence.</span>
      </div>
    </section>
  );
};
