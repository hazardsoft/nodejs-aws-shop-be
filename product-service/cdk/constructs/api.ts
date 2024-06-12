import {
  Cors,
  LambdaIntegration,
  type LambdaIntegrationOptions,
  RestApi
} from 'aws-cdk-lib/aws-apigateway'
import { type IFunction } from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'

interface ProductServiceApiProps {
  handlers: {
    getAllProducts: IFunction
    getOneProduct: IFunction
  }
}

export class ProductServiceApi extends Construct {
  constructor(scope: Construct, id: string, props: ProductServiceApiProps) {
    super(scope, id)

    const integrationOptions: LambdaIntegrationOptions = {
      allowTestInvoke: false
    }
    const getAllProductsIntegration = new LambdaIntegration(
      props.handlers.getAllProducts,
      integrationOptions
    )
    const getOneProductIntegration = new LambdaIntegration(
      props.handlers.getOneProduct,
      integrationOptions
    )

    const api = new RestApi(this, 'ProductApi', {
      restApiName: 'Products'
    })

    const productsEndpoint = api.root.addResource('products')
    productsEndpoint.addMethod('GET', getAllProductsIntegration)

    const oneProductEndpoint = productsEndpoint.addResource('{id}')
    oneProductEndpoint.addMethod('GET', getOneProductIntegration)

    api.root.addCorsPreflight({
      allowOrigins: Cors.ALL_ORIGINS,
      allowHeaders: Cors.DEFAULT_HEADERS,
      allowMethods: ['GET']
    })
  }
}
