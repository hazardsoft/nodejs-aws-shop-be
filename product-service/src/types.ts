import { QueryCommandOutput, ScanCommandOutput } from "@aws-sdk/lib-dynamodb";

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
};

export type Stock = {
  product_id: string;
  count: number;
};

export type AvailableProduct = Product & Pick<Stock, "count">;
export type ProductInput = Omit<AvailableProduct, "id">;

export type DBScanOutput<T> = Omit<ScanCommandOutput, "Items"> & {
  Items?: T[];
};
export type DBQueryOutput<T> = Omit<QueryCommandOutput, "Items"> & {
  Items?: T[];
};

export const enum RepositoryMessages {
  INTERNAL_REPOSITORY_ERROR = "Internal repository error",
}

export const enum ProductMessages {
  PRODUCT_NOT_FOUND = "Product not found",
  PRODUCT_INVALID_ID = "Product id is invalid (absent or incorrect)",
  PRODUCT_INVALID_PAYLOAD = "Product payload is invalid (absent or incorrect)",
}

export const enum ServerMessages {
  INTERNAL_SERVER_ERROR = "Internal Server Error",
}

export type ErrorMessage = ProductMessages | ServerMessages;

export type ProductApiFailedResponse = {
  message: ErrorMessage;
  reason?: string;
};
