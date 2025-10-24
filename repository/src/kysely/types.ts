import type { SelectQueryBuilder } from "kysely"
import type DB from "#db.type.ts"

// biome-ignore lint/suspicious/noExplicitAny: It is ok
export type SelectQuery<_Table extends keyof DB> = SelectQueryBuilder<DB, any, object>
