import React from 'react';

const SectionHeader = ({ title, description, children, className = '' }) => {
  return (
    <div className={`flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 ${className}`}>
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-white tracking-tight">{title}</h2>
        {description && <p className="text-slate-400 font-medium">{description}</p>}
      </div>
      <div className="flex items-center gap-4">
        {children}
      </div>
    </div>
  );
};

export default SectionHeader;
