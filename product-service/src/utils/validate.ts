import { ZodIssue, z } from "zod";
import { ProductInput, ProductInputSchema } from "../types";

export type ValidationIssue = string;
export type ValidationResult<T> =
  | {
      success: true;
      data: T;
    }
  | { success: false; issues: ValidationIssue[] };

const validatePayload = <T>(
  body: string,
  schema: z.Schema,
): ValidationResult<T> => {
  const result = schema.safeParse(JSON.parse(body));
  if (!result.success) {
    const parseIssues: ZodIssue[] = result.error.errors;
    const errorMessages: string[] = parseIssues.map((issue) => issue.message);
    return { success: false, issues: errorMessages };
  }
  return { success: true, data: result.data as T };
};

export const validateProductPayload = (
  body: string,
): ValidationResult<ProductInput> => {
  return validatePayload<ProductInput>(body, ProductInputSchema);
};
