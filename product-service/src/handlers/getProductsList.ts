import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createResponse } from '@/helpers/response.js'
import { getProducts } from '@/repository.js'
import type { ProductError } from '@/types.js'

export const handler = async (
  event: Pick<APIGatewayProxyEvent, 'path'>
): Promise<APIGatewayProxyResult> => {
  console.log('getProductsList:', event.path)

  try {
    const products = await getProducts()
    return createResponse({
      statusCode: 200,
      body: JSON.stringify(products)
    })
  } catch (e) {
    const error: ProductError =
      e instanceof Error
        ? { message: e.message, cause: e.cause }
        : { message: 'Error trying to get all products' }
    return createResponse({ statusCode: 500, body: JSON.stringify(error) })
  }
}
