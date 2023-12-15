import { Function as LambdaFunction } from "aws-cdk-lib/aws-lambda";
import {
  Cors,
  LambdaIntegration,
  LambdaIntegrationOptions,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { config } from "./constants.js";
import { ResponseModels } from "./models.js";
import { MethodResponses } from "./responses.js";

type ProductsServiceApiProps = {
  handlers: {
    getAllProducts: LambdaFunction;
    getOneProduct: LambdaFunction;
    createOneProduct: LambdaFunction;
  };
};
export class ProductsServiceApi extends Construct {
  constructor(scope: Construct, id: string, props: ProductsServiceApiProps) {
    super(scope, id);

    const integrationOptions = <LambdaIntegrationOptions>{
      allowTestInvoke: false,
    };
    const getAllProductsIntegration = new LambdaIntegration(
      props.handlers.getAllProducts,
      integrationOptions,
    );
    const getOneProductIntegration = new LambdaIntegration(
      props.handlers.getOneProduct,
      integrationOptions,
    );
    const createProductIntegration = new LambdaIntegration(
      props.handlers.createOneProduct,
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
      requestModels: {
        "application/json": models.createProductModel,
      },
    });
    products.addCorsPreflight({
      allowOrigins: Cors.ALL_ORIGINS,
      allowHeaders: Cors.DEFAULT_HEADERS,
      allowMethods: ["GET", "POST", "OPTIONS"],
    });

    const getOneProduct = products.addResource("{id}");
    getOneProduct.addMethod("GET", getOneProductIntegration, {
      methodResponses: responses.getOneProductMethodResponses,
    });
  }
}
