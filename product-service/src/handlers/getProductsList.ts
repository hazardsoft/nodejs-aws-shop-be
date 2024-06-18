import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import products from '../data/products.json'
import { createResponse } from '../helpers/response.js'

export const handler = async (
  event: Pick<APIGatewayProxyEvent, 'path'>
): Promise<APIGatewayProxyResult> => {
  console.log('getProductsList:', event.path)

  return createResponse({
    statusCode: 200,
    body: JSON.stringify(products.products)
  })
}
