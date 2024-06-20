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
    getManyProducts: IFunction
    getOneProduct: IFunction
    createOneProduct: IFunction
  }
}

export class ProductServiceApi extends Construct {
  constructor(scope: Construct, id: string, props: ProductServiceApiProps) {
    super(scope, id)

    const integrationOptions: LambdaIntegrationOptions = {
      allowTestInvoke: false
    }
    const getAllProductsIntegration = new LambdaIntegration(
      props.handlers.getManyProducts,
      integrationOptions
    )
    const getOneProductIntegration = new LambdaIntegration(
      props.handlers.getOneProduct,
      integrationOptions
    )
    const createOneProductIntegration = new LambdaIntegration(
      props.handlers.createOneProduct,
      integrationOptions
    )

    const api = new RestApi(this, 'ProductApi', {
      restApiName: 'Products'
    })
    const { getOneProduct, getManyProducts, createOneProduct, error } = new ProductsServiceModels(
      this,
      'ProductsServiceModels',
      {
        api
      }
    )
    const apiResponses = new ProductsServiceResponses(this, 'ProductsServiceResponses', {
      models: {
        getOneProduct,
        getManyProducts,
        createOneProduct,
        error
      }
    })

    // Adds /products endpoint
    const productsEndpoint = api.root.addResource('products', {
      // by default /products endpoint and all resources under will inherit default CORS settings
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowHeaders: Cors.DEFAULT_HEADERS,
        allowMethods: ['GET', 'POST']
      }
    })
    // Adds "GET" method
    productsEndpoint.addMethod('GET', getAllProductsIntegration, {
      methodResponses: apiResponses.getManyProductsResponses
    })
    // Adds "POST" method
    productsEndpoint.addMethod('POST', createOneProductIntegration, {
      methodResponses: apiResponses.createOneProductResponses,
      requestModels: {
        'application/json': createOneProduct
      }
    })

    // Adds /products/{id} endpoint
    const oneProductEndpoint = productsEndpoint.addResource('{id}')
    // Adds "GET" method
    oneProductEndpoint.addMethod('GET', getOneProductIntegration, {
      methodResponses: apiResponses.getOneProductResponses
    })
  }
}
