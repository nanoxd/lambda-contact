# Lambda Contact

A lambda function to be used in conjunction with static sites for contact forms using SES.

## Usage

1. Install Serverless
2. `yarn install` or `npm install`
3. Change `serverless.yml` environment variables
4. `serverless deploy`

## Integrate into static site

```html
<form method="post" action="https://API_GATEWAY/contact">
    <input name="name" required="true" placeholder="Name" type="text" id="name">
    <input name="email" placeholder="me@gmail.com" type="email" required="true">
    <textarea name="message" required="true" placeholder="Your message" maxlength="999"></textarea>
    <button type="submit">Send</button>
</form>
```
