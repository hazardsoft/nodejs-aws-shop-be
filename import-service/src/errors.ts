export class FilenameInvalidInput extends Error {
  constructor() {
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
