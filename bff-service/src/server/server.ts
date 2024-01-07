import http, { Server, ServerResponse } from "node:http";
import { URL } from "node:url";
import { Product, ServerRequest } from "./types.js";
import { parseQuery, readJsonBody, respond } from "./utils.js";
import { HTTP_STATUS } from "./constants.js";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import {
  getProducts,
  setProducts,
  hasProducts,
  isCacheExpired,
} from "./cache.js";
import { match } from "path-to-regexp";

const envKeys = Object.keys(process.env);
const matchProducts = match("/product", { decode: decodeURIComponent });

function createServer(port: number): Server {
  const server = http.createServer();
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  server.on("request", async (req: ServerRequest, res: ServerResponse) => {
    if (req.method === "OPTIONS") {
      respond(HTTP_STATUS.NO_CONTENT, null, res);
      return;
    }
    if (req.method === "DELETE") {
      respond(HTTP_STATUS.METHOD_NOT_ALLOWED, null, res);
      return;
    }

    try {
      req.body = await readJsonBody(req);
    } catch (e) {
      req.body = null;
    }

    const originalUrl = new URL(
      req.url as string,
      `http://${req.headers.host}`,
    );

    const originalPathname = originalUrl.pathname.substring(1);
    const destinationServiceKey = envKeys.find((key) =>
      originalPathname.startsWith(key),
    );
    if (!destinationServiceKey) {
      respond(
        HTTP_STATUS.BAD_GATEWAY,
        { message: `Service (${originalPathname}) not found` },
        res,
      );
      return;
    }

    const isProducts =
      req.method === "GET" && matchProducts(originalUrl.pathname);
    if (isProducts) {
      if (hasProducts() && !isCacheExpired()) {
        respond(HTTP_STATUS.OK, getProducts(), res);
        return;
      }
    }

    // /product -> EMPTY
    // /product/{id} -> {id}
    // /cart -> EMPTY
    // /cart/checkout -> /checkout
    const destinationPathname = originalUrl.pathname.substring(
      destinationServiceKey.length + 1,
    );

    const destinationServiceUrl = `${process.env[destinationServiceKey]}${destinationPathname}`;

    const requestConfig: AxiosRequestConfig = {
      url: destinationServiceUrl,
      method: req.method,
      headers: req.headers.authorization
        ? { Authorization: req.headers.authorization }
        : {},
      params: parseQuery(originalUrl.searchParams),
      data: req.body,
    };

    axios(requestConfig)
      .then((response) => {
        if (isProducts) {
          setProducts(response.data as Product[]);
        }
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
