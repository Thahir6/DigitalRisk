import React from 'react';
import { SignalItem } from '../../types';
import { 
  Type, 
  Image as ImageIcon, 
  FileText, 
  UserX, 
  Globe, 
  Lock, 
  Package 
} from 'lucide-react';

interface SignalCardProps {
  signal: SignalItem;
}

export const SignalCard: React.FC<SignalCardProps> = ({ signal }) => {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    name: Type,
    logo: ImageIcon,
    desc: FileText,
    owner: UserX,
    domain: Globe,
    permission: Lock,
    package: Package,
  };

  const IconComponent = iconMap[signal.iconName] || Globe;

  const strengthBadge = {
    Critical: 'bg-red-500/10 text-red-400 border-red-500/30',
    High: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    Low: 'bg-slate-700/30 text-slate-400 border-slate-700',
  }[signal.strength];

  return (
    <div className="p-3.5 rounded-xl bg-navy-850 border border-slate-800 hover:border-slate-700 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-800 text-cyan-400">
            <IconComponent className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-white tracking-tight">
            {signal.title}
          </span>
        </div>
        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${strengthBadge}`}>
          {signal.strength}
        </span>
      </div>
      <p className="text-xs text-slate-300 leading-relaxed pl-8">
        {signal.explanation}
      </p>
    </div>
  );
};
