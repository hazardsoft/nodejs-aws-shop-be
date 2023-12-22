import { expect, describe, test } from "vitest";
import { authService } from "../cdk/index.js";
import { Template } from "aws-cdk-lib/assertions";
import { ComponentsIds } from "../../shared/constants.js";

const userName = process.env.USERNAME ?? "";
const userPassword = process.env.USERPASS ?? "";

describe("Tests AWS CDK configuration", () => {
  const template = Template.fromStack(authService);
  let resourceType: string;

  test("1 Lambda function is defined", () => {
    resourceType = "AWS::Lambda::Function";

    const env = {
      Variables: {
        USERNAME: userName,
        USERPASS: userPassword,
      },
    };

    template.resourceCountIs(resourceType, 1);
    template.hasResourceProperties(resourceType, {
      Handler: "basicAuthorizer.handler",
      Environment: env,
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

    expect(isOutputDefined(ComponentsIds.authorizerLambdaArn)).toBe(true);
  });
});

type Output = {
  Export?: {
    Name: string;
  };
};
