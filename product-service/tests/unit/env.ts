import { config } from '../setup.js'
import { vi } from 'vitest'

vi.stubEnv('TOPIC_ARN', config.topicArn)
vi.stubEnv('TOPIC_SUBSCRIPTION_EMAIL', config.email)
