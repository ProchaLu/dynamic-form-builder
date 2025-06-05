import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createFormSubmission } from '../../../../database/forms';

export const formSchema = z.record(z.string());

export type FormBodyPost =
  | {
      message: string;
    }
  | {
      error: string;
    };

type FormParams = {
  params: Promise<{
    formId: string;
  }>;
};

export async function POST(
  request: NextRequest,
  { params }: FormParams,
): Promise<NextResponse<FormBodyPost>> {
  const formId = Number((await params).formId);
  const requestBody = await request.json();

  const result = formSchema.safeParse(requestBody);

  if (!result.success) {
    return NextResponse.json(
      {
        error: 'Request does not contain form data or is invalid',
      },
      { status: 400 },
    );
  }

  const newFormSubmission = await createFormSubmission(formId, result.data);

  if (!newFormSubmission) {
    return NextResponse.json(
      {
        error: 'Form not submitted',
      },
      {
        status: 500,
      },
    );
  }

  return NextResponse.json({
    message: 'Form submitted successfully',
  });
}
