import { Construct } from "constructs";
import { config } from "./constants.js";
import {
  AttributeType,
  Billing,
  TableEncryptionV2,
  TableV2,
} from "aws-cdk-lib/aws-dynamodb";
import { RemovalPolicy } from "aws-cdk-lib";
import { Function as LambdaFunction } from "aws-cdk-lib/aws-lambda";

export type ProductServiceDBProps = {
  functions: {
    getAllProducts: LambdaFunction;
    getOneProduct: LambdaFunction;
    createOneProduct: LambdaFunction;
  };
};

export class ProductServiceDB extends Construct {
  constructor(scope: Construct, id: string, props: ProductServiceDBProps) {
    super(scope, id);

    const { getAllProducts, getOneProduct, createOneProduct } = props.functions;

    const productsTable = new TableV2(this, "Products", {
      tableName: config.productsTableName,
      partitionKey: { name: "id", type: AttributeType.STRING },
      sortKey: { name: "title", type: AttributeType.STRING },
      billing: Billing.onDemand(),
      encryption: TableEncryptionV2.dynamoOwnedKey(),
      removalPolicy: RemovalPolicy.DESTROY,
    });
    productsTable.grantReadData(getAllProducts);
    productsTable.grantReadData(getOneProduct);
    productsTable.grantWriteData(createOneProduct);

    const stocksTable = new TableV2(this, "Stocks", {
      tableName: config.stocksTableName,
      partitionKey: { name: "product_id", type: AttributeType.STRING },
      billing: Billing.onDemand(),
      encryption: TableEncryptionV2.dynamoOwnedKey(),
      removalPolicy: RemovalPolicy.DESTROY,
    });

    stocksTable.grantReadData(getAllProducts);
    stocksTable.grantReadData(getOneProduct);
    stocksTable.grantWriteData(createOneProduct);
  }
}
