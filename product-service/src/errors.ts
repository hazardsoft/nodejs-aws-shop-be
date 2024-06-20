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
  constructor() {
    super('Invalid product input')
  }
}
