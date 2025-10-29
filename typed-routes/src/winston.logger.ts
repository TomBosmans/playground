import winston from "winston"
import type Logger from "#lib/logger.interface.ts"

const logFormat = winston.format.printf((info) => {
  const date = new Date().toISOString()
  return `${date} ${info.level}: ${JSON.stringify(info.message, null, 4)}`
})

export default class WinstonLogger implements Logger {
  private readonly winston: winston.Logger

  constructor() {
    this.winston = winston.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(winston.format.colorize(), logFormat),
        }),
      ],
    })
  }

  public info(message: string, obj?: object) {
    this.winston.info(message, obj)
  }

  public warn(message: string, obj?: object) {
    this.winston.warn(message, obj)
  }

  public error(message: string, obj?: object) {
    this.winston.error(message, obj)
  }

  public fatal(message: string, obj?: object) {
    this.winston.crit(message, obj)
  }
}
