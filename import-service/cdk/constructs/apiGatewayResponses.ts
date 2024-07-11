import { ResponseType, type GatewayResponseOptions } from 'aws-cdk-lib/aws-apigateway'
import { Construct } from 'constructs'

const enum ResponseTypeOptions {
  BAD_REQUEST_BODY = 'BAD_REQUEST_BODY',
  DEFAULT_4XX = 'DEFAULT_4XX',
  DEFAULT_5XX = 'DEFAULT_5XX'
}

export class ImportServiceGatewayResponses extends Construct {
  public static readonly options: Record<ResponseTypeOptions, GatewayResponseOptions> = {
    BAD_REQUEST_BODY: {
      type: ResponseType.BAD_REQUEST_BODY,
      statusCode: '400',
      // standard message is $context.error.message
      // but here $context.error.validationErrorString is used to return detailed information about request body validation
      templates: {
        'application/json':
          '{"message": "$context.error.messageString", "issues": ["$context.error.validationErrorString"]}'
      }
    },
    DEFAULT_4XX: {
      type: ResponseType.DEFAULT_4XX,
      responseHeaders: {
        'Access-Control-Allow-Origin': "'*'"
      }
    },
    DEFAULT_5XX: {
      type: ResponseType.DEFAULT_5XX,
      responseHeaders: {
        'Access-Control-Allow-Origin': "'*'"
      }
    }
  }
}
