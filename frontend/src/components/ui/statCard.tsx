'use client';

import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string;
  trend?: number | null;
  trendLabel?: string;
  icon?: ReactNode;
  variant?: 'default' | 'accent';
  description?: string;
}

export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      label,
      value,
      trend = null,
      trendLabel,
      icon,
      variant = 'default',
      description,
      className,
      ...props
    },
    ref,
  ) => {
    const positive = typeof trend === 'number' && trend > 0;
    const negative = typeof trend === 'number' && trend < 0;

    const trendIcon = positive ? (
      <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
    ) : negative ? (
      <ArrowDownRight className="h-3.5 w-3.5 text-rose-500" aria-hidden="true" />
    ) : (
      <Minus className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
    );

    const trendText = typeof trend === 'number' ? `${trend > 0 ? '+' : ''}${trend.toFixed(1)}%` : trendLabel;

    return (
      <div
        ref={ref}
        className={cx(
          'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:shadow-lg',
          variant === 'accent' && 'border-blue-200 bg-blue-50/60 dark:border-blue-500/40 dark:bg-blue-500/10',
          className,
        )}
        {...props}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 transition-colors dark:text-slate-400/80">{label}</p>
            <p className="text-3xl font-semibold text-slate-900 transition-colors dark:text-slate-100">{value}</p>
          </div>
          {icon && (
            <span className="rounded-full bg-blue-100 p-2 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              {icon}
            </span>
          )}
        </div>
        {(trendText || trendLabel) && (
          <div className="mt-3 flex items-center gap-2 text-xs font-medium">
            {trendIcon}
            <span
              className={cx(
                positive && 'text-emerald-600',
                negative && 'text-rose-600',
                !positive && !negative && 'text-slate-500',
              )}
            >
              {trendText ?? trendLabel}
            </span>
          </div>
        )}
        {description && (
          <p className="mt-2 text-sm text-slate-600 transition-colors dark:text-slate-400">{description}</p>
        )}
      </div>
    );
  },
);

StatCard.displayName = 'StatCard';

export default StatCard;
