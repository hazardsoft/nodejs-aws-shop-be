import { IncomingMessage } from "node:http";

export type ServerRequest = IncomingMessage & { body?: unknown };
