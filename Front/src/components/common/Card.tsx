import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={`
        bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl overflow-hidden
        transition-all duration-300 ease-out shadow-lg
        ${onClick ? 'cursor-pointer hover:border-[var(--accent-primary)]/60 hover:shadow-2xl hover:shadow-[var(--accent-primary)]/10 hover:scale-[1.02] hover:-translate-y-1' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export default Card;