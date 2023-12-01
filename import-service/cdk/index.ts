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
    bucket.registerPutHandler(importProductsHandler); // required to upload CSV file to S3

    bucket.registerGetHandler(parseProductsHandler); // required to download CSV file from S3
    bucket.registerDeleteHandler(parseProductsHandler); // required to delete parsed CSV from "uploaded" folder
    bucket.registerPutHandler(parseProductsHandler); // required to move parsed CSV to "parsed" folder
    bucket.registerObjectCreatedHandler(parseProductsHandler); // required to be triggered once a file is uploaded to S3 with prefix "uploaded"

    new ImportServiceApi(this, "ImportServiceApi", {
      importProductsHandler,
    });
  }
}

const app = new App();
const importService = new ImportService(app, "ImportService");

export { importService };
