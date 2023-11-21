import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { products } from "./products.json";
import { stocks } from "./stocks.json";
import { config } from "../../cdk/constants.js";
import "dotenv/config";

const populateProducts = async (
  dbClient: DynamoDBClient,
  tableName: string,
) => {
  for (const product of products) {
    await dbClient.send(
      new PutItemCommand({
        TableName: tableName,
        Item: {
          id: { S: product.id },
          title: { S: product.title },
          description: { S: product.description },
          price: { N: product.price.toString() },
        },
      }),
    );
  }
};

const populateStocks = async (dbClient: DynamoDBClient, tableName: string) => {
  for (const stock of stocks) {
    await dbClient.send(
      new PutItemCommand({
        TableName: tableName,
        Item: {
          product_id: { S: stock.productId },
          count: { N: stock.count.toString() },
        },
      }),
    );
  }
};

const dbClient = new DynamoDBClient({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    sessionToken: process.env.AWS_SESSION_TOKEN ?? "",
  },
});
await populateProducts(dbClient, config.productsTableName);
await populateStocks(dbClient, config.stocksTableName);
