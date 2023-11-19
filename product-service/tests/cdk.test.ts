import { describe, test } from "vitest";
import { productService } from "../cdk/index.js";
import { Template } from "aws-cdk-lib/assertions";

describe("Tests for Lambdas/API Gateway", () => {
    const template = Template.fromStack(productService);
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