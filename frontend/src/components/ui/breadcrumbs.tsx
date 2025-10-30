'use client';

import { forwardRef } from 'react';
import type { ReactNode, AnchorHTMLAttributes, HTMLAttributes } from 'react';
import Link, { type LinkProps } from 'next/link';
import { ChevronRight } from 'lucide-react';

function mergeClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
}

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: ReactNode;
}

type BreadcrumbLinkProps = LinkProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

const BreadcrumbLink = forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ className, children, ...props }, ref) => (
    <Link
      ref={ref}
      className={mergeClasses(
        'inline-flex items-center gap-1 text-sm font-medium text-slate-600 transition hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500',
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  ),
);
BreadcrumbLink.displayName = 'BreadcrumbLink';

export function Breadcrumbs({
  items,
  separator = <ChevronRight className="h-4 w-4 text-slate-300" />,
  className,
  ...props
}: BreadcrumbsProps) {
  if (!items?.length) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={mergeClasses('flex items-center gap-2 text-sm', className)}
      {...props}
    >
      <ol className="flex items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
              {item.href && !isLast ? (
                <BreadcrumbLink href={item.href}>
                  {item.icon && <span className="text-slate-400">{item.icon}</span>}
                  {item.label}
                </BreadcrumbLink>
              ) : (
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-slate-900">
                  {item.icon && <span className="text-slate-400">{item.icon}</span>}
                  {item.label}
                </span>
              )}
              {!isLast && separator}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
