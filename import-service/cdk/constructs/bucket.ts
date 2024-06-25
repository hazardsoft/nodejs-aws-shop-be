import { RemovalPolicy } from 'aws-cdk-lib'
import { BlockPublicAccess, Bucket, BucketEncryption } from 'aws-cdk-lib/aws-s3'
import { Construct } from 'constructs'

export class ImportServiceBucket extends Construct {
  public readonly uploadBucket: Bucket

  constructor(scope: Construct, id: string) {
    super(scope, id)

    this.uploadBucket = new Bucket(this, 'ImportServiceBucket', {
      publicReadAccess: false,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      encryption: BucketEncryption.S3_MANAGED,
      removalPolicy: RemovalPolicy.DESTROY,
      versioned: false
    })
  }
}
