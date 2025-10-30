'use client';

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, FocusEvent } from 'react';
import { TextField, type TextFieldProps } from './formFields';

type MaskToken = '9' | 'A' | '*' | '#';

const tokenMatchers: Record<MaskToken, RegExp> = {
  '9': /\d/,
  '#': /\d/,
  A: /[A-Za-zÀ-ÖØ-öø-ÿ]/,
  '*': /[A-Za-zÀ-ÖØ-öø-ÿ0-9]/,
};

function stripToRaw(value: string) {
  return value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ0-9]/g, '');
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function formatWithMask(input: string, mask: string) {
  const canonical = input.split('');
  let rawResult = '';
  let maskedResult = '';
  let rawIndex = 0;
  let produced = false;

  for (let i = 0; i < mask.length; i += 1) {
    const maskChar = mask[i]!;
    const token = tokenMatchers[maskChar as MaskToken];
    if (token) {
      let accepted: string | undefined;
      while (rawIndex < canonical.length) {
        const candidate = canonical[rawIndex]!;
        rawIndex += 1;
        if (token.test(candidate)) {
          accepted = maskChar === 'A' ? candidate.toUpperCase() : candidate;
          break;
        }
      }

      if (accepted) {
        rawResult += accepted;
        maskedResult += accepted;
        produced = true;
      } else {
        break;
      }
    } else {
      if (produced || rawIndex < canonical.length) {
        maskedResult += maskChar;
      }
    }
  }

  return { masked: maskedResult, raw: rawResult };
}

export interface InputMaskFieldProps
  extends Omit<TextFieldProps, 'value' | 'defaultValue' | 'onChange'> {
  mask: string;
  value?: string;
  defaultValue?: string;
  unmaskOnSubmit?: boolean;
  onMaskedValueChange?: (value: string) => void;
  onRawValueChange?: (value: string) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const InputMaskField = forwardRef<HTMLInputElement, InputMaskFieldProps>(
  (
    {
      mask,
      value,
      defaultValue,
      unmaskOnSubmit,
      onMaskedValueChange,
      onRawValueChange,
      onBlur,
      onChange,
      className,
      inputMode,
      ...props
    },
    ref,
  ) => {
    const maskTokens = useMemo(
      () => mask.split('').filter((char) => tokenMatchers[char as MaskToken]) as MaskToken[],
      [mask],
    );

    const initial = useMemo(() => {
      const seed = value ?? defaultValue ?? '';
      const formatted = formatWithMask(stripToRaw(seed), mask);
      return {
        masked: formatted.masked,
        raw: formatted.raw,
      };
    }, [defaultValue, mask, value]);

    const [maskedValue, setMaskedValue] = useState(initial.masked);
    const rawValueRef = useRef(initial.raw);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement, []);

    useEffect(() => {
      if (value === undefined) return;
      const formatted = formatWithMask(stripToRaw(value), mask);
      setMaskedValue(formatted.masked);
      rawValueRef.current = formatted.raw;
    }, [mask, value]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const incoming = event.target.value ?? '';
      const formatted = formatWithMask(stripToRaw(incoming), mask);
      rawValueRef.current = formatted.raw;
      if (value === undefined) {
        setMaskedValue(formatted.masked);
      }
      onMaskedValueChange?.(formatted.masked);
      onRawValueChange?.(formatted.raw);

      if (onChange) {
        const syntheticEvent = {
          ...event,
          target: {
            ...event.target,
            value: formatted.masked,
          },
          currentTarget: {
            ...event.currentTarget,
            value: formatted.masked,
          },
        };
        onChange(syntheticEvent as ChangeEvent<HTMLInputElement>);
      }
    };

    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
      if (unmaskOnSubmit && inputRef.current) {
        inputRef.current.value = rawValueRef.current;
      }
      onBlur?.(event);
    };

    return (
      <TextField
        {...props}
        ref={inputRef}
        value={maskedValue}
        inputMode={
          inputMode ??
          (maskTokens.length > 0 &&
          maskTokens.every((token) => token === '9' || token === '#')
            ? 'numeric'
            : 'text')
        }
        className={cx('font-mono', className)}
        maxLength={mask.length}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    );
  },
);

InputMaskField.displayName = 'InputMaskField';

export default InputMaskField;
