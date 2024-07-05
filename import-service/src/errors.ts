import type { ValidationIssue } from '@/helpers/validate.js'

export class FilenameInvalidInput extends Error {
  constructor(public readonly issues?: ValidationIssue[]) {
    super('Invalid filename')
  }
}

export class FailedToReadObject extends Error {
  constructor(id: string) {
    super(`Failed to read object ${id}`)
  }
}

export class FailedToCopyObject extends Error {
  constructor(id: string) {
    super(`Failed to copy object ${id}`)
  }
}

export class FailedToDeleteObject extends Error {
  constructor(id: string) {
    super(`Failed to delete object ${id}`)
  }
}

export class FailedToSendMessage extends Error {
  constructor(message: string) {
    super(`Failed to send message ${message}`)
  }
}

export class FailedToSendMessagesInBatch extends Error {
  constructor() {
    super('Failed to send messages in batch')
  }
}
