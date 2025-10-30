'use client';

import {
  cloneElement,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export interface TooltipProps {
  content: ReactNode;
  children: ReactElement;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  delay?: number;
}

export function Tooltip({
  content,
  children,
  side = 'top',
  align = 'center',
  delay = 80,
}: TooltipProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const show = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setVisible(false);
  };

  const alignmentClasses: Record<typeof align, string> = {
    start: 'items-start text-left',
    center: 'items-center text-center',
    end: 'items-end text-right',
  };

  const positionClasses: Record<typeof side, string> = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
  };

  return (
    <span className="relative inline-flex" onMouseLeave={hide} onMouseDown={hide}>
      {cloneElement(children, {
        onMouseEnter: (event: React.MouseEvent) => {
          children.props.onMouseEnter?.(event);
          show();
        },
        onFocus: (event: React.FocusEvent) => {
          children.props.onFocus?.(event);
          show();
        },
        onBlur: (event: React.FocusEvent) => {
          children.props.onBlur?.(event);
          hide();
        },
        'aria-describedby': visible ? id : undefined,
      })}
      {visible && (
        <span
          role="tooltip"
          id={id}
          className={cx(
            'pointer-events-none absolute z-50 flex max-w-xs rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white shadow-lg transition-colors dark:bg-slate-100 dark:text-slate-900',
            positionClasses[side],
            alignmentClasses[align],
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}

Tooltip.displayName = 'Tooltip';

export default Tooltip;
