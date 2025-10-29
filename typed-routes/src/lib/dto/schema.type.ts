import type DTO from "./interface.ts"

type DTOSchema<T extends DTO> = T extends DTO<unknown, unknown, infer Schema> ? Schema : never

export default DTOSchema
