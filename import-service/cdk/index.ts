import { App, Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import { ImportServiceApi } from "./api";
import { ImportServiceBucket } from "./bucket";
import { ImportProductsHandlers } from "./handlers";

class ImportService extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const bucket = new ImportServiceBucket(this, "ImportServiceBucket");

    const { importProductsHandler, parseProductsHandler } =
      new ImportProductsHandlers(this, "ImportProductsHandlers", {
        bucketName: bucket.importBucket.bucketName,
      });
    bucket.registerPutHandler(importProductsHandler);
    bucket.registerGetHandler(parseProductsHandler);
    bucket.registerObjectCreatedHandler(parseProductsHandler);

    new ImportServiceApi(this, "ImportServiceApi", {
      importProductsHandler,
    });
  }
}

const app = new App();
const importService = new ImportService(app, "ImportService");

export { importService };
