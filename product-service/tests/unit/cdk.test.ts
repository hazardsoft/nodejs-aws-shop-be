import { describe, test } from "vitest";
import { productService } from "../../cdk/index.js";
import { config } from "../../cdk/constants.js";
import { Template } from "aws-cdk-lib/assertions";

describe("Tests for Lambdas/API Gateway", () => {
  const template = Template.fromStack(productService);
  let resourceType: string;

  test("2 DynamoDB tables are defined", () => {
    resourceType = "AWS::DynamoDB::GlobalTable";

    template.resourceCountIs(resourceType, 2);
    template.hasResourceProperties(resourceType, {
      TableName: "Products",
    });
    template.hasResourceProperties(resourceType, {
      TableName: "Stocks",
    });
  });
  test("3 Lambda functions are defined", () => {
    resourceType = "AWS::Lambda::Function";

    template.resourceCountIs(resourceType, 3);
    template.hasResourceProperties(resourceType, {
      Handler: "getProducts.handler",
    });
    template.hasResourceProperties(resourceType, {
      Handler: "getOneProduct.handler",
    });
    template.hasResourceProperties(resourceType, {
      Handler: "createProduct.handler",
    });
  });

  test("3 API methods are defined", () => {
    resourceType = "AWS::ApiGateway::Method";

    template.resourceCountIs(resourceType, 4);
    template.hasResourceProperties(resourceType, {
      HttpMethod: "GET",
    });
    template.hasResourceProperties(resourceType, {
      HttpMethod: "POST",
    });
    template.hasResourceProperties(resourceType, {
      HttpMethod: "OPTIONS",
    });
  });

  test("RestApi Gateway is defined", () => {
    resourceType = "AWS::ApiGateway::RestApi";
    template.resourceCountIs(resourceType, 1);

    resourceType = "AWS::ApiGateway::Resource";
    template.resourceCountIs(resourceType, 2);
    template.hasResourceProperties(resourceType, {
      PathPart: "products",
    });
    template.hasResourceProperties(resourceType, {
      PathPart: "{id}",
    });
  });

  test(`Deployment stage ${config.stageName} is defined`, () => {
    resourceType = "AWS::ApiGateway::Stage";
    template.resourceCountIs(resourceType, 1);
    template.hasResourceProperties(resourceType, {
      StageName: config.stageName,
    });
  });
});
