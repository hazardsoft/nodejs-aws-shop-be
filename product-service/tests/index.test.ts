import { describe, test, expect, beforeAll } from "vitest";
import { ProductService } from "../cdk/index.js";
import { App, Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";

describe("Tests for Lambdas/API Gateway", () => {
    const stack = new ProductService(new App(), "ProductService");
    const template = Template.fromStack(stack);
    let resourceType: string;

    test("Two Lambda functions are defined", () => {
        resourceType = "AWS::Lambda::Function";

        template.resourceCountIs(resourceType, 2);
        template.hasResourceProperties(resourceType, {
            Handler: "getProducts.handler"
        })
        template.hasResourceProperties(resourceType, {
            Handler: "getOneProduct.handler"
        })
    })

    test("RestApi Gateway is defined", () => {
        resourceType = "AWS::ApiGateway::RestApi";
        template.resourceCountIs(resourceType, 1)

        resourceType = "AWS::ApiGateway::Resource";
        template.resourceCountIs(resourceType, 2);
        template.hasResourceProperties(resourceType, {
            PathPart: "products"
        })
        template.hasResourceProperties(resourceType, {
            PathPart: "{id}"
        })
    })

    test("Deployment stage 'dev' is defined", () => {
        resourceType = "AWS::ApiGateway::Stage"
        template.resourceCountIs(resourceType, 1);
        template.hasResourceProperties(resourceType, {
            StageName: "dev"
        })
    })
})