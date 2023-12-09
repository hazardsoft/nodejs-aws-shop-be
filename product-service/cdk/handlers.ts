import {
  Function as LambdaFunction,
  Runtime,
  Code,
} from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { config } from "./constants.js";

type ProductHandlersProps = {
  productsTopicArn: string;
};
export class ProductHandlers extends Construct {
  public readonly getAllProducts: LambdaFunction;
  public readonly getOneProduct: LambdaFunction;
  public readonly createOneProduct: LambdaFunction;
  public readonly createManyProducts: LambdaFunction;

  constructor(scope: Construct, id: string, props: ProductHandlersProps) {
    super(scope, id);

    const env = {
      PRODUCTS_TABLE_NAME: config.productsTableName,
      STOCKS_TABLE_NAME: config.stocksTableName,
    };

    this.getAllProducts = new LambdaFunction(this, "GetAllProducts", {
      runtime: Runtime.NODEJS_18_X,
      code: Code.fromAsset("./dist/lambdas/getProducts"),
      handler: "getProducts.handler",
      environment: env,
    });

    this.getOneProduct = new LambdaFunction(this, "GetOneProduct", {
      runtime: Runtime.NODEJS_18_X,
      code: Code.fromAsset("./dist/lambdas/getOneProduct"),
      handler: "getOneProduct.handler",
      environment: env,
    });

    this.createOneProduct = new LambdaFunction(this, "CreateProduct", {
      runtime: Runtime.NODEJS_18_X,
      code: Code.fromAsset("./dist/lambdas/createProduct"),
      handler: "createProduct.handler",
      environment: env,
    });

    this.createManyProducts = new LambdaFunction(this, "CreateManyProducts", {
      runtime: Runtime.NODEJS_18_X,
      code: Code.fromAsset("./dist/lambdas/createManyProducts"),
      handler: "createManyProducts.handler",
      environment: {
        ...env,
        PRODUCTS_TOPIC_ARN: props.productsTopicArn,
      },
    });
  }
}
