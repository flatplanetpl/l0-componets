'use client';

import {
  forwardRef,
  useCallback,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { ChevronDown } from 'lucide-react';

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
  description?: string;
  disabled?: boolean;
  meta?: ReactNode;
}

export interface AccordionProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultExpandedIds?: string[];
  expandedIds?: string[];
  onExpandedChange?: (ids: string[]) => void;
  variant?: 'default' | 'ghost';
}

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      items,
      allowMultiple,
      defaultExpandedIds = [],
      expandedIds,
      onExpandedChange,
      variant = 'default',
      className,
      ...props
    },
    ref,
  ) => {
    const isControlled = Array.isArray(expandedIds);
    const [internalExpanded, setInternalExpanded] = useState<string[]>(
      () => defaultExpandedIds,
    );

    const currentExpanded = isControlled ? expandedIds ?? [] : internalExpanded;

    const toggleItem = useCallback(
      (id: string) => {
        const isOpen = currentExpanded.includes(id);
        let next: string[];
        if (isOpen) {
          next = currentExpanded.filter((itemId) => itemId !== id);
        } else if (allowMultiple) {
          next = [...currentExpanded, id];
        } else {
          next = [id];
        }

        if (!isControlled) {
          setInternalExpanded(next);
        }
        onExpandedChange?.(next);
      },
      [allowMultiple, currentExpanded, isControlled, onExpandedChange],
    );

    const variantClasses = useMemo(
      () =>
        variant === 'ghost'
          ? 'border-none bg-transparent dark:bg-transparent'
          : 'border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
      [variant],
    );

    return (
      <div
        ref={ref}
        className={cx('divide-y divide-slate-200 rounded-xl transition-colors dark:divide-slate-700', variantClasses, className)}
        {...props}
      >
        {items.map((item) => {
          const open = currentExpanded.includes(item.id);
          const panelId = `${item.id}-panel`;
          const buttonId = `${item.id}-button`;
          return (
            <div key={item.id} className="p-4">
              <button
                id={buttonId}
                type="button"
                onClick={() => !item.disabled && toggleItem(item.id)}
                disabled={item.disabled}
                aria-expanded={open}
                aria-controls={panelId}
                className={cx(
                  'flex w-full items-start justify-between gap-4 text-left',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500',
                  item.disabled && 'cursor-not-allowed opacity-60',
                )}
              >
                <span className="flex-1 space-y-1">
                  <span className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-900 transition-colors dark:text-slate-100">{item.title}</span>
                    {item.meta && (
                      <span className="text-xs font-medium text-slate-500 transition-colors dark:text-slate-400">{item.meta}</span>
                    )}
                  </span>
                  {item.description && (
                    <span className="block text-xs text-slate-500 transition-colors dark:text-slate-400">
                      {item.description}
                    </span>
                  )}
                </span>
                <ChevronDown
                  className={cx(
                    'h-4 w-4 flex-shrink-0 text-slate-500 transition-transform duration-200 dark:text-slate-300',
                    open && 'rotate-180',
                  )}
                  aria-hidden="true"
                />
              </button>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={cx(
                  'overflow-hidden transition-[max-height] duration-300',
                  open ? 'mt-3 max-h-[720px]' : 'max-h-0',
                )}
              >
                <div className="text-sm text-slate-600 transition-colors dark:text-slate-300">
                  {item.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  },
);

Accordion.displayName = 'Accordion';

export default Accordion;
