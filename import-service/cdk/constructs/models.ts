import { JsonSchemaType, Model, type IModel, type IRestApi } from 'aws-cdk-lib/aws-apigateway'
import { Construct } from 'constructs'

export interface ImportServiceModelsProps {
  api: IRestApi
}

const ModelNames = {
  presignedUrl: 'PresignedUrl',
  error: 'ErrorModel'
}

export class ImportServiceModels extends Construct {
  public readonly presignedUrl: IModel
  public readonly error: IModel

  constructor(scope: Construct, id: string, props: ImportServiceModelsProps) {
    super(scope, id)

    this.presignedUrl = this.createPresignedUrlModel(props.api)
    this.error = this.createErrorModel(props.api)
  }

  private createPresignedUrlModel(api: IRestApi): IModel {
    return new Model(this, 'PresignedUrlModel', {
      restApi: api,
      contentType: 'text/plain',
      schema: {
        type: JsonSchemaType.STRING,
        description: 'Presigned url for CSV file upload'
      }
    })
  }

  private createErrorModel(api: IRestApi): IModel {
    return new Model(this, 'ErrorModel', {
      restApi: api,
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
