'use client';

import {
  forwardRef,
  useCallback,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ChangeEvent, DragEvent, HTMLAttributes, ReactNode } from 'react';
import { UploadCloud, XCircle } from 'lucide-react';

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function dedupeFiles(files: File[]) {
  const seen = new Set<string>();
  return files.filter((file) => {
    const key = `${file.name}-${file.size}-${file.lastModified}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export interface FileUploaderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  label?: string;
  description?: string;
  helperText?: string;
  error?: string;
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  value?: File[];
  onFilesChange?: (files: File[]) => void;
  renderFile?: (file: File, index: number) => ReactNode;
  actionLabel?: string;
  emptyLabel?: string;
}

export const FileUploader = forwardRef<HTMLInputElement, FileUploaderProps>(
  (
    {
      label,
      description,
      helperText,
      error,
      accept,
      multiple,
      maxSizeMB = 10,
      value,
      onFilesChange,
      renderFile,
      actionLabel = 'Wybierz pliki',
      emptyLabel = 'Przeciągnij i upuść pliki tutaj lub użyj przycisku',
      className,
      ...props
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);
    const generatedId = useId();

    const isControlled = value !== undefined;
    const [internalFiles, setInternalFiles] = useState<File[]>([]);
    const files = isControlled ? value ?? [] : internalFiles;
    const [isDragging, setIsDragging] = useState(false);
    const [rejectionMessage, setRejectionMessage] = useState<string | null>(null);

    const effectiveError = error ?? rejectionMessage ?? undefined;

    const processFiles = useCallback(
      (selected: FileList | null) => {
        if (!selected) return;
        const incoming = Array.from(selected);
        const limitInBytes = maxSizeMB * 1024 * 1024;

        const validFiles: File[] = [];
        const rejectedFiles: string[] = [];

        incoming.forEach((file) => {
          if (file.size > limitInBytes) {
            rejectedFiles.push(file.name);
          } else {
            validFiles.push(file);
          }
        });

        if (rejectedFiles.length > 0) {
          setRejectionMessage(
            `Odrzucono ${rejectedFiles.length} plików (>${maxSizeMB} MB): ${rejectedFiles.join(', ')}`,
          );
        } else {
          setRejectionMessage(null);
        }

        if (validFiles.length === 0) {
          return;
        }

        const nextFiles = multiple
          ? dedupeFiles([...files, ...validFiles])
          : dedupeFiles(validFiles.slice(0, 1));

        if (!isControlled) {
          setInternalFiles(nextFiles);
        }
        onFilesChange?.(nextFiles);
      },
      [files, isControlled, maxSizeMB, multiple, onFilesChange],
    );

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      processFiles(event.target.files);
    };

    const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      setIsDragging(false);
      processFiles(event.dataTransfer.files);
    };

    const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
    };

    const removeFileAt = useCallback(
      (index: number) => {
        const next = files.filter((_, idx) => idx !== index);
        if (!isControlled) {
          setInternalFiles(next);
        }
        onFilesChange?.(next);
      },
      [files, isControlled, onFilesChange],
    );

    const fileItems = useMemo(
      () =>
        files.map((file, index) =>
          renderFile ? (
            renderFile(file, index)
          ) : (
            <div
              key={`${file.name}-${file.size}-${file.lastModified}`}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition-colors dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200"
            >
              <div className="flex flex-col">
                <span className="font-medium text-slate-800 dark:text-slate-100">{file.name}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeFileAt(index)}
                className="text-slate-400 transition hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                aria-label={`Usuń plik ${file.name}`}
              >
                <XCircle className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ),
        ),
      [files, removeFileAt, renderFile],
    );

    return (
      <div className={cx('space-y-2', className)} {...props}>
        {(label || description) && (
          <div className="space-y-1">
            {label && (
              <label
                htmlFor={generatedId}
                className="text-sm font-medium text-slate-700 transition-colors dark:text-slate-200"
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-xs text-slate-500 transition-colors dark:text-slate-400">{description}</p>
            )}
          </div>
        )}
        <label
          htmlFor={generatedId}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={cx(
            'flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition',
            isDragging
              ? 'border-blue-500 bg-blue-50/60 dark:border-blue-400 dark:bg-blue-500/10'
              : 'border-slate-300 bg-slate-50/60 dark:border-slate-600 dark:bg-slate-900/40',
            effectiveError && 'border-rose-400 bg-rose-50/40 dark:border-rose-400 dark:bg-rose-500/10',
          )}
        >
          <UploadCloud className="h-8 w-8 text-blue-500 dark:text-blue-400" aria-hidden="true" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-800 transition-colors dark:text-slate-100">{emptyLabel}</p>
            <p className="text-xs text-slate-500 transition-colors dark:text-slate-400">
              Maksymalny rozmiar: {maxSizeMB} MB {accept ? `• Obsługiwane: ${accept}` : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {actionLabel}
          </button>
          <input
            ref={inputRef}
            id={generatedId}
            type="file"
            className="sr-only"
            accept={accept}
            multiple={multiple}
            onChange={handleInputChange}
          />
        </label>
        {helperText && (
          <p className="text-xs text-slate-500 transition-colors dark:text-slate-400">{helperText}</p>
        )}
        {effectiveError && (
          <p className="text-xs text-rose-600 dark:text-rose-400">{effectiveError}</p>
        )}
        {fileItems.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 transition-colors dark:text-slate-400">
              Wybrane pliki
            </p>
            <div className="space-y-2">{fileItems}</div>
          </div>
        )}
      </div>
    );
  },
);

FileUploader.displayName = 'FileUploader';

export default FileUploader;
