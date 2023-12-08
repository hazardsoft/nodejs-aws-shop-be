import { Product, Stock } from "../../src/types";
import { createProducts, createStocks } from "./generate";
import { populateProducts, populateStocks } from "./populate";
import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import "dotenv/config";
import { getTableNames } from "./config";

const dbConfig: DynamoDBClientConfig = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    sessionToken: process.env.AWS_SESSION_TOKEN ?? "",
  },
};
const dbClient = DynamoDBDocumentClient.from(new DynamoDBClient(dbConfig));

const products: Product[] = createProducts();
const stocks: Stock[] = createStocks(products);

const [productsTableName, stocksTableName] = getTableNames();
await populateProducts(dbClient, productsTableName, products);
await populateStocks(dbClient, stocksTableName, stocks);
