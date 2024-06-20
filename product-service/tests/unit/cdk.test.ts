import { Template } from 'aws-cdk-lib/assertions'
import { describe, test } from 'vitest'
import { productService } from '../../cdk/index.js'

describe('Test AWS CDK stack', () => {
  const template = Template.fromStack(productService)

  test('Lambda handlers are created', () => {
    template.resourceCountIs('AWS::Lambda::Function', 2)
    template.hasResourceProperties('AWS::Lambda::Function', {
      Handler: 'getProductsList.handler'
    })
    template.hasResourceProperties('AWS::Lambda::Function', {
      Handler: 'getProductsById.handler'
    })
  })

  test('REST API is created', () => {
    template.resourceCountIs('AWS::ApiGateway::RestApi', 1)
    template.hasResourceProperties('AWS::ApiGateway::RestApi', {
      Name: 'Products'
    })
  })

  test('Api Gateway has 2 resources', () => {
    template.resourceCountIs('AWS::ApiGateway::Resource', 2)
    template.hasResourceProperties('AWS::ApiGateway::Resource', {
      PathPart: 'products'
    })
    template.hasResourceProperties('AWS::ApiGateway::Resource', {
      PathPart: '{id}'
    })
  })

  test('Api Gateway has 2 GET methods', () => {
    template.resourceCountIs('AWS::ApiGateway::Method', 4)
    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'GET'
    })
    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'OPTIONS'
    })
  })
})
