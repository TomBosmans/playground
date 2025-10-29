// biome-ignore lint/suspicious/noExplicitAny: It is ok
type FunctionType<T = any> = (...args: any[]) => T
export default FunctionType
