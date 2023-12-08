import { App, Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import { ImportServiceApi } from "./api";
import { ImportServiceBucket } from "./bucket";
import { ImportProductsHandlers } from "./handlers";
import { config } from "./constants";
import { ProductsQueue } from "./queue";

class ImportService extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const bucket = new ImportServiceBucket(this, "ImportServiceBucket");

    const queue = new ProductsQueue(this, "ProductsQueue");

    const { importProductsHandler, parseProductsHandler } =
      new ImportProductsHandlers(this, "ImportProductsHandlers", {
        bucketName: bucket.importBucket.bucketName,
        queueUrl: queue.queue.queueUrl,
      });

    bucket.registerPutHandler(
      importProductsHandler,
      config.bucketUploadedPrefix,
    ); // required to upload CSV file to S3

    bucket.registerGetHandler(
      parseProductsHandler,
      config.bucketUploadedPrefix,
    ); // required to download CSV file from S3
    bucket.registerDeleteHandler(
      parseProductsHandler,
      config.bucketUploadedPrefix,
    ); // required to delete parsed CSV from "uploaded" folder
    bucket.registerPutHandler(parseProductsHandler, config.bucketParsedPrefix); // required to move parsed CSV to "parsed" folder
    bucket.registerObjectCreatedHandler(
      parseProductsHandler,
      config.bucketUploadedPrefix,
    ); // required to be triggered once a file is uploaded to S3 with prefix "uploaded"

    queue.registerProducer(parseProductsHandler); // registering producer for the queue

    new ImportServiceApi(this, "ImportServiceApi", {
      importProductsHandler,
    });
  }
}

const app = new App();
const importService = new ImportService(app, "ImportService");

export { importService };
