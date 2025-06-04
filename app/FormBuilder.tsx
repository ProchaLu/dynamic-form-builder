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
import { Input } from './components/Input';
import FieldTypeSelector from './FieldTypeSelector';
import FormFieldItem from './FormFieldItem';

export type Field = {
  id: string;
  type: string;
  label: string;
  placeholder: string;
  required: boolean;
  options?: string[];
  value?: any;

  // Text field validation
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  patternMessage?: string;

  // Number field validation
  min?: number;
  max?: number;
  integerOnly?: boolean;
  positiveOnly?: boolean;

  // Date field validation
  minDate?: string;
  maxDate?: string;
  futureOnly?: boolean;
  pastOnly?: boolean;
  minAge?: number;
  maxAge?: number;
};

export default function FormBuilder() {
  const [fields, setFields] = useState<Field[]>([]);
  const [formName, setFormName] = useState('My Form');

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
  }

  function removeField(id: string) {
    setFields(fields.filter((field) => field.id !== id));
  }

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
        <Input
          id="form-name"
          value={formName}
          name="formName"
          onChange={(event) => setFormName(event.currentTarget.value)}
          className="mt-1"
          required
        />
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
                const response = await fetch('/api/forms', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ name: formName, fields }),
                });
                const data = await response.json();
                console.log(data);
                setFields([]);
                setFormName('My Form');
                router.refresh();
              }}
              className={`w-full md:w-64 px-5 py-2.5 font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 active:shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 transition rounded-full ${fields.length === 0 && 'opacity-50 cursor-not-allowed hover:from-blue-600 hover:to-blue-500'}`}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
