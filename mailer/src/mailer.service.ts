export default interface MailerService {
  sendMail(params: {
    from: string
    to: string
    subject: string
    text?: string
    html?: string
  }): Promise<void>
}
