import * as AWS from 'aws-sdk'
import * as nodemailer from 'nodemailer'
import * as sesTransport from 'nodemailer-ses-transport'
import * as qs from 'qs'

declare const process: any
const SES = new AWS.SES()
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
}

const emailBody = (params: EmailParams) => `
  Name: ${params.name}
  Email: ${params.email}
  IP Address: ${params.sourceIp}
  User Agent: ${params.userAgent}

  ${params.message}
  `

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
