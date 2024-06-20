import { describe, expect, test, vi } from 'vitest'
import data from '@/data/products.json'
import { ProductValidationErrors, type AvailableProduct } from '@/types.js'
import { handler } from '@/handlers/createProduct.js'
import { ProductInvalidInput } from '@/errors.js'
import { validateProduct } from '@/helpers/validate'

const mocks = vi.hoisted(() => {
  return {
    createProduct: vi.fn()
  }
})

vi.mock('@/repository.js', () => {
  return {
    createProduct: mocks.createProduct
  }
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { id, ...productInput } = data.products[0] as AvailableProduct

describe('Create one product tests', () => {
  test('Create product successfully', async () => {
    mocks.createProduct.mockResolvedValue(productInput)

    const response = await handler({ body: JSON.stringify(productInput) })
    const parsedBody: AvailableProduct = JSON.parse(response.body)

    expect(response.statusCode).toBe(201)
    expect(parsedBody).toMatchObject(productInput)
  })

  test('Create product returns 400 (invalid input)', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { count, ...invalidProductInput } = productInput
    const issues = [ProductValidationErrors.COUNT_REQUIRED]
    const error = new ProductInvalidInput(issues)

    const response = await handler({ body: JSON.stringify(invalidProductInput) })

    expect(response.statusCode).toBe(400)
    expect(JSON.parse(response.body)).toMatchObject({ message: error.message, issues })
  })

  test('Create product returns 400 (no input)', async () => {
    const error = new ProductInvalidInput()
    const response = await handler({ body: null })

    expect(response.statusCode).toBe(400)
    expect(JSON.parse(response.body)).toMatchObject({ message: error.message })
  })

  test('Create product fails', async () => {
    const error = new Error('Something went wrong')
    mocks.createProduct.mockRejectedValue(error)

    const response = await handler({ body: JSON.stringify(data.products[0]) })

    expect(response.statusCode).toBe(500)
    expect(JSON.parse(response.body)).toMatchObject({ message: error.message })
  })
})
