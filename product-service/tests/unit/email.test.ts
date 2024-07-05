import data from '@/data/products.json'
import { getEmail } from '@/helpers/email.js'
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
})
