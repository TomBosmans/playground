import type { ColumnType, Generated } from "kysely"

type Timestamp = ColumnType<Date, Date | string, Date | string>

type DB = {
  users: {
    id: Generated<number>
    email: string
    firstName: string
    lastName: string
    age: number
    createdAt: Generated<Timestamp>
    updatedAt: Generated<Timestamp>
  }
}

export default DB
