import type { APIGatewayProxyResult } from 'aws-lambda'

type ProductId = string
type ImageUrl = string

export interface Product {
  id: ProductId
  name: string
  description: string
  price: number
  count: number
  image: ImageUrl
}

export interface ProductError {
  message: string
}

export type ProductResponse = Pick<APIGatewayProxyResult, 'statusCode' | 'body' | 'headers'>
