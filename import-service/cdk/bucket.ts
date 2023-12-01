import { Function as LambdaFunction } from "aws-cdk-lib/aws-lambda";
import { Bucket, EventType, HttpMethods } from "aws-cdk-lib/aws-s3";
import { LambdaDestination } from "aws-cdk-lib/aws-s3-notifications";
import { Construct } from "constructs";
import { config } from "./constants";

export class ImportServiceBucket extends Construct {
  public readonly importBucket: Bucket;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.importBucket = new Bucket(this, "ImportServiceBucket", {
      // autoDeleteObjects: true,
      // removalPolicy: RemovalPolicy.DESTROY,
      cors: [
        {
          allowedMethods: [HttpMethods.PUT, HttpMethods.GET, HttpMethods.HEAD],
          allowedOrigins: ["*"],
          allowedHeaders: ["*"],
        },
      ],
    });
  }

  registerPutHandler(handler: LambdaFunction): void {
    this.importBucket.grantPut(handler);
  }

  registerGetHandler(handler: LambdaFunction): void {
    this.importBucket.grantRead(handler);
  }

  registerObjectCreatedHandler(handler: LambdaFunction): void {
    this.importBucket.addEventNotification(
      EventType.OBJECT_CREATED,
      new LambdaDestination(handler),
      {
        prefix: config.bucketUploadedPrefix,
      },
    );
  }
}
