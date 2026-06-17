import React from 'react';

const Skeleton = ({ className = '', variant = 'rect' }) => {
  const baseClasses = 'animate-pulse bg-white/5 border border-white/5';
  
  const variants = {
    rect: 'rounded-2xl',
    circle: 'rounded-full',
    text: 'rounded-lg h-4 w-3/4',
  };

  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`} />
  );
};

export default Skeleton;
