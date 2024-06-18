import { describe, expect, test } from 'vitest'
import mockProducts from '../src/data/products.json'
import { handler } from '../src/handlers/getProductsList.js'
import { corsHeaders } from '../src/helpers/response.js'

describe('Get many products test', () => {
  test('Get all products successfully', async () => {
    const response = await handler({ path: '/products' })
    const products = JSON.parse(response.body)

    expect(products).toStrictEqual(mockProducts.products)
    expect(response).toMatchObject({
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(mockProducts.products)
    })
  })
})
