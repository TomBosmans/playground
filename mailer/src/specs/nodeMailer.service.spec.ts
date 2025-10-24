import assert from "node:assert"
import { before, describe, it } from "node:test"
import { render } from "@react-email/render"
import configFactory, { type Config } from "../config.factory.ts"
import WelcomeEmail from "../mails/WelcomeEmail.tsx"
import NodeMailerService from "../nodeMailer.service.ts"

describe("NodeMailerService", () => {
  let nodeMailerService: NodeMailerService
  let config: Config

  before(() => {
    config = configFactory({ env: process.env })
    nodeMailerService = new NodeMailerService({ config })
    console.info(`go to http://localhost:${config.mailer.port} to see the mail(s) inside mailpit`)
  })

  it("can send a mail", async () => {
    const name = "John Doe"

    await nodeMailerService.sendMail({
      from: "my@email.com",
      to: "your@email.com",
      subject: "Test email",
      text: `Welcome to this test ${name}`,
      html: await render(WelcomeEmail({ name })),
    })

    assert.ok(true)
  })
})
