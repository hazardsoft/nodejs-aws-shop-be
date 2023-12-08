import { App, Fn, Stack } from "aws-cdk-lib";
import { Function as LambdaFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { ProductsServiceApi } from "./api";
import { ProductServiceDB } from "./db";
import { ProductsQueue } from "./queue";
import { ProductHandlers } from "./handlers";
import { ComponentsIds } from "../../shared/constants";

class ProductService extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const handlers = new ProductHandlers(this, "ProductHandlers");

    new ProductsServiceApi(this, "ProductsApi", {
      handlers: {
        createOneProduct: handlers.createOneProduct,
        getOneProduct: handlers.getOneProduct,
        getAllProducts: handlers.getAllProducts,
      },
    });

    new ProductServiceDB(this, "ProductServiceDB", {
      handlers: {
        getAllProducts: handlers.getAllProducts,
        getOneProduct: handlers.getOneProduct,
        createOneProduct: handlers.createOneProduct,
        createManyProducts: handlers.createManyProducts,
      },
    });

    const parseProductsHandlerArn = Fn.importValue(
      <string>ComponentsIds.parseProductsHandlerArn,
    );

    const parseProductsHandler = LambdaFunction.fromFunctionArn(
      this,
      "ParseProductsHandler",
      parseProductsHandlerArn,
    );

    const productsQueue = new ProductsQueue(this, "ProductsQueue");
    productsQueue.registerProducer(parseProductsHandler);
    productsQueue.registerConsumer(handlers.createManyProducts);
  }
}

const app = new App();
const productService = new ProductService(app, "ProductsService");

export { productService };
