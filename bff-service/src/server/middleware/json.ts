import { ServerResponse } from "node:http";
import { Next, ServerRequest } from "../types.js";

const middleware = (
  req: ServerRequest,
  _: ServerResponse,
  next: Next,
): void => {
  if (req.headers["content-type"] !== "application/json") {
    next();
  }
  const data: Buffer[] = [];
  req.on("data", (chunk: Buffer) => {
    data.push(chunk);
  });
  req.on("error", () => {
    req.body = null;
    next();
  });

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  req.on("end", () => {
    try {
      const bufferContent = Buffer.concat(data).toString();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      req.body = JSON.parse(bufferContent);
    } catch (e) {
      req.body = null;
    }
    next();
  });
};

export default middleware;
