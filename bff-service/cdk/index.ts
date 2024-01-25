import { App, Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import { BffServiceApi } from "./api";
import "dotenv/config";

class BffService extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new BffServiceApi(this, "BffServiceApi", {
      serverUrl: process.env.BFF_SERVICE_URL ?? "",
    });
  }
}

const app = new App();
const bffService = new BffService(app, "BffService");

export { bffService };
