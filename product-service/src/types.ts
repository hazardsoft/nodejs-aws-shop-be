import type { APIGatewayProxyResult } from 'aws-lambda'

type ProductId = string
type ImageUrl = string

export interface Product {
  id: ProductId
  title: string
  description: string
  price: number
  image: ImageUrl
}

export interface Stock {
  product_id: ProductId
  count: number
}

export interface ProductError {
  message: string
}

export type ProductResponse = Pick<APIGatewayProxyResult, 'statusCode' | 'body' | 'headers'>
