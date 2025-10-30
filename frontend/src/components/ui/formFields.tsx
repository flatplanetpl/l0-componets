'use client';

import { forwardRef, useId, useState } from 'react';
import type {
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from 'react';
import { Eye, EyeOff } from 'lucide-react';

type ValidationStatus = 'default' | 'success' | 'error';

function classNames(...classes: Array<string | boolean | undefined>) {
  return classes.filter(Boolean).join(' ');
}

interface FormFieldShellProps {
  fieldId: string;
  label?: string;
  required?: boolean;
  helperText?: string;
  helperId?: string;
  error?: string;
  errorId?: string;
  children: ReactNode;
}

function FormFieldShell({
  fieldId,
  label,
  required,
  helperText,
  helperId,
  error,
  errorId,
  children,
}: FormFieldShellProps) {
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

const baseControlClasses =
  'w-full rounded-lg border px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-offset-0 placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500';

const statusClasses: Record<ValidationStatus, string> = {
  default: 'border-slate-300 focus:ring-blue-500',
  success: 'border-emerald-500 focus:ring-emerald-500',
  error: 'border-rose-500 focus:ring-rose-500',
};

export interface BaseFieldProps {
  label?: string;
  helperText?: string;
  error?: string;
  validationStatus?: ValidationStatus;
}

export interface TextFieldProps
  extends BaseFieldProps,
    InputHTMLAttributes<HTMLInputElement> {}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      id: providedId,
      label,
      helperText,
      error,
      validationStatus = 'default',
      required,
      className,
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
      <FormFieldShell
        fieldId={id}
        label={label}
        required={required}
        helperText={helperText}
        helperId={helperId}
        error={error}
        errorId={errorId}
      >
        <input
          id={id}
          ref={ref}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={
            [helperId, errorId].filter(Boolean).join(' ') || undefined
          }
          className={classNames(
            baseControlClasses,
            statusClasses[status],
            className,
          )}
          {...props}
        />
      </FormFieldShell>
    );
  },
);
TextField.displayName = 'TextField';

export interface TextareaFieldProps
  extends BaseFieldProps,
    TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const TextareaField = forwardRef<
  HTMLTextAreaElement,
  TextareaFieldProps
>(
  (
    {
      id: providedId,
      label,
      helperText,
      error,
      validationStatus = 'default',
      required,
      className,
      disabled,
      rows = 4,
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
      <FormFieldShell
        fieldId={id}
        label={label}
        required={required}
        helperText={helperText}
        helperId={helperId}
        error={error}
        errorId={errorId}
      >
        <textarea
          id={id}
          ref={ref}
          rows={rows}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={
            [helperId, errorId].filter(Boolean).join(' ') || undefined
          }
          className={classNames(
            baseControlClasses,
            'min-h-[120px] resize-y',
            statusClasses[status],
            className,
          )}
          {...props}
        />
      </FormFieldShell>
    );
  },
);
TextareaField.displayName = 'TextareaField';

export interface PasswordFieldProps
  extends Omit<TextFieldProps, 'type'> {}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  (
    {
      id: providedId,
      label,
      helperText,
      error,
      validationStatus = 'default',
      required,
      className,
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
    const [visible, setVisible] = useState(false);

    const toggleVisibility = () => setVisible((prev) => !prev);
    const describedBy =
      [helperId, errorId].filter(Boolean).join(' ') || undefined;

    return (
      <FormFieldShell
        fieldId={id}
        label={label}
        required={required}
        helperText={helperText}
        helperId={helperId}
        error={error}
        errorId={errorId}
      >
        <div className="relative">
          <input
            id={id}
            ref={ref}
            type={visible ? 'text' : 'password'}
            autoComplete="new-password"
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            className={classNames(
              baseControlClasses,
              'pr-10',
              statusClasses[status],
              className,
            )}
            {...props}
          />
          <button
            type="button"
            onClick={toggleVisibility}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 transition hover:text-slate-700"
            aria-label={visible ? 'Ukryj hasło' : 'Pokaż hasło'}
            tabIndex={-1}
          >
            {visible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </FormFieldShell>
    );
  },
);
PasswordField.displayName = 'PasswordField';

export interface NumberFieldProps
  extends Omit<TextFieldProps, 'type'> {}

export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(
  (
    {
      id: providedId,
      label,
      helperText,
      error,
      validationStatus = 'default',
      required,
      className,
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
      <FormFieldShell
        fieldId={id}
        label={label}
        required={required}
        helperText={helperText}
        helperId={helperId}
        error={error}
        errorId={errorId}
      >
        <input
          id={id}
          ref={ref}
          type="number"
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={
            [helperId, errorId].filter(Boolean).join(' ') || undefined
          }
          className={classNames(
            baseControlClasses,
            statusClasses[status],
            className,
          )}
          {...props}
        />
      </FormFieldShell>
    );
  },
);
NumberField.displayName = 'NumberField';

export interface ColorPickerFieldProps
  extends BaseFieldProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  showValue?: boolean;
}

export const ColorPickerField = forwardRef<HTMLInputElement, ColorPickerFieldProps>(
  (
    {
      id: providedId,
      label,
      helperText,
      error,
      validationStatus = 'default',
      required,
      className,
      disabled,
      value,
      defaultValue,
      onChange,
      showValue = true,
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
      <FormFieldShell
        fieldId={id}
        label={label}
        required={required}
        helperText={helperText}
        helperId={helperId}
        error={error}
        errorId={errorId}
      >
        <div className="flex items-center gap-3">
          <input
            id={id}
            ref={ref}
            type="color"
            value={value}
            defaultValue={defaultValue}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={
              [helperId, errorId].filter(Boolean).join(' ') || undefined
            }
            className={classNames(
              'h-12 w-12 cursor-pointer rounded-lg border border-slate-300 bg-transparent p-0 transition focus:outline-none focus:ring-2 focus:ring-blue-500',
              disabled && 'cursor-not-allowed opacity-75',
              className,
            )}
            onChange={onChange}
            {...props}
          />
          {showValue && (
            <span className={classNames(
              'rounded-lg border px-3 py-2 text-sm font-mono uppercase tracking-wide text-slate-600',
              status === 'error'
                ? 'border-rose-400'
                : status === 'success'
                ? 'border-emerald-400'
                : 'border-slate-200',
            )}>
              {(value ?? defaultValue ?? '#2563EB').toString()}
            </span>
          )}
        </div>
      </FormFieldShell>
    );
  },
);
ColorPickerField.displayName = 'ColorPickerField';
