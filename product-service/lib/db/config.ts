import { DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import "dotenv/config";

const productsTableName = process.env.PRODUCTS_TABLE_NAME ?? "";
const stocksTableName = process.env.STOCKS_TABLE_NAME ?? "";
const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  sessionToken: process.env.AWS_SESSION_TOKEN ?? "",
};

export const getDbClientConfig = (): DynamoDBClientConfig => {
  const isTest = Boolean(process.env.TEST);
  const isAWSRunning = Boolean(process.env.AWS_EXECUTION_ENV);
  const endpoint = isTest
    ? `${process.env.DYNAMODB_HOST}:${process.env.DYNAMODB_PORT}`
    : undefined;
  const creds = isAWSRunning ? undefined : credentials;
  return {
    endpoint,
    credentials: creds,
  };
};

export const getTableNames = (): [
  productsTableName: string,
  stocksTableName: string,
] => {
  return [productsTableName, stocksTableName];
};
