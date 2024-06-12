import type { IModel, MethodResponse } from 'aws-cdk-lib/aws-apigateway'
import { Construct } from 'constructs'

interface ProductsServiceResponsesProps {
  models: {
    oneProduct: IModel
    manyProducts: IModel
  }
}

export class ProductsServiceResponses extends Construct {
  public readonly oneProductResponses: MethodResponse[]
  public readonly manyProductsResponses: MethodResponse[]

  constructor(scope: Construct, id: string, props: ProductsServiceResponsesProps) {
    super(scope, id)

    this.oneProductResponses = this.createOneProductResponses(props)
    this.manyProductsResponses = this.createManyProductsResponses(props)
  }

  private createOneProductResponses(props: ProductsServiceResponsesProps): MethodResponse[] {
    return [
      {
        statusCode: '200',
        responseModels: {
          'application/json': props.models.oneProduct
        }
      }
    ]
  }

  private createManyProductsResponses(props: ProductsServiceResponsesProps): MethodResponse[] {
    return [
      {
        statusCode: '200',
        responseModels: {
          'application/json': props.models.manyProducts
        }
      }
    ]
  }
}
