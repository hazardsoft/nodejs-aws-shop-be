import { App, Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import { ProductsServiceApi } from "./api";
import { ProductServiceDB } from "./db";
import { ProductsQueue } from "./queue";
import { ProductHandlers } from "./handlers";
import { ProductsTopic } from "./topic";
import "dotenv/config";

type ProductServiceProps = {
  allProductsSubscriberEmail: string;
  noStockProductsSubscriberEmail: string;
};

class ProductService extends Stack {
  constructor(scope: Construct, id: string, props: ProductServiceProps) {
    super(scope, id);

    const topic = new ProductsTopic(this, "ProductsTopic");
    topic.subscribeToAllProducts(props.allProductsSubscriberEmail);
    topic.subscribeToNoStockProducts(props.noStockProductsSubscriberEmail);

    const handlers = new ProductHandlers(this, "ProductHandlers", {
      productsTopicArn: topic.topic.topicArn,
    });
    topic.registerPublisher(handlers.createManyProducts);

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
const productService = new ProductService(app, "ProductsService", {
  allProductsSubscriberEmail:
    process.env.SNS_ALL_PRODUCTS_SUBSCRIBER_EMAIL ?? "",
  noStockProductsSubscriberEmail:
    process.env.SNS_NO_STOCK_PRODUCTS_SUBSCRIBER_EMAIL ?? "",
});

export { productService };
