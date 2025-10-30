'use client';

import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
} from 'react';
import { Search, Check } from 'lucide-react';

type ValidationStatus = 'default' | 'success' | 'error';

const baseControlClasses =
  'w-full rounded-lg border px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-offset-0 placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500';

const statusClasses: Record<ValidationStatus, string> = {
  default: 'border-slate-300 focus:ring-blue-500',
  success: 'border-emerald-500 focus:ring-emerald-500',
  error: 'border-rose-500 focus:ring-rose-500',
};

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

interface FieldWrapperProps {
  fieldId: string;
  label?: string;
  required?: boolean;
  helperText?: string;
  helperId?: string;
  error?: string;
  errorId?: string;
  children: ReactNode;
}

function FieldWrapper({
  fieldId,
  label,
  required,
  helperText,
  helperId,
  error,
  errorId,
  children,
}: FieldWrapperProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={fieldId}
          className="text-sm font-medium text-slate-700"
        >
          {label}
          {required && <span className="ml-1 text-rose-600">*</span>}
        </label>
      )}
      {children}
      {helperText && (
        <p id={helperId} className="text-xs text-slate-500">
          {helperText}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}

export interface CheckboxFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  helperText?: string;
  error?: string;
  description?: string;
  onCheckedChange?: (checked: boolean) => void;
}

export const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(
  (
    {
      id: providedId,
      label,
      helperText,
      error,
      description,
      onCheckedChange,
      className,
      required,
      disabled,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const id = providedId ?? generatedId;
    const helperId = helperText ? `${id}-helper` : undefined;
    const errorId = error ? `${id}-error` : undefined;

    return (
      <div className="space-y-1.5">
        <div className="flex items-start space-x-2">
          <div className="relative flex h-5 w-5 items-center justify-center">
            <input
              id={id}
              ref={ref}
              type="checkbox"
              className={classNames(
                'peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 transition checked:border-blue-600 checked:bg-blue-600 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100',
                className,
              )}
              aria-describedby={
                [helperId, errorId].filter(Boolean).join(' ') || undefined
              }
              aria-invalid={Boolean(error)}
              disabled={disabled}
              required={required}
              onChange={(event) => {
                onCheckedChange?.(event.target.checked);
                props.onChange?.(event);
              }}
              {...props}
            />
            <Check className="pointer-events-none absolute h-3 w-3 text-white opacity-0 transition peer-checked:opacity-100" />
          </div>
          <label htmlFor={id} className="cursor-pointer select-none text-sm text-slate-700">
            {label}
            {required && <span className="ml-1 text-rose-600">*</span>}
            {description && (
              <span className="mt-1 block text-xs text-slate-500">
                {description}
              </span>
            )}
          </label>
        </div>
        {helperText && (
          <p id={helperId} className="text-xs text-slate-500">
            {helperText}
          </p>
        )}
        {error && (
          <p id={errorId} className="text-xs text-rose-600">
            {error}
          </p>
        )}
      </div>
    );
  },
);
CheckboxField.displayName = 'CheckboxField';

export interface SwitchFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  helperText?: string;
  error?: string;
  description?: string;
  onCheckedChange?: (checked: boolean) => void;
}

export const SwitchField = forwardRef<HTMLInputElement, SwitchFieldProps>(
  (
    {
      id: providedId,
      label,
      helperText,
      error,
      description,
      onCheckedChange,
      required,
      disabled,
      className,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const id = providedId ?? generatedId;
    const helperId = helperText ? `${id}-helper` : undefined;
    const errorId = error ? `${id}-error` : undefined;

    return (
      <div className="space-y-1.5">
        <label
          htmlFor={id}
          className="flex cursor-pointer items-center space-x-3"
        >
          <span className="relative inline-flex h-6 w-11 items-center">
            <input
              id={id}
              ref={ref}
              type="checkbox"
              className={classNames(
                'peer sr-only',
                className,
              )}
              role="switch"
              aria-describedby={
                [helperId, errorId].filter(Boolean).join(' ') || undefined
              }
              aria-invalid={Boolean(error)}
              disabled={disabled}
              required={required}
              onChange={(event) => {
                onCheckedChange?.(event.target.checked);
                props.onChange?.(event);
              }}
              {...props}
            />
            <span className="absolute inset-0 rounded-full bg-slate-300 transition peer-checked:bg-blue-600 peer-disabled:bg-slate-200" />
            <span className="absolute left-1 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-5 peer-disabled:bg-slate-100" />
          </span>
          <span className="text-sm text-slate-700">
            {label}
            {required && <span className="ml-1 text-rose-600">*</span>}
            {description && (
              <span className="mt-1 block text-xs text-slate-500">
                {description}
              </span>
            )}
          </span>
        </label>
        {helperText && (
          <p id={helperId} className="text-xs text-slate-500">
            {helperText}
          </p>
        )}
        {error && (
          <p id={errorId} className="text-xs text-rose-600">
            {error}
          </p>
        )}
      </div>
    );
  },
);
SwitchField.displayName = 'SwitchField';

export interface SelectFieldProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  helperText?: string;
  error?: string;
  validationStatus?: ValidationStatus;
  options: Array<{ label: string; value: string }>;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  (
    {
      id: providedId,
      label,
      helperText,
      error,
      validationStatus = 'default',
      options,
      required,
      disabled,
      className,
      onChange,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const id = providedId ?? generatedId;
    const helperId = helperText ? `${id}-helper` : undefined;
    const errorId = error ? `${id}-error` : undefined;
    const status = error ? 'error' : validationStatus;

    return (
      <FieldWrapper
        fieldId={id}
        label={label}
        required={required}
        helperText={helperText}
        helperId={helperId}
        error={error}
        errorId={errorId}
      >
        <select
          id={id}
          ref={ref}
          className={classNames(
            baseControlClasses,
            'appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 20 20\' fill=\'none\' stroke=\'%23657487\'%3E%3Cpolyline points=\'6 8 10 12 14 8\' stroke-width=\'1.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E")] bg-[length:1.25rem] bg-[position:calc(100%-0.75rem)_center] bg-no-repeat pr-10',
            statusClasses[status],
            className,
          )}
          disabled={disabled}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={
            [helperId, errorId].filter(Boolean).join(' ') || undefined
          }
          onChange={(event) => {
            onChange?.(event);
          }}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FieldWrapper>
    );
  },
);
SelectField.displayName = 'SelectField';

export interface RadioOption {
  label: string;
  value: string;
  description?: string;
}

export interface RadioGroupFieldProps {
  name: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  helperText?: string;
  error?: string;
  required?: boolean;
  orientation?: 'vertical' | 'horizontal';
}

export function RadioGroupField({
  name,
  label,
  value,
  onChange,
  options,
  helperText,
  error,
  required,
  orientation = 'vertical',
}: RadioGroupFieldProps) {
  const groupId = useId();
  const helperId = helperText ? `${groupId}-helper` : undefined;
  const errorId = error ? `${groupId}-error` : undefined;
  const isHorizontal = orientation === 'horizontal';

  return (
    <fieldset
      className="space-y-1.5"
      aria-describedby={[helperId, errorId].filter(Boolean).join(' ') || undefined}
    >
      {label && (
        <legend className="text-sm font-medium text-slate-700">
          {label}
          {required && <span className="ml-1 text-rose-600">*</span>}
        </legend>
      )}
      <div
        className={classNames(
          isHorizontal ? 'flex flex-wrap items-center gap-3' : 'space-y-2',
        )}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className={classNames(
              'flex cursor-pointer items-center space-x-2 text-sm text-slate-700',
              isHorizontal ? '' : 'w-full',
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
              required={required}
            />
            <div className="flex flex-col">
              <span>{option.label}</span>
              {option.description && (
                <span className="text-xs text-slate-500">
                  {option.description}
                </span>
              )}
            </div>
          </label>
        ))}
      </div>
      {helperText && (
        <p id={helperId} className="text-xs text-slate-500">
          {helperText}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs text-rose-600">
          {error}
        </p>
      )}
    </fieldset>
  );
}

export interface SearchFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  helperText?: string;
  error?: string;
  validationStatus?: ValidationStatus;
}

export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(
  (
    {
      id: providedId,
      helperText,
      error,
      validationStatus = 'default',
      className,
      required,
      disabled,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const id = providedId ?? generatedId;
    const helperId = helperText ? `${id}-helper` : undefined;
    const errorId = error ? `${id}-error` : undefined;
    const status = error ? 'error' : validationStatus;

    return (
      <FieldWrapper
        fieldId={id}
        helperText={helperText}
        helperId={helperId}
        error={error}
        errorId={errorId}
      >
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id={id}
            ref={ref}
            type="search"
            className={classNames(
              baseControlClasses,
              'pl-9',
              statusClasses[status],
              className,
            )}
            required={required}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={
              [helperId, errorId].filter(Boolean).join(' ') || undefined
            }
            {...props}
          />
        </div>
      </FieldWrapper>
    );
  },
);
SearchField.displayName = 'SearchField';
