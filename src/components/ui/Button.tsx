import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  loading = false,
  icon,
  className,
  children,
  disabled,
  ...props
}) => (
  <button
    {...props}
    disabled={disabled || loading}
    className={cn(
      'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 text-xs font-medium transition-[background-color,border-color,color,transform] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-50',
      variant === 'primary' && 'bg-brand-red text-white hover:bg-brand-red-hover active:bg-brand-red-hover',
      variant === 'secondary' && 'border border-dark-subtle bg-dark-card text-text-headline hover:border-white/[0.16] hover:bg-dark-base',
      variant === 'ghost' && 'bg-transparent text-text-body hover:bg-white/[0.04] hover:text-white',
      variant === 'destructive' && 'border border-danger/30 bg-danger/10 text-danger hover:bg-danger/15',
      className
    )}
  >
    {loading ? <Loader2 size={14} className="animate-spin" aria-hidden="true" /> : icon}
    {children}
  </button>
);

export default Button;
