import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import products from '../data/products.json'
import { createResponse } from '../helpers/response.js'

export const handler = async (
  event: Pick<APIGatewayProxyEvent, 'pathParameters'>
): Promise<APIGatewayProxyResult> => {
  console.log('getProductsById:', event.pathParameters)

  const productId = event.pathParameters?.id
  if (!productId || !decodeURI(productId).trim()) {
    return createResponse({
      statusCode: 400,
      body: JSON.stringify({
        message: 'Invalid product id'
      })
    })
  }

  const product = products.products.find((p) => p.id === productId)
  if (!product) {
    return createResponse({
      statusCode: 404,
      body: JSON.stringify({
        message: 'Product not found'
      })
    })
  }

  return createResponse({
    statusCode: 200,
    body: JSON.stringify(product)
  })
}
