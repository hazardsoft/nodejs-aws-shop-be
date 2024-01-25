import { ServerResponse } from "node:http";
import { Next, ServerRequest } from "../types.js";
import { HTTP_STATUS } from "../constants.js";
import { parseQuery, respond } from "../utils.js";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

const envKeys = Object.keys(process.env);

const middleware = (
  req: ServerRequest,
  res: ServerResponse,
  next: Next,
): void => {
  const originalUrl = new URL(req.url as string, `http://${req.headers.host}`);

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
      next();
    });
};

export default middleware;
