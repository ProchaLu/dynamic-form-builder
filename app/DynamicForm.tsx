type Field = {
  id: string;
  type: string;
  label: string;
  placeholder: string;
  required: boolean;
  options?: string[];
  value?: any;
};

type Props = {
  fields: Field[];
};

export function DynamicForm({ fields }: Props) {
  return (
    <form className="space-y-4">
      {fields.map((field) => {
        switch (field.type) {
          case 'text':
            return (
              <div key={field.id}>
                <label>{field.label}</label>
                <input
                  type="text"
                  placeholder={field.placeholder}
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
                  {field.options?.map((option, idx) => (
                    <option key={idx} value={option}>
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
      <button type="submit" className="bg-black text-white p-2 rounded">
        Submit
      </button>
    </form>
  );
}
