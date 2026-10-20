import React from 'react';

export default function Card({
  children,
  className = '',
  hoverable = false,
  padding = 'p-6',
  id,
  ...props
}) {
  return (
    <div
      id={id}
      className={`bg-white rounded-3xl border border-slate-200 shadow-sm ${
        hoverable ? 'hover:shadow-md hover:border-emerald-300 transition-all duration-300 transform hover:-translate-y-0.5' : ''
      } ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
