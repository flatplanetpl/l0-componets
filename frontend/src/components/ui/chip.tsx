'use client';

import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, HTMLAttributes } from 'react';
import { X } from 'lucide-react';

function mergeClasses(...classes: Array<string | null | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

export type ChipVariant = 'default' | 'outline' | 'success' | 'warning';

const chipVariantClasses: Record<ChipVariant, string> = {
  default:
    'bg-blue-50 text-blue-700 hover:bg-blue-100 focus-visible:outline-blue-500',
  outline:
    'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-800 focus-visible:outline-blue-500',
  success:
    'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 focus-visible:outline-emerald-500',
  warning:
    'bg-amber-50 text-amber-700 hover:bg-amber-100 focus-visible:outline-amber-500',
};

export interface ChipProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ChipVariant;
  selected?: boolean;
  removable?: boolean;
  onRemove?: () => void;
}

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(
  (
    {
      className,
      variant = 'default',
      selected = false,
      removable = false,
      onRemove,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        className={mergeClasses(
          'inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
          chipVariantClasses[variant],
          selected && 'ring-2 ring-offset-1 ring-blue-500',
          className,
        )}
        {...props}
      >
        <span>{children}</span>
        {removable && (
          <span
            role="button"
            tabIndex={-1}
            onClick={(event) => {
              event.stopPropagation();
              onRemove?.();
            }}
            className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-white/60 text-current hover:bg-white"
            aria-label="Usuń"
          >
            <X className="h-3 w-3" />
          </span>
        )}
      </button>
    );
  },
);
Chip.displayName = 'Chip';

export interface FilterPillProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  count?: number;
  onRemove?: () => void;
}

export const FilterPill = ({
  label,
  count,
  onRemove,
  className,
  ...props
}: FilterPillProps) => (
  <div
    className={mergeClasses(
      'inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600',
      className,
    )}
    {...props}
  >
    <span className="font-medium text-slate-700">{label}</span>
    {typeof count === 'number' && (
      <span className="rounded-full bg-slate-200 px-1.5 text-xs text-slate-600">
        {count}
      </span>
    )}
    {onRemove && (
      <button
        type="button"
        onClick={onRemove}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-slate-500 hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-500"
        aria-label={`Usuń filtr ${label}`}
      >
        <X className="h-3 w-3" />
      </button>
    )}
  </div>
);
