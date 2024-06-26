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
