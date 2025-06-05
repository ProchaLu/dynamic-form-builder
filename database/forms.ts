import { cache } from 'react';
import { sql } from '../database/connect';

export const createForm = cache(async (name: string, fields: any[]) => {
  const [result] = await sql`
      INSERT INTO
        forms (name, fields)
      VALUES
        (${name}, ${JSON.stringify(fields)})
      RETURNING
        *
    `;
  return result;
});

export const getAllForms = cache(async () => {
  const result = await sql`
      SELECT
        *
      FROM
        forms
      ORDER BY
        created_at DESC
    `;
  return result;
});

export const getAllFormTitlesAndDates = cache(async () => {
  const result = await sql`
      SELECT
        id, name, created_at
      FROM
        forms
      ORDER BY
        created_at DESC
    `;
  return result;
});

export const createFormSubmission = cache(
  async (formId: number, submittedData: any) => {
    const [result] = await sql`
      INSERT INTO
        form_submissions (form_id, submitted_data)
      VALUES
        (${formId}, ${JSON.stringify(submittedData)})
      RETURNING
        *
    `;
    return result;
  },
);

export const getSingleFormById = cache(async (formId: number) => {
  const [result] = await sql`
      SELECT
        *
      FROM
        forms
      WHERE
        id = ${formId}
    `;
  return result;
});
