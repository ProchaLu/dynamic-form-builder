import Link from 'next/link';
import { getAllForms, getAllFormTitlesAndDates } from '../database/forms';
import { DynamicForm } from './DynamicForm';
import FormBuilder from './FormBuilder';

export default async function Home() {
  const allFormTitlesWithDates = await getAllFormTitlesAndDates();

  console.log(allFormTitlesWithDates);

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
          Custom Forms
        </h2>
        <div className="space-y-4">
          {allFormTitlesWithDates.map((titleWithDate) => (
            <div
              key={`form-${titleWithDate.id}`}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {titleWithDate.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Created on{' '}
                    {new Date(titleWithDate.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <Link
                  href={`/forms/${titleWithDate.id}`}
                  className="w-full md:w-32 text-center px-5 py-2.5 font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 active:shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 transition rounded-full"
                >
                  View Form
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
