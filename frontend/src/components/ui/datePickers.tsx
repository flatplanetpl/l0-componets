'use client';

import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { Calendar, Clock4 } from 'lucide-react';

function mergeClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

const baseInputClasses =
  'w-full rounded-lg border border-slate-200 bg-white px-9 py-2 text-sm text-slate-700 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-slate-100';

export interface DatePickerProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  displayFormat?: (value: string) => string;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, displayFormat, value, defaultValue, onChange, ...props }, ref) => {
    const formattedValue =
      typeof value === 'string' && displayFormat ? displayFormat(value) : value;

    return (
      <div className="relative">
        <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          ref={ref}
          type="date"
          className={mergeClasses(baseInputClasses, className)}
          value={formattedValue as string | undefined}
          defaultValue={defaultValue as string | undefined}
          onChange={onChange}
          {...props}
        />
      </div>
    );
  },
);
DatePicker.displayName = 'DatePicker';

export interface TimePickerProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {}

export const TimePicker = forwardRef<HTMLInputElement, TimePickerProps>(
  ({ className, ...props }, ref) => (
    <div className="relative">
      <Clock4 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        ref={ref}
        type="time"
        className={mergeClasses(baseInputClasses, className)}
        step={props.step ?? 300}
        {...props}
      />
    </div>
  ),
);
TimePicker.displayName = 'TimePicker';

export interface DateTimePickerProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {}

export const DateTimePicker = forwardRef<HTMLInputElement, DateTimePickerProps>(
  ({ className, ...props }, ref) => (
    <div className="relative">
      <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        ref={ref}
        type="datetime-local"
        className={mergeClasses(baseInputClasses, className)}
        {...props}
      />
    </div>
  ),
);
DateTimePicker.displayName = 'DateTimePicker';

