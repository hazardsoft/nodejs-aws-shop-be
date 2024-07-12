import { decode, encode, validate } from '@/helpers/token.js'
import { describe, expect, test } from 'vitest'
import { config } from './setup.js'

describe('Token Tests', () => {
  test('shoud encode/decode token', () => {
    const { username, password } = config

    const encodedToken = encode(username, password)
    const [decodedUsername, decodedPassword] = decode(encodedToken)

    expect(decodedUsername).toBe(username)
    expect(decodedPassword).toBe(password)
    expect(validate(encodedToken)).toBe(true)
  })
})
