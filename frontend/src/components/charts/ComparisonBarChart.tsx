import React from 'react';
import { Share2, Smartphone } from 'lucide-react';

interface ComparisonBarChartProps {
  socialCount: number;
  appCount: number;
}

export const ComparisonBarChart: React.FC<ComparisonBarChartProps> = ({ socialCount, appCount }) => {
  const total = socialCount + appCount || 1;
  const socialPct = Math.round((socialCount / total) * 100);
  const appPct = Math.round((appCount / total) * 100);

  return (
    <div className="p-4 rounded-xl bg-navy-850 border border-slate-800 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-bold text-white tracking-tight">Channel Comparison</h4>
        <span className="text-[10px] text-slate-400 font-mono">Social vs Apps</span>
      </div>

      <div className="space-y-3.5 my-2">
        {/* Social Bar */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-300 flex items-center gap-1.5 font-medium">
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Social Profiles</span>
            </span>
            <span className="text-slate-200 font-mono font-semibold">
              {socialCount} <span className="text-slate-400 text-[10px]">({socialPct}%)</span>
            </span>
          </div>
          <div className="w-full h-3 bg-navy-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${socialPct}%` }}
              title={`Social: ${socialCount} (${socialPct}%)`}
            />
          </div>
        </div>

        {/* Mobile App Bar */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-300 flex items-center gap-1.5 font-medium">
              <Smartphone className="w-3.5 h-3.5 text-purple-400" />
              <span>Mobile Apps</span>
            </span>
            <span className="text-slate-200 font-mono font-semibold">
              {appCount} <span className="text-slate-400 text-[10px]">({appPct}%)</span>
            </span>
          </div>
          <div className="w-full h-3 bg-navy-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${appPct}%` }}
              title={`Apps: ${appCount} (${appPct}%)`}
            />
          </div>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800/80 leading-relaxed">
        {socialCount > appCount
          ? `Social impersonations account for ${socialPct}% of candidate detections.`
          : `Mobile application collisions represent ${appPct}% of detected risks.`}
      </p>
    </div>
  );
};
