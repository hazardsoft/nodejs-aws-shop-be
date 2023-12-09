import { QueryCommandOutput, ScanCommandOutput } from "@aws-sdk/lib-dynamodb";
import { z } from "zod";

export const enum ProductValidationErrors {
  TITLE_REQUIRED = "Title is required",
  TITLE_TOO_SHORT = "Title length must be greater than 1",
  TITLE_MUST_BE_STRING = "Title must be a string",
  DESCRIPTION_REQUIRED = "Description is required",
  DESCRIPTION_TOO_SHORT = "Description length must be greater than 1",
  DESCRIPTION_MUST_BE_STRING = "Description must be a string",
  PRICE_REQUIRED = "Price is required",
  PRICE_TOO_LOW = "Price must be greater than 0",
  PRICE_MUST_BE_NUMBER = "Price must be a number",
  COUNT_REQUIRED = "Count is required",
  COUNT_TOO_LOW = "Count must be greater or equal 0",
  COUNT_MUST_BE_NUMBER = "Count must be a number",
}

export const ProductInputSchema = z.object({
  title: z
    .string({
      required_error: ProductValidationErrors.TITLE_REQUIRED,
      invalid_type_error: ProductValidationErrors.TITLE_MUST_BE_STRING,
    })
    .min(1, ProductValidationErrors.TITLE_TOO_SHORT),
  description: z
    .string({
      required_error: ProductValidationErrors.DESCRIPTION_REQUIRED,
      invalid_type_error: ProductValidationErrors.DESCRIPTION_MUST_BE_STRING,
    })
    .min(1, ProductValidationErrors.DESCRIPTION_TOO_SHORT),
  price: z
    .number({
      required_error: ProductValidationErrors.PRICE_REQUIRED,
      invalid_type_error: ProductValidationErrors.PRICE_MUST_BE_NUMBER,
    })
    .positive(ProductValidationErrors.PRICE_TOO_LOW)
    .int(),
  count: z
    .number({
      required_error: ProductValidationErrors.COUNT_REQUIRED,
      invalid_type_error: ProductValidationErrors.COUNT_MUST_BE_NUMBER,
    })
    .nonnegative(ProductValidationErrors.COUNT_TOO_LOW)
    .int(),
});
export type ProductInput = z.infer<typeof ProductInputSchema>;

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

export type DBScanOutput<T> = Omit<ScanCommandOutput, "Items"> & {
  Items?: T[];
};
export type DBQueryOutput<T> = Omit<QueryCommandOutput, "Items"> & {
  Items?: T[];
};

export const enum RepositoryMessages {
  INTERNAL_REPOSITORY_ERROR = "Internal repository error",
}

export const enum TopicMessages {
  TOPIC_PUBLISH_ERROR = "Topic Publish Error",
  INTERNAL_TOPIC_ERROR = "Internal topic error",
}

export const enum ProductMessages {
  PRODUCT_NOT_FOUND = "Product not found",
  PRODUCT_EMPTY_ID = "Product id is empty",
  PRODUCT_INVALID_UUID = "Product id is not UUID",
  PRODUCT_EMPTY_PAYLOAD = "Product payload is empty",
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
