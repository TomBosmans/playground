import type ClassType from "#lib/types/class.type.ts"
import type FunctionType from "#lib/types/function.type.ts"
import type ValueType from "#lib/types/value.type.ts"

type DIRegistry = Record<string | symbol, Partial<ClassType | FunctionType | ValueType>>
export default DIRegistry
