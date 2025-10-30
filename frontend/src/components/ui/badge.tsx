import type { HTMLAttributes, ReactNode } from 'react';
import { CheckCircle2, Info, AlertTriangle, AlertCircle, MinusCircle } from 'lucide-react';

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
type BadgeVariant = 'solid' | 'subtle' | 'outline';

const toneStyles: Record<BadgeTone, { solid: string; subtle: string; outline: string }> = {
  neutral: {
    solid: 'bg-slate-700 text-white',
    subtle: 'bg-slate-100 text-slate-700',
    outline: 'border border-slate-300 text-slate-700',
  },
  info: {
    solid: 'bg-blue-600 text-white',
    subtle: 'bg-blue-100 text-blue-700',
    outline: 'border border-blue-400 text-blue-700',
  },
  success: {
    solid: 'bg-emerald-600 text-white',
    subtle: 'bg-emerald-100 text-emerald-700',
    outline: 'border border-emerald-400 text-emerald-700',
  },
  warning: {
    solid: 'bg-amber-500 text-slate-900',
    subtle: 'bg-amber-100 text-amber-700',
    outline: 'border border-amber-400 text-amber-700',
  },
  danger: {
    solid: 'bg-rose-600 text-white',
    subtle: 'bg-rose-100 text-rose-700',
    outline: 'border border-rose-400 text-rose-700',
  },
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

export function Badge({
  tone = 'neutral',
  variant = 'subtle',
  size = 'md',
  className,
  leadingIcon,
  trailingIcon,
  children,
  ...props
}: BadgeProps) {
  const variantClasses = toneStyles[tone][variant];
  const sizeClasses =
    size === 'sm'
      ? 'text-xs px-2 py-0.5 rounded-md'
      : 'text-sm px-2.5 py-1 rounded-lg';

  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 font-medium leading-none',
        sizeClasses,
        variantClasses,
        variant === 'outline' && 'bg-white',
        className,
      )}
      {...props}
    >
      {leadingIcon && <span className="inline-flex h-4 w-4 items-center justify-center">{leadingIcon}</span>}
      {children}
      {trailingIcon && <span className="inline-flex h-4 w-4 items-center justify-center">{trailingIcon}</span>}
    </span>
  );
}

Badge.displayName = 'Badge';

type Status = 'default' | 'success' | 'info' | 'warning' | 'danger' | 'offline';

const statusIcon: Record<Status, ReactNode> = {
  default: <Info className="h-3.5 w-3.5" aria-hidden="true" />,
  success: <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />,
  info: <Info className="h-3.5 w-3.5" aria-hidden="true" />,
  warning: <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />,
  danger: <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />,
  offline: <MinusCircle className="h-3.5 w-3.5" aria-hidden="true" />,
};

const statusTone: Record<Status, BadgeTone> = {
  default: 'neutral',
  success: 'success',
  info: 'info',
  warning: 'warning',
  danger: 'danger',
  offline: 'neutral',
};

export interface StatusTagProps extends Omit<BadgeProps, 'tone'> {
  status?: Status;
  toneOverride?: BadgeTone;
  showIcon?: boolean;
}

export function StatusTag({
  status = 'default',
  toneOverride,
  showIcon = true,
  leadingIcon,
  ...props
}: StatusTagProps) {
  const tone = toneOverride ?? statusTone[status];
  return (
    <Badge
      tone={tone}
      leadingIcon={
        showIcon
          ? leadingIcon ?? statusIcon[status]
          : undefined
      }
      {...props}
    />
  );
}

StatusTag.displayName = 'StatusTag';

export default Badge;
