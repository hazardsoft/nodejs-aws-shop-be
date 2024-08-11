import { bffService } from '@/index.js'
import { Template } from 'aws-cdk-lib/assertions'
import { describe, test } from 'vitest'

describe('BFF Service AWS CDK Stack Tests', () => {
  const template = Template.fromStack(bffService)

  test('should have HTTP API', () => {
    template.resourceCountIs('AWS::ApiGatewayV2::Api', 1)

    template.resourceCountIs('AWS::ApiGatewayV2::Route', 1)
    template.hasResourceProperties('AWS::ApiGatewayV2::Route', {
      RouteKey: 'ANY /{proxy+}'
    })

    template.resourceCountIs('AWS::ApiGatewayV2::Integration', 1)
    template.hasResourceProperties('AWS::ApiGatewayV2::Integration', {
      IntegrationMethod: 'ANY',
      IntegrationType: 'HTTP_PROXY'
    })
  })
})
