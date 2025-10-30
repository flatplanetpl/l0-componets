'use client';

import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, HTMLAttributes } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

function mergeClasses(...classes: Array<string | null | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

interface PaginationButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  'data-testid'?: string;
}

const PaginationButton = forwardRef<HTMLButtonElement, PaginationButtonProps>(
  ({ active, className, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      className={mergeClasses(
        'inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500',
        active
          ? 'border-blue-500 bg-blue-50 text-blue-700'
          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
);
PaginationButton.displayName = 'PaginationButton';

export interface PaginationProps extends HTMLAttributes<HTMLDivElement> {
  page: number;
  pageCount: number;
  onPageChange?: (page: number) => void;
  showEdges?: boolean;
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
  showEdges = false,
  className,
  ...props
}: PaginationProps) {
  const canGoPrev = page > 1;
  const canGoNext = page < pageCount;

  const goToPage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > pageCount) return;
    onPageChange?.(nextPage);
  };

  const buildRange = () => {
    if (pageCount <= 7) {
      return Array.from({ length: pageCount }, (_, i) => i + 1);
    }

    const range: Array<number | 'ellipsis'> = [];
    const addEllipsis = () => {
      if (range[range.length - 1] !== 'ellipsis') {
        range.push('ellipsis');
      }
    };

    if (showEdges) {
      range.push(1);
    }

    const start = Math.max(showEdges ? 2 : 1, page - 1);
    const end = Math.min(showEdges ? pageCount - 1 : pageCount, page + 1);

    if (start > (showEdges ? 2 : 1)) {
      addEllipsis();
    }

    for (let current = start; current <= end; current += 1) {
      range.push(current);
    }

    if (end < (showEdges ? pageCount - 1 : pageCount - 1)) {
      addEllipsis();
    }

    if (showEdges) {
      range.push(pageCount);
    }

    return range;
  };

  const pages = buildRange();

  return (
    <nav
      className={mergeClasses(
        'flex items-center gap-2',
        className,
      )}
      aria-label="Pagination"
      {...props}
    >
      <PaginationButton
        onClick={() => goToPage(page - 1)}
        disabled={!canGoPrev}
        aria-label="Poprzednia strona"
      >
        <ChevronLeft className="h-4 w-4" />
      </PaginationButton>

      {pages.map((entry, index) => {
        if (entry === 'ellipsis') {
          return (
            <span
              key={`ellipsis-${index}`}
              className="inline-flex h-9 w-9 items-center justify-center text-slate-400"
            >
              <MoreHorizontal className="h-4 w-4" />
            </span>
          );
        }

        return (
          <PaginationButton
            key={entry}
            active={entry === page}
            onClick={() => goToPage(entry)}
            aria-current={entry === page ? 'page' : undefined}
          >
            {entry}
          </PaginationButton>
        );
      })}

      <PaginationButton
        onClick={() => goToPage(page + 1)}
        disabled={!canGoNext}
        aria-label="Następna strona"
      >
        <ChevronRight className="h-4 w-4" />
      </PaginationButton>
    </nav>
  );
}

export default Pagination;
