import { PublishCommand, SNSClient, type MessageAttributeValue } from '@aws-sdk/client-sns'
import { FailToSendNotification } from './errors.js'
import type { EmailAttributes, EmailAttributesKeys } from './types.js'

const client = new SNSClient({})

export const sendNotification = async (
  topicArn: string,
  subject: string,
  message: string,
  attrs: EmailAttributes
) => {
  const command = new PublishCommand({
    TopicArn: topicArn,
    Subject: subject,
    Message: message,
    MessageAttributes: Object.entries(attrs).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: {
          DataType: 'String',
          StringValue: value
        }
      }),
      {} as Record<EmailAttributesKeys, MessageAttributeValue>
    )
  })

  const response = await client.send(command)
  if (response.$metadata.httpStatusCode !== 200) {
    throw new FailToSendNotification()
  }
}
