import type {
  CountQueryParams,
  DataSet,
  DeleteQueryParams,
  InsertQueryParams,
  SelectQueryParams,
  UpdateQueryParams,
} from "#types.ts"

export default interface Repository<DB extends DataSet, TableName extends keyof DB> {
  findMany(
    params: SelectQueryParams<DB, TableName> | undefined,
  ): Promise<Array<DB[TableName]>> | Array<DB[TableName]>
  findOne(
    params: SelectQueryParams<DB, TableName>,
  ): Promise<DB[TableName] | null> | DB[TableName] | null
  findOneOrThrow(params: SelectQueryParams<DB, TableName>): Promise<DB[TableName]> | DB[TableName]
  count(params: CountQueryParams<DB, TableName>): Promise<number> | number
  createOne(params: InsertQueryParams<DB, TableName>): Promise<DB[TableName]> | DB[TableName]
  createMany(
    params: Array<InsertQueryParams<DB, TableName>>,
  ): Promise<Array<DB[TableName]>> | Array<DB[TableName]>
  update(
    params: UpdateQueryParams<DB, TableName>,
  ): Promise<Array<DB[TableName]>> | Array<DB[TableName]>
  delete(params: DeleteQueryParams<DB, TableName>): Promise<void> | void
}
