import { ProductErrorMessage } from "./types";

export class ProductNotFoundError extends Error {
  constructor() {
    super(<ProductErrorMessage>"Product Not Found");
  }
}
