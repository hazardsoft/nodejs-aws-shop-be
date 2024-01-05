import { ServerResponse } from "node:http";
import { ServerRequest } from "./types";

export const readJsonBody = async (req: ServerRequest): Promise<void> => {
  if (req.headers["content-type"] !== "application/json") {
    return;
  }
  const data: Buffer[] = [];
  return new Promise((resolve, reject) => {
    req.on("data", (chunk: Buffer) => {
      data.push(chunk);
    });
    req.on("error", () => {
      reject();
    });

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    req.on("end", () => {
      const bufferContent = Buffer.concat(data).toString();
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        req.body = JSON.parse(bufferContent);
        resolve();
      } catch (e) {
        reject();
      }
    });
  });
};

export const respond = (code: number, data: unknown, res: ServerResponse) => {
  res.writeHead(code, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
};
