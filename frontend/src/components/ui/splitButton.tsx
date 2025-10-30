'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

function mergeClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export interface SplitButtonOption {
  label: string;
  icon?: ReactNode;
  onSelect?: () => void;
  description?: string;
}

export interface SplitButtonProps {
  label: string;
  onPrimaryAction: () => void;
  options: SplitButtonOption[];
  className?: string;
  disabled?: boolean;
}

export default function SplitButton({
  label,
  onPrimaryAction,
  options,
  className,
  disabled,
}: SplitButtonProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        toggleRef.current &&
        !toggleRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div
      className={mergeClasses(
        'relative inline-flex items-stretch overflow-hidden rounded-full border border-blue-600 shadow-sm transition-colors dark:border-blue-400',
        disabled && 'opacity-60',
        className,
      )}
    >
      <button
        type="button"
        onClick={onPrimaryAction}
        disabled={disabled}
        className="inline-flex items-center bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        {label}
      </button>
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        disabled={disabled}
        aria-haspopup="true"
        aria-expanded={open}
        className="inline-flex h-full min-w-[44px] items-center justify-center bg-blue-700 px-3 py-2 text-white transition hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-700"
      >
        <ChevronDown className={mergeClasses('h-4 w-4 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div
          ref={menuRef}
          className="absolute right-0 top-full z-40 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl transition-colors dark:border-slate-700 dark:bg-slate-900"
          role="menu"
        >
          {options.map((option) => (
            <button
              key={option.label}
              type="button"
              className="flex w-full items-start gap-3 px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:text-slate-200 dark:hover:bg-slate-800"
              onClick={() => {
                option.onSelect?.();
                setOpen(false);
              }}
            >
              {option.icon && <span className="mt-0.5 text-blue-500 dark:text-blue-400">{option.icon}</span>}
              <span className="flex-1">
                <span className="block font-medium text-slate-800 dark:text-slate-100">{option.label}</span>
                {option.description && (
                  <span className="text-xs text-slate-500 dark:text-slate-400">{option.description}</span>
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
