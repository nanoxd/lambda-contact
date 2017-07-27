import * as AWS from 'aws-sdk'
import * as nodemailer from 'nodemailer'
import * as sesTransport from 'nodemailer-ses-transport'
declare const process: any
const SES = new AWS.SES({ region: 'us-west-2' })
const transporter = nodemailer.createTransport(sesTransport({ SES }))

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

interface EmailParams {
  email: string
  message: string
  name: string
  sourceIp: string
  userAgent: string
  referrer?: string
}

const emailBody = (params: EmailParams) => `
  Name: ${params.name}
  Email: ${params.email}
  IP Address: ${params.sourceIp}
  User Agent: ${params.userAgent}
  Referrer: ${params.referrer}

  ${params.message}
  `

async function sendEmail(
  to: string,
  from: string,
  replyTo: string,
  subject: string,
  body: string
) {
  return transporter.sendMail({
    to,
    from,
    replyTo,
    subject,
    text: body
  })
}

export async function contact(event, context, callback) {
  // Avoids destructuring to ensure we have the right types
  const site: string = process.env.SITE
  const fromEmail: string = process.env.FROM_EMAIL
  const toEmail: string = process.env.TO_EMAIL

  const body = JSON.parse(event.body)
  const requiredFields = ['name', 'message', 'email']
  requiredFields.forEach(e => {
    if (!body.hasOwnProperty(e)) {
      const response = createResponse(422, {
        message: `Missing ${e} field.`
      })

      return callback(null, response)
    }
  })

  try {
    const subject = `Contact Form: ${body.name}`
    const text = emailBody({
      name: body.name as string,
      email: body.email as string,
      message: body.message as string,
      referrer: body.referrer as string,
      sourceIp: event.requestContext.identity.sourceIp,
      userAgent: event.requestContext.identity.userAgent,
    })

    const receipt = await sendEmail(toEmail, fromEmail, body.email, subject, text)
    const response = createResponse(202, {
      message: 'Successfully sent message. Expect to hear back very soon!'
    })

    return callback(null, response)
  } catch (error) {
    console.log(error)
    const response = createResponse(500, {
      message: 'Unable to send email',
      error
    })

    return callback(null, response)
  }
}
