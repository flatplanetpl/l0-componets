'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export interface ModalAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  icon?: ReactNode;
  dismiss?: boolean;
}

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  primaryAction?: ModalAction;
  secondaryAction?: ModalAction;
  actions?: ModalAction[];
  footerContent?: ReactNode;
  showCloseButton?: boolean;
  size?: ModalSize;
  preventCloseOnOverlay?: boolean;
  preventCloseOnEsc?: boolean;
  loading?: boolean;
}

const actionClasses: Record<NonNullable<ModalAction['variant']>, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'border border-border bg-card text-foreground hover:bg-muted/50 focus:ring-blue-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
};

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'h-full w-full max-w-none sm:h-auto sm:mx-6',
};

function renderAction(action: ModalAction, onClose: () => void) {
  const variant = action.variant ?? 'primary';
  const content = action.loading ? 'Przetwarzanie…' : action.label;
  return (
    <button
      key={action.label}
      type="button"
      onClick={() => {
        if (action.dismiss) {
          onClose();
        }
        action.onClick();
      }}
      disabled={action.loading}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        action.loading ? 'cursor-not-allowed opacity-70' : ''
      } ${actionClasses[variant]}`}
    >
      {action.icon && !action.loading && <span className="h-4 w-4">{action.icon}</span>}
      {content}
    </button>
  );
}

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  primaryAction,
  secondaryAction,
  actions,
  footerContent,
  showCloseButton = true,
  size = 'md',
  preventCloseOnOverlay,
  preventCloseOnEsc,
  loading,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open || preventCloseOnEsc) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (!preventCloseOnEsc) {
      document.addEventListener('keydown', handleKeyDown);
    }
    document.body.style.overflow = 'hidden';

    return () => {
      if (!preventCloseOnEsc) {
        document.removeEventListener('keydown', handleKeyDown);
      }
      document.body.style.overflow = '';
    };
  }, [open, onClose, preventCloseOnEsc]);

  const handleBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!preventCloseOnOverlay && event.target === overlayRef.current) {
        onClose();
      }
    },
    [onClose, preventCloseOnOverlay],
  );

  if (!mounted || !open) {
    return null;
  }

  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-description' : undefined}
    >
      <div
        className={`w-full transform rounded-2xl bg-card shadow-2xl transition-all ${sizeClasses[size]}`}
      >
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4">
          <div className="space-y-1">
            {title && (
              <h2 id="modal-title" className="text-lg font-semibold text-foreground">
                {title}
              </h2>
            )}
            {description && (
              <p id="modal-description" className="text-sm text-slate-600">
                {description}
              </p>
            )}
          </div>
          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Zamknij modal"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <div className="relative px-6 py-5">
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-card/70">
              <p className="text-sm font-medium text-muted-foreground">Przetwarzanie…</p>
            </div>
          )}
          <div className="text-sm text-slate-700 dark:text-slate-200">{children}</div>
        </div>
        {(footerContent || primaryAction || secondaryAction || (actions && actions.length > 0)) && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-700/70 dark:bg-slate-900/60">
            {footerContent && <div className="text-xs text-muted-foreground">{footerContent}</div>}
            <div className="flex flex-wrap items-center gap-2">
              {actions &&
                actions.map((action) => renderAction(action, onClose))}
              {secondaryAction &&
                renderAction({ ...secondaryAction, variant: secondaryAction.variant ?? 'secondary' }, onClose)}
              {primaryAction &&
                renderAction({ ...primaryAction, variant: primaryAction.variant ?? 'primary' }, onClose)}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
