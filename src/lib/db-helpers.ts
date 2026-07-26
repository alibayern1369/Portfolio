import db from "@/db";
import type { Row } from "@libsql/client";

export async function queryOne(sql: string, args: unknown[] = []): Promise<Record<string, unknown> | undefined> {
  const result = await db.execute({ sql, args: args as (string | number | null)[] });
  const row = result.rows[0];
  if (!row) return undefined;
  return Object.fromEntries(Object.entries(row as Record<string, unknown>));
}

export async function queryAll(sql: string, args: unknown[] = []): Promise<Record<string, unknown>[]> {
  const result = await db.execute({ sql, args: args as (string | number | null)[] });
  return result.rows.map((row: Row) => Object.fromEntries(Object.entries(row as Record<string, unknown>)));
}

export async function execute(sql: string, args: unknown[] = []) {
  return db.execute({ sql, args: args as (string | number | null)[] });
}
