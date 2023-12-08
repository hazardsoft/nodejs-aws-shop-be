import { describe, test } from "vitest";
import { importService } from "../cdk/index.js";
import { config } from "../cdk/constants.js";
import { Template } from "aws-cdk-lib/assertions";

describe("Tests for Lambdas/API Gateway", () => {
  const template = Template.fromStack(importService);
  let resourceType: string;

  test("1 Lambda function is defined", () => {
    resourceType = "AWS::Lambda::Function";

    template.resourceCountIs(resourceType, 3);
    template.hasResourceProperties(resourceType, {
      Handler: "importProducts.handler",
    });
    template.hasResourceProperties(resourceType, {
      Handler: "parseProducts.handler",
    });
  });

  test("1 API method is defined", () => {
    resourceType = "AWS::ApiGateway::Method";

    template.resourceCountIs(resourceType, 1);
    template.hasResourceProperties(resourceType, {
      HttpMethod: "GET",
    });
  });

  test("RestApi Gateway is defined", () => {
    resourceType = "AWS::ApiGateway::RestApi";
    template.resourceCountIs(resourceType, 1);

    resourceType = "AWS::ApiGateway::Resource";
    template.resourceCountIs(resourceType, 1);
    template.hasResourceProperties(resourceType, {
      PathPart: "import",
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
