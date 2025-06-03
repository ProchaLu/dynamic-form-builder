'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

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
        aria-label="Drag to reorder"
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
            aria-label="Remove field"
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
                Field Label
              </label>
              <input
                id={`${field.id}-label`}
                value={field.label}
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
            <div className="space-y-2">
              <label
                htmlFor={`${field.id}-options`}
                className="block text-sm font-medium text-gray-700"
              >
                Options (one per line)
              </label>
              <textarea
                id={`${field.id}-options`}
                value={field.options?.join('\n')}
                onChange={(event) =>
                  onUpdate({
                    options: event.currentTarget.value
                      .split('\n')
                      // filter out empty lines
                      .filter((option) => option.trim() !== ''),
                  })
                }
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
