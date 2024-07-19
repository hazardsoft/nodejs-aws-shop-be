import { authorizationService } from '@/index.js'
import { Template } from 'aws-cdk-lib/assertions'
import { describe, test } from 'vitest'

describe('Authorization Service AWS CDK Stack Tests', () => {
  const template = Template.fromStack(authorizationService)

  test('should have 1 lambda', () => {
    template.resourceCountIs('AWS::Lambda::Function', 1)

    template.hasResourceProperties('AWS::Lambda::Function', {
      Handler: 'basicAuthorizer.handler'
    })
  })
})
