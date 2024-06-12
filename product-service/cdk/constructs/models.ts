import { JsonSchemaType, Model, IModel, IRestApi } from 'aws-cdk-lib/aws-apigateway'
import { Construct } from 'constructs'

export interface ProductsServiceModelsProps {
  api: IRestApi
}

const ModelNames = {
  oneProduct: 'OneProduct',
  manyProducts: 'ManyProducts'
}

export class ProductsServiceModels extends Construct {
  public readonly manyProducts: IModel
  public readonly oneProduct: IModel

  constructor(scope: Construct, id: string, props: ProductsServiceModelsProps) {
    super(scope, id)

    this.oneProduct = this.createOneProductModel(props.api)
    this.manyProducts = this.createManyProductsModel(props.api)
  }

  private createOneProductModel(api: IRestApi): Model {
    return new Model(this, 'OneProductModel', {
      restApi: api,
      modelName: ModelNames.oneProduct,
      schema: {
        type: JsonSchemaType.OBJECT,
        properties: {
          id: { type: JsonSchemaType.STRING },
          name: { type: JsonSchemaType.STRING },
          description: { type: JsonSchemaType.STRING },
          price: { type: JsonSchemaType.NUMBER },
          count: { type: JsonSchemaType.INTEGER },
          image: { type: JsonSchemaType.STRING }
        },
        required: ['id', 'name', 'description', 'price', 'count', 'image']
      }
    })
  }

  private createManyProductsModel(api: IRestApi): IModel {
    return new Model(this, 'ManyProductsModel', {
      restApi: api,
      modelName: ModelNames.manyProducts,
      schema: {
        type: JsonSchemaType.ARRAY,
        items: {
          ref: `#/definitions/${ModelNames.oneProduct}`
        }
      }
    })
  }
}
