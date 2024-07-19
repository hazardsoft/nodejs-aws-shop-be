import { vi } from 'vitest'

export const config = {
  username: 'test_user',
  password: 'test_password',
  methodArn: 'test_method_arn'
}

vi.stubEnv('USERNAME', config.username)
vi.stubEnv('PASSWORD', config.password)
