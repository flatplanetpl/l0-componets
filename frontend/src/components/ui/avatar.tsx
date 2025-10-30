'use client';

import { forwardRef, useMemo } from 'react';
import type { ImgHTMLAttributes } from 'react';

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'rounded' | 'square';

const sizeMap: Record<AvatarSize, string> = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
};

const textSizeMap: Record<AvatarSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
};

const statusColor: Record<NonNullable<AvatarProps['status']>, string> = {
  online: 'bg-emerald-500',
  offline: 'bg-slate-400',
  busy: 'bg-rose-500',
  away: 'bg-amber-400',
};

export interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  name?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  status?: 'online' | 'offline' | 'busy' | 'away';
  showStatusIndicator?: boolean;
  initialsFallback?: string;
}

export const Avatar = forwardRef<HTMLImageElement, AvatarProps>(
  (
    {
      src,
      alt,
      name,
      size = 'md',
      shape = 'rounded',
      status,
      showStatusIndicator = Boolean(status),
      className,
      initialsFallback,
      ...props
    },
    ref,
  ) => {
    const initials = useMemo(() => {
      if (initialsFallback) return initialsFallback;
      if (!name) return '';
      const [first, second = ''] = name.trim().split(/\s+/);
      const initialsFromName =
        (first?.[0] ?? '') + (second?.[0] ?? '');
      return initialsFromName.toUpperCase();
    }, [initialsFallback, name]);

    const sizeClasses = sizeMap[size];
    const shapeClasses = shape === 'rounded' ? 'rounded-full' : 'rounded-lg';
    const fontSize = textSizeMap[size];

    return (
      <span className={cx('relative inline-flex', sizeClasses, shapeClasses)}>
        {src ? (
          <img
            ref={ref}
            src={src}
            alt={alt ?? name ?? 'Avatar'}
            className={cx(
              'h-full w-full object-cover',
              shapeClasses,
              className,
            )}
            {...props}
          />
        ) : (
          <span
            className={cx(
              'flex h-full w-full items-center justify-center bg-slate-200 font-semibold uppercase text-slate-600',
              shapeClasses,
              fontSize,
              className,
            )}
            aria-label={alt ?? name ?? 'Avatar'}
          >
            {initials || '•'}
          </span>
        )}
        {showStatusIndicator && status && (
          <span
            className={cx(
              'absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white',
              statusColor[status],
            )}
            aria-hidden="true"
          />
        )}
      </span>
    );
  },
);

Avatar.displayName = 'Avatar';

export default Avatar;
