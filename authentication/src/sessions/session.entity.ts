export type Session = {
  id: string
  hashedToken: string
  userId: string
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
}

export type NewSessionDTO = {
  hashedToken: string
  userId: string
  expiresAt: Date
}

export type UpdateSessionDTO = Partial<NewSessionDTO>
