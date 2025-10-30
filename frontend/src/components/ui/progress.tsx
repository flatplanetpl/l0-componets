import type { HTMLAttributes } from 'react';

function clampValue(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export interface ProgressBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'role'> {
  value: number;
  max?: number;
  showValue?: boolean;
  label?: string;
  striped?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  showValue = true,
  label,
  striped,
  className,
  ...props
}: ProgressBarProps) {
  const clamped = clampValue(value, 0, max);
  const percentage = (clamped / max) * 100;

  return (
    <div className={cx('space-y-1', className)} {...props}>
      {label && (
        <div className="flex items-center justify-between text-xs font-medium text-slate-600">
          <span>{label}</span>
          {showValue && <span>{Math.round(percentage)}%</span>}
        </div>
      )}
      <div
        className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-200"
        role="progressbar"
        aria-valuenow={Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className={cx(
            'h-full rounded-full bg-blue-600 transition-all duration-300 ease-out',
            striped &&
              'bg-[length:16px_16px] bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 [background-position:0_0]',
          )}
          style={{
            width: `${percentage}%`,
            ...(striped
              ? {
                  backgroundImage:
                    'linear-gradient(135deg, rgba(255,255,255,0.25) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.25) 75%, transparent 75%, transparent)',
                }
              : undefined),
          }}
        />
      </div>
      {!label && showValue && (
        <div className="text-right text-xs font-medium text-slate-600">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
}

ProgressBar.displayName = 'ProgressBar';

export interface ProgressCircleProps extends HTMLAttributes<SVGSVGElement> {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  showValue?: boolean;
}

export function ProgressCircle({
  value,
  max = 100,
  size = 96,
  strokeWidth = 8,
  label,
  showValue = true,
  className,
  ...props
}: ProgressCircleProps) {
  const clamped = clampValue(value, 0, max);
  const normalized = (clamped / max) * 100;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalized / 100) * circumference;

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <svg
        width={size}
        height={size}
        className={cx('text-blue-600', className)}
        role="img"
        aria-label={label ?? `Progress ${Math.round(normalized)} percent`}
        {...props}
      >
        <circle
          className="text-slate-200"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          className="origin-center text-blue-600 transition-[stroke-dashoffset]"
        />
        {showValue && (
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            className="fill-slate-700 text-sm font-semibold"
          >
            {Math.round(normalized)}%
          </text>
        )}
      </svg>
      {label && (
        <span className="text-xs font-medium text-slate-600">{label}</span>
      )}
    </div>
  );
}

ProgressCircle.displayName = 'ProgressCircle';

export default ProgressBar;
