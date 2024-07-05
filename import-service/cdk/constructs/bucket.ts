import { RemovalPolicy } from 'aws-cdk-lib'
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam'
import type { IFunction } from 'aws-cdk-lib/aws-lambda'
import {
  BlockPublicAccess,
  Bucket,
  BucketEncryption,
  EventType,
  HttpMethods
} from 'aws-cdk-lib/aws-s3'
import { Construct } from 'constructs'
import { LambdaDestination } from 'aws-cdk-lib/aws-s3-notifications'

const enum S3Actions {
  PUT = 's3:PutObject',
  GET = 's3:GetObject',
  DELETE = 's3:DeleteObject'
}

export class ImportServiceBucket extends Construct {
  public readonly uploadBucket: Bucket

  constructor(scope: Construct, id: string) {
    super(scope, id)

    this.uploadBucket = new Bucket(this, 'ImportServiceBucket', {
      publicReadAccess: false,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      encryption: BucketEncryption.S3_MANAGED,
      removalPolicy: RemovalPolicy.DESTROY,
      versioned: false,
      cors: [
        {
          allowedMethods: [HttpMethods.PUT],
          allowedOrigins: ['*'],
          allowedHeaders: ['*']
        }
      ]
    })
  }

  grantPermission(handler: IFunction, action: S3Actions, key: string) {
    handler.addToRolePolicy(
      new PolicyStatement({
        actions: [action],
        resources: [this.uploadBucket.arnForObjects(`${key}/*`)],
        effect: Effect.ALLOW
      })
    )
  }

  grantPut(handler: IFunction, key: string) {
    this.grantPermission(handler, S3Actions.PUT, key)
  }

  grantGet(handler: IFunction, key: string) {
    this.grantPermission(handler, S3Actions.GET, key)
  }

  grantDelete(handler: IFunction, key: string) {
    this.grantPermission(handler, S3Actions.DELETE, key)
  }

  notify(handler: IFunction, prefix: string) {
    this.uploadBucket.addEventNotification(
      EventType.OBJECT_CREATED_PUT,
      new LambdaDestination(handler),
      { prefix }
    )
  }
}
