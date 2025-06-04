'use client';

type Field = {
  id: string;
  type: string;
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
  value?: any;
};

type Props = {
  fields: Field[];
};

export function DynamicForm({ fields }: Props) {
  return (
    <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
      {fields.map((field) => {
        switch (field.type) {
          case 'text':
            return (
              <div key={field.id}>
                <label>{field.label}</label>
                <input
                  type="text"
                  placeholder={field.placeholder || 'Enter text'}
                  required={field.required}
                  name={field.id}
                  className="border p-2 rounded w-full"
                />
              </div>
            );
          case 'number':
            return (
              <div key={field.id}>
                <label>{field.label}</label>
                <input
                  type="number"
                  placeholder={field.placeholder}
                  required={field.required}
                  name={field.id}
                  className="border p-2 rounded w-full"
                />
              </div>
            );
          case 'date':
            return (
              <div key={field.id}>
                <label>{field.label}</label>
                <input
                  type="date"
                  required={field.required}
                  name={field.id}
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
                  name={field.id}
                  className="border p-2 rounded w-full"
                >
                  {field.options?.map((option, index) => (
                    <option key={`option-${index}`} value={option}>
                      {option}
                    </option>
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
        className="w-full md:w-64 px-5 py-2.5 font-medium text-white bg-black hover:bg-neutral-900 active:shadow-inner focus:outline-none focus:ring-2 focus:ring-black transition rounded-full"
      >
        Submit
      </button>
    </form>
  );
}
