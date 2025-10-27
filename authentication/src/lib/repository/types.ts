export type Obj = Record<string, unknown>

export type OrderBy<Entity extends Obj> = Partial<Record<keyof Entity, "asc" | "desc">>

export type Where<Entity extends Obj> = Partial<{
  [Key in keyof Entity]:
    | {
        $match?: Entity[Key]
        $eq?: Entity[Key] | null
        $ne?: Entity | null
        $lt?: Entity[Key] | null
        $lte?: Entity[Key] | null
        $gt?: Entity[Key] | null
        $gte?: Entity[Key] | null
        $in?: Array<Entity[Key]>
        $nin?: Array<Entity[Key]>
      }
    | Entity[Key]
    | null
}>

export type SelectQueryParams<Entity extends Obj> = {
  orderBy?: OrderBy<Entity>
  where?: Where<Entity>
  limit?: number
  offset?: number
}

export type CountQueryParams<Entity extends Obj> = {
  where?: Where<Entity>
}

export type InsertQueryParams<NewEntityDTO extends Obj> = NewEntityDTO

export type UpdateQueryParams<Entity extends Obj, UpdateEntityDTO extends Obj> = {
  where: Where<Entity>
  set: UpdateEntityDTO
}
export type DeleteQueryParams<Entity extends Obj> = {
  where: Where<Entity>
}
