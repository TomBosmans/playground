import type DIContainer from "#lib/di/container.interface.ts"
import type Logger from "#lib/logger.interface.ts"
import AwilixContainer from "./awilix.container.ts"
import configFactory, { type Config } from "./config.factory.ts"
import WinstonLogger from "./winston.logger.ts"

export type AppRegistry = {
  config: Config
  logger: Logger
}

export default function containerFactory(): DIContainer<AppRegistry> {
  const container = new AwilixContainer()
  container.register(process.env, { name: "env", type: "value" })
  container.register(configFactory, { name: "config", type: "function" })
  container.register(WinstonLogger, { name: "logger", type: "class" })
  return container
}
