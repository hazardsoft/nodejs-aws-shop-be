import { FailedToSendMessage, FailedToSendMessagesInBatch } from '@/errors.js'
import { SendMessageBatchCommand, SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs'
import { getBatch } from '@/helpers/array.js'

const queueUrl: string = process.env.PRODUCTS_QUEUE_URL ?? ''

const client = new SQSClient({})

/**
 * AWS limit of number of messages in a batch
 * @link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/sqs/command/SendMessageBatchCommand/
 */
const MAX_MESSAGES_PER_BATCH = 10

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
  const batches: Promise<void>[] = []
  let batchIndex = 0
  for (const batch of getBatch<string>(messages, MAX_MESSAGES_PER_BATCH)) {
    batches.push(sendBatch(batch, ++batchIndex))
  }
  await Promise.all(batches)
}

const sendBatch = async (messages: string[], batchIndex: number) => {
  console.log(`sending batch ${batchIndex} of ${messages.length} messages`)
  const command = new SendMessageBatchCommand({
    QueueUrl: queueUrl,
    Entries: messages.map((message, index) => {
      return {
        Id: `${batchIndex}-${index}`,
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
