import { BffService } from './server/server'
import deleteMiddleware from './server/middleware/delete'
import optionsMiddleware from './server/middleware/options'
import jsonMiddleware from './server/middleware/json'
import cacheMiddleware from './server/middleware/cache'
import redirectMiddleware from './server/middleware/redirect'
import type { PathMatcher, ServerRequest } from './server/types'
import { match } from 'path-to-regexp'

const port = Number(process.env.PORT) || 3000

const productsMatcher: PathMatcher = (req: ServerRequest) => {
  const matchProducts = match('/product', { decode: decodeURIComponent })
  const originalUrl = new URL(req.url ?? '', `http://${req.headers.host}`)
  const isProducts = req.method === 'GET' && matchProducts(originalUrl.pathname)
  return !!isProducts
}

const bffService = new BffService()
bffService.addMiddleware(deleteMiddleware) // do not allow DELETE method
bffService.addMiddleware(optionsMiddleware) // return CORS headers on OPTIONS method
bffService.addMiddleware(jsonMiddleware) // assign parsed JSON body to server request if applicable
bffService.addMiddleware(cacheMiddleware, productsMatcher) // cache all products
bffService.addMiddleware(redirectMiddleware) // redirects requests to responsible services
bffService.listen(port)
