import type { IModel, MethodResponse } from 'aws-cdk-lib/aws-apigateway'
import { Construct } from 'constructs'

interface ImportServiceResponsesProps {
  models: {
    presignedUrl: IModel
    error: IModel
  }
}

export class ImportServiceResponses extends Construct {
  public readonly getPresignedUrlResponses: MethodResponse[]

  constructor(scope: Construct, id: string, props: ImportServiceResponsesProps) {
    super(scope, id)

    this.getPresignedUrlResponses = this.createGetPresignedUrlResponses(props)
  }

  private createGetPresignedUrlResponses(props: ImportServiceResponsesProps): MethodResponse[] {
    return [
      {
        statusCode: '200',
        responseModels: {
          'text/plain': props.models.presignedUrl
        }
      },
      {
        statusCode: '401',
        responseModels: {
          'application/json': props.models.error
        }
      },
      {
        statusCode: '403',
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
