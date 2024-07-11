import { vi } from 'vitest'
import { config } from './setup.js'

vi.stubEnv('BUCKET_NAME', config.bucketName)
