import { FailedToSendMessage, FailedToSendMessagesInBatch } from '@/errors.js'
import { SendMessageBatchCommand, SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs'

const queueUrl: string = process.env.PRODUCTS_QUEUE_URL ?? ''

const client = new SQSClient({})

export const sendMessage = async (message: string) => {
  const command = new SendMessageCommand({
    QueueUrl: queueUrl,
    MessageBody: message
  })

  const response = await client.send(command)
  if (response.$metadata.httpStatusCode !== 200) {
    throw new FailedToSendMessage(message)
  }
}

export const sendMessagesInBatch = async (messages: string[]) => {
  const command = new SendMessageBatchCommand({
    QueueUrl: queueUrl,
    Entries: messages.map((message, index) => {
      return {
        Id: String(index),
        MessageBody: message
      }
    })
  })

  const response = await client.send(command)
  if (response.$metadata.httpStatusCode !== 200) {
    throw new FailedToSendMessagesInBatch()
  }
  console.log('successfully sent messages:', response.Successful)
  console.log('failed to send messages:', response.Failed)
}
