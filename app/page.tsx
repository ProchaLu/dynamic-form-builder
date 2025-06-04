import { getAllForms } from '../database/forms';
import { DynamicForm } from './DynamicForm';
import FormBuilder from './FormBuilder';

export default async function Home() {
  const forms = await getAllForms();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Dynamic Form Builder</h1>
      <p className="text-gray-900 mb-8">
        Create custom forms by adding, removing, and reordering fields. Supports
        text, number, date, and dropdown fields.
      </p>
      <FormBuilder />
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4 text-black pt-4 border-t">
          Form Structure
        </h2>
        {forms.map((form) => (
          <div key={form.id} className="mb-10">
            <h2 className="text-xl font-bold mb-2">{form.name}</h2>

            {/* JSON.parse is used to convert the stringified fields back to an object */}
            <DynamicForm fields={JSON.parse(form.fields)} />
          </div>
        ))}
      </div>
    </div>
  );
}
