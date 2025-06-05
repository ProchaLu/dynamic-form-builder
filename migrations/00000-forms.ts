import type { Sql } from 'postgres';

export type Field = {
  id: string;
  type: string;
  label: string;
  placeholder: string;
  required: boolean;
  options?: string[];
  value?: any;
  // Text field validation
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  patternMessage?: string;
  // Number field validation
  min?: number;
  max?: number;
  step?: number;
  // Date field validation
  minDate?: string;
  maxDate?: string;
};

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE forms (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      name TEXT NOT NULL,
      fields JSONB NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE forms`;
}
