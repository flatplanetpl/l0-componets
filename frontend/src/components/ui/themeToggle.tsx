'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './themeProvider';
import type { ButtonHTMLAttributes } from 'react';

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function ThemeToggle({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { theme, toggleTheme, setTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div
        className={cx(
          'relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800',
          className,
        )}
        aria-hidden="true"
      />
    );
  }

  return (
    <button
      type="button"
      aria-label="Przełącz tryb kolorystyczny"
      data-theme={theme}
      onClick={toggleTheme}
      className={cx(
        'relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition hover:border-blue-400 hover:text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500',
        className,
      )}
      {...props}
    >
      <Sun
        className={cx(
          'h-4 w-4 transition-transform duration-300',
          theme === 'dark' ? 'translate-y-2 rotate-90 opacity-0' : 'translate-y-0 opacity-100',
        )}
      />
      <Moon
        className={cx(
          'absolute h-4 w-4 transition-transform duration-300',
          theme === 'dark' ? 'translate-y-0 opacity-100' : '-translate-y-2 -rotate-90 opacity-0',
        )}
      />
      <span className="sr-only">
        {theme === 'dark' ? 'Przełącz na tryb jasny' : 'Przełącz na tryb ciemny'}
      </span>
      <div className="absolute right-2 top-2 flex gap-1">
        <div
          role="button"
          tabIndex={0}
          aria-label="Tryb jasny"
          onClick={(event) => {
            event.stopPropagation();
            setTheme('light');
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              event.stopPropagation();
              setTheme('light');
            }
          }}
          className={cx(
            'h-2 w-2 rounded-full border transition cursor-pointer',
            theme === 'light'
              ? 'border-blue-500 bg-blue-500'
              : 'border-slate-400 bg-white/40 dark:bg-slate-600',
          )}
        />
        <div
          role="button"
          tabIndex={0}
          aria-label="Tryb ciemny"
          onClick={(event) => {
            event.stopPropagation();
            setTheme('dark');
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              event.stopPropagation();
              setTheme('dark');
            }
          }}
          className={cx(
            'h-2 w-2 rounded-full border transition cursor-pointer',
            theme === 'dark'
              ? 'border-blue-500 bg-blue-500'
              : 'border-slate-400 bg-white/40 dark:bg-slate-600',
          )}
        />
      </div>
    </button>
  );
}
