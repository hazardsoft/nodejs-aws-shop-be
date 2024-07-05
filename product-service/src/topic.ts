import { PublishCommand, SNSClient } from '@aws-sdk/client-sns'
import { FailToSendNotification } from './errors.js'

const client = new SNSClient({})

export const sendNotification = async (topicArn: string, subject: string, message: string) => {
  const command = new PublishCommand({
    TopicArn: topicArn,
    Subject: subject,
    Message: message
  })

  const response = await client.send(command)
  if (response.$metadata.httpStatusCode !== 200) {
    throw new FailToSendNotification()
  }
}
