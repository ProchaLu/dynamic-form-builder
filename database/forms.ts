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
