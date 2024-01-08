import { ServerResponse } from "node:http";
import { Next, Product, ServerRequest } from "../types.js";
import { HTTP_STATUS } from "../constants.js";
import { respond } from "../utils.js";
import { match } from "path-to-regexp";
import {
  getProducts,
  hasProducts,
  isCacheExpired,
  setProducts,
} from "../storage.js";

const matchProducts = match("/product", { decode: decodeURIComponent });

const middleware = (
  req: ServerRequest,
  res: ServerResponse,
  next: Next,
): void => {
  const originalUrl = new URL(req.url as string, `http://${req.headers.host}`);

  const isProducts =
    req.method === "GET" && matchProducts(originalUrl.pathname);
  if (isProducts) {
    if (hasProducts() && !isCacheExpired()) {
      respond(HTTP_STATUS.OK, getProducts(), res);
    } else {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const originalResEnd = res.end;
      res.end = function (data) {
        originalResEnd.apply(this, [data, "utf-8"]);
        setProducts(data as Product[]);
        return res;
      };
    }
  } else {
    next();
  }
};

export default middleware;
