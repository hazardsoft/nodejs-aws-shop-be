import http, { Server, ServerResponse } from "node:http";
import { Middleware, ServerRequest } from "./types.js";
export class BffService {
  private server: Server;
  private middlewares: Middleware[] = [];

  constructor() {
    this.server = this.createServer();
  }

  addMiddleware(middleware: Middleware): void {
    this.middlewares.push(middleware);
  }

  listen(port: number): void {
    this.server.listen(port, () => {
      console.log(`Server is running at port ${port}`);
    });
  }

  createServer(): Server {
    const server = http.createServer();
    // eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/require-await
    server.on("request", async (req: ServerRequest, res: ServerResponse) => {
      const callMiddleware = (index: number) => {
        if (index === this.middlewares.length) {
          res.end();
          return;
        }
        this.middlewares[index](req, res, () => {
          callMiddleware(++index);
        });
      };
      callMiddleware(0);
    });

    return server;
  }
}
