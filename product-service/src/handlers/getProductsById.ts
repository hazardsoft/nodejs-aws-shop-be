import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createResponse } from '@/helpers/response.js'
import { getProductById } from '@/repository.js'
import { ProductInvalidId, ProductNotFound } from '@/errors.js'

export const handler = async (
  event: Pick<APIGatewayProxyEvent, 'pathParameters'>
): Promise<APIGatewayProxyResult> => {
  console.log('getProductsById:', event.pathParameters)

  try {
    const productId = event.pathParameters?.id
    if (!productId || !decodeURI(productId).trim()) {
      throw new ProductInvalidId(productId)
    }
    const product = await getProductById(productId)
    return createResponse({
      statusCode: 200,
      body: JSON.stringify(product)
    })
  } catch (e) {
    if (e instanceof ProductInvalidId) {
      return createResponse({
        statusCode: 400,
        body: JSON.stringify({ message: e.message })
      })
    }
    if (e instanceof ProductNotFound) {
      return createResponse({
        statusCode: 404,
        body: JSON.stringify({ message: e.message })
      })
    }
    if (e instanceof Error) {
      return createResponse({
        statusCode: 500,
        body: JSON.stringify({ message: e.message })
      })
    }
    return createResponse({
      statusCode: 500,
      body: JSON.stringify({ message: 'get product by id: unknown error' })
    })
  }
}
