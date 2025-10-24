import { type Selectable, sql } from "kysely"
import type DB from "#db.type.ts"
import type { SelectQuery } from "#kysely/types.ts"
import { mapOperatorExpression } from "#kysely/utils.ts"

export type Where<Table extends keyof DB> = Partial<{
  [Key in keyof Selectable<DB[Table]>]:
    | {
        $match?: Selectable<DB[Table]>[Key]
        $eq?: Selectable<DB[Table]>[Key] | null
        $ne?: Selectable<DB[Table]>[Key] | null
        $lt?: Selectable<DB[Table]>[Key] | null
        $lte?: Selectable<DB[Table]>[Key] | null
        $gt?: Selectable<DB[Table]>[Key] | null
        $gte?: Selectable<DB[Table]>[Key] | null
        $in?: Array<Selectable<DB[Table]>[Key]>
        $nin?: Array<Selectable<DB[Table]>[Key]>
      }
    | Selectable<DB[Table]>[Key]
    | null
}>

export default function whereClause<Table extends keyof DB>(where?: Where<Table>) {
  return (query: SelectQuery<Table>) => {
    if (!where) return query

    const attributes = Object.keys(where) as Array<keyof typeof where>
    for (const attribute of attributes) {
      if (typeof where[attribute] !== "object" || where[attribute] === null) {
        const value = where[attribute]
        // biome-ignore lint/suspicious/noExplicitAny: It is ok
        query = query.where(attribute as any, mapOperatorExpression("$eq", value as any), value)
      } else {
        // biome-ignore lint/suspicious/noExplicitAny: It is ok
        const operators = Object.keys(where[attribute] as any) as Array<
          keyof (typeof where)[typeof attribute]
        >
        for (const operator of operators) {
          // biome-ignore lint/suspicious/noExplicitAny: It is ok
          const value = (where[attribute] as any)?.[operator]
          if (value !== undefined) {
            if (operator === "$match") {
              query = query.where(
                // biome-ignore lint/suspicious/noExplicitAny: It is ok
                attribute as any,
                // biome-ignore lint/suspicious/noExplicitAny: It is ok
                mapOperatorExpression(operator as any, value),
                sql.val(`%${value}%`),
              )
            } else {
              query = query.where(
                // biome-ignore lint/suspicious/noExplicitAny: It is ok
                attribute as any,
                // biome-ignore lint/suspicious/noExplicitAny: It is ok
                mapOperatorExpression(operator as any, value),
                value,
              )
            }
          }
        }
      }
    }

    return query
  }
}
