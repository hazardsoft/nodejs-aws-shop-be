import {
  Function as LambdaFunction,
  Runtime,
  Code,
} from "aws-cdk-lib/aws-lambda";
import {
  LambdaIntegration,
  LambdaIntegrationOptions,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { config } from "./constants.js";
import { ResponseModels } from "./models.js";
import { MethodResponses } from "./responses.js";
export class ProductsServiceApi extends Construct {
  public readonly getAllProductsFunction: LambdaFunction;
  public readonly getOneProductFunction: LambdaFunction;
  public readonly createOneProductFunction: LambdaFunction;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.getAllProductsFunction = new LambdaFunction(this, "GetAllProducts", {
      runtime: Runtime.NODEJS_18_X,
      code: Code.fromAsset("./dist/lambdas/getProducts"),
      handler: "getProducts.handler",
      environment: {
        PRODUCTS_TABLE_NAME: config.productsTableName,
        STOCKS_TABLE_NAME: config.stocksTableName,
      },
    });

    this.getOneProductFunction = new LambdaFunction(this, "GetOneProduct", {
      runtime: Runtime.NODEJS_18_X,
      code: Code.fromAsset("./dist/lambdas/getOneProduct"),
      handler: "getOneProduct.handler",
      environment: {
        PRODUCTS_TABLE_NAME: config.productsTableName,
        STOCKS_TABLE_NAME: config.stocksTableName,
      },
    });

    this.createOneProductFunction = new LambdaFunction(this, "CreateProduct", {
      runtime: Runtime.NODEJS_18_X,
      code: Code.fromAsset("./dist/lambdas/createProduct"),
      handler: "createProduct.handler",
      environment: {
        PRODUCTS_TABLE_NAME: config.productsTableName,
        STOCKS_TABLE_NAME: config.stocksTableName,
      },
    });

    const integrationOptions = <LambdaIntegrationOptions>{
      allowTestInvoke: false,
    };
    const getAllProductsIntegration = new LambdaIntegration(
      this.getAllProductsFunction,
      integrationOptions,
    );
    const getOneProductIntegration = new LambdaIntegration(
      this.getOneProductFunction,
      integrationOptions,
    );
    const createProductIntegration = new LambdaIntegration(
      this.createOneProductFunction,
      integrationOptions,
    );

    const api = new RestApi(this, "ProductApi", {
      restApiName: "Products",
      deployOptions: {
        stageName: config.stageName,
      },
    });

    const models = new ResponseModels(this, "ResponseModels", {
      restApi: api,
    });
    const responses = new MethodResponses(this, "MethodResponses", {
      models: {
        oneProductModel: models.oneProductModel,
        allProductsModel: models.allProductsModel,
        productErrorModel: models.productErrorModel,
      },
    });

    const products = api.root.addResource("products");
    products.addMethod("GET", getAllProductsIntegration, {
      methodResponses: responses.getAllProductsMethodResponses,
    });
    products.addMethod("POST", createProductIntegration, {
      methodResponses: responses.createOneProductMethodResponses,
    });

    const getOneProduct = products.addResource("{id}");
    getOneProduct.addMethod("GET", getOneProductIntegration, {
      methodResponses: responses.getOneProductMethodResponses,
    });
  }
}
