import {
  Code,
  IFunction,
  Function as LambdaFunction,
  Runtime,
} from "aws-cdk-lib/aws-lambda";
import { Fn } from "aws-cdk-lib/core";
import { Construct } from "constructs";
import { ComponentsIds } from "../../shared/constants";

type ImportProductsHandlersProps = {
  bucketName: string;
  productsQueueUrl: string;
};

export class ImportProductsHandlers extends Construct {
  public readonly importProductsHandler: LambdaFunction;
  public readonly parseProductsHandler: LambdaFunction;
  public readonly basicAuthHandler: IFunction;

  constructor(
    scope: Construct,
    id: string,
    props: ImportProductsHandlersProps,
  ) {
    super(scope, id);

    const basicAuthorizerArn = Fn.importValue(
      <string>ComponentsIds.authorizerLambdaArn,
    );

    this.basicAuthHandler = LambdaFunction.fromFunctionArn(
      this,
      "BasicAuthorizer",
      basicAuthorizerArn,
    );

    this.importProductsHandler = new LambdaFunction(this, "ImportProducts", {
      runtime: Runtime.NODEJS_18_X,
      code: Code.fromAsset("./dist/lambdas/importProducts"),
      handler: "importProducts.handler",
      environment: { BUCKET_NAME: props.bucketName },
    });

    this.parseProductsHandler = new LambdaFunction(this, "ParseProducts", {
      runtime: Runtime.NODEJS_18_X,
      code: Code.fromAsset("./dist/lambdas/parseProducts"),
      handler: "parseProducts.handler",
      environment: { QUEUE_URL: props.productsQueueUrl },
    });
  }
}
