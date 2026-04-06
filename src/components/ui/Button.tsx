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
  const baseClasses = 'inline-flex items-center justify-center rounded-[0.75rem] px-4 py-2 font-medium transition-colors focus:outline-none';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary to-primary-container text-on-primary hover:from-primary-container hover:to-primary-container',
    secondary: 'ghost-border hover:bg-surface-container-highest',
    outline: 'border border-outline-variant text-on-surface hover:bg-surface-container-low',
    ghost: 'hover:bg-surface-container-low text-on-surface'
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
