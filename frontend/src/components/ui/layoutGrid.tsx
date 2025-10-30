'use client';

import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function resolveColumns(value: number, prefix?: string) {
  const classMap: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  };
  const baseClass = classMap[value] ?? 'grid-cols-1';
  return prefix ? `${prefix}:${baseClass}` : baseClass;
}

export interface LayoutGridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: {
    base?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const gapClasses: Record<NonNullable<LayoutGridProps['gap']>, string> = {
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
};

export const LayoutGrid = forwardRef<HTMLDivElement, LayoutGridProps>(
  ({ columns, gap = 'md', className, children, ...props }, ref) => {
    const {
      base = 1,
      sm = base,
      md = sm,
      lg = md,
      xl = lg,
    } = columns ?? {};

    const gridClasses = cx(
      'grid',
      resolveColumns(base),
      sm !== base && resolveColumns(sm, 'sm'),
      md !== sm && resolveColumns(md, 'md'),
      lg !== md && resolveColumns(lg, 'lg'),
      xl !== lg && resolveColumns(xl, 'xl'),
      gapClasses[gap],
      className,
    );

    return (
      <div ref={ref} className={gridClasses} {...props}>
        {children}
      </div>
    );
  },
);

LayoutGrid.displayName = 'LayoutGrid';

export interface LayoutSectionProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export const LayoutSection = forwardRef<HTMLDivElement, LayoutSectionProps>(
  ({ title, description, actions, className, children, ...props }, ref) => (
    <section
      ref={ref}
      className={cx('space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900', className)}
      {...props}
    >
      <header className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-slate-900 transition-colors dark:text-slate-100">{title}</h3>
          {description && <p className="text-sm text-slate-600 transition-colors dark:text-slate-400">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </header>
      <div>{children}</div>
    </section>
  ),
);

LayoutSection.displayName = 'LayoutSection';

export default LayoutGrid;
