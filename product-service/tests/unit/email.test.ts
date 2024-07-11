import data from '@/data/products.json'
import { getEmail, getEmailAttributes } from '@/helpers/email.js'
import { StockStatus, type AvailableProduct } from '@/types.js'
import { describe, expect, test } from 'vitest'

describe('Email for created products tests', () => {
  test('should create email', () => {
    const email = getEmail(data.products)

    expect(email.subject).toBe('Products added')
    expect(email.body).toContain(`Products added (${data.products.length})`)
    data.products.forEach((product, index) => {
      expect(email.body).toContain(`${index + 1}.`)
      expect(email.body).toContain(product.title)
      expect(email.body).toContain(product.description)
      expect(email.body).toContain(product.count)
      expect(email.body).toContain(product.price)
    })
  })

  test('should create email attributes with stock warning', () => {
    const availableProduct = data.products[0] as AvailableProduct
    const productWithoutStock = { ...availableProduct, count: 0 }
    const attributes = getEmailAttributes([productWithoutStock])

    expect(attributes.stockStatus).toBe(StockStatus.SOME_OUT_OF_STOCK)
  })

  test('should create email attributes w/o stock warning', () => {
    const availableProduct = data.products[0] as AvailableProduct
    const productWithStock = { ...availableProduct, count: 1 }
    const attributes = getEmailAttributes([productWithStock])

    expect(attributes.stockStatus).toBe(StockStatus.ALL_IN_STOCK)
  })
})
