'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';

type ToastVariant = 'default' | 'success' | 'error' | 'info' | 'warning';

export interface ToastAction {
  label: string;
  onClick: (toastId: string) => void;
  ariaLabel?: string;
}

export interface ToastOptions {
  id?: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number | null;
  action?: ToastAction;
  dismissible?: boolean;
}

export interface Toast extends ToastOptions {
  id: string;
  variant: ToastVariant;
  duration: number | null;
  dismissible: boolean;
}

interface ToastContextValue {
  showToast: (options: ToastOptions) => string;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const variantClasses: Record<ToastVariant, string> = {
  default: 'border-border bg-card text-foreground dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200',
  error: 'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200',
  info: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-200',
  warning: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200',
};

const variantIcons: Record<ToastVariant, ReactNode> = {
  default: <Info className="h-5 w-5" />,
  success: <CheckCircle2 className="h-5 w-5" />,
  error: <XCircle className="h-5 w-5" />,
  info: <Info className="h-5 w-5" />,
  warning: <AlertTriangle className="h-5 w-5" />,
};

function getId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `toast-${Date.now()}-${Math.round(Math.random() * 10_000)}`;
}

const positionClasses: Record<ToastPosition, string> = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
};

export type ToastPosition =
  | 'top-left'
  | 'top-right'
  | 'top-center'
  | 'bottom-left'
  | 'bottom-right'
  | 'bottom-center';

export interface ToastProviderProps {
  children: ReactNode;
  position?: ToastPosition;
  maxToasts?: number;
}

export function ToastProvider({ children, position = 'bottom-right', maxToasts = 4 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Record<string, NodeJS.Timeout>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      Object.values(timers.current).forEach(clearTimeout);
    };
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    const timer = timers.current[id];
    if (timer) {
      clearTimeout(timer);
      delete timers.current[id];
    }
  }, []);

  const showToast = useCallback(
    ({ id, title, description, variant = 'default', duration = 4000, action, dismissible = true }: ToastOptions) => {
      const toastId = id ?? getId();
      const toast: Toast = {
        id: toastId,
        title: title ?? 'Powiadomienie',
        description: description ?? '',
        variant,
        duration: duration ?? null,
        action,
        dismissible,
      };

      setToasts((current) => {
        const filtered = current.filter((existing) => existing.id !== toastId);
        const next = [...filtered, toast];
        if (next.length > maxToasts) {
          const [first, ...rest] = next;
          dismissToast(first.id);
          return rest;
        }
        return next;
      });

      if (duration !== null) {
        const timeout = setTimeout(() => {
          dismissToast(toastId);
        }, duration);

        timers.current[toastId] = timeout;
      }

      return toastId;
    },
    [dismissToast, maxToasts],
  );

  const contextValue = useMemo(() => ({ showToast, dismissToast }), [showToast, dismissToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {mounted &&
        createPortal(
          <div className={`pointer-events-none fixed z-50 flex w-full max-w-sm flex-col gap-3 ${positionClasses[position]}`}>
            {toasts.map((toast) => (
              <div
                key={toast.id}
                className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg transition ${variantClasses[toast.variant]}`}
              >
                <div className="mt-0.5 text-blue-600">{variantIcons[toast.variant]}</div>
                <div className="flex-1">
                  {toast.title && <p className="text-sm font-semibold">{toast.title}</p>}
                  {toast.description && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{toast.description}</p>}
                  {toast.action && (
                    <button
                      type="button"
                      onClick={() => toast.action?.onClick(toast.id)}
                      className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200"
                    >
                      {toast.action.label}
                    </button>
                  )}
                </div>
                {toast.dismissible && (
                  <button
                    type="button"
                    onClick={() => dismissToast(toast.id)}
                    className="text-slate-400 transition hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                    aria-label="Zamknij powiadomienie"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast musi być użyty wewnątrz ToastProvider');
  }
  return context;
}
