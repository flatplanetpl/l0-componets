'use client';

import { useMemo, useState } from 'react';
import { Save, X } from 'lucide-react';
import {
  NumberField,
  PasswordField,
  TextField,
  TextareaField,
} from '@/components/ui/formFields';
import {
  CheckboxField,
  RadioGroupField,
  SelectField,
  SwitchField,
} from '@/components/ui/choiceFields';

interface FormField {
  name: string;
  label: string;
  type:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'switch'
    | 'radio';
  options?: { label: string; value: string }[];
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  description?: string;
  orientation?: 'vertical' | 'horizontal';
}

interface AdminFormProps {
  fields: FormField[];
  title: string;
  onSubmit: (data: Record<string, any>) => void;
  initialData?: Record<string, any>;
  submitButtonText?: string;
  onCancel?: () => void;
}

export default function AdminForm({
  fields,
  title,
  onSubmit,
  initialData = {},
  submitButtonText = 'Save',
  onCancel,
}: AdminFormProps) {
  const initialValues = useMemo(() => {
    const preset: Record<string, any> = {};
    fields.forEach((field) => {
      if (field.type === 'checkbox' || field.type === 'switch') {
        preset[field.name] =
          initialData[field.name] !== undefined
            ? Boolean(initialData[field.name])
            : false;
        return;
      }

      if (field.type === 'select' || field.type === 'radio') {
        preset[field.name] =
          initialData[field.name] ??
          field.options?.[0]?.value ??
          '';
        return;
      }

      preset[field.name] = initialData[field.name] ?? '';
    });
    return preset;
  }, [fields, initialData]);

  const [formData, setFormData] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    fields.forEach((field) => {
      const value = formData[field.name];
      if (field.required && (value === '' || value === undefined || value === null)) {
        nextErrors[field.name] = `${field.label} is required`;
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-slate-500 transition hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => {
          const fieldError = errors[field.name];
          const fieldValue = formData[field.name] ?? '';

          if (field.type === 'textarea') {
            return (
              <TextareaField
                key={field.name}
                id={field.name}
                label={field.label}
                helperText={field.helperText}
                required={field.required}
                placeholder={field.placeholder}
                error={fieldError}
                value={fieldValue}
                onChange={(event) =>
                  handleChange(field.name, event.target.value)
                }
              />
            );
          }

          if (field.type === 'password') {
            return (
              <PasswordField
                key={field.name}
                id={field.name}
                label={field.label}
                helperText={field.helperText}
                required={field.required}
                placeholder={field.placeholder}
                error={fieldError}
                value={fieldValue}
                onChange={(event) =>
                  handleChange(field.name, event.target.value)
                }
              />
            );
          }

          if (field.type === 'number') {
            return (
              <NumberField
                key={field.name}
                id={field.name}
                label={field.label}
                helperText={field.helperText}
                required={field.required}
                placeholder={field.placeholder}
                error={fieldError}
                value={fieldValue}
                onChange={(event) =>
                  handleChange(field.name, event.target.value)
                }
              />
            );
          }

          if (field.type === 'text' || field.type === 'email') {
            return (
              <TextField
                key={field.name}
                id={field.name}
                type={field.type}
                label={field.label}
                helperText={field.helperText}
                required={field.required}
                placeholder={field.placeholder}
                error={fieldError}
                value={fieldValue}
                onChange={(event) =>
                  handleChange(field.name, event.target.value)
                }
              />
            );
          }

          if (field.type === 'select') {
            return (
              <SelectField
                key={field.name}
                id={field.name}
                label={field.label}
                helperText={field.helperText}
                required={field.required}
                error={fieldError}
                value={fieldValue}
                onChange={(event) =>
                  handleChange(field.name, event.target.value)
                }
                options={field.options ?? []}
              />
            );
          }

          if (field.type === 'checkbox') {
            return (
              <CheckboxField
                key={field.name}
                id={field.name}
                label={field.label}
                helperText={field.helperText}
                description={field.description}
                required={field.required}
                error={fieldError}
                checked={Boolean(formData[field.name])}
                onCheckedChange={(checked) =>
                  handleChange(field.name, checked)
                }
              />
            );
          }

          if (field.type === 'switch') {
            return (
              <SwitchField
                key={field.name}
                id={field.name}
                label={field.label}
                helperText={field.helperText}
                description={field.description}
                required={field.required}
                error={fieldError}
                checked={Boolean(formData[field.name])}
                onCheckedChange={(checked) =>
                  handleChange(field.name, checked)
                }
              />
            );
          }

          if (field.type === 'radio') {
            return (
              <RadioGroupField
                key={field.name}
                name={field.name}
                label={field.label}
                helperText={field.helperText}
                error={fieldError}
                required={field.required}
                options={(field.options ?? []).map((option) => ({
                  label: option.label,
                  value: option.value,
                }))}
                value={String(fieldValue)}
                orientation={field.orientation}
                onChange={(val) => handleChange(field.name, val)}
              />
            );
          }

          return (
            <TextField
              key={field.name}
              id={field.name}
              label={field.label}
              helperText={field.helperText}
              required={field.required}
              placeholder={field.placeholder}
              error={fieldError}
              value={fieldValue}
              onChange={(event) =>
                handleChange(field.name, event.target.value)
              }
            />
          );
        })}

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            className="flex items-center rounded-md bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
          >
            <Save className="mr-2 h-4 w-4" />
            {submitButtonText}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md bg-slate-200 px-4 py-2 text-slate-800 transition hover:bg-slate-300"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
