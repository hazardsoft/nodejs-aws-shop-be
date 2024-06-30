import { FilenameSchema, type Filename } from '@/types.js'
import type { Schema, ZodIssue } from 'zod'

export type ValidationIssue = string
export type ValidationResult<T> =
  | {
      success: true
      data: T
    }
  | { success: false; issues: ValidationIssue[] }

const validatePayload = <T>(payload: unknown, schema: Schema): ValidationResult<T> => {
  const result = schema.safeParse(payload)
  if (!result.success) {
    const parseIssues: ZodIssue[] = result.error.errors
    const errorMessages: string[] = parseIssues.map((issue) => issue.message)
    return { success: false, issues: errorMessages }
  }
  return { success: true, data: result.data as T }
}

export const validateFilename = (payload: unknown): ValidationResult<Filename> => {
  return validatePayload<Filename>(payload, FilenameSchema)
}
