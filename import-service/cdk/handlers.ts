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
  public readonly importProductsFileHandler: LambdaFunction;

  constructor(
    scope: Construct,
    id: string,
    props: ImportProductsHandlersProps,
  ) {
    super(scope, id);

    this.importProductsFileHandler = new LambdaFunction(
      this,
      "ImportProductsFile",
      {
        runtime: Runtime.NODEJS_18_X,
        code: Code.fromAsset("./dist/lambdas/importProductsFile"),
        handler: "importProductsFile.handler",
        environment: {
          BUCKET_NAME: props.bucketName,
        },
      },
    );
  }
}
