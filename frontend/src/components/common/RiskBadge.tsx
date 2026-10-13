import React from 'react';
import { RiskSeverity } from '../../types';
import { AlertOctagon, AlertTriangle, AlertCircle, Shield } from 'lucide-react';

interface RiskBadgeProps {
  severity: RiskSeverity;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ 
  severity, 
  size = 'md',
  showIcon = true 
}) => {
  const config = {
    critical: {
      label: 'Critical Risk',
      bg: 'bg-red-500/10 text-red-400 border-red-500/30',
      icon: AlertOctagon,
      dotColor: 'bg-red-500',
    },
    high: {
      label: 'High Risk',
      bg: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      icon: AlertTriangle,
      dotColor: 'bg-orange-500',
    },
    medium: {
      label: 'Medium Risk',
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      icon: AlertCircle,
      dotColor: 'bg-amber-500',
    },
    low: {
      label: 'Low Risk',
      bg: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
      icon: Shield,
      dotColor: 'bg-slate-400',
    },
  }[severity];

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-medium px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-2',
  }[size];

  const IconComponent = config.icon;

  return (
    <span 
      className={`inline-flex items-center rounded-full border ${config.bg} ${sizeClasses} select-none`}
      role="status"
      aria-label={config.label}
    >
      {showIcon && <IconComponent className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
      <span>{config.label}</span>
    </span>
  );
};
