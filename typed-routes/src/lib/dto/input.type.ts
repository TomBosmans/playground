import type DTO from "./interface.ts"

type DTOInput<T extends DTO> = T extends DTO<infer Input, unknown, unknown> ? Input : never
export default DTOInput
