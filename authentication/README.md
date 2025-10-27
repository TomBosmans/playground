# Authentication
This example demonstrates a simple authentication setup using Express to keep the focus squarely on the authentication process.
Note that there is no validation of request parameters, query strings, or body data in this example — in a real application, proper validation is essential.
We use [Secure cookies](https://developer.mozilla.org/en-US/docs/Web/Security/Practical_implementation_guides/Cookies), so this implementation works only when the backend and frontend are served from the same domain.

A great resource for writing authentication is [Lucia](https://lucia-auth.com/).
