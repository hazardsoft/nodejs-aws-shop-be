import type { IModel, MethodResponse } from 'aws-cdk-lib/aws-apigateway'
import { Construct } from 'constructs'

interface ImportServiceResponsesProps {
  models: {
    getPresignedUrl: IModel
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
          'application/json': props.models.presignedUrl
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
