import { App, Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import { ProductsServiceApi } from "./api";
import { ProductServiceDB } from "./db";

class ProductService extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const api = new ProductsServiceApi(this, "ProductsApi");
    new ProductServiceDB(this, "ProductServiceDB", {
      lambdas: {
        getAllProductsFunction: api.getAllProductsFunction,
        getOneProductFunction: api.getOneProductFunction,
        createOneProductFunction: api.createOneProductFunction,
      },
    });
  }
}

const app = new App();
const productService = new ProductService(app, "ProductsService");

export { productService };
