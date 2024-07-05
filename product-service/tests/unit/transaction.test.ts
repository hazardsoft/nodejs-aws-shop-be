import { describe, expect, test } from 'vitest'
import {
  createManyProductsTransaction,
  createOneProductTransaction
} from '@/helpers/transaction.js'
import { validate } from 'uuid'
import { manyProductsInput, oneProductInput } from '../setup.js'

describe('Products transactions tests', () => {
  test('should create transaction for one product', () => {
    const {
      availableProduct,
      transactItems: [productPut, stockPut]
    } = createOneProductTransaction(oneProductInput)

    expect(availableProduct).toMatchObject(oneProductInput)
    expect(validate(availableProduct.id)).toBe(true)
    expect(productPut.Put).toBeTruthy()
    expect(productPut.Put?.TableName).toBe('Products')
    expect(stockPut.Put).toBeTruthy()
    expect(stockPut.Put?.TableName).toBe('Stocks')
  })

  test('should create transactions for many products', () => {
    const { availableProducts, transactItems } = createManyProductsTransaction(manyProductsInput)

    expect(availableProducts.length).toBe(manyProductsInput.length)
    expect(availableProducts).toMatchObject(manyProductsInput)

    expect(transactItems.length).toBe(manyProductsInput.length * 2)
    expect(transactItems.filter((item) => item.Put?.TableName === 'Products').length).toBe(
      manyProductsInput.length
    )
    expect(transactItems.filter((item) => item.Put?.TableName === 'Stocks').length).toBe(
      manyProductsInput.length
    )
  })
})
