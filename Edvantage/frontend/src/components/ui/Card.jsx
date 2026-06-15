import React from 'react';

const Card = ({ children, className = '', hover = true, glass = true }) => {
  const baseClasses = 'rounded-[2rem] border border-white/10 transition-all duration-300';
  const glassClasses = glass ? 'bg-white/[0.03] backdrop-blur-xl' : 'bg-slate-900/50';
  const hoverClasses = hover ? 'hover:bg-white/[0.05] hover:border-white/20' : '';
  
  return (
    <div className={`${baseClasses} ${glassClasses} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
