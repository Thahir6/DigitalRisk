import React from 'react';
import { ConfidenceLevel } from '../../types';
import { CheckCircle2, HelpCircle } from 'lucide-react';

interface ConfidenceBadgeProps {
  confidence: ConfidenceLevel;
  size?: 'sm' | 'md';
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ 
  confidence, 
  size = 'md' 
}) => {
  const config = {
    High: {
      label: 'High Confidence',
      style: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25',
      icon: CheckCircle2,
    },
    Medium: {
      label: 'Medium Confidence',
      style: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/25',
      icon: HelpCircle,
    },
    Low: {
      label: 'Low Confidence',
      style: 'bg-slate-700/30 text-slate-400 border-slate-700',
      icon: HelpCircle,
    },
  }[confidence];

  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5 gap-1' : 'text-xs px-2.5 py-1 gap-1.5';
  const IconComponent = config.icon;

  return (
    <span 
      className={`inline-flex items-center rounded-full border ${config.style} ${sizeClass} font-medium`}
      title={`Automated detection confidence: ${confidence}`}
    >
      <IconComponent className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{config.label}</span>
    </span>
  );
};
