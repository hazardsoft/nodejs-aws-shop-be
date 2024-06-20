import type { APIGatewayProxyResult } from 'aws-lambda'
import { z } from 'zod'

const ProductIdSchema = z.string().uuid()
const ImageUrlSchema = z.string().url()

const ProductSchema = z.object({
  id: ProductIdSchema,
  title: z.string().min(3),
  description: z.string().min(3),
  price: z.number().positive(),
  image: ImageUrlSchema
})

const StockSchema = z.object({
  product_id: z.string().uuid(),
  count: z.number().nonnegative()
})

const AvailableProductSchema = ProductSchema.merge(StockSchema).omit({ product_id: true })
export const ProductInputSchema = AvailableProductSchema.omit({ id: true })

export type ProductId = z.infer<typeof ProductIdSchema>
export type ImageUrl = z.infer<typeof ImageUrlSchema>
export type Product = z.infer<typeof ProductSchema>
export type ProductInput = z.infer<typeof ProductInputSchema>
export type Stock = z.infer<typeof StockSchema>
export type AvailableProduct = z.infer<typeof AvailableProductSchema>

export interface ProductError {
  message: string
}

export type ProductResponse = Pick<APIGatewayProxyResult, 'statusCode' | 'body' | 'headers'>
