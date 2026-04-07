import React, { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  className = '',
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:pointer-events-none rounded-[12px] px-6 py-3';

  const variantClasses = {
    primary: 'bg-primary text-on-primary hover:bg-primary-container glow-primary',
    secondary: 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest surface-border',
    outline: 'surface-border bg-transparent text-on-surface hover:bg-surface-container-low',
    ghost: 'bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
