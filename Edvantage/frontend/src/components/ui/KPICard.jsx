import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Card from './Card';

const KPICard = ({ label, value, trend, trendValue, icon: Icon, className = '' }) => {
  const isUp = trend === 'up';
  const isDown = trend === 'down';
  
  return (
    <Card className={`p-6 relative overflow-hidden group ${className}`}>
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
        {Icon && <Icon size={80} strokeWidth={1} />}
      </div>
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:border-primary-500/30 group-hover:bg-primary-500/5 transition-all duration-500">
            {Icon && <Icon size={18} className="text-slate-400 group-hover:text-primary-400" />}
          </div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</span>
        </div>
        
        <div className="mt-auto">
          <div className="text-3xl font-black text-white tracking-tight mb-2">
            {value}
          </div>
          
          {(trend || trendValue) && (
            <div className="flex items-center gap-1.5">
              <div className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                isUp ? 'bg-success-500/10 text-success-500' : 
                isDown ? 'bg-risk-critical/10 text-risk-critical' : 'bg-slate-500/10 text-slate-400'
              }`}>
                {isUp && <TrendingUp size={10} />}
                {isDown && <TrendingDown size={10} />}
                {!isUp && !isDown && <Minus size={10} />}
                {trendValue}
              </div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest opacity-60">vs last period</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default KPICard;
