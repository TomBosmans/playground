import type DTO from "./interface.ts"

type DTOOutput<T extends DTO> = T extends DTO<unknown, infer Output, unknown> ? Output : never

export default DTOOutput
