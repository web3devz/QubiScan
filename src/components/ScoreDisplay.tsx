import React from 'react';
import { Shield, ShieldCheck, ShieldX, ShieldAlert } from 'lucide-react';

interface ScoreDisplayProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function ScoreDisplay({ score, size = 'md' }: ScoreDisplayProps) {
  const getScoreInfo = (score: number) => {
    if (score >= 80) {
      return {
        color: 'text-green-600',
        bg: 'bg-green-100',
        border: 'border-green-300',
        icon: ShieldCheck,
        label: 'SECURE',
        description: 'Good security practices detected'
      };
    } else if (score >= 60) {
      return {
        color: 'text-yellow-600',
        bg: 'bg-yellow-100',
        border: 'border-yellow-300',
        icon: ShieldAlert,
        label: 'MODERATE',
        description: 'Some security concerns found'
      };
    } else {
      return {
        color: 'text-red-600',
        bg: 'bg-red-100',
        border: 'border-red-300',
        icon: ShieldX,
        label: 'NEEDS IMPROVEMENT',
        description: 'Significant security issues detected'
      };
    }
  };

  const info = getScoreInfo(score);
  const Icon = info.icon;

  const sizeClasses = {
    sm: {
      container: 'p-3',
      icon: 'h-6 w-6',
      score: 'text-2xl',
      label: 'text-xs',
      description: 'text-xs'
    },
    md: {
      container: 'p-4',
      icon: 'h-8 w-8',
      score: 'text-3xl',
      label: 'text-sm',
      description: 'text-sm'
    },
    lg: {
      container: 'p-6',
      icon: 'h-12 w-12',
      score: 'text-5xl',
      label: 'text-base',
      description: 'text-base'
    }
  };

  const classes = sizeClasses[size];

  return (
    <div className={`rounded-lg border ${info.bg} ${info.border} ${classes.container}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon className={`${classes.icon} ${info.color}`} />
          <div>
            <div className="flex items-baseline space-x-2">
              <span className={`font-bold ${info.color} ${classes.score}`}>
                {score}
              </span>
              <span className={`text-gray-600 ${classes.label}`}>/100</span>
            </div>
            <p className={`font-medium ${info.color} ${classes.label}`}>
              {info.label}
            </p>
          </div>
        </div>
      </div>
      <p className={`mt-2 ${info.color} ${classes.description} opacity-80`}>
        {info.description}
      </p>
    </div>
  );
}