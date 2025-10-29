export default interface Logger {
  info(message: string, obj?: object): void
  warn(message: string, obj?: object): void
  error(message: string, obj?: object): void
  fatal(message: string, obj?: object): void
}
