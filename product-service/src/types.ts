import type { APIGatewayProxyResult } from 'aws-lambda'
import { z } from 'zod'

export const enum ProductValidationErrors {
  // id
  ID_MUST_BE_UUID = 'Id must be UUID',
  // title
  TITLE_REQUIRED = 'Title is required',
  TITLE_MUST_BE_STRING = 'Title must be a string',
  TITLE_TOO_SHORT = 'Title length must be greater than 1',
  // description
  DESCRIPTION_REQUIRED = 'Description is required',
  DESCRIPTION_MUST_BE_STRING = 'Description must be a string',
  DESCRIPTION_TOO_SHORT = 'Description length must be greater than 1',
  // price
  PRICE_REQUIRED = 'Price is required',
  PRICE_MUST_BE_NUMBER = 'Price must be number',
  PRICE_TOO_LOW = 'Price must be greater than 0',
  // count
  COUNT_REQUIRED = 'Count is required',
  COUNT_MUST_BE_NUMBER = 'Count must be a number',
  COUNT_TOO_LOW = 'Count must be greater or equal 0',
  COUNT_MUST_BE_INTEGER = 'Count must be integer',
  // image
  IMAGE_MUST_BE_URL = 'Image must be a valid URL'
}

const ProductIdSchema = z.string().uuid(ProductValidationErrors.ID_MUST_BE_UUID)
const ImageUrlSchema = z.string().url(ProductValidationErrors.IMAGE_MUST_BE_URL)

const ProductSchema = z.object({
  id: ProductIdSchema,
  title: z
    .string({
      required_error: ProductValidationErrors.TITLE_REQUIRED,
      invalid_type_error: ProductValidationErrors.TITLE_MUST_BE_STRING
    })
    .min(3, ProductValidationErrors.TITLE_TOO_SHORT),
  description: z
    .string({
      required_error: ProductValidationErrors.DESCRIPTION_REQUIRED,
      invalid_type_error: ProductValidationErrors.DESCRIPTION_MUST_BE_STRING
    })
    .min(3, ProductValidationErrors.DESCRIPTION_TOO_SHORT),
  price: z
    .number({
      required_error: ProductValidationErrors.PRICE_REQUIRED,
      invalid_type_error: ProductValidationErrors.PRICE_MUST_BE_NUMBER
    })
    .positive(ProductValidationErrors.PRICE_TOO_LOW),
  image: ImageUrlSchema
})

const StockSchema = z.object({
  product_id: z.string().uuid(),
  count: z
    .number({
      required_error: ProductValidationErrors.COUNT_REQUIRED,
      invalid_type_error: ProductValidationErrors.COUNT_MUST_BE_NUMBER
    })
    .nonnegative(ProductValidationErrors.COUNT_TOO_LOW)
    .int(ProductValidationErrors.COUNT_MUST_BE_INTEGER)
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
