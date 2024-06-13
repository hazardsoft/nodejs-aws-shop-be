import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import products from '../data/products.json'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log(`getProductsList: ${event.path}`)

  return {
    statusCode: 200,
    body: JSON.stringify(products.products)
  }
}
