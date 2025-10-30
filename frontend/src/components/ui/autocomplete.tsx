'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type {
  InputHTMLAttributes,
  ReactNode,
} from 'react';
import { Loader2, Search } from 'lucide-react';

function mergeClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export interface AutocompleteOption {
  label: string;
  value: string;
  description?: string;
  icon?: ReactNode;
}

export interface AutocompleteProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onSelect'> {
  options: AutocompleteOption[];
  onOptionSelect?: (option: AutocompleteOption) => void;
  onQueryChange?: (query: string) => void;
  emptyMessage?: string;
  loading?: boolean;
  renderOption?: (option: AutocompleteOption) => ReactNode;
}

const defaultEmptyMessage = 'Brak wyników dla zapytania.';

export const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
  (
    {
      options,
      onOptionSelect,
      onQueryChange,
      renderOption,
      loading = false,
      emptyMessage = defaultEmptyMessage,
      placeholder = 'Szukaj…',
      className,
      disabled,
      value,
      defaultValue,
      ...rest
    },
    ref,
  ) => {
    const [query, setQuery] = useState(() => (value as string) ?? (defaultValue as string) ?? '');
    const [open, setOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(0);

    const inputRef = useRef<HTMLInputElement | null>(null);
    const listRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (typeof value === 'string') {
        setQuery(value);
      }
    }, [value]);

    const filteredOptions = useMemo(() => {
      if (!query) return options;
      const normalized = query.toLowerCase();
      return options.filter((option) =>
        option.label.toLowerCase().includes(normalized) ||
        option.description?.toLowerCase().includes(normalized),
      );
    }, [options, query]);

    useEffect(() => {
      if (highlightedIndex >= filteredOptions.length) {
        setHighlightedIndex(Math.max(filteredOptions.length - 1, 0));
      }
    }, [filteredOptions.length, highlightedIndex]);

    const handleQueryChange = useCallback(
      (next: string) => {
        if (value === undefined) {
          setQuery(next);
        }
        onQueryChange?.(next);
      },
      [onQueryChange, value],
    );

    const handleSelect = useCallback(
      (option: AutocompleteOption) => {
        onOptionSelect?.(option);
        if (value === undefined) {
          setQuery(option.label);
        }
        setOpen(false);
      },
      [onOptionSelect, value],
    );

    useEffect(() => {
      if (!open) return;

      const handleOutside = (event: MouseEvent) => {
        if (
          listRef.current &&
          !listRef.current.contains(event.target as Node) &&
          inputRef.current &&
          !inputRef.current.contains(event.target as Node)
        ) {
          setOpen(false);
        }
      };

      window.addEventListener('mousedown', handleOutside);
      return () => window.removeEventListener('mousedown', handleOutside);
    }, [open]);

    return (
      <div className="relative">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            ref={(node) => {
              inputRef.current = node;
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
              }
            }}
            type="text"
            className={mergeClasses(
              'w-full rounded-lg border border-slate-200 bg-white px-9 py-2 text-sm text-slate-700 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-slate-100',
              className,
            )}
            placeholder={placeholder}
            value={query}
            disabled={disabled}
            onFocus={() => {
              setOpen(true);
            }}
            onChange={(event) => {
              handleQueryChange(event.target.value);
              setOpen(true);
            }}
            onKeyDown={(event) => {
              if (!open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
                setOpen(true);
                return;
              }
              if (!open) return;
              if (event.key === 'ArrowDown') {
                event.preventDefault();
                setHighlightedIndex((prev) => Math.min(prev + 1, filteredOptions.length - 1));
              } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                setHighlightedIndex((prev) => Math.max(prev - 1, 0));
              } else if (event.key === 'Enter') {
                event.preventDefault();
                const option = filteredOptions[highlightedIndex];
                if (option) {
                  handleSelect(option);
                }
              } else if (event.key === 'Escape') {
                setOpen(false);
              }
            }}
            {...rest}
          />
        </div>

        {open && (
          <div
            ref={listRef}
            className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                Szukam…
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className="px-4 py-6 text-sm text-slate-500">{emptyMessage}</div>
            ) : (
              <ul className="max-h-64 overflow-y-auto py-2 text-sm">
                {filteredOptions.map((option, index) => (
                  <li key={option.value}>
                    <button
                      type="button"
                      onClick={() => handleSelect(option)}
                      className={mergeClasses(
                        'flex w-full items-start gap-3 px-4 py-2 text-left transition',
                        highlightedIndex === index
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-slate-700 hover:bg-slate-100',
                      )}
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      {option.icon && <span className="mt-0.5 text-blue-500">{option.icon}</span>}
                      <span className="flex-1">
                        <span className="block font-medium">{option.label}</span>
                        {option.description && (
                          <span className="text-xs text-slate-500">{option.description}</span>
                        )}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    );
  },
);
Autocomplete.displayName = 'Autocomplete';

export default Autocomplete;
