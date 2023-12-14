import { CfnOutput } from "aws-cdk-lib";
import {
  Code,
  Function as LambdaFunction,
  Runtime,
} from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { ComponentsIds } from "../../shared/constants";

type AuthorizerHandlersProps = {
  user: {
    name: string;
    password: string;
  };
};

export class AuthorizerHandlers extends Construct {
  public readonly basicAuthorizer: LambdaFunction;

  constructor(scope: Construct, id: string, props: AuthorizerHandlersProps) {
    super(scope, id);

    this.basicAuthorizer = new LambdaFunction(this, "BasicAuthorizer", {
      runtime: Runtime.NODEJS_18_X,
      code: Code.fromAsset("./dist/lambdas/basicAuthorizer"),
      handler: "basicAuthorizer.handler",
      environment: { USERNAME: props.user.name, USERPASS: props.user.password },
    });

    new CfnOutput(this, "AuthorizerLambdaArn", {
      value: this.basicAuthorizer.functionArn,
      exportName: <string>ComponentsIds.authorizerLambdaArn,
    });
  }
}
