import type { ComparisonOperatorExpression } from "kysely"

type Operator = "$eq" | "$ne" | "$lt" | "$lte" | "$gt" | "$gte" | "$in" | "$nin" | "$match"

export function mapOperatorExpression<Value extends string | number | Date | boolean | null>(
  operator: Operator,
  value: Value,
): ComparisonOperatorExpression {
  if (operator === "$eq" && value === null) return "is"
  if (operator === "$eq") return "="

  if (operator === "$ne" && value === null) return "is not"
  if (operator === "$ne") return "!="

  if (operator === "$lt") return "<"
  if (operator === "$lte") return "<="

  if (operator === "$gt") return ">"
  if (operator === "$gte") return ">="

  if (operator === "$in") return "in"
  if (operator === "$nin") return "not in"

  if (operator === "$match") return "ilike"

  return "="
}
