import { z } from "zod";

export const enum ProductValidationErrors {
  FILENAME_REQUIRED = "Filename is required",
  FILENAME_INVALID = "Filename extension should be .csv",
}

export const ImportProductsSchema = z
  .string({
    required_error: ProductValidationErrors.FILENAME_REQUIRED,
  })
  .endsWith(".csv", ProductValidationErrors.FILENAME_INVALID);
export type ImportProductsInput = z.infer<typeof ImportProductsSchema>;

export const ProductSchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.number(),
  count: z.number(),
});
export type Product = z.infer<typeof ProductSchema>;

export const enum ImportMessages {
  FILENAME_EMPTY = "Filename to import is empty",
  FILENAME_INVALID = "Filename to import is invalid",
  BUCKET_NAME_MISMATCH = "Bucket name mismatch",
}

export const enum ServerMessages {
  INTERNAL_SERVER_ERROR = "Internal Server Error",
}

export type ErrorMessage = ImportMessages | ServerMessages;

export type ImportApiFailedResponse = {
  message: ErrorMessage;
  reason?: string;
};
