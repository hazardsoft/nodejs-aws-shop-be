import { BffService } from './server/server'
import redirectMiddleware from './server/middleware/redirect'

const port = Number(process.env.PORT) || 8080

const bffService = new BffService()
bffService.addMiddleware(redirectMiddleware) // redirects requests to responsible services
bffService.listen(port)
