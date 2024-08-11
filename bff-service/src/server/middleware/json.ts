import { ServerResponse } from 'node:http'
import type { Next, ServerRequest } from '../types.js'

const middleware = async (req: ServerRequest, _: ServerResponse, next: Next): Promise<void> => {
  if (req.headers['content-type'] !== 'application/json') {
    next()
    return
  }
  const data: Buffer[] = []
  for await (const chunk of req) {
    data.push(chunk)
  }

  try {
    const buffer = Buffer.concat(data)
    req.body = JSON.parse(buffer.toString())
  } catch (e) {
    req.body = null
  } finally {
    next()
  }
}

export default middleware
