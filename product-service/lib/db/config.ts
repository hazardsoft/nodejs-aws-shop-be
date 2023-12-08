import { DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";

const host = process.env.DYNAMODB_HOST ?? "";
const port = process.env.DYNAMODB_PORT ?? "";

const productsTableName = process.env.PRODUCTS_TABLE_NAME ?? "";
const stocksTableName = process.env.STOCKS_TABLE_NAME ?? "";

export const getDbClientConfig = (): DynamoDBClientConfig => {
  const endpoint = host && port ? `${host}:${port}` : undefined;
  return {
    endpoint,
  };
};

export const getTableNames = (): [
  productsTableName: string,
  stocksTableName: string,
] => {
  return [productsTableName, stocksTableName];
};
