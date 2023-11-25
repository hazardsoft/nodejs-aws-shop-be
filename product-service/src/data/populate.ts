import {
  BatchWriteItemCommand,
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import { randomUUID } from "node:crypto";
import { config } from "../../cdk/constants.js";
import "dotenv/config";
import { Product, ProductRecord, Stock, StockRecord } from "../types.js";

const createProducts = (): Product[] => {
  const products: Product[] = [];
  for (let i = 1; i <= 10; i++) {
    products.push({
      id: randomUUID(),
      title: `Product ${i}`,
      description: `Description ${i}`,
      price: i,
    });
  }
  return products;
};

const createStocks = (products: Product[]): Stock[] => {
  const stocks: Stock[] = [];
  products.forEach((product) => {
    stocks.push({
      product_id: product.id,
      count: Math.ceil(Math.random() * products.length),
    });
  });
  return stocks;
};

const populateProducts = async (
  dbClient: DynamoDBClient,
  tableName: string,
  products: Product[],
) => {
  await dbClient.send(
    new BatchWriteItemCommand({
      RequestItems: {
        [tableName]: products.map((product) => ({
          PutRequest: {
            Item: <ProductRecord>{
              id: { S: product.id },
              title: { S: product.title },
              description: { S: product.description },
              price: { N: product.price.toString() },
            },
          },
        })),
      },
    }),
  );
};

const populateStocks = async (
  dbClient: DynamoDBClient,
  tableName: string,
  stocks: Stock[],
) => {
  await dbClient.send(
    new BatchWriteItemCommand({
      RequestItems: {
        [tableName]: stocks.map((stock) => ({
          PutRequest: {
            Item: <StockRecord>{
              product_id: { S: stock.product_id },
              count: { N: stock.count.toString() },
            },
          },
        })),
      },
    }),
  );
};

const dbClient = new DynamoDBClient({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    sessionToken: process.env.AWS_SESSION_TOKEN ?? "",
  },
});
const products: Product[] = createProducts();
const stocks: Stock[] = createStocks(products);
await populateProducts(dbClient, config.productsTableName, products);
await populateStocks(dbClient, config.stocksTableName, stocks);
