import * as nodemailer from "nodemailer"
import type { Config } from "./config.factory.ts"
import type MailerService from "./mailer.service.ts"

export default class NodeMailerService implements MailerService {
  private readonly transporter: nodemailer.Transporter

  constructor({ config }: { config: Config }) {
    this.transporter = nodemailer.createTransport(config.mailer)
  }

  public async sendMail(params: Parameters<MailerService["sendMail"]>[0]) {
    await this.transporter.sendMail(params)
  }
}
