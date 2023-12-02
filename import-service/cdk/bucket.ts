import { Function as LambdaFunction } from "aws-cdk-lib/aws-lambda";
import { Bucket, EventType, HttpMethods } from "aws-cdk-lib/aws-s3";
import { LambdaDestination } from "aws-cdk-lib/aws-s3-notifications";
import { Construct } from "constructs";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

const enum S3Action {
  GET = "s3:GetObject",
  PUT = "s3:PutObject",
  DELETE = "s3:DeleteObject",
}
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

  registerPutHandler(handler: LambdaFunction, keyPrefix: string): void {
    // this.importBucket.grantPut(handler);
    handler.addToRolePolicy(this.createAccessPolicy(S3Action.PUT, keyPrefix));
  }

  registerGetHandler(handler: LambdaFunction, keyPrefix: string): void {
    // this.importBucket.grantRead(handler);
    handler.addToRolePolicy(this.createAccessPolicy(S3Action.GET, keyPrefix));
  }

  registerDeleteHandler(handler: LambdaFunction, keyPrefix: string): void {
    // this.importBucket.grantDelete(handler);
    handler.addToRolePolicy(
      this.createAccessPolicy(S3Action.DELETE, keyPrefix),
    );
  }

  registerObjectCreatedHandler(
    handler: LambdaFunction,
    keyPrefix: string,
  ): void {
    this.importBucket.addEventNotification(
      EventType.OBJECT_CREATED,
      new LambdaDestination(handler),
      {
        prefix: keyPrefix,
      },
    );
  }

  private createAccessPolicy(
    action: S3Action,
    keyPrefix: string,
  ): PolicyStatement {
    return new PolicyStatement({
      actions: [action],
      resources: [this.importBucket.arnForObjects(`${keyPrefix}/*`)],
      effect: Effect.ALLOW,
    });
  }
}
