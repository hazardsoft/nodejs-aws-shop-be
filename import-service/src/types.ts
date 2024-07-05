import { z } from 'zod'

export interface ProductInput {
  title: string
  description: string
  price: number
  count: number
}

export const enum FilenameValidationErrors {
  // id
  FILE_MUST_BE_CSV = 'File extensions should be .csv'
}

export const FilenameSchema = z
  .string()
  .regex(/^.+.csv$/, FilenameValidationErrors.FILE_MUST_BE_CSV)
export type Filename = z.infer<typeof FilenameSchema>
