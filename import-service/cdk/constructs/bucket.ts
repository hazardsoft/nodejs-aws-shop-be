import { RemovalPolicy } from 'aws-cdk-lib'
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam'
import type { IFunction } from 'aws-cdk-lib/aws-lambda'
import { BlockPublicAccess, Bucket, BucketEncryption, HttpMethods } from 'aws-cdk-lib/aws-s3'
import { Construct } from 'constructs'
import { UploadBucketConfig } from './config.js'

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

  grantPut(handler: IFunction) {
    handler.addToRolePolicy(
      new PolicyStatement({
        actions: ['s3:PutObject'],
        resources: [this.uploadBucket.arnForObjects(`${UploadBucketConfig.uploadKeyPrefix}/*`)],
        effect: Effect.ALLOW
      })
    )
  }
}
