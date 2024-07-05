import { vi } from 'vitest'

export const config = {
  bucketName: 'testBucket',
  fileName: 'test.csv'
}

vi.stubEnv('BUCKET_NAME', config.bucketName)
