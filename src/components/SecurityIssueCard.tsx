import React from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { SecurityIssue } from '../types/audit';

interface SecurityIssueCardProps {
  issue: SecurityIssue;
  index: number;
}

export default function SecurityIssueCard({ issue, index }: SecurityIssueCardProps) {
  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'High':
        return {
          bg: 'bg-red-50 border-red-200',
          text: 'text-red-800',
          icon: AlertTriangle,
          iconColor: 'text-red-500'
        };
      case 'Medium':
        return {
          bg: 'bg-yellow-50 border-yellow-200',
          text: 'text-yellow-800',
          icon: AlertCircle,
          iconColor: 'text-yellow-500'
        };
      case 'Low':
        return {
          bg: 'bg-blue-50 border-blue-200',
          text: 'text-blue-800',
          icon: Info,
          iconColor: 'text-blue-500'
        };
      default:
        return {
          bg: 'bg-gray-50 border-gray-200',
          text: 'text-gray-800',
          icon: Info,
          iconColor: 'text-gray-500'
        };
    }
  };

  const styles = getSeverityStyles(issue.severity);
  const Icon = styles.icon;

  return (
    <div className={`p-4 rounded-lg border ${styles.bg} hover:shadow-md transition-shadow`}>
      <div className="flex items-start space-x-3">
        <Icon className={`h-5 w-5 ${styles.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium px-2 py-1 rounded ${styles.text} bg-white/50`}>
              {issue.severity}
            </span>
            {issue.line && (
              <span className="text-xs text-gray-500 bg-white/70 px-2 py-1 rounded">
                Line {issue.line}
              </span>
            )}
          </div>
          <p className={`text-sm ${styles.text} leading-relaxed`}>
            {issue.message}
          </p>
        </div>
      </div>
    </div>
  );
}