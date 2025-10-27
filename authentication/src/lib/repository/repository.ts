import type {
  CountQueryParams,
  DeleteQueryParams,
  InsertQueryParams,
  Obj,
  SelectQueryParams,
  UpdateQueryParams,
} from "./types.ts"

export default interface Repository<
  Entity extends Obj,
  NewEntityDTO extends Obj,
  UpdateEntityDTO extends Obj,
> {
  findMany(params: SelectQueryParams<Entity> | undefined): Promise<Entity[]> | Entity[]
  findOne(params: SelectQueryParams<Entity>): Promise<Entity | null> | Entity | null
  findOneOrThrow(params: SelectQueryParams<Entity>): Promise<Entity> | Entity
  count(params: CountQueryParams<Entity>): Promise<number> | number
  createOne(params: InsertQueryParams<NewEntityDTO>): Promise<Entity> | Entity
  createMany(params: Array<InsertQueryParams<NewEntityDTO>>): Promise<Array<Entity>> | Entity[]
  update(params: UpdateQueryParams<Entity, UpdateEntityDTO>): Promise<Entity[]> | Entity[]
  delete(params: DeleteQueryParams<Entity>): Promise<void> | void
}
