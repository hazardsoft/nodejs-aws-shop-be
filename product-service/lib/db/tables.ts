import { CreateTableCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export const createProductsTable = async (
  dbDocClient: DynamoDBDocumentClient,
  tableName: string,
): Promise<void> => {
  console.log("creating Products table...");
  await dbDocClient.send(
    new CreateTableCommand({
      TableName: tableName,
      AttributeDefinitions: [
        {
          AttributeName: "id",
          AttributeType: "S",
        },
        {
          AttributeName: "title",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "id",
          KeyType: "HASH",
        },
        {
          AttributeName: "title",
          KeyType: "RANGE",
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    }),
  );
};

export const createStocksTable = async (
  dbDocClient: DynamoDBDocumentClient,
  tableName: string,
): Promise<void> => {
  console.log("creating Stocks table...");
  await dbDocClient.send(
    new CreateTableCommand({
      TableName: tableName,
      AttributeDefinitions: [
        {
          AttributeName: "product_id",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "product_id",
          KeyType: "HASH",
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    }),
  );
};
