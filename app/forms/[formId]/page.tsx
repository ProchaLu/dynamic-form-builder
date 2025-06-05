import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSingleFormById } from '../../../database/forms';
import { DynamicForm } from '../../DynamicForm';

export const metadata = {
  title: 'Single Form View',
  description:
    'View and interact with a single form created in the Dynamic Form Builder. This page allows to enter data into the form fields and submit the form',
};

type Props = {
  params: {
    formId: string;
  };
};

export default async function FormPage(props: Props) {
  const singleForm = await getSingleFormById(Number(props.params.formId));

  if (!singleForm) {
    notFound();
  }

  const formattedDate = new Date(singleForm.createdAt).toLocaleDateString(
    'de-AT',
    {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    },
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <Link href="/" className="text-blue-600 hover:underline text-sm">
        ← Back to all forms
      </Link>
      <div className="border rounded-lg p-6 bg-white shadow-sm space-y-2">
        <h1 className="text-2xl font-bold">{singleForm.name}</h1>
        <p className="text-gray-600 text-sm">Created on {formattedDate}</p>
      </div>

      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <DynamicForm
          formId={singleForm.id}
          fields={JSON.parse(singleForm.fields)}
        />
      </div>
    </div>
  );
}
