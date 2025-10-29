import type HTTPRoute from "#lib/http/route.ts"
import userDetailRoute from "../users/detail.route.ts"

const routeRegistry: HTTPRoute[] = [
  userDetailRoute
]
export default routeRegistry
