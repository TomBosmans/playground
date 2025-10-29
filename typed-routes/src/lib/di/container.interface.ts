import type ClassType from "#lib/types/class.type.ts"
import type FunctionType from "#lib/types/function.type.ts"
import type DIRegistry from "./registry.type.ts"

export default interface DIContainer<Registry extends DIRegistry = DIRegistry> {
  register<Name extends keyof Registry>(
    registration: unknown,
    { name, type }: { name: Name; type: "value" | "function" | "class" },
  ): void
  resolve<ReturnType extends Registry[Name], Name extends keyof Registry = string>(
    name: Name,
  ): ReturnType
  build<T>(registration: ClassType<T> | FunctionType<T> | T): T
  createScope(): DIContainer
  dispose(): Promise<void>
}
