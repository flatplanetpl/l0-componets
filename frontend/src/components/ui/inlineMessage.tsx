'use client';

import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Info,
  Sparkles,
} from 'lucide-react';

export type InlineMessageVariant =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'helper';

const variantClasses: Record<InlineMessageVariant, string> = {
  info: 'text-blue-700',
  success: 'text-emerald-700',
  warning: 'text-amber-700',
  error: 'text-rose-700',
  helper: 'text-slate-600',
};

const iconByVariant: Record<InlineMessageVariant, ReactNode> = {
  info: <Info className="h-3.5 w-3.5" />,
  success: <CheckCircle2 className="h-3.5 w-3.5" />,
  warning: <Sparkles className="h-3.5 w-3.5" />,
  error: <AlertCircle className="h-3.5 w-3.5" />,
  helper: <Info className="h-3.5 w-3.5" />,
};

function mergeClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export interface InlineMessageProps
  extends HTMLAttributes<HTMLParagraphElement> {
  variant?: InlineMessageVariant;
  withIcon?: boolean;
}

export const InlineMessage = forwardRef<HTMLParagraphElement, InlineMessageProps>(
  ({ className, variant = 'helper', withIcon = true, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={mergeClasses(
          'flex items-start gap-1.5 text-sm leading-snug',
          variantClasses[variant],
          className,
        )}
        {...props}
      >
        {withIcon && (
          <span className="mt-0.5 flex-shrink-0">
            {iconByVariant[variant]}
          </span>
        )}
        <span>{children}</span>
      </p>
    );
  },
);
InlineMessage.displayName = 'InlineMessage';

