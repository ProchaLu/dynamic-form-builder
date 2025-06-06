'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Field = {
  id: string;
  type: string;
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
  // Text field validation
  minLength?: number;
  maxLength?: number;
  // Number field validation
  min?: number;
  max?: number;
  step?: number;
  // Date field validation
  minDate?: string;
  maxDate?: string;
};

type Props = {
  fields: Field[];
  formId: number;
};

export function DynamicForm({ fields, formId }: Props) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string>('');
  const router = useRouter();

  function validateField(field: Field, value: any): string | null {
    if (field.required && !value) {
      return 'This field is required';
    }

    if (!value) return null;

    switch (field.type) {
      case 'text':
        const textValue = String(value);
        if (field.minLength && textValue.length < field.minLength) {
          return `Minimum length is ${field.minLength} characters (current: ${textValue.length})`;
        }

        if (field.maxLength && textValue.length > field.maxLength) {
          return `Maximum length is ${field.maxLength} characters (current: ${textValue.length})`;
        }
        break;

      case 'number':
        const num = Number(value);
        if (isNaN(num)) return 'Must be a number';

        if (field.min !== undefined && num < field.min) {
          return `Minimum value is ${field.min}`;
        }

        if (field.max !== undefined && num > field.max) {
          return `Maximum value is ${field.max}`;
        }

        if (field.step !== undefined) {
          const step = Number(field.step);
          const remainder = (num - (field.min || 0)) % step;
          if (remainder !== 0) {
            return `Value must be in steps of ${step}`;
          }
        }
        break;

      case 'date':
        const date = new Date(value);
        if (isNaN(date.getTime())) return 'Invalid date';

        if (field.minDate && new Date(value) < new Date(field.minDate)) {
          return `Date must be after ${new Date(field.minDate).toLocaleDateString()}`;
        }

        if (field.maxDate && new Date(value) > new Date(field.maxDate)) {
          return `Date must be before ${new Date(field.maxDate).toLocaleDateString()}`;
        }
        break;
    }

    return null;
  }

  function handleChange(id: string, value: any) {
    setFormData((prev) => ({ ...prev, [id]: value }));
  }

  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setSubmitError('');

        // Validate all fields and collect errors
        const newErrors: Record<string, string> = {};

        fields.forEach((field) => {
          const error = validateField(field, formData[field.id]);
          if (error) {
            newErrors[field.id] = error;
          }
        });

        // Update errors state with all errors
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
          try {
            const response = await fetch(`/api/forms/${formId}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
            });

            if (!response.ok) {
              const errorData = await response.json();
              setSubmitError(errorData.error || 'Failed to submit form');
              return;
            }

            // Reset form data and errors after successful submission
            setFormData({});
            setErrors({});
            router.refresh();
          } catch (error) {
            setSubmitError('Network error. Please try again.');
          }
        }
      }}
      aria-label="Dynamic form"
      // noValidate is used to disable native HTML5 validation
      // since we are handling validation manually
      // This allows to show custom error messages
      noValidate
    >
      {fields.map((field) => {
        const error = errors[field.id];

        switch (field.type) {
          case 'text':
            return (
              <div key={field.id} className="space-y-1">
                <label
                  htmlFor={`field-${field.id}`}
                  className="block text-m font-medium text-gray-700"
                >
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                <input
                  id={`field-${field.id}`}
                  type="text"
                  placeholder={field.placeholder || ''}
                  required={field.required}
                  minLength={field.minLength}
                  maxLength={field.maxLength}
                  value={formData[field.id] || ''}
                  onChange={(event) =>
                    handleChange(field.id, event.currentTarget.value)
                  }
                  className={`border p-2 rounded w-full ${
                    error ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-invalid={!!error}
                  aria-describedby={error ? `error-${field.id}` : undefined}
                />
                {error && (
                  <p
                    id={`error-${field.id}`}
                    className="text-sm text-red-600"
                    role="alert"
                  >
                    {error}
                  </p>
                )}
                {field.minLength && (
                  <p className="text-xs text-gray-500">
                    Minimum length: {field.minLength} characters
                  </p>
                )}
                {field.maxLength && (
                  <p className="text-xs text-gray-500">
                    Maximum length: {field.maxLength} characters
                  </p>
                )}
              </div>
            );

          case 'number':
            return (
              <div key={field.id} className="space-y-1">
                <label
                  htmlFor={`field-${field.id}`}
                  className="block text-m font-medium text-gray-700"
                >
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                <input
                  id={`field-${field.id}`}
                  type="number"
                  placeholder={field.placeholder || ''}
                  required={field.required}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  value={formData[field.id] || ''}
                  onChange={(event) =>
                    handleChange(field.id, event.currentTarget.value)
                  }
                  className={`border p-2 rounded w-full ${
                    error ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-invalid={!!error}
                  aria-describedby={error ? `error-${field.id}` : undefined}
                />
                {error && (
                  <p
                    id={`error-${field.id}`}
                    className="text-sm text-red-600"
                    role="alert"
                  >
                    {error}
                  </p>
                )}
              </div>
            );

          case 'date':
            return (
              <div key={field.id} className="space-y-1">
                <label
                  htmlFor={`field-${field.id}`}
                  className="block text-m font-medium text-gray-700"
                >
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                <input
                  id={`field-${field.id}`}
                  type="date"
                  required={field.required}
                  min={field.minDate}
                  max={field.maxDate}
                  value={formData[field.id] || ''}
                  onChange={(event) =>
                    handleChange(field.id, event.currentTarget.value)
                  }
                  className={`border p-2 rounded w-full ${
                    error ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-invalid={!!error}
                  aria-describedby={error ? `error-${field.id}` : undefined}
                />
                {error && (
                  <p
                    id={`error-${field.id}`}
                    className="text-sm text-red-600"
                    role="alert"
                  >
                    {error}
                  </p>
                )}
              </div>
            );

          case 'dropdown':
            return (
              <div key={field.id} className="space-y-1">
                <label
                  htmlFor={`field-${field.id}`}
                  className="block text-m font-medium text-gray-700"
                >
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                <select
                  id={`field-${field.id}`}
                  required={field.required}
                  value={formData[field.id] || ''}
                  onChange={(event) =>
                    handleChange(field.id, event.currentTarget.value)
                  }
                  className={`border p-2 rounded w-full ${
                    error ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-invalid={!!error}
                  aria-describedby={error ? `error-${field.id}` : undefined}
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  {field.options?.map((option) => (
                    <option key={`option-${option}`} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {error && (
                  <p
                    id={`error-${field.id}`}
                    className="text-sm text-red-600"
                    role="alert"
                  >
                    {error}
                  </p>
                )}
              </div>
            );

          default:
            return null;
        }
      })}

      {submitError && (
        <div className="text-sm text-red-700" role="alert">
          {submitError}
        </div>
      )}

      <button
        type="submit"
        className="w-full px-5 py-2.5 font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 active:shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 transition rounded-full"
      >
        Submit
      </button>
    </form>
  );
}
