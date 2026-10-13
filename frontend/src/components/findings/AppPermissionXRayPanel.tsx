import React from 'react';
import { Finding, RiskSeverity } from '../../types';
import { 
  Smartphone, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  BarChart3,
  Layers,
  Lock
} from 'lucide-react';

interface AppPermission {
  name: string;
  plainMeaning: string;
  severity: RiskSeverity;
  whyItMatters: string;
  status: 'Unusual for payment app' | 'High-Risk Spyware Pattern' | 'Standard Permission';
  isAbuseCommon: boolean;
}

interface AppPermissionXRayPanelProps {
  finding: Finding;
}

export const AppPermissionXRayPanel: React.FC<AppPermissionXRayPanelProps> = ({ finding }) => {
  // Demo parsed Android manifest permissions
  const permissions: AppPermission[] = [
    {
      name: 'android.permission.READ_SMS',
      plainMeaning: 'May read incoming SMS messages, including One-Time Passcodes (OTPs).',
      severity: 'critical',
      whyItMatters: 'Malware intercepts financial 2FA OTP codes to authorize unauthorized wire transfers without victim notice.',
      status: 'High-Risk Spyware Pattern',
      isAbuseCommon: true,
    },
    {
      name: 'android.permission.SYSTEM_ALERT_WINDOW',
      plainMeaning: 'May draw floating overlays on top of other applications, including legit banking screens.',
      severity: 'critical',
      whyItMatters: 'Enables overlay attacks: draws a fake login credential prompt over the real banking app when launched.',
      status: 'High-Risk Spyware Pattern',
      isAbuseCommon: true,
    },
    {
      name: 'android.permission.ACCESS_FINE_LOCATION',
      plainMeaning: 'May access precise GPS location coordinates at all times.',
      severity: 'high',
      whyItMatters: 'Exposes user physical whereabouts and geo-targets phishing campaigns based on region.',
      status: 'Unusual for payment app',
      isAbuseCommon: false,
    },
    {
      name: 'android.permission.READ_CONTACTS',
      plainMeaning: 'May access and export the user complete address book and phone numbers.',
      severity: 'high',
      whyItMatters: 'Allows malware operators to harvest victim contact circles for secondary SMS worm propagation.',
      status: 'Unusual for payment app',
      isAbuseCommon: true,
    },
    {
      name: 'android.permission.REQUEST_INSTALL_PACKAGES',
      plainMeaning: 'Can prompt or silently sideload secondary APK payloads from external URLs.',
      severity: 'critical',
      whyItMatters: 'Acts as a dropper Trojan, downloading heavier banking ransomware after installation.',
      status: 'High-Risk Spyware Pattern',
      isAbuseCommon: true,
    },
    {
      name: 'android.permission.INTERNET',
      plainMeaning: 'Allows network communication to communicate with external web servers.',
      severity: 'low',
      whyItMatters: 'Standard Android capability required for any mobile client.',
      status: 'Standard Permission',
      isAbuseCommon: false,
    },
  ];

  const criticalCount = permissions.filter((p) => p.severity === 'critical').length;
  const highCount = permissions.filter((p) => p.severity === 'high').length;
  const lowCount = permissions.filter((p) => p.severity === 'low').length;

  return (
    <section className="p-5 rounded-2xl bg-navy-850/90 border border-slate-800 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Smartphone className="w-4 h-4" />
            </span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              App Permission X-Ray & Manifest Telemetry
            </h3>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
              Demo data
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Plain-language translation of Android permissions requested in suspect package manifest.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">
            {criticalCount} Critical Dropper / Intercept Permissions
          </span>
        </div>
      </div>

      {/* Permission Risk Distribution Chart Pill Bar */}
      <div className="p-3.5 rounded-xl bg-navy-950 border border-slate-800 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-slate-300 font-medium">Manifest Permission Risk Breakdown</span>
          <span className="font-mono text-slate-400 text-[11px]">{permissions.length} total permissions analyzed</span>
        </div>

        <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden flex">
          <div style={{ width: `${(criticalCount / permissions.length) * 100}%` }} className="bg-red-500" title={`${criticalCount} Critical`} />
          <div style={{ width: `${(highCount / permissions.length) * 100}%` }} className="bg-orange-500" title={`${highCount} High`} />
          <div style={{ width: `${(lowCount / permissions.length) * 100}%` }} className="bg-emerald-500" title={`${lowCount} Standard`} />
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
          <span className="flex items-center gap-1.5 text-red-400 font-semibold">
            <span className="w-2 h-2 rounded bg-red-500" /> {criticalCount} Critical (SMS / Overlay / Dropper)
          </span>
          <span className="flex items-center gap-1.5 text-orange-400 font-semibold">
            <span className="w-2 h-2 rounded bg-orange-500" /> {highCount} High (Contacts / GPS)
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded bg-emerald-500" /> {lowCount} Standard (Internet)
          </span>
        </div>
      </div>

      {/* Translated Permission Table */}
      <div className="space-y-2.5">
        {permissions.map((perm, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-xl border transition-colors ${
              perm.severity === 'critical'
                ? 'bg-red-950/20 border-red-500/40 hover:border-red-500/60'
                : perm.severity === 'high'
                ? 'bg-orange-950/20 border-orange-500/30 hover:border-orange-500/50'
                : 'bg-navy-950/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <div className="flex items-center gap-2">
                <code className="text-xs font-mono font-bold text-white">
                  {perm.name}
                </code>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  perm.severity === 'critical'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                    : perm.severity === 'high'
                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>
                  {perm.severity}
                </span>

                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  {perm.status}
                </span>
              </div>
            </div>

            <div className="mt-2 space-y-1">
              <p className="text-xs font-semibold text-slate-200">
                &rarr; {perm.plainMeaning}
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed italic">
                <strong>Why it matters:</strong> {perm.whyItMatters}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 rounded-xl bg-navy-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Extracted from candidate APK package: <code className="text-cyan-300 font-mono">{finding.usernameOrPackage}</code></span>
        <span className="italic">Demo data — Permissions extracted from manifest simulation.</span>
      </div>
    </section>
  );
};
