'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  description?: string;
  icon?: ReactNode;
  badge?: ReactNode;
  disabled?: boolean;
}

export interface TabsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  tabs: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  fitted?: boolean;
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      tabs,
      value,
      defaultValue,
      onValueChange,
      orientation = 'horizontal',
      fitted,
      className,
      ...props
    },
    ref,
  ) => {
    const tabIds = tabs.map((tab) => tab.id);
    const firstEnabled = useMemo(
      () => tabs.find((tab) => !tab.disabled)?.id ?? tabs[0]?.id,
      [tabs],
    );

    const isControlled = typeof value === 'string';
    const [internalValue, setInternalValue] = useState<string>(
      () => defaultValue ?? firstEnabled ?? '',
    );

    useEffect(() => {
      if (defaultValue && !isControlled) {
        setInternalValue(defaultValue);
      }
    }, [defaultValue, isControlled]);

    const activeValue =
      (isControlled ? value : internalValue) ?? firstEnabled ?? '';

    const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

    const setActiveValue = useCallback(
      (next: string) => {
        if (!tabIds.includes(next)) return;
        if (!isControlled) {
          setInternalValue(next);
        }
        onValueChange?.(next);
      },
      [isControlled, onValueChange, tabIds],
    );

    const focusTab = useCallback((id: string) => {
      const button = tabRefs.current[id];
      if (button) {
        button.focus();
      }
    }, []);

    const moveFocus = useCallback(
      (currentId: string, direction: 1 | -1) => {
        if (!tabIds.length) return;
        const currentIndex = tabIds.indexOf(currentId);
        let nextIndex = currentIndex;

        do {
          nextIndex = (nextIndex + direction + tabIds.length) % tabIds.length;
          const candidateId = tabIds[nextIndex];
          const candidate = tabs.find((tab) => tab.id === candidateId);
          if (candidate && !candidate.disabled) {
            focusTab(candidateId);
            setActiveValue(candidateId);
            break;
          }
        } while (nextIndex !== currentIndex);
      },
      [focusTab, setActiveValue, tabIds, tabs],
    );

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        const { key } = event;
        if (!tabIds.length) return;

        if (orientation === 'horizontal') {
          if (key === 'ArrowRight') {
            event.preventDefault();
            moveFocus(activeValue, 1);
          } else if (key === 'ArrowLeft') {
            event.preventDefault();
            moveFocus(activeValue, -1);
          }
        } else {
          if (key === 'ArrowDown') {
            event.preventDefault();
            moveFocus(activeValue, 1);
          } else if (key === 'ArrowUp') {
            event.preventDefault();
            moveFocus(activeValue, -1);
          }
        }

        if (key === 'Home') {
          event.preventDefault();
          const first = tabs.find((tab) => !tab.disabled);
          if (first) {
            focusTab(first.id);
            setActiveValue(first.id);
          }
        } else if (key === 'End') {
          event.preventDefault();
          const reversed = [...tabs].reverse();
          const last = reversed.find((tab) => !tab.disabled);
          if (last) {
            focusTab(last.id);
            setActiveValue(last.id);
          }
        }
      },
      [activeValue, focusTab, moveFocus, orientation, setActiveValue, tabIds.length, tabs],
    );

    return (
      <div
        ref={ref}
        className={cx(
          'flex rounded-xl border border-slate-200 bg-white transition-colors dark:border-slate-700 dark:bg-slate-900',
          orientation === 'horizontal' ? 'flex-col' : 'flex-row',
          className,
        )}
        {...props}
      >
        <div
          role="tablist"
          aria-orientation={orientation}
          className={cx(
            'flex',
            orientation === 'horizontal'
              ? 'flex-row border-b border-slate-200 dark:border-slate-700'
              : 'flex-col border-r border-slate-200 dark:border-slate-700',
          )}
          onKeyDown={handleKeyDown}
        >
          {tabs.map((tab) => {
            const selected = tab.id === activeValue;
            return (
              <button
                key={tab.id}
                ref={(node) => {
                  tabRefs.current[tab.id] = node;
                }}
                role="tab"
                id={`tab-${tab.id}`}
                type="button"
                aria-selected={selected}
                aria-controls={`panel-${tab.id}`}
                disabled={tab.disabled}
                onClick={() => !tab.disabled && setActiveValue(tab.id)}
                className={cx(
                  'group inline-flex min-w-[120px] items-center gap-2 px-4 py-3 text-sm font-medium text-slate-600 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:text-slate-300',
                  orientation === 'horizontal'
                    ? 'border-b-2'
                    : 'border-l-2',
                  selected
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent hover:border-slate-200 hover:text-slate-800 dark:hover:border-slate-600 dark:hover:text-slate-200',
                  tab.disabled && 'cursor-not-allowed opacity-50',
                  fitted && orientation === 'horizontal' && 'flex-1 justify-center',
                )}
              >
                {tab.icon && <span className="text-slate-500 transition-colors group-hover:text-blue-500 dark:text-slate-400 dark:group-hover:text-blue-400">{tab.icon}</span>}
                <span className="transition-colors dark:text-inherit">{tab.label}</span>
                {tab.badge && <span className="text-xs text-slate-400 transition-colors dark:text-slate-400/80">{tab.badge}</span>}
              </button>
            );
          })}
        </div>
        <div
          className={cx(
            'flex-1',
            orientation === 'horizontal' ? 'p-4' : 'p-4',
          )}
        >
          {tabs.map((tab) => {
            const selected = tab.id === activeValue;
            return (
              <div
                key={tab.id}
                role="tabpanel"
                id={`panel-${tab.id}`}
                aria-labelledby={`tab-${tab.id}`}
                hidden={!selected}
                className="space-y-2 text-sm text-slate-600 transition-colors dark:text-slate-300"
              >
                {selected && tab.content}
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);

Tabs.displayName = 'Tabs';

export default Tabs;
