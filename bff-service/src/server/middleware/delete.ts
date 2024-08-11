import { ServerResponse } from 'node:http'
import type { Next, ServerRequest } from '../types.js'
import { HTTP_STATUS } from '../constants.js'
import { respond } from '../utils.js'

const middleware = async (req: ServerRequest, res: ServerResponse, next: Next): Promise<void> => {
  if (req.method === 'DELETE') {
    respond(HTTP_STATUS.METHOD_NOT_ALLOWED, null, res)
  } else {
    next()
  }
}

export default middleware
