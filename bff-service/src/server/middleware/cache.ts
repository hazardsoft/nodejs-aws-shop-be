import { ServerResponse } from 'node:http'
import type { Next, ServerRequest } from '../types.js'
import { HTTP_STATUS } from '../constants.js'
import { respond } from '../utils.js'
import { retrieve, hasCache, isCacheExpired, save } from '../cache.js'

const middleware = async (_: ServerRequest, res: ServerResponse, next: Next): Promise<void> => {
  if (hasCache() && !isCacheExpired()) {
    respond(HTTP_STATUS.OK, retrieve(), res)
  } else {
    const originalResEnd = res.end
    res.end = function (data) {
      originalResEnd.apply(this, [data, 'utf-8'])
      save(JSON.parse(data))
      return res
    }
    next()
  }
}

export default middleware
