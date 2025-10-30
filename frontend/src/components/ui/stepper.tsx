'use client';

import { forwardRef, useMemo } from 'react';
import type { ReactNode } from 'react';

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export type StepStatus = 'complete' | 'current' | 'upcoming' | 'error';

export interface Step {
  title: string;
  description?: string;
  optionalLabel?: string;
  status?: StepStatus;
  icon?: ReactNode;
  content?: ReactNode;
  disabled?: boolean;
  meta?: ReactNode;
}

export interface StepperProps {
  steps: Step[];
  activeStep?: number;
  orientation?: 'horizontal' | 'vertical';
  onStepChange?: (stepIndex: number) => void;
  className?: string;
  showStepContent?: boolean;
  label?: string;
}

const statusStyles: Record<StepStatus, string> = {
  complete: 'border-blue-600 bg-blue-600 text-white',
  current: 'border-blue-600 text-blue-600 bg-white',
  upcoming: 'border-slate-200 text-slate-500 bg-white',
  error: 'border-rose-500 text-rose-600 bg-white',
};

const connectorStyles: Record<StepStatus, string> = {
  complete: 'bg-blue-500',
  current: 'bg-blue-300',
  upcoming: 'bg-slate-200',
  error: 'bg-rose-400',
};

function resolveStatus(index: number, activeStep: number, explicit?: StepStatus): StepStatus {
  if (explicit) return explicit;
  if (index < activeStep) return 'complete';
  if (index === activeStep) return 'current';
  return 'upcoming';
}

export const Stepper = forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      steps,
      activeStep = 0,
      orientation = 'horizontal',
      onStepChange,
      className,
      showStepContent = true,
      label,
    },
    ref,
  ) => {
    const isHorizontal = orientation === 'horizontal';

    const derivedSteps = useMemo(
      () =>
        steps.map((step, index) => ({
          ...step,
          resolvedStatus: resolveStatus(index, activeStep, step.status),
        })),
      [activeStep, steps],
    );

    const activeContent = showStepContent
      ? derivedSteps[activeStep]?.content
      : null;

    return (
      <div
        ref={ref}
        aria-label={label}
        className={cx(
          'flex',
          isHorizontal ? 'flex-col gap-6' : 'flex-col',
          className,
        )}
      >
        <ol
          className={cx(
            'relative',
            isHorizontal
              ? 'flex items-start justify-between gap-6'
              : 'flex flex-col gap-6 pl-5',
          )}
        >
          {derivedSteps.map((step, index) => {
            const status = step.resolvedStatus as StepStatus;
            const isClickable = Boolean(onStepChange) && !step.disabled;
            const stepId = `step-${index}`;
            const contentId = `step-content-${index}`;
            const verticalConnectorColor =
              status === 'complete'
                ? 'bg-blue-500'
                : status === 'error'
                ? 'bg-rose-400'
                : 'bg-slate-200';

            return (
              <li
                key={step.title}
                className={cx(
                  'flex',
                  isHorizontal
                    ? 'flex-1 flex-col items-center text-center'
                    : 'relative flex-col pl-0',
                )}
              >
                {isHorizontal && index > 0 && (
                  <span
                    aria-hidden="true"
                    className={cx(
                      'absolute left-0 right-0 top-4 -z-10 h-0.5',
                      connectorStyles[status],
                    )}
                    style={{ left: '-50%', right: '50%' }}
                  />
                )}
                {!isHorizontal && index < derivedSteps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className={cx(
                      'absolute left-[-24px] top-8 h-full w-0.5',
                      verticalConnectorColor,
                    )}
                  />
                )}
                <button
                  type="button"
                  id={stepId}
                  aria-current={status === 'current' ? 'step' : undefined}
                  aria-controls={step.content ? contentId : undefined}
                  disabled={!isClickable}
                  onClick={() => {
                    if (!isClickable) return;
                    onStepChange?.(index);
                  }}
                  className={cx(
                    'group flex w-full items-start gap-4 rounded-lg border border-transparent px-2 py-1 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500',
                    isHorizontal ? 'flex-col items-center text-center' : 'flex-row',
                    step.disabled && 'cursor-not-allowed opacity-50',
                    isClickable && 'cursor-pointer hover:border-blue-200 hover:bg-blue-50/60',
                  )}
                >
                  <span
                    className={cx(
                      'flex h-9 w-9 items-center justify-center rounded-full border-2 font-semibold transition',
                      statusStyles[status],
                    )}
                  >
                    {step.icon
                      ? step.icon
                      : status === 'complete'
                      ? '✓'
                      : index + 1}
                  </span>
                  <span className={cx('flex flex-1 flex-col gap-1', isHorizontal && 'items-center')}>
                    <span className="text-sm font-semibold text-slate-800">
                      {step.title}
                    </span>
                    {step.description && (
                      <span className="text-xs text-slate-500">
                        {step.description}
                      </span>
                    )}
                    {step.optionalLabel && (
                      <span className="text-xs italic text-slate-400">
                        {step.optionalLabel}
                      </span>
                    )}
                    {step.meta && (
                      <span className="text-xs text-slate-500">{step.meta}</span>
                    )}
                  </span>
                </button>
                {!isHorizontal && step.content && showStepContent && (
                  <div
                    id={contentId}
                    role="region"
                    aria-labelledby={stepId}
                    className={cx(
                      'mt-3 w-full rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm',
                      isHorizontal ? 'max-w-md self-center' : 'ml-12',
                      status === 'current' ? 'opacity-100' : 'opacity-70',
                    )}
                  >
                    {step.content}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
        {isHorizontal && activeContent && (
          <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
            {activeContent}
          </div>
        )}
      </div>
    );
  },
);

Stepper.displayName = 'Stepper';

export default Stepper;
