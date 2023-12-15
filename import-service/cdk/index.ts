import { App, Fn, Stack } from "aws-cdk-lib";
import { Function as LambdaFunction } from "aws-cdk-lib/aws-lambda";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import { ImportServiceApi } from "./api";
import { ImportServiceBucket } from "./bucket";
import { ImportProductsHandlers } from "./handlers";
import { config } from "./constants";
import { ComponentsIds } from "../../shared/constants";

class ImportService extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const bucket = new ImportServiceBucket(this, "ImportServiceBucket");

    const productsQueueUrl = Fn.importValue(
      <string>ComponentsIds.productsQueueUrl,
    );
    const productsQueueArn = Fn.importValue(
      <string>ComponentsIds.productsQueueArn,
    );

    const { importProductsHandler, parseProductsHandler } =
      new ImportProductsHandlers(this, "ImportProductsHandlers", {
        bucketName: bucket.importBucket.bucketName,
        productsQueueUrl,
      });

    this.configureBucket(bucket, importProductsHandler, parseProductsHandler);
    this.configureQueueProducer(productsQueueArn, parseProductsHandler);

    new ImportServiceApi(this, "ImportServiceApi", {
      importProductsHandler,
    });
  }
  private configureBucket(
    bucket: ImportServiceBucket,
    importProductsHandler: LambdaFunction,
    parseProductsHandler: LambdaFunction,
  ): void {
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
  }

  private configureQueueProducer(
    queueArn: string,
    parseProductsHandler: LambdaFunction,
  ): void {
    parseProductsHandler.addToRolePolicy(
      new PolicyStatement({
        actions: ["sqs:SendMessage"],
        resources: [queueArn],
        effect: Effect.ALLOW,
      }),
    );
  }
}

const app = new App();
const importService = new ImportService(app, "ImportService");

export { importService };
