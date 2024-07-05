import { Function as LambdaFunction, Runtime, Code, type IFunction } from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'

interface ProductServiceHandlersProps {
  productsTableName: string
  stocksTableName: string
  topicArn: string
}

export class ProductServiceHandlers extends Construct {
  public readonly getManyProducts: IFunction
  public readonly getOneProduct: IFunction
  public readonly createOneProduct: IFunction
  public readonly catalogBatchProcess: IFunction

  constructor(scope: Construct, id: string, props: ProductServiceHandlersProps) {
    super(scope, id)

    const env = {
      PRODUCTS_TABLE_NAME: props.productsTableName,
      STOCKS_TABLE_NAME: props.stocksTableName
    }

    this.getManyProducts = new LambdaFunction(this, 'GetAllProducts', {
      runtime: Runtime.NODEJS_20_X,
      code: Code.fromAsset('./dist/handlers/getProductsList'),
      handler: 'getProductsList.handler',
      environment: env
    })

    this.getOneProduct = new LambdaFunction(this, 'GetOneProduct', {
      runtime: Runtime.NODEJS_20_X,
      code: Code.fromAsset('./dist/handlers/getProductsById'),
      handler: 'getProductsById.handler',
      environment: env
    })

    this.createOneProduct = new LambdaFunction(this, 'CreateOneProduct', {
      runtime: Runtime.NODEJS_20_X,
      code: Code.fromAsset('./dist/handlers/createProduct'),
      handler: 'createProduct.handler',
      environment: env
    })

    this.catalogBatchProcess = new LambdaFunction(this, 'CatalogBatchProcess', {
      runtime: Runtime.NODEJS_20_X,
      code: Code.fromAsset('./dist/handlers/catalogBatchProcess'),
      handler: 'catalogBatchProcess.handler',
      environment: {
        TOPIC_ARN: props.topicArn
      }
    })
  }
}
