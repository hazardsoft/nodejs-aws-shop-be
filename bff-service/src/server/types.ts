import { IncomingMessage, ServerResponse } from "node:http";

export type ServerRequest = IncomingMessage & { body?: unknown };
export type Next = () => void;

export type Middleware = (
  req: ServerRequest,
  res: ServerResponse,
  next: Next,
) => void;

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  count: number;
};
