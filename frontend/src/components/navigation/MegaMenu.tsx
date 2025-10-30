'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

function mergeClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export interface MegaMenuItem {
  label: string;
  description?: string;
  href: string;
  icon?: ReactNode;
}

export interface MegaMenuColumn {
  heading: string;
  items: MegaMenuItem[];
}

export interface MegaMenuProps {
  triggerLabel: string;
  description?: string;
  columns: MegaMenuColumn[];
  cta?: { label: string; href: string };
  className?: string;
}

export default function MegaMenu({
  triggerLabel,
  description,
  columns,
  cta,
  className,
}: MegaMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
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
    <div className={mergeClasses('relative', className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls="mega-menu-panel"
        className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
      >
        {triggerLabel}
        <ChevronDown className={mergeClasses('h-4 w-4 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div
          ref={menuRef}
          id="mega-menu-panel"
          className="absolute left-0 top-full z-40 mt-3 w-[min(680px,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white shadow-2xl"
        >
          <div className="grid gap-8 p-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,2fr)]">
            <div className="grid gap-6 sm:grid-cols-2">
              {columns.map((column) => (
                <div key={column.heading} className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {column.heading}
                  </p>
                  <ul className="space-y-2">
                    {column.items.map((item) => (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          className="group flex items-start gap-3 rounded-lg px-2 py-2 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                          onClick={() => setOpen(false)}
                        >
                          {item.icon && (
                            <span className="mt-0.5 text-blue-600">
                              {item.icon}
                            </span>
                          )}
                          <span className="flex-1">
                            <span className="block text-sm font-medium text-slate-900 group-hover:text-blue-600">
                              {item.label}
                            </span>
                            {item.description && (
                              <span className="block text-xs text-slate-500">
                                {item.description}
                              </span>
                            )}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="space-y-4 rounded-xl bg-slate-50 p-5">
              {description && (
                <p className="text-sm text-slate-600">{description}</p>
              )}
              {cta && (
                <Link
                  href={cta.href}
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                  onClick={() => setOpen(false)}
                >
                  {cta.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
