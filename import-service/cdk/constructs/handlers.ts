import { Function as LambdaFunction, Runtime, Code, type IFunction } from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'

interface ImportServiceHandlersProps {
  bucketName: string
  queueUrl: string
}

export class ImportServiceHandlers extends Construct {
  public readonly getPresignedUrl: IFunction
  public readonly parseProducts: IFunction

  constructor(scope: Construct, id: string, props: ImportServiceHandlersProps) {
    super(scope, id)

    this.getPresignedUrl = new LambdaFunction(this, 'GetPresignedUrl', {
      runtime: Runtime.NODEJS_20_X,
      code: Code.fromAsset('./dist/handlers/importProductsFile'),
      handler: 'importProductsFile.handler',
      environment: {
        BUCKET_NAME: props.bucketName
      }
    })

    this.parseProducts = new LambdaFunction(this, 'ParseProducts', {
      runtime: Runtime.NODEJS_20_X,
      code: Code.fromAsset('./dist/handlers/importFileParser'),
      handler: 'importFileParser.handler',
      environment: {
        PRODUCTS_QUEUE_URL: props.queueUrl
      }
    })
  }
}
