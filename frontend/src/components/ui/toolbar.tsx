'use client';

import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export interface ToolbarProps extends HTMLAttributes<HTMLDivElement> {
  dense?: boolean;
  justify?: 'start' | 'between' | 'end';
}

export const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(
  ({ dense, justify = 'between', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cx(
          'flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900',
          dense && 'gap-2 px-3 py-2',
          justify === 'between' && 'justify-between',
          justify === 'start' && 'justify-start',
          justify === 'end' && 'justify-end',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Toolbar.displayName = 'Toolbar';

export interface ToolbarGroupProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  align?: 'start' | 'center' | 'end';
  children: ReactNode;
}

export function ToolbarGroup({
  label,
  align = 'center',
  className,
  children,
  ...props
}: ToolbarGroupProps) {
  return (
    <div
      className={cx(
        'flex items-center gap-2',
        align === 'start' && 'justify-start',
        align === 'center' && 'justify-center',
        align === 'end' && 'justify-end',
        className,
      )}
      {...props}
    >
      {label && <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>}
      {children}
    </div>
  );
}

export function ToolbarSeparator({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cx('h-6 w-px bg-slate-200 dark:bg-slate-700', className)}
    />
  );
}

export default Toolbar;
