import assert from "node:assert"
import { beforeEach, describe, it } from "node:test"
import type { Express } from "express"
import request, { type Agent } from "supertest"
import expressFactory from "./express.factory.ts"

describe("E2E auth", () => {
  let app: Express
  let agent: Agent

  beforeEach(() => {
    app = expressFactory()
    agent = request.agent(app)
  })

  it("can sign up", async () => {
    const body = {
      email: "john.doe@example.com",
      firstName: "John",
      lastName: "Doe",
      password: "string",
    }
    const response = await agent.post("/sign_up").send(body).expect(201)

    assert.ok(response.body.id)
    assert.strictEqual(response.body.email, body.email)
    assert.strictEqual(response.body.firstName, body.firstName)
    assert.strictEqual(response.body.lastName, body.lastName)
    assert.strictEqual(response.body.password, undefined)
    assert.ok(response.body.createdAt)
    assert.ok(response.body.updatedAt)
  })

  it("is signed in after sign out, and can request profile", async () => {
    const { body } = await agent.post("/sign_up").send({
      email: "john.doe@example.com",
      firstName: "John",
      lastName: "Doe",
      password: "string",
    })
    const response = await agent.get("/profile").expect(200)
    assert.strictEqual(response.body.id, body.id)
    assert.strictEqual(response.body.email, body.email)
    assert.strictEqual(response.body.firstName, body.firstName)
    assert.strictEqual(response.body.lastName, body.lastName)
    assert.strictEqual(response.body.password, undefined)
    assert.strictEqual(response.body.createdAt, body.createdAt)
    assert.strictEqual(response.body.updatedAt, body.updatedAt)
  })

  it("cannot request profile whithout signing in", async () => {
    await agent.get("/profile").expect(401)
  })

  it("can sign out", async () => {
    await agent.post("/sign_up").send({
      email: "john.doe@example.com",
      firstName: "John",
      lastName: "Doe",
      password: "string",
    })
    await agent.get("/profile").expect(200)
    await agent.delete("/sign_out").expect(204)
    await agent.get("/profile").expect(401)
  })

  it("can sign in", async () => {
    const { body } = await agent.post("/sign_up").send({
      email: "john.doe@example.com",
      firstName: "John",
      lastName: "Doe",
      password: "string",
    })
    await agent.get("/profile").expect(200)
    await agent.delete("/sign_out").expect(204)
    await agent.get("/profile").expect(401)
    const response = await agent
      .post("/sign_in")
      .send({ email: "john.doe@example.com", password: "string" })
      .expect(201)

    assert.strictEqual(response.body.id, body.id)
    assert.strictEqual(response.body.email, body.email)
    assert.strictEqual(response.body.firstName, body.firstName)
    assert.strictEqual(response.body.lastName, body.lastName)
    assert.strictEqual(response.body.password, undefined)
    assert.strictEqual(response.body.createdAt, body.createdAt)
    assert.strictEqual(response.body.updatedAt, body.updatedAt)

    await agent.get("/profile").expect(200)
  })
})
