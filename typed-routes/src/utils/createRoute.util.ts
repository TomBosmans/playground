import type DTO from "#lib/dto/interface.ts"
import HTTPRoute from "#lib/http/route.ts"
import type { AppRegistry } from "../container.factory.ts"

type RequestRegistry = AppRegistry & { session?: { id: string; userId: string } }

export default function createRoute<
  Query extends DTO = DTO,
  Params extends DTO = DTO,
  Body extends DTO = DTO,
  Response extends DTO = DTO,
>(
  params: ConstructorParameters<
    typeof HTTPRoute<RequestRegistry, Query, Params, Body, Response>
  >[0],
) {
  return new HTTPRoute<RequestRegistry, Query, Params, Body, Response>(params)
}
