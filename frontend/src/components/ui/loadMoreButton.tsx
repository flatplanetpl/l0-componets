'use client';

import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { Loader2, Plus } from 'lucide-react';

function mergeClasses(...classes: Array<string | null | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

export interface LoadMoreButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'solid' | 'outline';
}

export const LoadMoreButton = forwardRef<HTMLButtonElement, LoadMoreButtonProps>(
  ({ className, loading = false, variant = 'solid', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={mergeClasses(
          'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-60',
          variant === 'solid'
            ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
            : 'border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800',
          className,
        )}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
        <span>{children ?? (loading ? 'Ładowanie...' : 'Załaduj więcej')}</span>
      </button>
    );
  },
);
LoadMoreButton.displayName = 'LoadMoreButton';
