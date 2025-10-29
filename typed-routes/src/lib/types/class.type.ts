// biome-ignore lint/suspicious/noExplicitAny: It is ok
type ClassType<T = any> = new (...args: any[]) => T
export default ClassType
