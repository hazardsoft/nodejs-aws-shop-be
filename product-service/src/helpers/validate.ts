import { ProductInputSchema, type ProductInput } from '@/types.js'

export const validateProduct = (product: unknown): ProductInput | null => {
  const result = ProductInputSchema.safeParse(product)
  return result.success ? result.data : null
}
