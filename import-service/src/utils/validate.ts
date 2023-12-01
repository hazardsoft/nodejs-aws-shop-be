import { ZodIssue, z } from "zod";
import {
  ImportProductsInput,
  ImportProductsSchema,
  Product,
  ProductSchema,
} from "../types";

export type ValidationIssue = string;
export type ValidationResult<T> =
  | {
      success: true;
      data: T;
    }
  | { success: false; issues: ValidationIssue[] };

const validatePayload = <T>(
  payload: unknown,
  schema: z.Schema,
): ValidationResult<T> => {
  const result = schema.safeParse(payload);
  if (!result.success) {
    const parseIssues: ZodIssue[] = result.error.errors;
    const errorMessages: string[] = parseIssues.map((issue) => issue.message);
    return { success: false, issues: errorMessages };
  }
  return { success: true, data: result.data as T };
};

export const validateImportProducts = (
  payload: unknown,
): ValidationResult<ImportProductsInput> => {
  return validatePayload<ImportProductsInput>(payload, ImportProductsSchema);
};

export const validateProduct = (
  payload: unknown,
): ValidationResult<Product> => {
  return validatePayload<Product>(payload, ProductSchema);
};
