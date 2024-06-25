import { Function as LambdaFunction, Runtime, Code, type IFunction } from 'aws-cdk-lib/aws-lambda'
import { env } from 'cdk/config'
import { Construct } from 'constructs'

export class ProductServiceHandlers extends Construct {
  public readonly getManyProducts: IFunction
  public readonly getOneProduct: IFunction
  public readonly createOneProduct: IFunction

  constructor(scope: Construct, id: string) {
    super(scope, id)

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
  }
}
