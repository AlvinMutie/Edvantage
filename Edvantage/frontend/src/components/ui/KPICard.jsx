import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Card from './Card';

const KPICard = ({ label, value, trend, trendValue, icon: Icon, className = '' }) => {
  const isPositive = trend === 'up';
  
  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-primary-500/10 rounded-2xl border border-primary-500/20">
          {Icon && <Icon size={24} className="text-primary-400" />}
        </div>
        {trendValue && (
          <div className={`flex items-center gap-1 text-sm font-bold ${isPositive ? 'text-success-400' : 'text-risk-critical'}`}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {trendValue}
          </div>
        )}
      </div>
      <div>
        <p className="text-slate-400 text-sm font-medium mb-1">{label}</p>
        <h3 className="text-3xl font-black text-white tracking-tight">{value}</h3>
      </div>
    </Card>
  );
};

export default KPICard;
