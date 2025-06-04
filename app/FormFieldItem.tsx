'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { Field } from './FormBuilder';

type Props = {
  field: Field;
  onUpdate: (updates: Partial<Field>) => void;
  onRemove: () => void;
};

export default function FormFieldItem({ field, onUpdate, onRemove }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });
  const [newOption, setNewOption] = useState('');

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  function addOption() {
    if (newOption.trim()) {
      const existingOptions = field.options || [];
      onUpdate({ options: [...existingOptions, newOption.trim()] });
      setNewOption('');
    }
  }

  function removeOption(value: number) {
    const existingOptions = field.options || [];
    onUpdate({
      options: existingOptions.filter((option, index) => index !== value),
    });
  }

  function updateOption(index: number, value: string) {
    const updatedOptions = [...(field.options || [])];
    updatedOptions[index] = value;
    onUpdate({ options: updatedOptions });
  }

  return (
    <section
      ref={setNodeRef}
      style={style}
      className="relative rounded-lg border border-gray-300 bg-white p-4 shadow-sm"
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-0 bottom-0 flex items-center cursor-grab"
        aria-label="drag to reorder"
      >
        <GripVertical className="h-5 w-5 text-gray-400" />
      </div>

      <div className="pt-4 pl-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2 py-0.5 rounded ${
                field.required
                  ? 'bg-gray-800 text-white'
                  : 'border border-gray-400 text-gray-600'
              }`}
            >
              {field.type.toUpperCase()}
            </span>
            <h3 className="font-medium text-black">{field.label}</h3>
          </div>

          <button
            type="button"
            onClick={onRemove}
            className="rounded p-1 hover:bg-gray-100"
            aria-label="remove field"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </button>
        </div>

        <div className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor={`${field.id}-label`}
                className="block text-sm font-medium text-gray-700"
              >
                Label
              </label>
              <input
                id={`${field.id}-label`}
                value={field.label}
                required
                onChange={(event) =>
                  onUpdate({ label: event.currentTarget.value })
                }
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor={`${field.id}-placeholder`}
                className="block text-sm font-medium text-gray-700"
              >
                Placeholder
              </label>
              <input
                id={`${field.id}-placeholder`}
                value={field.placeholder}
                onChange={(event) =>
                  onUpdate({ placeholder: event.currentTarget.value })
                }
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {field.type === 'dropdown' && (
            <section className="space-y-4">
              <label
                htmlFor="dropdown-options"
                className="block text-sm font-medium text-gray-700"
              >
                Dropdown Options
              </label>

              {/* Existing options */}
              <ul className="space-y-2" id="dropdown-options">
                {field.options?.map((option, index) => (
                  <li
                    key={`option-${field.id}-${index}`}
                    className="flex items-center gap-2"
                  >
                    <span className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded text-sm font-medium text-gray-600">
                      {index + 1}
                    </span>
                    <input
                      type="text"
                      value={option}
                      onChange={(event) =>
                        updateOption(index, event.currentTarget.value)
                      }
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-100"
                      aria-label={`Remove option ${index + 1}`}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>

              {/* Add new option */}
              <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded text-sm font-medium text-blue-600">
                  +
                </div>
                <form
                  className="flex items-center gap-2 w-full"
                  onSubmit={(event) => {
                    event.preventDefault();
                    addOption();
                  }}
                >
                  <input
                    type="text"
                    value={newOption}
                    onChange={(event) =>
                      setNewOption(event.currentTarget.value)
                    }
                    placeholder="Add new option..."
                    className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    disabled={!newOption}
                  >
                    +
                  </button>
                </form>
              </div>
            </section>
          )}
        </div>
      </div>
    </section>
  );
}
