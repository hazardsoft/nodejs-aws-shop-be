import type { APIGatewayProxyResult } from 'aws-lambda'
import { describe, expect, test } from 'vitest'
import mockProducts from '../src/data/products.json'
import { Product, ProductError } from '../src/types.js'
import { handler } from '../src/handlers/getProductsById.js'
import { corsHeaders } from '../src/helpers/response.js'

const mockProduct: Product = mockProducts.products[0]

describe('Get one product test', () => {
  test('Get one product successfully', async () => {
    const response = await handler({ pathParameters: { id: mockProduct.id } })
    const product = JSON.parse(response.body)

    expect(product).toEqual(mockProduct)
    expect(response).toMatchObject({
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(mockProduct)
    } as APIGatewayProxyResult)
  })

  test('Get one product returns 400', async () => {
    const emptyProductId = '%20'
    const response = await handler({ pathParameters: { id: emptyProductId } })
    const error: ProductError = {
      message: 'Invalid product id'
    }

    expect(response).toMatchObject({
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify(error)
    } as APIGatewayProxyResult)
  })

  test('Get one product returns 400 (2nd case)', async () => {
    const response = await handler({ pathParameters: { id: undefined } })
    const error: ProductError = {
      message: 'Invalid product id'
    }

    expect(response).toMatchObject({
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify(error)
    } as APIGatewayProxyResult)
  })

  test('Get one product returns 404', async () => {
    const invalidProductId = 'invalid-product-id'
    const response = await handler({ pathParameters: { id: invalidProductId } })
    const error: ProductError = {
      message: 'Product not found'
    }

    expect(response).toMatchObject({
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify(error)
    } as APIGatewayProxyResult)
  })
})