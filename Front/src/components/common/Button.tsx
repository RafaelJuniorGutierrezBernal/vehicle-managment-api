import React from 'react'

interface ButtonProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

function Button({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
  type = 'button',
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--primary-bg)] disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95';

  const variants = {
    primary:
      'bg-gradient-to-r from-[var(--accent-primary)] to-[#0ea5e9] text-[var(--primary-bg)] hover:opacity-90 hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] focus:ring-[var(--accent-primary)]',
    secondary:
      'bg-transparent text-[var(--text-primary)] border border-[var(--border-color)] hover:bg-[var(--card-bg)] hover:border-[var(--accent-primary)]/50 focus:ring-[var(--accent-primary)]/50',
    danger:
      'bg-gradient-to-r from-[var(--accent-danger)] to-red-600 text-white hover:opacity-90 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] focus:ring-[var(--accent-danger)]',
    ghost:
      'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-bg)] focus:ring-[var(--border-color)]',
  };

  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;