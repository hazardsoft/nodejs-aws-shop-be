import { Function as LambdaFunction } from "aws-cdk-lib/aws-lambda";
import { Bucket, HttpMethods } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

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
}
