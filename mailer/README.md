# Mailer

This is an example of how to set up email handling in a project.

We define a mailer service interface to describe the expected behavior of any mailer implementation.
NodeMailerService is one such implementation, built using the Nodemailer library.

For development, we use Mailpit — a lightweight local SMTP server with a web interface — to safely test emails without actually sending them.

Our email templates are built with React Email, which lets us design and render emails using JSX, similar to React components. Keeping templates in the codebase makes them easy to maintain and version-control alongside the rest of the project.

This setup is provider-agnostic — whether you use Mailgun, SendGrid, or another service, you just need to adjust the environment variables to switch providers.

To view the emails you’ve sent, open the Mailpit UI at http://localhost:8025 To preview and work on your email templates, open the React Email previewer at http://localhost:3000 It supports hot-reloading, making it much easier and more enjoyable to develop your templates.

If you want to understand more about the choices made here, you can read more [here](https://tombosmans.github.io/#/2025-10-24-how-to-send-mails-in-node)
