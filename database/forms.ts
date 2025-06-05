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

export const getFormWithSubmissions = cache(async (formId: number) => {
  const result = await sql`
    SELECT
      forms.id AS form_id,
      forms.name AS form_name,
      forms.fields AS form_fields,
      forms.created_at AS form_created_at,
      form_submissions.id AS submission_id,
      form_submissions.submitted_data AS submission_data,
      form_submissions.submitted_at AS submission_time
    FROM
      forms
    LEFT JOIN
      form_submissions ON forms.id = form_submissions.form_id
    WHERE
      forms.id = ${formId}
    ORDER BY
      form_submissions.submitted_at DESC NULLS LAST
  `;
  return result;
});
