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
  lambdas: {
    getAllProductsFunction: LambdaFunction;
    getOneProductFunction: LambdaFunction;
    createOneProductFunction: LambdaFunction;
  };
};

export class ProductServiceDB extends Construct {
  constructor(scope: Construct, id: string, props: ProductServiceDBProps) {
    super(scope, id);

    const productsTable = new TableV2(this, "Products", {
      tableName: config.productsTableName,
      partitionKey: { name: "id", type: AttributeType.STRING },
      sortKey: { name: "title", type: AttributeType.STRING },
      billing: Billing.onDemand(),
      encryption: TableEncryptionV2.dynamoOwnedKey(),
      removalPolicy: RemovalPolicy.DESTROY,
    });
    productsTable.grantReadData(props.lambdas.getAllProductsFunction);
    productsTable.grantReadData(props.lambdas.getOneProductFunction);
    productsTable.grantWriteData(props.lambdas.createOneProductFunction);

    const stocksTable = new TableV2(this, "Stocks", {
      tableName: config.stocksTableName,
      partitionKey: { name: "product_id", type: AttributeType.STRING },
      billing: Billing.onDemand(),
      encryption: TableEncryptionV2.dynamoOwnedKey(),
      removalPolicy: RemovalPolicy.DESTROY,
    });

    stocksTable.grantReadData(props.lambdas.getAllProductsFunction);
    stocksTable.grantReadData(props.lambdas.getOneProductFunction);
    stocksTable.grantWriteData(props.lambdas.createOneProductFunction);
  }
}
