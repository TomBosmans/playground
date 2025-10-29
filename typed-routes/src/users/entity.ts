import zodDto from "../zod.dto.ts"

export default class User extends zodDto((z) =>
  z.object({
    id: z.string().uuid(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  }),
) { }

export class NewUserDTO extends zodDto(() =>
  User.schema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }),
) { }

export class EditUserDTO extends zodDto(() => NewUserDTO.schema.partial()) { }
