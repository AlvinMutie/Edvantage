import React from 'react';

const StatGroup = ({ children, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 ${className}`}>
      {children}
    </div>
  );
};

export default StatGroup;
