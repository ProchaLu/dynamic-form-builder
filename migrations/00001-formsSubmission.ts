import type { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE form_submissions (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      form_id INTEGER REFERENCES forms(id),
      submitted_data JSONB NOT NULL,
      submitted_at TIMESTAMP DEFAULT NOW()
    );
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE form_submissions`;
}
