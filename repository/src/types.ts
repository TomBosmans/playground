export type DataSet = Record<string, Record<string, unknown>>
export type Select<DB extends DataSet, Table extends keyof DB> = Array<keyof DB[Table]>

export type OrderBy<DB extends DataSet, TableName extends keyof DB> = Partial<
  Record<keyof DB[TableName], "asc" | "desc">
>

export type Where<DB extends DataSet, TableName extends keyof DB> = Partial<{
  [Key in keyof DB[TableName]]:
    | {
        $match?: DB[TableName][Key]
        $eq?: DB[TableName][Key] | null
        $ne?: DB[TableName][Key] | null
        $lt?: DB[TableName][Key] | null
        $lte?: DB[TableName][Key] | null
        $gt?: DB[TableName][Key] | null
        $gte?: DB[TableName][Key] | null
        $in?: Array<DB[TableName][Key]>
        $nin?: Array<DB[TableName][Key]>
      }
    | DB[TableName][Key]
    | null
}>

export type SelectQueryParams<DB extends DataSet, TableName extends keyof DB> = {
  orderBy?: OrderBy<DB, TableName>
  where?: Where<DB, TableName>
  limit?: number
  offset?: number
}

export type CountQueryParams<DB extends DataSet, TableName extends keyof DB> = {
  where?: Where<DB, TableName>
}

export type InsertQueryParams<DB extends DataSet, TableName extends keyof DB> = DB[TableName]

export type UpdateQueryParams<DB extends DataSet, TableName extends keyof DB> = {
  where: Where<DB, TableName>
  set: Partial<DB[TableName]>
}
export type DeleteQueryParams<DB extends DataSet, TableName extends keyof DB> = {
  where: SelectQueryParams<DB, TableName>
}
