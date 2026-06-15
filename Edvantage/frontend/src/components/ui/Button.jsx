import React from 'react';

const Button = ({ children, variant = 'solid', size = 'md', className = '', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center font-bold transition-all duration-300 rounded-2xl active:scale-95 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    solid: 'bg-primary-600 text-white hover:bg-primary-500 shadow-[0_10px_20px_rgba(37,99,235,0.2)]',
    outline: 'bg-transparent border border-white/10 text-white hover:bg-white/5',
    ghost: 'bg-transparent text-slate-400 hover:text-white hover:bg-white/5',
    white: 'bg-white text-slate-950 hover:bg-slate-100 shadow-[0_10px_20px_rgba(255,255,255,0.1)]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
    xl: 'px-10 py-5 text-lg',
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
