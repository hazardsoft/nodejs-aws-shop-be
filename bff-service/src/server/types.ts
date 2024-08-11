import { IncomingMessage, ServerResponse } from 'node:http'

export type ServerRequest = IncomingMessage & { body?: unknown }
export type Next = () => Promise<void>
export type Middleware = (req: ServerRequest, res: ServerResponse, next: Next) => Promise<void>
export type PathMatcher = (req: ServerRequest) => boolean
