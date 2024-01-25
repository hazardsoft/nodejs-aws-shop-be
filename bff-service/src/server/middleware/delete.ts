import { ServerResponse } from "node:http";
import { Next, ServerRequest } from "../types.js";
import { HTTP_STATUS } from "../constants.js";
import { respond } from "../utils.js";

const middleware = (
  req: ServerRequest,
  res: ServerResponse,
  next: Next,
): void => {
  if (req.method === "DELETE") {
    respond(HTTP_STATUS.METHOD_NOT_ALLOWED, null, res);
  } else {
    next();
  }
};

export default middleware;
