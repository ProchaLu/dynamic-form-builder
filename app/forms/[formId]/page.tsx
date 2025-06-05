import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getFormWithSubmissions,
  getSingleFormById,
} from '../../../database/forms';
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
  const getFormAndSubmissions = await getFormWithSubmissions(
    Number((await props.params).formId),
  );

  if (!getFormAndSubmissions[0]) {
    notFound();
  }

  const formattedDate = new Date(
    getFormAndSubmissions[0].formCreatedAt,
  ).toLocaleDateString('de-AT', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <Link href="/" className="text-blue-600 hover:underline text-sm">
        ← Back to all forms
      </Link>
      <div className="border rounded-lg p-6 bg-white shadow-sm space-y-2">
        <h1 className="text-2xl font-bold">
          {getFormAndSubmissions[0].formName}
        </h1>
        <p className="text-gray-600 text-sm">Created on {formattedDate}</p>
      </div>

      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <DynamicForm
          formId={getFormAndSubmissions[0].formId}
          fields={JSON.parse(getFormAndSubmissions[0].formFields)}
        />
      </div>
      {getFormAndSubmissions[0].submissionId ? (
        <div className="border rounded-lg p-6 bg-white shadow-sm space-y-4">
          <h2 className="text-xl font-semibold">Submissions</h2>

          {getFormAndSubmissions.map((submission) => {
            const answers = JSON.parse(submission.submissionData ?? '{}');
            const fields = JSON.parse(submission.formFields);

            const formattedSubmissionDate = new Date(
              submission.submissionTime,
            ).toLocaleString('de-AT', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={submission.submissionId}
                className="border p-4 rounded bg-gray-50 space-y-2"
              >
                <p className="text-sm text-gray-900">
                  Submitted at {formattedSubmissionDate}
                </p>
                <ul className="space-y-1">
                  {fields.map((field: any) => (
                    <li key={`field-${field.id}`}>
                      <span className="font-medium">{field.label}:</span>{' '}
                      {answers[field.id] ?? (
                        <span className="text-gray-500">–</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-gray-500 italic text-sm text-center">
          No submissions yet.
        </div>
      )}
    </div>
  );
}
