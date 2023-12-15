import { describe, expect, test } from "vitest";
import { productService } from "../../cdk/index.js";
import { config } from "../../cdk/constants.js";
import { Template } from "aws-cdk-lib/assertions";
import { ComponentsIds, SharedCdkConfig } from "../../../shared/constants.js";

describe("Tests for Lambdas/API Gateway", () => {
  const template = Template.fromStack(productService);
  let resourceType: string;

  test("2 DynamoDB tables are defined", () => {
    resourceType = "AWS::DynamoDB::GlobalTable";

    template.resourceCountIs(resourceType, 2);
    template.hasResourceProperties(resourceType, {
      TableName: "Products",
      KeySchema: [
        {
          AttributeName: "id",
          KeyType: "HASH",
        },
        {
          AttributeName: "title",
          KeyType: "RANGE",
        },
      ],
    });
    template.hasResourceProperties(resourceType, {
      TableName: "Stocks",
      KeySchema: [
        {
          AttributeName: "product_id",
          KeyType: "HASH",
        },
      ],
    });
  });
  test("3 Lambda functions are defined", () => {
    resourceType = "AWS::Lambda::Function";

    const env = {
      Variables: {
        PRODUCTS_TABLE_NAME: "Products",
        STOCKS_TABLE_NAME: "Stocks",
      },
    };

    template.resourceCountIs(resourceType, 4);
    template.hasResourceProperties(resourceType, {
      Handler: "getProducts.handler",
      Environment: env,
    });
    template.hasResourceProperties(resourceType, {
      Handler: "getOneProduct.handler",
      Environment: env,
    });
    template.hasResourceProperties(resourceType, {
      Handler: "createProduct.handler",
      Environment: env,
    });
    template.hasResourceProperties(resourceType, {
      Handler: "createManyProducts.handler",
      Environment: env,
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

  test("SNS is defined", () => {
    resourceType = "AWS::SNS::Topic";
    template.resourceCountIs(resourceType, 1);
    template.hasResourceProperties(resourceType, {
      DisplayName: "Topic to notify users via email about newly added products",
    });

    resourceType = "AWS::SNS::Subscription";
    template.resourceCountIs(resourceType, 2);
    template.hasResourceProperties(resourceType, {
      Protocol: "email",
    });
  });

  test("SQS is defined", () => {
    resourceType = "AWS::SQS::Queue";
    template.resourceCountIs(resourceType, 1);

    resourceType = "AWS::Lambda::EventSourceMapping";
    template.resourceCountIs(resourceType, 1);
    template.hasResourceProperties(resourceType, {
      BatchSize: SharedCdkConfig.queueBatchSize,
    });
  });

  test("Outputs are defined", () => {
    const outputs = template.findOutputs("*");
    const outputValues = Object.values(outputs);

    const isOutputDefined = (outputName: string) => {
      return outputValues.some((output: Output) => {
        return output.Export?.Name === outputName;
      });
    };

    expect(isOutputDefined(ComponentsIds.productsQueueArn)).toBe(true);
    expect(isOutputDefined(ComponentsIds.productsQueueUrl)).toBe(true);
  });
});

type Output = {
  Export?: {
    Name: string;
  };
};
