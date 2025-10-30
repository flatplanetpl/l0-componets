'use client';

import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import type { HTMLAttributes } from 'react';

function mergeClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function clampValue(next: number, min: number, max: number) {
  return Math.min(Math.max(next, min), max);
}

function snapValue(next: number, min: number, step: number) {
  const snapped = Math.round((next - min) / step) * step + min;
  return snapped;
}

function toPercentage(value: number, min: number, max: number) {
  if (max === min) {
    return 0;
  }
  return ((value - min) / (max - min)) * 100;
}

export interface SliderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  showValue?: boolean;
  disabled?: boolean;
}

export const Slider = forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      min = 0,
      max = 100,
      step = 1,
      value,
      defaultValue,
      onValueChange,
      showValue = true,
      disabled,
      className,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState<number>(
      value ?? defaultValue ?? min,
    );
    const trackRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (typeof value === 'number') {
        setInternalValue(value);
      }
    }, [value]);

    const getPercentage = useCallback(
      (current: number) => toPercentage(current, min, max),
      [min, max],
    );

    const changeValue = useCallback(
      (next: number) => {
        const clamped = clampValue(snapValue(next, min, step), min, max);
        if (value === undefined) {
          setInternalValue(clamped);
        }
        onValueChange?.(clamped);
      },
      [max, min, onValueChange, step, value],
    );

    const handlePointer = useCallback(
      (clientX: number) => {
        const rect = trackRef.current?.getBoundingClientRect();
        if (!rect) return;
        const ratio = (clientX - rect.left) / rect.width;
        changeValue(min + ratio * (max - min));
      },
      [changeValue, max, min],
    );

    return (
      <div
        ref={ref}
        className={mergeClasses('space-y-1', className)}
        role="group"
        {...props}
      >
        <div
          ref={trackRef}
          className={mergeClasses(
            'relative h-2 w-full cursor-pointer rounded-full bg-slate-200',
            disabled && 'cursor-not-allowed opacity-50',
          )}
          onClick={(event) => {
            if (disabled) return;
            handlePointer(event.clientX);
          }}
        >
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-blue-500"
            style={{ width: `${getPercentage(internalValue)}%` }}
          />
          <button
            type="button"
            className={mergeClasses(
              'absolute top-1/2 h-4 w-4 -translate-y-1/2 transform rounded-full border-2 border-white bg-blue-600 shadow transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500',
              disabled && 'cursor-not-allowed',
            )}
            style={{ left: `calc(${getPercentage(internalValue)}% - 8px)` }}
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={internalValue}
            aria-disabled={disabled}
            onPointerDown={(event) => {
              if (disabled) return;
              event.preventDefault();
              const handleMove = (moveEvent: PointerEvent) => {
                handlePointer(moveEvent.clientX);
              };
              const handleUp = () => {
                window.removeEventListener('pointermove', handleMove);
                window.removeEventListener('pointerup', handleUp);
              };
              window.addEventListener('pointermove', handleMove);
              window.addEventListener('pointerup', handleUp);
            }}
            onKeyDown={(event) => {
              if (disabled) return;
              if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
                event.preventDefault();
                changeValue(internalValue + step);
              } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
                event.preventDefault();
                changeValue(internalValue - step);
              } else if (event.key === 'Home') {
                event.preventDefault();
                changeValue(min);
              } else if (event.key === 'End') {
                event.preventDefault();
                changeValue(max);
              }
            }}
          />
        </div>
        {showValue && (
          <div className="text-xs text-slate-500">{internalValue}</div>
        )}
      </div>
    );
  },
);
Slider.displayName = 'Slider';

export interface RangeSliderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  min?: number;
  max?: number;
  step?: number;
  value?: [number, number];
  defaultValue?: [number, number];
  onValueChange?: (value: [number, number]) => void;
  showValue?: boolean;
  disabled?: boolean;
  minDistance?: number;
  ariaLabelledby?: string;
}

export const RangeSlider = forwardRef<HTMLDivElement, RangeSliderProps>(
  (
    {
      min = 0,
      max = 100,
      step = 1,
      value,
      defaultValue,
      onValueChange,
      showValue = true,
      disabled,
      minDistance = 0,
      className,
      ariaLabelledby,
      ...props
    },
    ref,
  ) => {
    const isControlled = Array.isArray(value);
    const initialRange = value ?? defaultValue ?? [min, max];
    const sanitizeRange = useCallback(
      (range: [number, number]): [number, number] => {
        const [rawStart, rawEnd] = range;
        const clampedStart = clampValue(rawStart, min, max);
        const clampedEnd = clampValue(rawEnd, min, max);
        const ordered =
          clampedStart <= clampedEnd
            ? [clampedStart, clampedEnd]
            : [clampedEnd, clampedStart];
        return ordered as [number, number];
      },
      [max, min],
    );

    const [internalValue, setInternalValue] = useState<[number, number]>(() =>
      sanitizeRange(initialRange as [number, number]),
    );
    const currentValue: [number, number] = isControlled
      ? sanitizeRange(value as [number, number])
      : internalValue;
    const valueRef = useRef<[number, number]>(currentValue);
    const trackRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      valueRef.current = currentValue;
      if (isControlled) {
        setInternalValue((prev) => {
          if (prev[0] === currentValue[0] && prev[1] === currentValue[1]) {
            return prev;
          }
          return currentValue;
        });
      }
    }, [currentValue, isControlled]);

    const commitChange = useCallback(
      (next: [number, number]) => {
        const ordered = sanitizeRange(next);
        if (!isControlled) {
          setInternalValue(ordered);
        }
        valueRef.current = ordered;
        onValueChange?.(ordered);
      },
      [isControlled, onValueChange, sanitizeRange],
    );

    const getPercentage = useCallback(
      (current: number) => toPercentage(current, min, max),
      [min, max],
    );

    const updateThumb = useCallback(
      (thumbIndex: 0 | 1, rawNext: number) => {
        const snapped = clampValue(snapValue(rawNext, min, step), min, max);
        const [start, end] = valueRef.current;
        const next: [number, number] =
          thumbIndex === 0
            ? [
                Math.min(snapped, end - minDistance),
                end,
              ]
            : [
                start,
                Math.max(snapped, start + minDistance),
              ];
        commitChange(next);
      },
      [commitChange, min, minDistance, step],
    );

    const handleTrackClick = useCallback(
      (clientX: number) => {
        if (disabled) return;
        const rect = trackRef.current?.getBoundingClientRect();
        if (!rect) return;
        const ratio = (clientX - rect.left) / rect.width;
        const computed = min + ratio * (max - min);
        const [start, end] = valueRef.current;
        const distanceToStart = Math.abs(computed - start);
        const distanceToEnd = Math.abs(computed - end);
        updateThumb(distanceToStart <= distanceToEnd ? 0 : 1, computed);
      },
      [disabled, max, min, updateThumb],
    );

    const attachPointerListeners = useCallback(
      (thumbIndex: 0 | 1) => (event: PointerEvent) => {
        const rect = trackRef.current?.getBoundingClientRect();
        if (!rect) return;
        const ratio = (event.clientX - rect.left) / rect.width;
        const computed = min + ratio * (max - min);
        updateThumb(thumbIndex, computed);
      },
      [max, min, updateThumb],
    );

    const [start, end] = currentValue;
    const startPercentage = getPercentage(start);
    const endPercentage = getPercentage(end);
    const rangeWidth = endPercentage - startPercentage;

    return (
      <div
        ref={ref}
        className={mergeClasses('space-y-1', className)}
        role="group"
        {...props}
      >
        <div
          ref={trackRef}
          className={mergeClasses(
            'relative h-2 w-full cursor-pointer rounded-full bg-slate-200',
            disabled && 'cursor-not-allowed opacity-50',
          )}
          onClick={(event) => {
            if (disabled) return;
            handleTrackClick(event.clientX);
          }}
        >
          <div
            className="absolute h-full rounded-full bg-blue-500"
            style={{
              left: `${startPercentage}%`,
              width: `${rangeWidth}%`,
            }}
          />
          {[0, 1].map((thumbIndex) => {
            const valueForThumb = thumbIndex === 0 ? start : end;
            const percentage = thumbIndex === 0 ? startPercentage : endPercentage;
            return (
              <button
                key={thumbIndex}
                type="button"
                className={mergeClasses(
                  'absolute top-1/2 h-4 w-4 -translate-y-1/2 transform rounded-full border-2 border-white bg-blue-600 shadow transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500',
                  disabled && 'cursor-not-allowed',
                )}
                style={{ left: `calc(${percentage}% - 8px)` }}
                role="slider"
                aria-valuemin={thumbIndex === 0 ? min : start + minDistance}
                aria-valuemax={thumbIndex === 0 ? end - minDistance : max}
                aria-valuenow={valueForThumb}
                aria-disabled={disabled}
                aria-labelledby={ariaLabelledby}
                onPointerDown={(event) => {
                  if (disabled) return;
                  event.preventDefault();
                  const moveListener = attachPointerListeners(thumbIndex as 0 | 1);
                  const upListener = () => {
                    window.removeEventListener('pointermove', moveListener);
                    window.removeEventListener('pointerup', upListener);
                  };
                  window.addEventListener('pointermove', moveListener);
                  window.addEventListener('pointerup', upListener);
                }}
                onKeyDown={(event) => {
                  if (disabled) return;
                  if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
                    event.preventDefault();
                    updateThumb(thumbIndex as 0 | 1, valueForThumb + step);
                  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
                    event.preventDefault();
                    updateThumb(thumbIndex as 0 | 1, valueForThumb - step);
                  } else if (event.key === 'Home') {
                    event.preventDefault();
                    updateThumb(thumbIndex as 0 | 1, thumbIndex === 0 ? min : start);
                  } else if (event.key === 'End') {
                    event.preventDefault();
                    updateThumb(thumbIndex as 0 | 1, thumbIndex === 0 ? end : max);
                  }
                }}
              />
            );
          })}
        </div>
        {showValue && (
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{Math.min(start, end)}</span>
            <span>{Math.max(start, end)}</span>
          </div>
        )}
      </div>
    );
  },
);

RangeSlider.displayName = 'RangeSlider';

export default Slider;
