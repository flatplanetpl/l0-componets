'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

function mergeClasses(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(' ');
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface FooterProps {
  sections: FooterSection[];
  logo?: ReactNode;
  description?: string;
  bottomContent?: ReactNode;
  className?: string;
}

export default function Footer({
  sections,
  logo,
  description,
  bottomContent,
  className,
}: FooterProps) {
  return (
    <footer className={mergeClasses('border-t border-slate-200 bg-white text-slate-600', className)}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-12">
        <div className="grid gap-10 md:grid-cols-[minmax(0,2.5fr)_minmax(0,3fr)]">
          <div className="space-y-4">
            {logo && <div className="inline-flex items-center gap-2 text-slate-900">{logo}</div>}
            {description && <p className="text-sm text-slate-500">{description}</p>}
          </div>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {sections.map((section) => (
              <div key={section.title} className="space-y-3">
                <p className="text-sm font-semibold text-slate-900">{section.title}</p>
                <ul className="space-y-2 text-sm">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="transition hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col-reverse items-start justify-between gap-4 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} EduPlatform. Wszelkie prawa zastrzeżone.</p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <Link href="/privacy" className="hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">
              Polityka prywatności
            </Link>
            <span aria-hidden="true">•</span>
            <Link href="/terms" className="hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">
              Regulamin
            </Link>
            {bottomContent}
          </div>
        </div>
      </div>
    </footer>
  );
}
