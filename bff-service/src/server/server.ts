import http, { Server, ServerResponse } from "node:http";
import { URL } from "node:url";
import { ServerRequest } from "./types.js";
import { readJsonBody, respond } from "./utils.js";
import { HTTP_STATUS } from "./constants.js";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

const envKeys = Object.keys(process.env);

function createServer(port: number): Server {
  const server = http.createServer();
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  server.on("request", async (req: ServerRequest, res: ServerResponse) => {
    await readJsonBody(req);

    const originalUrl = new URL(
      req.url as string,
      `http://${req.headers.host}`,
    );

    const serviceName = originalUrl.pathname.substring(1);
    if (!envKeys.includes(serviceName)) {
      respond(
        HTTP_STATUS.BAD_GATEWAY,
        { message: `Service "${serviceName}" not found` },
        res,
      );
      return;
    }

    const serviceUrl = process.env[serviceName] as string;

    const reqParams: Record<string, string> = {};
    for (const [key, value] of originalUrl.searchParams.entries()) {
      reqParams[key] = value;
    }

    const requestConfig: AxiosRequestConfig = {
      url: serviceUrl,
      method: req.method,
      headers: req.headers.authorization
        ? { Authorization: req.headers.authorization }
        : {},
      params: reqParams,
      data: req.body,
    };

    axios(requestConfig)
      .then((response) => {
        respond(response.status, response.data, res);
      })
      .catch((e) => {
        console.error(e);
        if (e instanceof AxiosError) {
          respond(
            e.response?.status || HTTP_STATUS.INTERNAL_SERVER_ERROR,
            e.response?.data || { message: e.message },
            res,
          );
        }
      });
  });

  server.listen(port, () => {
    console.log(`Server is running at port ${port}`);
  });
  return server;
}
export { createServer };
