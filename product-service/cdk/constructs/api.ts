import {
  Cors,
  LambdaIntegration,
  type LambdaIntegrationOptions,
  RestApi
} from 'aws-cdk-lib/aws-apigateway'
import { type IFunction } from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'
import { ProductsServiceModels } from './models.js'
import { ProductsServiceResponses } from './responses.js'

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
    api.root.addCorsPreflight({
      allowOrigins: Cors.ALL_ORIGINS,
      allowHeaders: Cors.DEFAULT_HEADERS,
      allowMethods: ['GET']
    })
    const { oneProduct, manyProducts } = new ProductsServiceModels(this, 'ProductsServiceModels', {
      api
    })
    const apiResponses = new ProductsServiceResponses(this, 'ProductsServiceResponses', {
      models: {
        oneProduct,
        manyProducts
      }
    })

    const productsEndpoint = api.root.addResource('products')
    const oneProductEndpoint = productsEndpoint.addResource('{id}')

    productsEndpoint.addMethod('GET', getAllProductsIntegration, {
      methodResponses: apiResponses.manyProductsResponses
    })
    oneProductEndpoint.addMethod('GET', getOneProductIntegration, {
      methodResponses: apiResponses.oneProductResponses
    })
  }
}
