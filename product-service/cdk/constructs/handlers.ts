import { Function as LambdaFunction, Runtime, Code, type IFunction } from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'

export class ProductServiceHandlers extends Construct {
  public readonly getAllProducts: IFunction
  public readonly getOneProduct: IFunction

  constructor(scope: Construct, id: string) {
    super(scope, id)

    this.getAllProducts = new LambdaFunction(this, 'GetAllProducts', {
      runtime: Runtime.NODEJS_20_X,
      code: Code.fromAsset('./dist/lambdas/getProductsList'),
      handler: 'getProductsList.handler'
    })

    this.getOneProduct = new LambdaFunction(this, 'GetOneProduct', {
      runtime: Runtime.NODEJS_20_X,
      code: Code.fromAsset('./dist/lambdas/getProductsById'),
      handler: 'getProductsById.handler'
    })
  }
}
