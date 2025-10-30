'use client';

import {
  cloneElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type MutableRefObject,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export interface PopoverProps {
  trigger: ReactElement;
  title?: string;
  description?: string;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  widthClassName?: string;
}

export function Popover({
  trigger,
  title,
  description,
  children,
  open,
  onOpenChange,
  side = 'bottom',
  align = 'start',
  widthClassName = 'min-w-[240px] max-w-sm',
}: PopoverProps) {
  const triggerRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const generatedId = useId();
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = isControlled ? Boolean(open) : internalOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setInternalOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        panelRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, setOpen]);

  const positionClasses: Record<typeof side, string> = {
    bottom: 'top-full mt-2 left-0',
    top: 'bottom-full mb-2 left-0',
    left: 'right-full mr-2 top-0',
    right: 'left-full ml-2 top-0',
  };

  const alignmentClasses: Record<typeof align, string> = {
    start: '',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0',
  };

  const panelPosition = cx(
    'absolute z-50 rounded-xl border border-slate-200 bg-white p-4 shadow-xl focus:outline-none transition-colors dark:border-slate-700 dark:bg-slate-900',
    positionClasses[side],
    alignmentClasses[align],
    widthClassName,
  );

  return (
    <div className="relative inline-flex">
      {cloneElement(trigger, {
        ref: (node: HTMLElement | null) => {
          triggerRef.current = node;
          const originalRef = (trigger as { ref?: Ref<HTMLElement> }).ref;
          if (!originalRef) return;
          if (typeof originalRef === 'function') {
            originalRef(node);
          } else if (originalRef && typeof originalRef === 'object') {
            (originalRef as MutableRefObject<HTMLElement | null>).current = node;
          }
        },
        onClick: (event: React.MouseEvent) => {
          trigger.props.onClick?.(event);
          setOpen(!isOpen);
        },
        'aria-haspopup': 'dialog',
        'aria-expanded': isOpen,
        'aria-controls': generatedId,
      })}
      {isOpen && (
        <div
          id={generatedId}
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          className={panelPosition}
        >
          <div className="space-y-2 text-sm text-slate-600">
            {(title || description) && (
              <div className="space-y-1">
                {title && (
                  <p className="text-sm font-semibold text-slate-900">{title}</p>
                )}
                {description && (
                  <p className="text-xs text-slate-500">{description}</p>
                )}
              </div>
            )}
            <div>{children}</div>
          </div>
        </div>
      )}
    </div>
  );
}

Popover.displayName = 'Popover';

export default Popover;
