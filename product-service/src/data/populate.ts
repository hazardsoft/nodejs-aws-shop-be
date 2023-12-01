import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { config } from "../../cdk/constants.js";
import "dotenv/config";
import { Product, Stock } from "../types.js";
import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";

const generatedItemsNum = 5;

const createProducts = (): Product[] => {
  const products: Product[] = [];
  for (let i = 1; i <= generatedItemsNum; i++) {
    products.push({
      id: uuidv4(),
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
  dbDocClient: DynamoDBDocumentClient,
  tableName: string,
  products: Product[],
) => {
  await dbDocClient.send(
    new BatchWriteCommand({
      RequestItems: {
        [tableName]: products.map((product) => {
          return {
            PutRequest: {
              Item: product,
            },
          };
        }),
      },
    }),
  );
};

const populateStocks = async (
  dbDocClient: DynamoDBDocumentClient,
  tableName: string,
  stocks: Stock[],
) => {
  await dbDocClient.send(
    new BatchWriteCommand({
      RequestItems: {
        [tableName]: stocks.map((stock) => ({
          PutRequest: {
            Item: stock,
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
const dbDocumentClient = DynamoDBDocumentClient.from(dbClient);
const products: Product[] = createProducts();
const stocks: Stock[] = createStocks(products);
await populateProducts(dbDocumentClient, config.productsTableName, products);
await populateStocks(dbDocumentClient, config.stocksTableName, stocks);
