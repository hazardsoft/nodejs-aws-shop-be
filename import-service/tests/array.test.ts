import { getBatch } from '@/helpers/array.js'
import { beforeEach, describe, expect, test } from 'vitest'

describe('Array utils tests', () => {
  const batches: number[][] = []
  const messages = Array(6).fill(0)
  beforeEach(() => {
    batches.length = 0
  })

  test('should return 3 batches', () => {
    for (const batch of getBatch<number>(messages, 2)) {
      batches.push(batch)
    }
    expect(batches.length).toBe(3)
  })

  test('should return 2 batches', () => {
    for (const batch of getBatch<number>(messages, 3)) {
      batches.push(batch)
    }
    expect(batches.length).toBe(2)
    expect(batches[0]?.length).toBe(3)
    expect(batches[1]?.length).toBe(3)
  })

  test('should return 2 batches', () => {
    for (const batch of getBatch(messages, 4)) {
      batches.push(batch)
    }
    expect(batches.length).toBe(2)
    expect(batches[0]?.length).toBe(4)
    expect(batches[1]?.length).toBe(2)
  })

  test('should return 1 batch', () => {
    for (const batch of getBatch(messages, 6)) {
      batches.push(batch)
    }
    expect(batches.length).toBe(1)
    expect(batches[0]?.length).toBe(6)
  })
})
