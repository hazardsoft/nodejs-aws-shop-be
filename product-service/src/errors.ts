export class ProductsFailToGetAll extends Error {
  constructor(cause: string) {
    super('Failed to get all products', { cause })
  }
}
