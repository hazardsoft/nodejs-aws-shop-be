import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createResponse } from '@/helpers/response.js'
import { getProducts } from '@/repository.js'

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
    if (e instanceof Error) {
      return createResponse({ statusCode: 500, body: JSON.stringify({ message: e.message }) })
    }
    return createResponse({
      statusCode: 500,
      body: JSON.stringify({ message: 'get products: unknown error' })
    })
  }
}
