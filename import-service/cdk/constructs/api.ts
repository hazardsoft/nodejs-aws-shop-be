import {
  Cors,
  LambdaIntegration,
  type LambdaIntegrationOptions,
  RestApi
} from 'aws-cdk-lib/aws-apigateway'
import { type IFunction } from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'
import { ImportServiceModels } from './models.js'
import { ImportServiceResponses } from './responses.js'
import { ImportServiceGatewayResponses } from './apiGatewayResponses.js'

interface ImportServiceApiProps {
  handlers: {
    getPresignedUrl: IFunction
  }
}

export class ImportServiceApi extends Construct {
  constructor(scope: Construct, id: string, props: ImportServiceApiProps) {
    super(scope, id)

    const integrationOptions: LambdaIntegrationOptions = {
      allowTestInvoke: false
    }
    const getPresignedUrlIntegration = new LambdaIntegration(
      props.handlers.getPresignedUrl,
      integrationOptions
    )

    const api = new RestApi(this, 'ImportApi', { restApiName: 'Import' })

    api.addGatewayResponse(
      'GetPresignedUrlBadRequestBody',
      ImportServiceGatewayResponses.options.BAD_REQUEST_BODY
    )

    const { presignedUrl, error } = new ImportServiceModels(this, 'ImportServiceModels', { api })
    const apiResponses = new ImportServiceResponses(this, 'ImportServiceResponses', {
      models: {
        presignedUrl,
        error
      }
    })

    // Adds /import endpoint
    const importEndpoint = api.root.addResource('import', {
      // by default /import endpoint and all resources under will inherit default CORS settings
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowHeaders: Cors.DEFAULT_HEADERS,
        allowMethods: ['GET']
      }
    })

    // Adds "POST" method
    importEndpoint.addMethod('GET', getPresignedUrlIntegration, {
      methodResponses: apiResponses.getPresignedUrlResponses,
      requestParameters: {
        'method.request.querystring.name': true
      },
      requestValidatorOptions: {
        validateRequestBody: false,
        validateRequestParameters: true
      }
    })
  }
}
