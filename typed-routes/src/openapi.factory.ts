import { OpenApiBuilder } from "openapi3-ts/oas31"
import routeRegistry from "#registries/route.registry.ts"
import type { AppRegistry } from "./container.factory.ts"

export default function openapiFactory({ config }: AppRegistry) {
  const builder = OpenApiBuilder.create().addOpenApiVersion("3.1.0").addInfo(config.openapi.info)

  for (const route of routeRegistry) {
    builder.addPath(`${route.path}`.replace(/:(\w+)/g, "{$1}"), route.openapi())
  }

  return builder
}
