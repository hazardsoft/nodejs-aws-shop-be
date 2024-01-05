import "dotenv/config";

import { createServer } from "./server/server";
import "dotenv/config";

const port = Number(process.env.PORT) || 3000;
createServer(port);
