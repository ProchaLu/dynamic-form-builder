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
};

type Props = {
  fields: Field[];
  formId: number;
};

export function DynamicForm({ fields, formId }: Props) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  function handleChange(id: string, value: any) {
    setFormData((prev) => ({ ...prev, [id]: value }));
  }

  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        const response = await fetch(`/api/forms/${formId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }}
    >
      {fields.map((field) => {
        switch (field.type) {
          case 'text':
          case 'number':
          case 'date':
            return (
              <div key={field.id}>
                <label>{field.label}</label>
                <input
                  type={field.type}
                  placeholder={field.placeholder || ''}
                  required={field.required}
                  onChange={(event) =>
                    handleChange(field.id, event.currentTarget.value)
                  }
                  className="border p-2 rounded w-full"
                />
              </div>
            );
          case 'dropdown':
            return (
              <div key={field.id}>
                <label>{field.label}</label>
                <select
                  required={field.required}
                  onChange={(event) =>
                    handleChange(field.id, event.currentTarget.value)
                  }
                  className="border p-2 rounded w-full"
                >
                  {field.options?.map((option, index) => (
                    <option key={index}>{option}</option>
                  ))}
                </select>
              </div>
            );
          default:
            return null;
        }
      })}

      <button
        type="submit"
        className="w-full md:w-64 px-5 py-2.5 font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 active:shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 transition rounded-full"
      >
        Submit
      </button>
    </form>
  );
}
