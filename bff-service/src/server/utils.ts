import { ServerResponse } from "node:http";
import { ServerRequest } from "./types";

export const readJsonBody = async (req: ServerRequest): Promise<unknown> => {
  if (req.headers["content-type"] !== "application/json") {
    return;
  }
  const data: Buffer[] = [];
  return new Promise((resolve, reject) => {
    req.on("data", (chunk: Buffer) => {
      data.push(chunk);
    });
    req.on("error", (e) => {
      reject(e);
    });

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    req.on("end", () => {
      const bufferContent = Buffer.concat(data).toString();
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        resolve(JSON.parse(bufferContent));
      } catch (e) {
        reject(e);
      }
    });
  });
};

export const parseQuery = (
  searchParams: URLSearchParams,
): Record<string, string> => {
  const queryParams: Record<string, string> = {};
  for (const [key, value] of searchParams.entries()) {
    queryParams[key] = value;
  }
  return queryParams;
};

export const respond = (code: number, data: unknown, res: ServerResponse) => {
  res.writeHead(code, {
    "Content-Type": "application/json",
    "access-control-allow-methods": "GET,POST,PUT,OPTIONS",
    "access-control-allow-origin": "*",
    "access-control-allow-headers": "*",
  });
  res.end(data ? JSON.stringify(data) : null);
};
