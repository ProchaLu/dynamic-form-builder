'use client';

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useState } from 'react';
import FieldTypeSelector from './FieldTypeSelector';

type Field = {
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
  validation?: 'email' | 'phone' | 'url' | 'birthdate';
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
      <FieldTypeSelector />
    </div>
  );
}
