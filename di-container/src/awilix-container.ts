import {
  type AwilixContainer as Awilix,
  asClass,
  asFunction,
  asValue,
  createContainer,
} from "awilix"
import type Container from "./container.ts"
import type { ClassType, FunctionType, RegisterData } from "./container.ts"

const TypeMapper = {
  class: asClass,
  function: asFunction,
  value: asValue,
} as const

export default class AwilixContainer implements Container {
  private readonly awilix: Awilix

  constructor(container?: Awilix) {
    this.awilix = container || createContainer({ injectionMode: "CLASSIC", strict: true })
  }

  public register<Registration>(
    registration: Registration,
    { name, type = "class" }: RegisterData,
  ): void {
    const asType = TypeMapper[type]
    // biome-ignore lint/suspicious/noExplicitAny: it is okay here
    this.awilix.register(name, asType(registration as any, { lifetime: "SINGLETON" }))
  }

  public resolve<T>(name: RegisterData["name"]): T {
    return this.awilix.resolve(name)
  }

  public build<T>(registration: ClassType<T> | FunctionType<T> | T): T {
    // biome-ignore lint/suspicious/noExplicitAny: it is okay here
    return this.awilix.build<T>(registration as any)
  }

  public createScope(): Container {
    const scope = this.awilix.createScope()
    return new AwilixContainer(scope)
  }

  public async dispose() {
    await this.awilix.dispose()
  }

  public loadModules(_modules: string[] | RegExp[], _directory: string): void {
    throw new Error("Method not implemented.")
  }

  public registrations(_pattern?: RegExp): string[] {
    throw new Error("Method not implemented.")
  }
}
