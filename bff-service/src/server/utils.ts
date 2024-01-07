import { ServerResponse } from "node:http";

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
