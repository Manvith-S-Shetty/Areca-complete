import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl p-6 border border-secondary shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
