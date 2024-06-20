import { ProductInvalidInput } from '@/errors.js'
import { createResponse } from '@/helpers/response.js'
import { validateProduct } from '@/helpers/validate.js'
import { createProduct } from '@/repository.js'
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

export const handler = async (
  event: Pick<APIGatewayProxyEvent, 'body'>
): Promise<APIGatewayProxyResult> => {
  console.log('createProduct:', event.body)

  try {
    if (!event.body) {
      throw new ProductInvalidInput()
    }

    const productInput = validateProduct(JSON.parse(event.body))
    if (!productInput) {
      throw new ProductInvalidInput()
    }

    const product = await createProduct(productInput)
    return createResponse({
      statusCode: 201,
      body: JSON.stringify(product)
    })
  } catch (e) {
    if (e instanceof ProductInvalidInput) {
      return createResponse({
        statusCode: 400,
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
      body: JSON.stringify({ message: 'create product: unknown error' })
    })
  }
}
