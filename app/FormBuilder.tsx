'use client';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';
import type { Field } from '../migrations/00000-forms';
import FieldTypeSelector from './FieldTypeSelector';
import FormFieldItem from './FormFieldItem';

type FieldErrorMap = { [id: string]: { label?: string; options?: string } };

// This schema defines the structure of a form with fields
const fieldSchema = z
  .object({
    id: z.string(),
    type: z.enum(['text', 'number', 'date', 'dropdown']),
    label: z.string().min(1, 'Label cannot be empty'),
    placeholder: z.string(),
    required: z.boolean(),
    options: z.array(z.string()).optional(),
    value: z.any(),
  })
  .superRefine((field, context) => {
    if (field.type === 'dropdown') {
      if (!field.options || field.options.length === 0) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Dropdown options cannot be empty',
          path: ['options'],
        });
      } else if (field.options.some((option) => !option.trim())) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Dropdown options cannot be empty strings',
          path: ['options'],
        });
      }
    }
  });

const formSchema = z.object({
  name: z.string().min(1, 'Form name cannot be empty'),
  fields: z.array(fieldSchema),
});

export default function FormBuilder() {
  const [fields, setFields] = useState<Field[]>([]);
  const [formName, setFormName] = useState('My Form');
  const [formNameError, setFormNameError] = useState<string | null>(null);

  const [fieldErrors, setFieldErrors] = useState<FieldErrorMap>({});

  const router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function addField(type: string) {
    const newField: Field = {
      id: crypto.randomUUID(),
      type,
      label: '',
      placeholder: '',
      required: false,
      options: type === 'dropdown' ? ['Option 1', 'Option 2', 'Option 3'] : [],
      value: '',
    };

    setFields([...fields, newField]);
  }

  function updateField(id: string, updatedField: Partial<Field>) {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, ...updatedField } : field,
      ),
    );
    if (updatedField.label !== undefined) {
      // Remove error for this field if label is updated
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  }

  function removeField(id: string) {
    setFields(fields.filter((field) => field.id !== id));
    // Remove error for this field if label is updated
    setFieldErrors((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  }

  // Handle drag and drop reordering of fields with dnd-kit/sortable
  // https://docs.dndkit.com/presets/sortable
  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <div>
      <div className="mb-6">
        <label htmlFor="form-name" className="font-bold">
          Form Name
        </label>
        <input
          id="form-name"
          name="formName"
          value={formName}
          onChange={(event) => {
            setFormName(event.currentTarget.value);
            setFormNameError(null);
          }}
          placeholder="Form name"
          className={`w-full rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
            formNameError
              ? 'border-red-500 ring-2 ring-red-400'
              : 'border border-gray-300'
          }`}
        />
        {formNameError && (
          <div className="text-red-600 text-sm mt-1">{formNameError}</div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-6">
        <FieldTypeSelector addField={addField} />
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-black">
            Form Structure
          </h2>

          {fields.length === 0 ? (
            <div className="border border-dashed border-gray-300 rounded-md p-8 text-center text-gray-500">
              Add fields to your form by selecting a type
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis]}
            >
              <SortableContext
                items={fields.map((field) => field.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {fields.map((field) => (
                    <FormFieldItem
                      key={`field-${field.id}`}
                      field={field}
                      onUpdate={(updates) => updateField(field.id, updates)}
                      onRemove={() => removeField(field.id)}
                      labelError={fieldErrors[field.id]?.label}
                      optionsError={fieldErrors[field.id]?.options}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          <div className="mt-6 flex justify-end">
            <button
              disabled={fields.length === 0}
              onClick={async () => {
                setFormNameError(null);
                setFieldErrors({});

                const result = formSchema.safeParse({ name: formName, fields });

                if (!result.success) {
                  // Form name error
                  const formNameError =
                    result.error.formErrors.fieldErrors.name?.[0];
                  if (formNameError) {
                    setFormNameError(formNameError);
                  }

                  // Field errors
                  const fieldErrors: FieldErrorMap = {};
                  result.error.errors.forEach((error) => {
                    if (error.path[0] === 'fields') {
                      const index = error.path[1];
                      const key = error.path[2];
                      const fieldId = fields[index].id;
                      if (!fieldErrors[fieldId]) fieldErrors[fieldId] = {};
                      if (key === 'label')
                        fieldErrors[fieldId].label = error.message;
                      if (key === 'options')
                        fieldErrors[fieldId].options = error.message;
                    }
                  });
                  setFieldErrors(fieldErrors);
                  return;
                }

                const response = await fetch('/api/forms', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ name: formName, fields }),
                });
                const data = await response.json();
                setFields([]);
                setFormName('My Form');
                setFormNameError(null);
                setFieldErrors({});
                router.refresh();
              }}
              className={`w-full md:w-64 px-5 py-2.5 font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 active:shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 transition rounded-full ${
                fields.length === 0 &&
                'opacity-50 cursor-not-allowed hover:from-blue-600 hover:to-blue-500'
              }`}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
