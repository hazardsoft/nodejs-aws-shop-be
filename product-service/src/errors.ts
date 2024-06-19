export class FailedToGetAllProducts extends Error {
  constructor(cause: string) {
    super('Failed to get all products', { cause })
  }
}

export class FailedToGetProductById extends Error {
  constructor(id: string, cause?: string) {
    super(`Failed to get product with id ${id}`, { cause })
  }
}

export class ProductNotFound extends Error {
  constructor(id: string) {
    super(`Product with id ${id} not found`)
  }
}

export class ProductInvalidId extends Error {
  constructor() {
    super('Invalid product id')
  }
}
