import SQLite from "better-sqlite3"
import { Kysely, SqliteDialect } from "kysely"
import type DB from "#db.type.ts"

const dialect = new SqliteDialect({
  database: new SQLite(":memory:"),
})

export const db = new Kysely<DB>({
  dialect,
})

await db.schema
  .createTable("users")
  .ifNotExists()
  .addColumn("id", "integer", (col) => col.primaryKey())
  .addColumn("email", "text", (col) => col.notNull())
  .addColumn("firstName", "text", (col) => col.notNull())
  .addColumn("lastName", "text", (col) => col.notNull())
  .addColumn("age", "integer", (col) => col.notNull())
  .addColumn("createdAt", "integer", (col) => col.notNull().defaultTo("CURRENT_TIMESTAMP"))
  .addColumn("updatedAt", "integer", (col) => col.notNull().defaultTo("CURRENT_TIMESTAMP"))
  .execute()
