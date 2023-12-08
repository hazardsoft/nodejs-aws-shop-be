import { App, Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import { ProductsServiceApi } from "./api";
import { ProductServiceDB } from "./db";
import { ProductsQueue } from "./queue";
import { ProductHandlers } from "./handlers";

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

    const productsQueue = new ProductsQueue(this, "ProductsQueue");
    productsQueue.registerConsumer(handlers.createManyProducts);
  }
}

const app = new App();
const productService = new ProductService(app, "ProductsService");

export { productService };
