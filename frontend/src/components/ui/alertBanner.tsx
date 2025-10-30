'use client';

import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from 'lucide-react';

export type AlertBannerVariant = 'info' | 'success' | 'warning' | 'error';

const containerClasses: Record<AlertBannerVariant, string> = {
  info: 'border-blue-200 bg-blue-50 text-blue-900',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  warning: 'border-amber-200 bg-amber-50 text-amber-900',
  error: 'border-rose-200 bg-rose-50 text-rose-900',
};

const iconByVariant: Record<AlertBannerVariant, ReactNode> = {
  info: <Info className="h-5 w-5" />,
  success: <CheckCircle2 className="h-5 w-5" />,
  warning: <AlertTriangle className="h-5 w-5" />,
  error: <AlertTriangle className="h-5 w-5" />,
};

function mergeClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export interface AlertBannerProps
  extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertBannerVariant;
  title?: string;
  description?: string;
  onDismiss?: () => void;
  dismissLabel?: string;
}

export const AlertBanner = forwardRef<HTMLDivElement, AlertBannerProps>(
  (
    {
      className,
      variant = 'info',
      title,
      description,
      children,
      onDismiss,
      dismissLabel = 'Zamknij alert',
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={mergeClasses(
          'flex items-start gap-3 rounded-xl border px-4 py-3',
          containerClasses[variant],
          className,
        )}
        {...props}
      >
        <span className="mt-0.5 flex-shrink-0">
          {iconByVariant[variant]}
        </span>
        <div className="flex-1 space-y-1">
          {title && <p className="text-sm font-semibold">{title}</p>}
          {(description || children) && (
            <div className="text-sm leading-snug">
              {description ? <p>{description}</p> : children}
            </div>
          )}
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-full p-1 text-inherit transition hover:bg-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
            aria-label={dismissLabel}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  },
);
AlertBanner.displayName = 'AlertBanner';

