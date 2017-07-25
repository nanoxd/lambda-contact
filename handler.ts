import AWS from 'aws-sdk'

declare const process: any
const ses = new AWS.SES()

interface Response {
  statusCode: number
  body: string
  headers?: {
    [name: string]: string
  }
}

const createResponse = (
  statusCode: number,
  body: any,
  headers?: any
): Response => {
  let response: Response = {
    statusCode,
    body: JSON.stringify(body),
    ...headers ? { headers } : {}
  }

  return response
}

export async function contact(event, context, callback) {
  // Avoids destructuring to ensure we have the right types
  const site: string = process.env.SITE
  const fromEmail: string = process.env.FROM_EMAIL
  const toEmail: string = process.env.TO_EMAIL

  const response = createResponse(200, {
    message: 'Hello',
    input: event
  })

  callback(null, response)
}
