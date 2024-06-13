import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import products from '../data/products.json'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log(`getProductsById: ${event.path} ${event.pathParameters}`)

  const productId = event.pathParameters?.id?.trim()
  if (!productId) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Invalid product id'
      })
    }
  }

  const product = products.products.find((p) => p.id === productId)
  if (!product) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: 'Product not found'
      })
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(product)
  }
}
