import React from 'react';

const RiskBadge = ({ level, className = '' }) => {
  const levels = {
    Low: 'bg-risk-low/10 text-risk-low border-risk-low/20',
    Medium: 'bg-risk-medium/10 text-risk-medium border-risk-medium/20',
    High: 'bg-risk-high/10 text-risk-high border-risk-high/20',
    Critical: 'bg-risk-critical/10 text-risk-critical border-risk-critical/20',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${levels[level] || levels.Low} ${className}`}>
      {level}
    </span>
  );
};

export default RiskBadge;
