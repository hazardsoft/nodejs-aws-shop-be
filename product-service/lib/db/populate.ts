import { Product, Stock } from "../../src/types.js";
import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";

export const populateProducts = async (
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

export const populateStocks = async (
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
