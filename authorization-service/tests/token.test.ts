import { decodeToken, encodeToken } from '@/helpers/token.js'
import { describe, expect, test } from 'vitest'
import { config } from './setup.js'

describe('Token Tests', () => {
  test('shoud encode/decode token', () => {
    const { username, password } = config

    const encodedToken = encodeToken(username, password)
    const [decodedUsername, decodedPassord] = decodeToken(encodedToken)

    expect(decodedUsername).toBe(username)
    expect(decodedPassord).toBe(password)
  })
})
