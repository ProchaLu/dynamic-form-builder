import type { Sql } from 'postgres';

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
