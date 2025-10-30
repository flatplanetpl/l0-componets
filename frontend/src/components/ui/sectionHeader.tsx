'use client';

import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export interface SectionHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
  align?: 'left' | 'center' | 'right';
}

export const SectionHeader = forwardRef<HTMLDivElement, SectionHeaderProps>(
  (
    { title, description, eyebrow, actions, align = 'left', className, ...props },
    ref,
  ) => {
    const alignmentClasses =
      align === 'center'
        ? 'items-center text-center'
        : align === 'right'
        ? 'items-end text-right'
        : 'items-start text-left';

    return (
      <div
        ref={ref}
        className={cx(
          'flex flex-col gap-3 md:flex-row md:items-center md:justify-between',
          className,
        )}
        {...props}
      >
        <div className={cx('flex flex-col gap-1', alignmentClasses)}>
          {eyebrow && (
            <span className="text-xs font-semibold uppercase tracking-wide text-blue-500">
              {eyebrow}
            </span>
          )}
          <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
          {description && (
            <p className="text-sm text-slate-600">{description}</p>
          )}
        </div>
        {actions && (
          <div className={cx('flex items-center gap-2', align === 'center' && 'justify-center')}>
            {actions}
          </div>
        )}
      </div>
    );
  },
);

SectionHeader.displayName = 'SectionHeader';

export default SectionHeader;
