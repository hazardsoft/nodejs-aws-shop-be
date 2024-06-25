import type { IModel, MethodResponse } from 'aws-cdk-lib/aws-apigateway'
import { Construct } from 'constructs'

interface ProductsServiceResponsesProps {
  models: {
    getOneProduct: IModel
    getManyProducts: IModel
    createOneProduct: IModel
    error: IModel
  }
}

export class ProductsServiceResponses extends Construct {
  public readonly getOneProductResponses: MethodResponse[]
  public readonly getManyProductsResponses: MethodResponse[]
  public readonly createOneProductResponses: MethodResponse[]

  constructor(scope: Construct, id: string, props: ProductsServiceResponsesProps) {
    super(scope, id)

    this.getOneProductResponses = this.createGetOneProductResponses(props)
    this.getManyProductsResponses = this.createGetManyProductsResponses(props)
    this.createOneProductResponses = this.createCreateOneProductResponses(props)
  }

  private createGetOneProductResponses(props: ProductsServiceResponsesProps): MethodResponse[] {
    return [
      {
        statusCode: '200',
        responseModels: {
          'application/json': props.models.getOneProduct
        }
      },
      {
        statusCode: '400',
        responseModels: {
          'application/json': props.models.error
        }
      },
      {
        statusCode: '404',
        responseModels: {
          'application/json': props.models.error
        }
      },
      {
        statusCode: '500',
        responseModels: {
          'application/json': props.models.error
        }
      }
    ]
  }

  private createGetManyProductsResponses(props: ProductsServiceResponsesProps): MethodResponse[] {
    return [
      {
        statusCode: '200',
        responseModels: {
          'application/json': props.models.getManyProducts
        }
      },
      {
        statusCode: '500',
        responseModels: {
          'application/json': props.models.error
        }
      }
    ]
  }

  private createCreateOneProductResponses(props: ProductsServiceResponsesProps): MethodResponse[] {
    return [
      {
        statusCode: '201',
        responseModels: {
          'application/json': props.models.getOneProduct
        }
      },
      {
        statusCode: '400',
        responseModels: {
          'application/json': props.models.error
        }
      },
      {
        statusCode: '500',
        responseModels: {
          'application/json': props.models.error
        }
      }
    ]
  }
}
