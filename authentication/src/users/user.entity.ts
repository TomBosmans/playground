export type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
}

export type NewUserDTO = {
  firstName: string
  lastName: string
  email: string
  password: string
}

export type UpdateUserDto = {
  firstName?: string
  lastName?: string
  email?: string
}
