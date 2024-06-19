import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createResponse } from '@/helpers/response.js'
import { getProductById } from '@/repository.js'
import { ProductInvalidId, ProductNotFound } from '@/errors.js'

export const handler = async (
  event: Pick<APIGatewayProxyEvent, 'pathParameters'>
): Promise<APIGatewayProxyResult> => {
  console.log('getProductsById:', event.pathParameters)

  const productId = event.pathParameters?.id
  if (!productId || !decodeURI(productId).trim()) {
    return createResponse({
      statusCode: 400,
      body: JSON.stringify({
        message: new ProductInvalidId().message
      })
    })
  }

  try {
    const product = await getProductById(productId)
    return createResponse({
      statusCode: 200,
      body: JSON.stringify(product)
    })
  } catch (e) {
    if (e instanceof ProductNotFound) {
      return createResponse({
        statusCode: 404,
        body: JSON.stringify({
          message: e.message
        })
      })
    }
    return createResponse({
      statusCode: 500,
      body: JSON.stringify(e)
    })
  }
}
