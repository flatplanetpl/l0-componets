'use client';

import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { CheckCircle2 } from 'lucide-react';

function cx(...classes: Array<string | null | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export type ListVariant = 'unordered' | 'ordered' | 'check';

export interface ListProps extends HTMLAttributes<HTMLUListElement | HTMLOListElement> {
  variant?: ListVariant;
  items: Array<ReactNode>;
  markerColor?: string;
  spacing?: 'tight' | 'base' | 'loose';
}

export const List = forwardRef<HTMLUListElement | HTMLOListElement, ListProps>(
  (
    {
      variant = 'unordered',
      items,
      markerColor = 'text-blue-600',
      spacing = 'base',
      className,
      ...props
    },
    ref,
  ) => {
    const spacingClass =
      spacing === 'tight'
        ? 'space-y-1.5'
        : spacing === 'loose'
        ? 'space-y-3'
        : 'space-y-2';

    if (variant === 'ordered') {
      return (
        <ol
          ref={ref as React.Ref<HTMLOListElement>}
          className={cx('list-decimal pl-5 text-sm text-slate-600', spacingClass, className)}
          {...props}
        >
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>
      );
    }

    if (variant === 'check') {
      return (
        <ul
          ref={ref as React.Ref<HTMLUListElement>}
          className={cx('space-y-2 text-sm text-slate-600', className)}
          {...props}
        >
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle2 className={cx('mt-0.5 h-4 w-4 flex-shrink-0', markerColor)} aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    }

    return (
      <ul
        ref={ref as React.Ref<HTMLUListElement>}
        className={cx('list-disc pl-5 text-sm text-slate-600', spacingClass, className)}
        {...props}
      >
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  },
);

List.displayName = 'List';

export default List;
