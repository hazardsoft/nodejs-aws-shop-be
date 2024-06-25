import { Template } from 'aws-cdk-lib/assertions'
import { describe, test } from 'vitest'
import { importService } from '../cdk/index.js'

describe('Test AWS CDK stack', () => {
  const template = Template.fromStack(importService)

  test('Lambda handlers are created', () => {
    template.resourceCountIs('AWS::Lambda::Function', 1)
    template.hasResourceProperties('AWS::Lambda::Function', {
      Handler: 'importProductsFile.handler'
    })
  })

  test('REST API is created', () => {
    template.resourceCountIs('AWS::ApiGateway::RestApi', 1)
    template.hasResourceProperties('AWS::ApiGateway::RestApi', {
      Name: 'Import'
    })
  })

  test('Api Gateway has 1 resource', () => {
    template.resourceCountIs('AWS::ApiGateway::Resource', 1)
    template.hasResourceProperties('AWS::ApiGateway::Resource', {
      PathPart: 'import'
    })
  })

  test('Api Gateway has 2 methods', () => {
    template.resourceCountIs('AWS::ApiGateway::Method', 2)
    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'GET'
    })
    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'OPTIONS'
    })
  })
})
