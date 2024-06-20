import { describe, expect, test } from 'vitest'
import data from '@/data/products.json'
import { type AvailableProduct } from '@/types.js'
import { handler } from '@/handlers/createProduct.js'
import { validate } from 'uuid'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { id, ...productInput } = data.products[0] as AvailableProduct

describe('Create one product tests', () => {
  test('Create product successfully', async () => {
    const response = await handler({ body: JSON.stringify(productInput) })
    const parsedBody: AvailableProduct = JSON.parse(response.body)

    expect(response.statusCode).toBe(201)
    expect(parsedBody).toMatchObject(productInput)
    expect(validate(parsedBody.id)).toBe(true)
  })
})
