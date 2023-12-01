import {
  Code,
  Function as LambdaFunction,
  Runtime,
} from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

type ImportProductsHandlersProps = {
  bucketName: string;
};

export class ImportProductsHandlers extends Construct {
  public readonly importProductsHandler: LambdaFunction;
  public readonly parseProductsHandler: LambdaFunction;

  constructor(
    scope: Construct,
    id: string,
    props: ImportProductsHandlersProps,
  ) {
    super(scope, id);

    const env = { BUCKET_NAME: props.bucketName };

    this.importProductsHandler = new LambdaFunction(this, "ImportProducts", {
      runtime: Runtime.NODEJS_18_X,
      code: Code.fromAsset("./dist/lambdas/importProducts"),
      handler: "importProducts.handler",
      environment: env,
    });

    this.parseProductsHandler = new LambdaFunction(this, "ParseProducts", {
      runtime: Runtime.NODEJS_18_X,
      code: Code.fromAsset("./dist/lambdas/parseProducts"),
      handler: "parseProducts.handler",
      environment: env,
    });
  }
}
