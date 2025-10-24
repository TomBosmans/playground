import type DB from "#db.type.ts"
import type { SelectQuery } from "#kysely/types.ts"

export type Select<Table extends keyof DB> = Array<keyof DB[Table]>

export default function selectClause<Table extends keyof DB>(select?: Select<Table>) {
  return (query: SelectQuery<Table>) =>
    (select
      ? // biome-ignore lint/suspicious/noExplicitAny: It is ok
        query.select(select as any)
      : query.selectAll()) as SelectQuery<Table>
}
