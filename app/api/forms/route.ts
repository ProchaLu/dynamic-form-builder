import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createForm } from '../../../database/forms';

const fieldSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['text', 'number', 'date', 'dropdown']),
  label: z.string().min(1),
  placeholder: z.string(),
  required: z.boolean(),
  options: z.array(z.string()).optional(),
  value: z.any().optional(),
});

const formSchema = z.object({
  name: z.string().min(1),
  fields: z.array(fieldSchema).min(1),
});

export type FormBodyPost =
  | {
      message: string;
    }
  | {
      error: string;
    };

export async function POST(
  request: Request,
): Promise<NextResponse<FormBodyPost>> {
  const requestBody = await request.json();

  // validate information from client with zod
  const result = formSchema.safeParse(requestBody);

  console.log(result.error);

  if (!result.success) {
    return NextResponse.json(
      {
        error: 'Request does not contain form data or is invalid',
      },
      { status: 400 },
    );
  }

  const newForm = await createForm(result.data.name, result.data.fields);

  if (!newForm) {
    return NextResponse.json(
      {
        error: 'Form not created',
      },
      {
        status: 500,
      },
    );
  }

  return NextResponse.json({
    message: 'Form created successfully',
  });
}
