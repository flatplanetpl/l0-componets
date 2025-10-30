'use client';

import Link from 'next/link';
import { forwardRef } from 'react';
import type { AnchorHTMLAttributes } from 'react';

type TextLinkVariant = 'default' | 'subtle' | 'inverse';

export interface TextLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: TextLinkVariant;
  underline?: 'hover' | 'always' | 'none';
  external?: boolean;
}

const variantClasses: Record<TextLinkVariant, string> = {
  default:
    'text-blue-600 hover:text-blue-700 focus-visible:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500',
  subtle:
    'text-slate-600 hover:text-slate-800 focus-visible:text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400',
  inverse:
    'text-white hover:text-blue-100 focus-visible:text-blue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-200',
};

const underlineClasses: Record<NonNullable<TextLinkProps['underline']>, string> = {
  hover: 'underline-offset-2 hover:underline',
  always: 'underline underline-offset-2',
  none: 'no-underline',
};

function mergeClasses(...classes: Array<string | null | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

export const TextLink = forwardRef<HTMLAnchorElement, TextLinkProps>(
  (
    {
      href,
      children,
      className,
      variant = 'default',
      underline = 'hover',
      external,
      rel,
      ...props
    },
    ref,
  ) => {
    const isExternal = external ?? (href ? href.startsWith('http') : false);
    const relValue = isExternal ? rel ?? 'noopener noreferrer' : rel;

    if (!href) {
      return (
        <span
          ref={ref}
          className={mergeClasses(
            variantClasses[variant],
            underlineClasses[underline],
            'cursor-not-allowed opacity-60',
            className,
          )}
          aria-disabled="true"
          {...props}
        >
          {children}
        </span>
      );
    }

    return (
      <Link
        href={href}
        ref={ref}
        className={mergeClasses(
          'inline-flex items-center gap-1 transition-colors',
          variantClasses[variant],
          underlineClasses[underline],
          className,
        )}
        rel={relValue}
        target={isExternal ? '_blank' : props.target}
        {...props}
      >
        {children}
      </Link>
    );
  },
);
TextLink.displayName = 'TextLink';

export default TextLink;
