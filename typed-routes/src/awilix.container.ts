import {
  type AwilixContainer as Awilix,
  asClass,
  asFunction,
  asValue,
  createContainer,
} from "awilix"
import type DIContainer from "#lib/di/container.interface.ts"
import type ClassType from "#lib/types/class.type.ts"
import type FunctionType from "#lib/types/function.type.ts"

const TypeMapper = {
  class: asClass,
  function: asFunction,
  value: asValue,
} as const

export default class AwilixContainer implements DIContainer {
  private readonly awilix: Awilix

  constructor(container?: Awilix) {
    this.awilix =
      container ||
      createContainer({
        injectionMode: "PROXY",
        strict: true,
      })
  }

  public register(
    registration: Parameters<DIContainer["register"]>[0],
    { name, type = "class" }: Parameters<DIContainer["register"]>[1],
  ) {
    const asType = TypeMapper[type]
    // biome-ignore lint/suspicious/noExplicitAny: It is ok
    this.awilix.register(name, asType(registration as any, { lifetime: "SINGLETON" }))
  }

  public resolve<T>(name: string | symbol): T {
    return this.awilix.resolve(name)
  }

  public build<T>(registration: ClassType<T> | FunctionType<T> | T) {
    // biome-ignore lint/suspicious/noExplicitAny: It is ok
    return this.awilix.build<T>(registration as any)
  }

  public createScope() {
    const scope = this.awilix.createScope()
    return new AwilixContainer(scope)
  }

  public async dispose() {
    await this.awilix.dispose()
  }
}
