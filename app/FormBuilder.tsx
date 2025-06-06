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
import { FormProvider, useForm } from './context/FormContext';
import FieldTypeSelector from './FieldTypeSelector';
import FormFieldItem from './FormFieldItem';
import { useFormFields } from './hooks/useFormFields';

function FormBuilderContent() {
  const {
    fields,
    formName,
    errors,
    addField,
    removeField,
    updateField,
    reorderFields,
    setFormName,
  } = useFormFields();

  const { validateForm, dispatch } = useForm();
  const router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Handle drag and drop reordering of fields with dnd-kit/sortable
  // https://docs.dndkit.com/presets/sortable
  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);
      reorderFields(arrayMove(fields, oldIndex, newIndex));
    }
  }

  return (
    <div>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (validateForm()) {
            try {
              const response = await fetch('/api/forms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: formName, fields }),
              });

              if (response.ok) {
                dispatch({ type: 'RESET_FORM' });
                router.refresh();
              }
            } catch (error) {
              console.error('Error saving form:', error);
            }
          }
        }}
      >
        <div className="mb-6">
          <label htmlFor="form-name" className="font-bold">
            Form Name
          </label>
          <input
            id="form-name"
            name="formName"
            value={formName}
            onChange={(event) => setFormName(event.currentTarget.value)}
            placeholder="Form name"
            className={`w-full rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
              errors.name
                ? 'border-red-500 ring-2 ring-red-400'
                : 'border border-gray-300'
            }`}
          />
          {errors.name && (
            <div className="text-red-600 text-sm mt-1">{errors.name}</div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-6">
          <FieldTypeSelector addField={addField} />
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Form Structure</h2>

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
                        labelError={errors.fields[field.id]?.label}
                        optionsError={errors.fields[field.id]?.options}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className={`w-full md:w-64 px-5 py-2.5 font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 active:shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 transition rounded-full ${
              fields.length === 0 &&
              'opacity-50 cursor-not-allowed hover:from-blue-600 hover:to-blue-500'
            }`}
          >
            Save Form
          </button>
        </div>
      </form>
    </div>
  );
}

export default function FormBuilder() {
  return (
    <FormProvider>
      <FormBuilderContent />
    </FormProvider>
  );
}
