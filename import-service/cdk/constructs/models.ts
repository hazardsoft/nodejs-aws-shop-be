import { JsonSchemaType, Model, type IModel, type IRestApi } from 'aws-cdk-lib/aws-apigateway'
import { Construct } from 'constructs'

export interface ImportServiceModelsProps {
  api: IRestApi
}

const ModelNames = {
  getPresignedUrl: 'GetPresignedUrlModel',
  presignedUrl: 'PresignedUrl',
  error: 'ErrorModel'
}

export class ImportServiceModels extends Construct {
  public readonly getPresignedUrl: IModel
  public readonly presignedUrl: IModel
  public readonly error: IModel

  constructor(scope: Construct, id: string, props: ImportServiceModelsProps) {
    super(scope, id)

    this.getPresignedUrl = this.createGetPresignedUrlModel(props.api)
    this.presignedUrl = this.createPresignedUrlModel(props.api)
    this.error = this.createErrorModel(props.api)
  }

  private createGetPresignedUrlModel(api: IRestApi): IModel {
    return new Model(this, 'GetPresignedUrlModel', {
      restApi: api,
      modelName: ModelNames.getPresignedUrl,
      schema: {
        type: JsonSchemaType.OBJECT,
        properties: {
          name: {
            type: JsonSchemaType.STRING,
            pattern: '^.+.csv$',
            description: 'Name of the CSV file to upload'
          }
        },
        required: ['name']
      }
    })
  }

  private createPresignedUrlModel(api: IRestApi): IModel {
    return new Model(this, 'PresignedUrlModel', {
      restApi: api,
      modelName: ModelNames.presignedUrl,
      schema: {
        type: JsonSchemaType.STRING,
        description: 'Presigned url for CSV file upload'
      }
    })
  }

  private createErrorModel(api: IRestApi): IModel {
    return new Model(this, 'ErrorModel', {
      restApi: api,
      modelName: ModelNames.error,
      schema: {
        title: ModelNames.error,
        type: JsonSchemaType.OBJECT,
        properties: {
          message: { type: JsonSchemaType.STRING },
          issues: {
            type: JsonSchemaType.ARRAY,
            items: { type: JsonSchemaType.STRING }
          }
        },
        required: ['message']
      }
    })
  }
}
