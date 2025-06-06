'use client';

import Calendar from './components/icons/Calendar';
import Hash from './components/icons/Hash';
import ListIcon from './components/icons/ListIcon';
import TextIcon from './components/icons/TextIcon';
import type { FieldType } from './context/FormContext';

type Props = {
  addField: (type: FieldType) => void;
};

const fieldTypes = [
  {
    type: 'text' as const,
    label: 'Text Field',
    icon: TextIcon,
    description: 'Text input',
  },
  {
    type: 'number' as const,
    label: 'Number Field',
    icon: Hash,
    description: 'Numeric input',
  },
  {
    type: 'date' as const,
    label: 'Date Field',
    icon: Calendar,
    description: 'Date picker input',
  },
  {
    type: 'dropdown' as const,
    label: 'Dropdown Field',
    icon: ListIcon,
    description: 'Select from options',
  },
];

export default function FieldTypeSelector({ addField }: Props) {
  return (
    <section className="rounded-lg w-full max-w-full md:max-w-xs">
      <h2 className="text-xl font-semibold mb-4">Field Types</h2>
      <ul className="space-y-3">
        {fieldTypes.map((fieldType) => (
          <li key={`field-type-${fieldType.type}`}>
            <button
              onClick={() => addField(fieldType.type)}
              className="w-full flex items-start gap-3 rounded-md border px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              type="button"
              aria-label={`Add ${fieldType.label} field`}
            >
              <fieldType.icon />
              <div className="min-w-0">
                <span className="block font-medium text-gray-900">
                  {fieldType.label}
                </span>
                <span className="block text-sm text-gray-500">
                  {fieldType.description}
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
