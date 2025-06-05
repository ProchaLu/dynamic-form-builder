'use client';

import Calendar from './components/icons/Calendar';
import Hash from './components/icons/Hash';
import ListIcon from './components/icons/ListIcon';
import TextIcon from './components/icons/TextIcon';

type Props = {
  addField: (type: string) => void;
};

const fieldTypes = [
  {
    type: 'text',
    label: 'Text Field',
    icon: TextIcon,
    description: 'Text input',
  },
  {
    type: 'number',
    label: 'Number Field',
    icon: Hash,
    description: 'Numeric input',
  },
  {
    type: 'date',
    label: 'Date Field',
    icon: Calendar,
    description: 'Date picker input',
  },
  {
    type: 'dropdown',
    label: 'Dropdown Field',
    icon: ListIcon,
    description: 'Select from options',
  },
];

export default function FieldTypeSelector({ addField }: Props) {
  return (
    <section className="rounded-lg bg-white p-4 sm:p-6 w-full max-w-full md:max-w-xs">
      <header className="mb-4">
        <h2 className="text-lg font-semibold">Field Types</h2>
      </header>
      <ul className="space-y-3">
        {fieldTypes.map((fieldType) => (
          <li key={`field-type-${fieldType.type}`}>
            <button
              onClick={() => addField(fieldType.type)}
              className="w-full flex items-start gap-3 rounded-md border px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              type="button"
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
