import { IncomingMessage } from "node:http";

export type ServerRequest = IncomingMessage & { body?: unknown };

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  count: number;
};
