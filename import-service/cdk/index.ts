import { App, Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import { ImportServiceApi } from "./api";
import { ImportServiceBucket } from "./bucket";
import { ImportProductsHandlers } from "./handlers";

class ImportService extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const bucket = new ImportServiceBucket(this, "ImportServiceBucket");

    const { importProductsFileHandler } = new ImportProductsHandlers(
      this,
      "ImportProductsHandlers",
      { bucketName: bucket.importBucket.bucketName },
    );
    bucket.registerPutHandler(importProductsFileHandler);

    new ImportServiceApi(this, "ImportServiceApi", {
      importProductsFileHandler,
    });
  }
}

const app = new App();
const importService = new ImportService(app, "ImportService");

export { importService };
