import createRoute from "#utils/createRoute.util.ts"
import zodDto from "../zod.dto.ts"
import User from "./entity.ts"

const userDetailRoute = createRoute({
  tags: ["users"],
  method: "GET",
  path: "/users/:id",
  statusCode: 200,
  schemas: {
    params: zodDto((z) => z.object({ id: z.string().uuid() })),
    response: User,
  },
  handler: async ({ request, response }) => {
    const id = request.params.id
    return response
  },
})

export default userDetailRoute
