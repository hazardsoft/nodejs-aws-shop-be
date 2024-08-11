import http, { Server, ServerResponse } from 'node:http'
import type { Middleware, PathMatcher, ServerRequest } from './types.js'

export class BffService {
  private server: Server
  private middlewares: Middleware[] = []
  private matcherByMiddleware = new Map<Middleware, PathMatcher>()

  constructor() {
    this.server = this.createServer()
  }

  addMiddleware(middleware: Middleware, matcher?: PathMatcher): void {
    this.middlewares.push(middleware)
    if (matcher) {
      this.matcherByMiddleware.set(middleware, matcher)
    }
  }

  listen(port: number): void {
    this.server.listen(port, () => {
      console.log(`Server is running at port ${port}`)
    })
  }

  createServer(): Server {
    const server = http.createServer()
    server.on('request', async (req, res) => {
      await this.callMiddleware(req, res, 0)
    })

    return server
  }

  private async callMiddleware(
    req: ServerRequest,
    res: ServerResponse,
    index: number
  ): Promise<void> {
    if (index === this.middlewares.length) {
      res.end()
      return
    }
    const middleware = this.middlewares[index]
    if (!middleware) {
      return
    }
    const matcher = this.matcherByMiddleware.get(middleware)
    const toCallMiddleware = matcher ? matcher(req) : true
    if (toCallMiddleware) {
      await middleware(req, res, async () => {
        await this.callMiddleware(req, res, ++index)
      })
    } else {
      await this.callMiddleware(req, res, ++index)
    }
  }
}
