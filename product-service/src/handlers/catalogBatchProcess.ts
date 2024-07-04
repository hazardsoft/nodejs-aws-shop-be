import type { SQSEvent } from 'aws-lambda'

export const handler = async (event: SQSEvent): Promise<void> => {
  let index = 0
  for (const record of event.Records) {
    await processMessage(index++, record.body)
  }
}

const processMessage = async (index: number, message: string): Promise<void> => {
  console.log(`processing message {${index}}:`, message)
}
