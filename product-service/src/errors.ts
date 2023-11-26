import { ProductMessages, RepositoryMessages } from "./types";
export class ProductNotFoundError extends Error {
  constructor() {
    super(ProductMessages.PRODUCT_NOT_FOUND);
  }
}

export class RepositoryError extends Error {
  constructor() {
    super(RepositoryMessages.INTERNAL_REPOSITORY_ERROR);
  }
}
