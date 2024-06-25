import type { ValidationIssue } from '@/helpers/validate.js'

export class ProductNotFound extends Error {
  constructor(id: string) {
    super(`Product with id ${id} not found`)
  }
}

export class ProductInvalidId extends Error {
  constructor(id: unknown) {
    super(`Invalid product id: ${id}`)
  }
}

export class ProductInvalidInput extends Error {
  constructor(public readonly issues?: ValidationIssue[]) {
    super('Invalid product input')
  }
}

export class ProductCreationFail extends Error {
  constructor() {
    super('Failed to create product')
  }
}
