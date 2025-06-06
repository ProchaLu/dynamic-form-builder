'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Accordion } from '@radix-ui/react-accordion';
import { GripVertical, Settings, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './components/Accordion';
import type { FormField } from './context/FormContext';

type Props = {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
  onRemove: () => void;
  labelError?: string;
  optionsError?: string;
};

export default function FormFieldItem({
  field,
  onUpdate,
  onRemove,
  labelError,
  optionsError,
}: Props) {
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
                className="block text-m font-semibold text-gray-700"
              >
                Label
              </label>
              <input
                id={`${field.id}-label`}
                value={field.label}
                placeholder="Enter field label..."
                onChange={(event) =>
                  onUpdate({ label: event.currentTarget.value })
                }
                className={`w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" ${
                  labelError
                    ? 'border-red-500 ring-2 ring-red-400'
                    : 'border-gray-300'
                }`}
              />
              {labelError && (
                <div className="text-red-600 text-xs mt-1">{labelError}</div>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor={`${field.id}-placeholder`}
                className="block text-m font-semibold text-gray-700"
              >
                Placeholder
              </label>
              <input
                id={`${field.id}-placeholder`}
                value={field.placeholder}
                placeholder="Enter placeholder text..."
                onChange={(event) =>
                  onUpdate({ placeholder: event.currentTarget.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {field.type === 'dropdown' && (
            <>
              <section className="space-y-4">
                <label
                  htmlFor="dropdown-options"
                  className="block text-m font-semibold text-gray-700"
                >
                  Dropdown Options
                </label>

                {/* Existing options */}
                <ul className="space-y-2" id="dropdown-options">
                  {field.options?.map((option, index) => {
                    const isThisOptionEmpty =
                      optionsError &&
                      optionsError.toLowerCase().includes('empty string') &&
                      (!option || option.trim() === '');
                    return (
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
                          placeholder={`Enter option ${index + 1}`}
                          className={`w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" ${
                            isThisOptionEmpty
                              ? 'border-red-500 ring-2 ring-red-400'
                              : 'border-gray-300'
                          }`}
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
                    );
                  })}
                </ul>
                {optionsError && (
                  <div className="text-red-600 text-xs mt-1">
                    {optionsError}
                  </div>
                )}

                {/* Add new option */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded text-sm font-medium text-blue-600">
                    +
                  </div>
                  <div className="flex items-center gap-2 w-full">
                    <input
                      type="text"
                      value={newOption}
                      onChange={(event) =>
                        setNewOption(event.currentTarget.value)
                      }
                      // Use onKeyDown instead of a nested form with onSubmit to avoid hydration issues.
                      // Since the outer component is already a form, this allows us to handle "Enter" key presses
                      // without triggering a full form submit.
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' && newOption) {
                          // Need to prevent default to avoid submitting the form
                          event.preventDefault();
                          addOption();
                        }
                      }}
                      placeholder="Add new option..."
                      aria-label="Add new dropdown option"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newOption) {
                          addOption();
                        }
                      }}
                      aria-label="Add option"
                      className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                      disabled={!newOption}
                    >
                      +
                    </button>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* Custom validation settings */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="validation">
              <AccordionTrigger className="py-2">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span className="text-black text-m font-semibold">
                    Validation Settings
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4 space-y-4">
                  <label
                    htmlFor={`${field.id}-required`}
                    className="inline-flex items-center cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      id={`${field.id}-required`}
                      checked={field.required}
                      onChange={(event) =>
                        onUpdate({ required: event.currentTarget.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-400 rounded-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none" />
                    <span className="ml-3 text-sm font-medium text-gray-900">
                      Required field
                    </span>
                  </label>

                  {/* Text field validation options */}
                  {field.type === 'text' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor={`${field.id}-minLength`}
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Minimum Length
                          </label>
                          <input
                            type="number"
                            id={`${field.id}-minLength`}
                            value={field.minLength || ''}
                            onChange={(event) =>
                              onUpdate({
                                minLength: event.currentTarget.value
                                  ? Number(event.currentTarget.value)
                                  : undefined,
                              })
                            }
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter minimum text length..."
                          />
                        </div>
                        <div>
                          <label
                            htmlFor={`${field.id}-maxLength`}
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Maximum Length
                          </label>
                          <input
                            type="number"
                            id={`${field.id}-maxLength`}
                            value={field.maxLength || ''}
                            onChange={(event) =>
                              onUpdate({
                                maxLength: event.currentTarget.value
                                  ? Number(event.currentTarget.value)
                                  : undefined,
                              })
                            }
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter maximum text length..."
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Number field validation options */}
                  {field.type === 'number' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor={`${field.id}-min`}
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Minimum Value
                          </label>
                          <input
                            type="number"
                            id={`${field.id}-min`}
                            value={field.min || ''}
                            onChange={(event) =>
                              onUpdate({
                                min: event.currentTarget.value
                                  ? Number(event.currentTarget.value)
                                  : undefined,
                              })
                            }
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter minimum value..."
                          />
                        </div>
                        <div>
                          <label
                            htmlFor={`${field.id}-max`}
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Maximum Value
                          </label>
                          <input
                            type="number"
                            id={`${field.id}-max`}
                            value={field.max || ''}
                            onChange={(event) =>
                              onUpdate({
                                max: event.currentTarget.value
                                  ? Number(event.currentTarget.value)
                                  : undefined,
                              })
                            }
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter maximum value..."
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor={`${field.id}-step`}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Step Value
                        </label>
                        <input
                          type="number"
                          id={`${field.id}-step`}
                          value={field.step || ''}
                          onChange={(event) =>
                            onUpdate({
                              step: event.currentTarget.value
                                ? Number(event.currentTarget.value)
                                : undefined,
                            })
                          }
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          placeholder="Enter step value..."
                        />
                      </div>
                    </div>
                  )}

                  {/* Date field validation options */}
                  {field.type === 'date' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor={`${field.id}-minDate`}
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Minimum Date
                          </label>
                          <input
                            type="date"
                            id={`${field.id}-minDate`}
                            value={field.minDate || ''}
                            onChange={(event) =>
                              onUpdate({
                                minDate: event.currentTarget.value || undefined,
                              })
                            }
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor={`${field.id}-maxDate`}
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Maximum Date
                          </label>
                          <input
                            type="date"
                            id={`${field.id}-maxDate`}
                            value={field.maxDate || ''}
                            onChange={(event) =>
                              onUpdate({
                                maxDate: event.currentTarget.value || undefined,
                              })
                            }
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
}
